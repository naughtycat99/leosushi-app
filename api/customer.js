// Customer Module
// This file contains customer management and auto-fill functions

console.log('customer.js loaded');

// Cache for customer lookups (in-memory cache to speed up repeated searches)
const customerCodeCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache TTL (increased for better performance)

// Load customer info from Firebase or localStorage
async function loadCustomerInfo(email = null, phone = null, customerCode = null) {
  if (!email && !phone && !customerCode) return null;

  // Primary source: Firebase (đồng bộ giữa tất cả thiết bị)
  if (typeof db !== 'undefined' && db) {
    try {
      let customerDoc = null;

      // Try by customer code first (fastest, unique identifier)
      if (customerCode) {
        // Normalize search code exactly like stored codes
        const codeUpper = customerCode.toString().toUpperCase().trim().replace(/\s+/g, '');
        console.log('🔍 Searching Firebase for customerCode:', codeUpper);
        console.log('🔍 Original input:', customerCode);

        // Check cache first
        const cacheKey = `code_${codeUpper}`;
        const cached = customerCodeCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
          console.log('✅ Customer found in cache:', codeUpper);
          return cached.data;
        }

        try {
          // Try query with where clause first (fastest if index exists)
          let querySnapshot;
          try {
            querySnapshot = await db.collection('customers')
              .where('customerCode', '==', codeUpper)
              .limit(1)
              .get();

            if (!querySnapshot.empty) {
              const customerData = querySnapshot.docs[0].data();
              console.log('✅ Customer found by code (query method):', codeUpper);
              // Cache the result
              customerCodeCache.set(cacheKey, { data: customerData, timestamp: Date.now() });
              return customerData;
            }
          } catch (queryError) {
            // Query failed (likely no index) - return null immediately instead of slow fallback
            console.error('❌ Query failed (likely missing index):', queryError.message);
            console.error('⚠️ Please create a Firestore index for customers.customerCode');
            return null; // Return null immediately - don't try slow fallback
          }

          // If query succeeded but empty, return null (don't try slow fallback)
          if (!querySnapshot || querySnapshot.empty) {
            return null;
          }

          // This code should never be reached, but keep for safety
          console.warn('⚠️ Unexpected code path in loadCustomerInfo');
          const allSnapshot = await db.collection('customers').get();
          let foundDoc = null;
          const sampleCodes = [];

          // Try multiple normalization methods to handle different formats
          const normalizeMethods = [
            (code) => code.toString().toUpperCase().trim().replace(/\s+/g, ''), // Standard: UPPERCASE, trim, no spaces
            (code) => code.toString().toUpperCase().trim(), // UPPERCASE, trim only
            (code) => code.toString().trim().replace(/\s+/g, ''), // Trim, no spaces, keep original case
            (code) => code.toString().toUpperCase(), // UPPERCASE only
            (code) => code.toString().trim(), // Trim only
            (code) => code.toString(), // Original
          ];

          const searchNormalized = normalizeMethods[0](codeUpper); // Primary search method

          // Use for...of instead of forEach to allow await
          for (const doc of allSnapshot.docs) {
            const data = doc.data();
            const rawCode = data.customerCode || '';

            if (!rawCode) continue;

            // Try all normalization methods to find match
            let matched = false;
            let matchedMethod = null;

            for (let i = 0; i < normalizeMethods.length; i++) {
              const storedNormalized = normalizeMethods[i](rawCode);
              const searchNormalizedForMethod = normalizeMethods[i](codeUpper);

              if (storedNormalized === searchNormalizedForMethod) {
                matched = true;
                matchedMethod = i;
                foundDoc = doc;
                console.log(`✅ Match found with normalization method ${i}!`, {
                  raw: rawCode,
                  storedNormalized: storedNormalized,
                  searchNormalized: searchNormalizedForMethod,
                  email: data.email
                });

                // If matched with a different normalization method (not method 0), 
                // update Firebase to use the standard format for future searches
                if (i !== 0) {
                  console.log('⚠️ Customer code format mismatch detected. Normalizing in Firebase...');
                  const standardNormalized = normalizeMethods[0](rawCode);
                  try {
                    await doc.ref.update({
                      customerCode: standardNormalized,
                      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    console.log(`✅ Updated customerCode in Firebase from "${rawCode}" to "${standardNormalized}"`);
                  } catch (updateError) {
                    console.error('❌ Error updating customerCode format in Firebase:', updateError);
                    // Continue anyway - we found the customer
                  }
                }

                break;
              }
            }

            // Debug: Log all codes for comparison
            const comparison = {
              code: rawCode,
              codeType: typeof rawCode,
              codeLength: rawCode.toString().length,
              normalized: normalizeMethods[0](rawCode),
              searchCode: codeUpper,
              searchNormalized: searchNormalized,
              matches: matched,
              matchedMethod: matchedMethod,
              email: data.email,
              docId: doc.id
            };

            sampleCodes.push(comparison);

            // Log if close match (for debugging)
            if (!matched) {
              const storedPrimary = normalizeMethods[0](rawCode);
              if (storedPrimary.length > 0 && searchNormalized.length > 0) {
                if (storedPrimary.includes(searchNormalized) || searchNormalized.includes(storedPrimary)) {
                  console.log('⚠️ Close match found (partial/substring):', comparison);
                } else if (storedPrimary.toLowerCase() === searchNormalized.toLowerCase()) {
                  console.log('⚠️ Case mismatch found:', comparison);
                }
              }
            }
          }

          if (foundDoc) {
            customerDoc = foundDoc;
            const customerData = foundDoc.data();
            console.log('✅ Customer found by code:', codeUpper);

            // Address will be loaded separately if needed (non-blocking)

            // Cache the result
            customerCodeCache.set(cacheKey, { data: customerData, timestamp: Date.now() });
            return customerData;
          } else {
            console.warn('⚠️ Customer code not found in customers collection, searching in orders...');
            console.log('📋 Total customers checked:', allSnapshot.size);
            console.log('📋 Customers with codes:', sampleCodes.length);
            console.log('📋 All customer codes in customers collection:', JSON.stringify(sampleCodes, null, 2));

            // Try searching in orders collection as fallback
            // OPTIMIZATION: Only search recent orders (last 200 orders) for speed
            try {
              console.log('📋 Searching in recent orders (last 200 orders for speed)...');
              const ordersSnapshot = await db.collection('orders')
                .orderBy('createdAt', 'desc')
                .limit(200)
                .get();

              for (const orderDoc of ordersSnapshot.docs) {
                const orderData = orderDoc.data();

                // Check customerCode in order root
                if (orderData.customerCode) {
                  const orderCode = orderData.customerCode.toString().toUpperCase().trim().replace(/\s+/g, '');
                  if (orderCode === codeUpper) {
                    // Extract customer info from order
                    if (orderData.delivery && orderData.delivery.address) {
                      const customerDataFromOrder = {
                        firstName: orderData.delivery.address.firstName || '',
                        lastName: orderData.delivery.address.lastName || '',
                        email: orderData.delivery.address.email || '',
                        phone: orderData.delivery.address.phone || '',
                        street: orderData.delivery.address.street || '',
                        postal: orderData.delivery.address.postal || '',
                        city: orderData.delivery.address.city || '',
                        note: orderData.delivery.address.note || '',
                        customerCode: codeUpper
                      };

                      console.log('✅ Customer code found in orders collection:', codeUpper);

                      // Try to create/update customer record in customers collection for future lookups
                      if (customerDataFromOrder.email) {
                        try {
                          const customerKey = customerDataFromOrder.email.toLowerCase().trim();
                          const customerRef = db.collection('customers').doc(customerKey);
                          await customerRef.set({
                            ...customerDataFromOrder,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                          }, { merge: true });
                          console.log('✅ Created/updated customer record in customers collection');
                        } catch (createError) {
                          console.warn('⚠️ Could not create customer record:', createError);
                        }
                      }

                      // Cache the result
                      customerCodeCache.set(cacheKey, { data: customerDataFromOrder, timestamp: Date.now() });
                      return customerDataFromOrder;
                    }
                  }
                }

                // Also check in delivery.address.customerCode
                if (orderData.delivery && orderData.delivery.address && orderData.delivery.address.customerCode) {
                  const orderCode = orderData.delivery.address.customerCode.toString().toUpperCase().trim().replace(/\s+/g, '');
                  if (orderCode === codeUpper) {
                    // Extract customer info from order
                    if (orderData.delivery && orderData.delivery.address) {
                      const customerDataFromOrder = {
                        firstName: orderData.delivery.address.firstName || '',
                        lastName: orderData.delivery.address.lastName || '',
                        email: orderData.delivery.address.email || '',
                        phone: orderData.delivery.address.phone || '',
                        street: orderData.delivery.address.street || '',
                        postal: orderData.delivery.address.postal || '',
                        city: orderData.delivery.address.city || '',
                        note: orderData.delivery.address.note || '',
                        customerCode: codeUpper
                      };

                      console.log('✅ Customer code found in orders collection:', codeUpper);

                      // Try to create/update customer record in customers collection for future lookups
                      if (customerDataFromOrder.email) {
                        try {
                          const customerKey = customerDataFromOrder.email.toLowerCase().trim();
                          const customerRef = db.collection('customers').doc(customerKey);
                          await customerRef.set({
                            ...customerDataFromOrder,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                          }, { merge: true });
                          console.log('✅ Created/updated customer record in customers collection');
                        } catch (createError) {
                          console.warn('⚠️ Could not create customer record:', createError);
                        }
                      }

                      // Cache the result
                      customerCodeCache.set(cacheKey, { data: customerDataFromOrder, timestamp: Date.now() });
                      return customerDataFromOrder;
                    }
                  }
                }
              }
            } catch (ordersError) {
              console.error('❌ Error searching orders collection:', ordersError);
            }
            console.log('🔍 Searching for:', codeUpper);
            console.log('🔍 Search code normalized:', searchNormalized);
            console.log('🔍 Search code length:', searchNormalized.length);

            // Show first few codes for quick reference
            if (sampleCodes.length > 0) {
              console.log('📋 First 5 customer codes in Firebase:', sampleCodes.slice(0, 5).map(c => ({
                raw: c.code,
                normalized: c.normalized,
                length: c.codeLength,
                matches: c.matches
              })));
            }

            return null;
          }
        } catch (queryError) {
          console.error('❌ Error querying Firebase for customerCode:', queryError);
          console.error('Error code:', queryError.code, 'Error message:', queryError.message);
          console.error('Error stack:', queryError.stack);

          // If it's a permission error, throw it so caller can handle with proper message
          if (queryError.code === 'permission-denied' || (queryError.message && queryError.message.includes('permission'))) {
            const permissionError = new Error('Keine Berechtigung zum Lesen der Kundendaten. Bitte überprüfen Sie die Firebase Security Rules für die "customers" Collection.');
            permissionError.code = 'permission-denied';
            throw permissionError;
          }

          // For other errors, also throw so caller can show appropriate message
          throw queryError;
        }
      }

      // Try by email (email is the document ID)
      if ((!customerDoc || !customerDoc.exists) && email) {
        const emailKey = email.toLowerCase().trim();
        customerDoc = await db.collection('customers').doc(emailKey).get();

        // If not found by email and we only have email (no phone/code), return null immediately
        if (!customerDoc.exists && !phone && !customerCode) {
          return null;
        }
      }

      // If not found by email, try by phone (need to query)
      if ((!customerDoc || !customerDoc.exists) && phone) {
        const querySnapshot = await db.collection('customers')
          .where('phone', '==', phone)
          .limit(1)
          .get();

        if (!querySnapshot.empty) {
          customerDoc = querySnapshot.docs[0];
        } else {
          // Not found by phone either - return null immediately (don't check localStorage)
          // localStorage is only for caching on same device, not for cross-device sync
          return null;
        }
      }

      // If found in Firebase, return it and cache to localStorage for faster access on same device
      if (customerDoc && customerDoc.exists) {
        const customerData = customerDoc.data();

        // Cache to localStorage for faster access on the same device (optional optimization)
        try {
          const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
          const emailKey = customerData.email.toLowerCase().trim();
          const phoneKey = customerData.phone.replace(/[\s\-\+\(\)]/g, '');
          savedCustomers[emailKey] = customerData;
          savedCustomers[`phone_${phoneKey}`] = customerData;
          if (customerData.customerCode) {
            savedCustomers[`code_${customerData.customerCode.toUpperCase()}`] = customerData;
          }
          localStorage.setItem('leoCustomers', JSON.stringify(savedCustomers));
        } catch (e) {
          console.error('Error caching customer to localStorage:', e);
        }

        return customerData;
      }

      // Not found in Firebase - return null immediately (don't check localStorage)
      // localStorage is only for caching on same device, not for cross-device sync
      return null;
    } catch (e) {
      console.error('Error loading customer info from Firebase:', e);

      // NO FALLBACK TO LOCALSTORAGE when searching by customerCode
      // customerCode search MUST use Firebase only for cross-device sync
      if (customerCode) {
        console.error('❌ Error loading customer by code from Firebase:', e);
        console.error('Error code:', e.code, 'Error message:', e.message);
        // Don't fallback to localStorage for customerCode - it's device-specific
        return null;
      }

      // Only fallback to localStorage for email/phone if Firebase connection error (not "not found")
      // Check if it's a connection/permission error vs "not found"
      const isConnectionError = e.code === 'unavailable' || e.code === 'permission-denied' || e.code === 'unauthenticated';

      if (isConnectionError && (email || phone)) {
        // Firebase connection issue - try localStorage as last resort (offline mode)
        // BUT ONLY for email/phone, NOT for customerCode
        console.warn('⚠️ Firebase connection error, trying localStorage fallback for email/phone...');
        try {
          const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');

          if (email) {
            const emailKey = email.toLowerCase().trim();
            if (savedCustomers[emailKey]) {
              return savedCustomers[emailKey];
            }
          }

          if (phone) {
            const phoneKey = phone.replace(/[\s\-\+\(\)]/g, '');
            if (savedCustomers[`phone_${phoneKey}`]) {
              return savedCustomers[`phone_${phoneKey}`];
            }
          }
        } catch (localError) {
          console.error('Error loading customer info from localStorage:', localError);
        }
      }

      // If not a connection error, return null (data not found or other error)
      return null;
    }
  } else {
    // No Firebase available - cannot load customer info (Firebase is required for web app)
    console.error('❌ Firebase nicht verfügbar. Kundeninformationen können nicht geladen werden.');
    console.error('❌ Bitte öffnen Sie setup.html zur Konfiguration der Firebase-Datenbank.');
    return null;
  }

  return null;
}

// Auto-fill customer information in form (only fill empty fields)
function autoFillCustomerInfo(customerInfo, skipEmailPhone = false) {
  if (!customerInfo) return;

  // Fill order form fields (only if empty)
  const firstNameField = document.getElementById('customerFirstName');
  const lastNameField = document.getElementById('customerLastName');
  const emailField = document.getElementById('customerEmail');
  const phoneField = document.getElementById('customerPhone');
  const streetField = document.getElementById('deliveryStreet');
  const postalField = document.getElementById('deliveryPostal');
  const cityField = document.getElementById('deliveryCity');
  const noteField = document.getElementById('deliveryNote');

  if (firstNameField && !firstNameField.value) firstNameField.value = customerInfo.firstName || '';
  if (lastNameField && !lastNameField.value) lastNameField.value = customerInfo.lastName || '';
  if (emailField && !skipEmailPhone && !emailField.value) emailField.value = customerInfo.email || '';
  if (phoneField && !skipEmailPhone && !phoneField.value) phoneField.value = customerInfo.phone || '';
  if (streetField && !streetField.value) streetField.value = customerInfo.street || '';
  if (postalField && !postalField.value) postalField.value = customerInfo.postal || '';
  if (cityField && !cityField.value) cityField.value = customerInfo.city || '';
  if (noteField && !noteField.value) noteField.value = customerInfo.note || '';

  // Fill reservation form fields (only if empty)
  const reserveFirstNameField = document.getElementById('reserveFirstNameInPayment');
  const reserveLastNameField = document.getElementById('reserveLastNameInPayment');
  const reserveEmailField = document.getElementById('reserveEmailInPayment');
  const reservePhoneField = document.getElementById('reservePhoneInPayment');

  if (reserveFirstNameField && !reserveFirstNameField.value) reserveFirstNameField.value = customerInfo.firstName || '';
  if (reserveLastNameField && !reserveLastNameField.value) reserveLastNameField.value = customerInfo.lastName || '';
  if (reserveEmailField && !skipEmailPhone && !reserveEmailField.value) reserveEmailField.value = customerInfo.email || '';
  if (reservePhoneField && !skipEmailPhone && !reservePhoneField.value) reservePhoneField.value = customerInfo.phone || '';

  // Show notification
  showCustomerInfoLoadedNotification();
}

// Show notification when customer info is loaded
function showCustomerInfoLoadedNotification() {
  showNotification('✓ Kundeninformationen wurden automatisch ausgefüllt');
}

// Show notification helper function
function showNotification(message, isError = false) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${isError ? '#ff4444' : 'linear-gradient(180deg, var(--gold), var(--gold-2))'};
    color: ${isError ? 'white' : '#1a1a1a'};
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,.3);
    z-index: 100000;
    font-weight: 600;
    animation: slideInRight 0.3s ease;
    max-width: 400px;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Load address from orders collection (optimized, non-blocking)
async function loadAddressFromOrders(customerCode) {
  if (!customerCode || typeof db === 'undefined' || !db) {
    return null;
  }

  const codeUpper = customerCode.toString().toUpperCase().trim().replace(/\s+/g, '');

  try {
    // Try query with where clause first (fastest if index exists)
    let ordersSnapshot;
    try {
      ordersSnapshot = await db.collection('orders')
        .where('customerCode', '==', codeUpper)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
    } catch (e) {
      // If query fails (missing index), try without orderBy
      try {
        ordersSnapshot = await db.collection('orders')
          .where('customerCode', '==', codeUpper)
          .limit(1)
          .get();
      } catch (e2) {
        // If still fails, use fallback method
        ordersSnapshot = null;
      }
    }

    if (ordersSnapshot && !ordersSnapshot.empty) {
      const orderData = ordersSnapshot.docs[0].data();
      if (orderData.delivery && orderData.delivery.address) {
        return {
          street: orderData.delivery.address.street || '',
          postal: orderData.delivery.address.postal || '',
          city: orderData.delivery.address.city || '',
          note: orderData.delivery.address.note || ''
        };
      }
    }

    // Fallback: search recent orders without where clause (slower but works)
    try {
      const recentOrders = await db.collection('orders')
        .orderBy('createdAt', 'desc')
        .limit(100) // Reduced from 200 for better performance
        .get();

      for (const orderDoc of recentOrders.docs) {
        const orderData = orderDoc.data();
        if (orderData.customerCode && orderData.customerCode.toString().toUpperCase().trim().replace(/\s+/g, '') === codeUpper) {
          if (orderData.delivery && orderData.delivery.address) {
            return {
              street: orderData.delivery.address.street || '',
              postal: orderData.delivery.address.postal || '',
              city: orderData.delivery.address.city || '',
              note: orderData.delivery.address.note || ''
            };
          }
        }

        // Also check in delivery.address.customerCode
        if (orderData.delivery && orderData.delivery.address && orderData.delivery.address.customerCode) {
          const orderCode = orderData.delivery.address.customerCode.toString().toUpperCase().trim().replace(/\s+/g, '');
          if (orderCode === codeUpper) {
            if (orderData.delivery.address) {
              return {
                street: orderData.delivery.address.street || '',
                postal: orderData.delivery.address.postal || '',
                city: orderData.delivery.address.city || '',
                note: orderData.delivery.address.note || ''
              };
            }
          }
        }
      }
    } catch (e) {
      console.warn('Fallback address search failed:', e);
    }

    return null;
  } catch (e) {
    console.warn('Error loading address from orders:', e);
    return null;
  }
}

// Validate customer code - ensure uniqueness (1 code = 1 customer)
async function validateCustomerCode(customerCode) {
  if (!customerCode) {
    return { isValid: false, message: 'Kunden-Code darf nicht leer sein' };
  }

  const codeUpper = customerCode.toUpperCase().trim();

  // Check format
  if (!codeUpper.match(/^LEO-[A-Z0-9]+$/)) {
    return { isValid: false, message: 'Kunden-Code hat falsches Format (LEO-XXXXXX)' };
  }

  const cacheKey = `code_${codeUpper}`;

  // Check in-memory cache first (fastest)
  const cached = customerCodeCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
    console.log('✅ Customer code validated from memory cache:', codeUpper);
    return {
      isValid: true,
      customerInfo: cached.data,
      message: 'Kunden-Code gültig'
    };
  }

  // Check localStorage cache second (very fast, no network)
  try {
    const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
    const cachedCustomer = savedCustomers[cacheKey];
    if (cachedCustomer) {
      console.log('✅ Customer code validated from localStorage cache:', codeUpper);
      // Update in-memory cache
      customerCodeCache.set(cacheKey, { data: cachedCustomer, timestamp: Date.now() });
      return {
        isValid: true,
        customerInfo: cachedCustomer,
        message: 'Kunden-Code gültig'
      };
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }

  // Check in Firebase (slower, but syncs across devices)
  if (typeof db !== 'undefined' && db) {
    try {
      console.log('🔍 Validating customerCode in Firebase:', codeUpper);

      // Try query first (fastest if index exists)
      let querySnapshot;
      try {
        querySnapshot = await db.collection('customers')
          .where('customerCode', '==', codeUpper)
          .limit(1)
          .get();

        console.log('📋 Validation query result - empty:', querySnapshot.empty, 'size:', querySnapshot.size);

        // If found via query, return immediately (address will be loaded separately if needed)
        if (!querySnapshot.empty) {
          const customerData = querySnapshot.docs[0].data();
          console.log('✅ Customer code validated in Firebase (query method):', codeUpper);

          // Cache to both in-memory and localStorage for faster future access
          customerCodeCache.set(cacheKey, { data: customerData, timestamp: Date.now() });
          try {
            const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
            savedCustomers[cacheKey] = customerData;
            localStorage.setItem('leoCustomers', JSON.stringify(savedCustomers));
          } catch (e) {
            console.warn('Error caching to localStorage:', e);
          }

          return {
            isValid: true,
            customerInfo: customerData,
            message: 'Kunden-Code gültig'
          };
        }
      } catch (queryError) {
        // If query fails (e.g., missing index), return error immediately
        // Don't try to get all customers - that's too slow!
        console.error('❌ Query failed (likely missing index):', queryError.message);
        console.error('⚠️ Please create a Firestore index for customers.customerCode');

        // Return error immediately instead of trying slow fallback
        return {
          isValid: false,
          message: 'Fehler: Firestore Index fehlt. Bitte kontaktieren Sie den Administrator.'
        };
      }

      if (querySnapshot && querySnapshot.empty) {
        // Not found in customers - try searching in orders collection with where clause (fast)
        console.warn('⚠️ Customer code not found in customers collection, searching in orders...');

        try {
          // Try query orders with where clause first (fastest if index exists)
          let ordersSnapshot;
          try {
            ordersSnapshot = await db.collection('orders')
              .where('customerCode', '==', codeUpper)
              .orderBy('createdAt', 'desc')
              .limit(1)
              .get();
          } catch (e) {
            // If orderBy fails, try without orderBy
            try {
              ordersSnapshot = await db.collection('orders')
                .where('customerCode', '==', codeUpper)
                .limit(1)
                .get();
            } catch (e2) {
              // If both fail, skip orders search (too slow without index)
              console.warn('⚠️ Cannot query orders (missing index), skipping...');
              ordersSnapshot = null;
            }
          }

          if (ordersSnapshot && !ordersSnapshot.empty) {
            const orderData = ordersSnapshot.docs[0].data();
            if (orderData.delivery && orderData.delivery.address) {
              const customerDataFromOrder = {
                firstName: orderData.delivery.address.firstName || '',
                lastName: orderData.delivery.address.lastName || '',
                email: orderData.delivery.address.email || '',
                phone: orderData.delivery.address.phone || '',
                street: orderData.delivery.address.street || '',
                postal: orderData.delivery.address.postal || '',
                city: orderData.delivery.address.city || '',
                note: orderData.delivery.address.note || '',
                customerCode: codeUpper
              };

              console.log('✅ Customer code found in orders collection:', codeUpper);

              // Try to create/update customer record in customers collection for future lookups (async, don't wait)
              if (customerDataFromOrder.email) {
                const customerKey = customerDataFromOrder.email.toLowerCase().trim();
                const customerRef = db.collection('customers').doc(customerKey);
                customerRef.set({
                  ...customerDataFromOrder,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true }).catch(createError => {
                  console.warn('⚠️ Could not create customer record:', createError);
                });
              }

              // Cache the result
              customerCodeCache.set(cacheKey, { data: customerDataFromOrder, timestamp: Date.now() });
              return {
                isValid: true,
                customerInfo: customerDataFromOrder,
                message: 'Kunden-Code gültig'
              };
            }
          }

          // Not found in orders either
          return { isValid: false, message: 'Kein Kunde mit diesem Code gefunden' };
        } catch (ordersError) {
          console.error('❌ Error searching orders collection:', ordersError);
          return { isValid: false, message: 'Kein Kunde mit diesem Code gefunden' };
        }
      }

      // Check if there are multiple customers with the same code (should not happen)
      if (querySnapshot && querySnapshot.size > 1) {
        console.error('⚠️ WARNING: Multiple customers found with the same code:', codeUpper);
        return {
          isValid: false,
          message: '⚠️ Fehler: Kunden-Code ist doppelt vorhanden. Bitte kontaktieren Sie den Administrator.'
        };
      }

      // Exactly one customer found - valid
      if (querySnapshot && !querySnapshot.empty) {
        const customerDoc = querySnapshot.docs[0];
        const customerData = customerDoc.data();

        console.log('✅ Customer code validated in Firebase:', codeUpper);

        // Cache to both in-memory and localStorage for faster future access
        customerCodeCache.set(cacheKey, { data: customerData, timestamp: Date.now() });
        try {
          const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
          savedCustomers[cacheKey] = customerData;
          localStorage.setItem('leoCustomers', JSON.stringify(savedCustomers));
        } catch (e) {
          console.warn('Error caching to localStorage:', e);
        }

        return {
          isValid: true,
          customerInfo: customerData,
          message: 'Kunden-Code gültig'
        };
      }
    } catch (e) {
      console.error('❌ Error validating customer code in Firebase:', e);
      console.error('Error code:', e.code, 'Error message:', e.message);

      // Only return error if it's a permission error - don't fallback to localStorage
      if (e.code === 'permission-denied') {
        throw e; // Let caller handle permission error
      }

      // For other errors (connection issues, etc.), return error instead of fallback
      return {
        isValid: false,
        message: 'Fehler bei der Validierung des Kunden-Codes. Bitte versuchen Sie es erneut.'
      };
    }
  } else {
    // Firebase not available - cannot validate (Firebase is required for web app)
    console.error('❌ Firebase nicht verfügbar. Kunden-Code kann nicht validiert werden.');
    return {
      isValid: false,
      message: 'Firebase nicht verfügbar. Bitte öffnen Sie setup.html zur Konfiguration.'
    };
  }

  // NO FALLBACK TO LOCALSTORAGE - Firebase is required for cross-device sync
  return { isValid: false, message: 'Kein Kunde mit diesem Code gefunden' };
}

// Validate customer uniqueness when saving (1 email + 1 phone = 1 code)
// Mỗi khách hàng có 1 email + 1 số điện thoại, cặp này là duy nhất và chỉ có 1 mã khách hàng
async function validateCustomerUniqueness(email, phone, customerCode = null) {
  if (!email || !phone) {
    return { isValid: false, message: 'E-Mail và Telefonnummer sind erforderlich' };
  }

  const emailKey = email.toLowerCase().trim();
  const phoneNormalized = phone.replace(/[\s\-\+\(\)]/g, '');

  if (typeof db !== 'undefined' && db) {
    try {
      // Check if this exact email+phone combination already exists
      const emailDoc = await db.collection('customers').doc(emailKey).get();

      if (emailDoc.exists) {
        const existingData = emailDoc.data();
        const existingPhone = (existingData.phone || '').replace(/[\s\-\+\(\)]/g, '');

        // Same email - check if phone matches
        if (existingPhone === phoneNormalized) {
          // Same email + same phone = same customer
          // Return existing customer code if available
          if (existingData.customerCode) {
            if (customerCode && existingData.customerCode.toUpperCase() !== customerCode.toUpperCase()) {
              return {
                isValid: false,
                message: `Diese E-Mail und Telefonnummer haben bereits einen anderen Kunden-Code: ${existingData.customerCode}`
              };
            }
            return {
              isValid: true,
              existingCustomerCode: existingData.customerCode,
              message: 'Kunde existiert bereits mit Code: ' + existingData.customerCode
            };
          }
          // Same customer but no code yet - valid to create
          return { isValid: true, message: 'Kunde existiert bereits, neuer Code wird erstellt' };
        } else {
          // Same email but different phone - conflict
          return {
            isValid: false,
            message: `Diese E-Mail wird bereits mit einer anderen Telefonnummer verwendet`
          };
        }
      }

      // Check if phone already exists with different email
      const phoneQuery = await db.collection('customers')
        .where('phone', '==', phone)
        .get();

      if (!phoneQuery.empty) {
        const existingDoc = phoneQuery.docs[0];
        const existingData = existingDoc.data();
        const existingEmail = (existingData.email || '').toLowerCase().trim();

        if (existingEmail !== emailKey) {
          // Same phone but different email - conflict
          return {
            isValid: false,
            message: `Diese Telefonnummer wird bereits mit einer anderen E-Mail verwendet`
          };
        }
        // Same phone and same email (should have been caught above, but double-check)
        if (existingData.customerCode) {
          if (customerCode && existingData.customerCode.toUpperCase() !== customerCode.toUpperCase()) {
            return {
              isValid: false,
              message: `Diese E-Mail und Telefonnummer haben bereits einen anderen Kunden-Code: ${existingData.customerCode}`
            };
          }
          return {
            isValid: true,
            existingCustomerCode: existingData.customerCode,
            message: 'Kunde existiert bereits mit Code: ' + existingData.customerCode
          };
        }
      }

      // Check if customer code already exists with different email/phone combination
      if (customerCode) {
        const codeUpper = customerCode.toUpperCase().trim();
        const codeQuery = await db.collection('customers')
          .where('customerCode', '==', codeUpper)
          .get();

        if (!codeQuery.empty) {
          const existingDoc = codeQuery.docs[0];
          const existingData = existingDoc.data();
          const existingEmail = (existingData.email || '').toLowerCase().trim();
          const existingPhone = (existingData.phone || '').replace(/[\s\-\+\(\)]/g, '');

          // Check if BOTH email AND phone match
          if (existingEmail !== emailKey || existingPhone !== phoneNormalized) {
            return {
              isValid: false,
              message: `Dieser Kunden-Code wird bereits von einem anderen Kunden verwendet (andere E-Mail oder Telefonnummer)`
            };
          }
        }
      }

      // New customer or valid existing customer
      return { isValid: true, message: 'Kundeninformationen gültig' };
    } catch (e) {
      console.error('Error validating customer uniqueness:', e);
      return { isValid: false, message: 'Fehler bei der Validierung der Kundeninformationen' };
    }
  }

  return { isValid: true, message: 'Kundeninformationen gültig' };
}

// Check if customer exists by email+phone and auto-fill customer code
async function checkExistingCustomerByEmailPhone() {
  const emailField = document.getElementById('customerEmail');
  const phoneField = document.getElementById('customerPhone');
  const customerCodeField = document.getElementById('customerCode');

  if (!emailField || !phoneField || !customerCodeField) return;

  const email = emailField.value.trim();
  const phone = phoneField.value.trim();

  // Need both email and phone to check
  if (!email || !phone) return;

  // Don't check if customer code is already filled
  if (customerCodeField.value.trim()) return;

  try {
    const emailKey = email.toLowerCase().trim();
    const phoneNormalized = phone.replace(/[\s\-\+\(\)]/g, '');

    // Check in Firebase
    if (typeof db !== 'undefined' && db) {
      const emailDoc = await db.collection('customers').doc(emailKey).get();

      if (emailDoc.exists) {
        const existingData = emailDoc.data();
        const existingPhone = (existingData.phone || '').replace(/[\s\-\+\(\)]/g, '');

        // Check if phone matches
        if (existingPhone === phoneNormalized) {
          // Same customer found - fill in the customer code
          if (existingData.customerCode) {
            customerCodeField.value = existingData.customerCode;
            showNotification('✓ Kunden-Code gefunden: ' + existingData.customerCode);

            // Also auto-fill other fields if empty (skip email/phone since user already entered them)
            autoFillCustomerInfo(existingData, true);
          }
        }
      }
    }
  } catch (e) {
    console.error('Error checking existing customer:', e);
  }
}

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Setup auto-fill when customer code is entered
function setupCustomerCodeAutoFill() {
  const customerCodeField = document.getElementById('customerCode');
  const emailField = document.getElementById('customerEmail');
  const phoneField = document.getElementById('customerPhone');

  if (!customerCodeField) return;

  let isAutoFilling = false;
  let preloadTimeout = null;

  // Auto-format to uppercase while typing (already handled above, but keep for compatibility)

  // Check existing customer when email and phone are both filled
  if (emailField && phoneField) {
    let checkTimeout;
    const handleEmailPhoneInput = () => {
      clearTimeout(checkTimeout);
      checkTimeout = setTimeout(() => {
        checkExistingCustomerByEmailPhone();
      }, 1000); // Wait 1 second after user stops typing
    };

    emailField.addEventListener('blur', handleEmailPhoneInput);
    phoneField.addEventListener('blur', handleEmailPhoneInput);
    emailField.addEventListener('input', handleEmailPhoneInput);
    phoneField.addEventListener('input', handleEmailPhoneInput);
  }

  // Auto-fill when customer code is entered (on blur or Enter key)
  // OPTIMIZED: Only search when code is complete (at least 7 chars: LEO-XXX)
  const handleCustomerCodeInput = async () => {
    const code = customerCodeField.value.trim().toUpperCase();

    // Update field value to uppercase
    if (customerCodeField.value !== code) {
      customerCodeField.value = code;
    }

    if (!code || isAutoFilling) return;

    // OPTIMIZATION: Only search when code is at least 7 characters (LEO-XXX)
    if (code.length < 7) {
      // If code is too short, don't do anything (user might still be typing)
      return; // Wait for more input
    }

    // Check if code format is valid (LEO-XXXXXX)
    if (!code.match(/^LEO-[A-Z0-9]+$/i)) {
      showNotification('⚠ Kunden-Code hat falsches Format (LEO-XXXXXX)', true);
      return;
    }

    isAutoFilling = true;
    const originalPlaceholder = customerCodeField.placeholder;
    customerCodeField.placeholder = 'Wird geladen...';
    customerCodeField.disabled = true;

    // Add visual feedback
    customerCodeField.style.opacity = '0.7';

    try {
      // Validate customer code uniqueness and load info
      const validationResult = await validateCustomerCode(code);

      if (validationResult.isValid && validationResult.customerInfo) {
        // Verify that BOTH email AND phone match (if already filled)
        const emailField = document.getElementById('customerEmail');
        const phoneField = document.getElementById('customerPhone');

        const existingEmail = emailField?.value.trim().toLowerCase() || '';
        const existingPhone = phoneField?.value.trim().replace(/[\s\-\+\(\)]/g, '') || '';

        const customerEmail = (validationResult.customerInfo.email || '').toLowerCase().trim();
        const customerPhone = (validationResult.customerInfo.phone || '').replace(/[\s\-\+\(\)]/g, '');

        // If both email and phone are already filled, verify BOTH match
        if (existingEmail && existingPhone) {
          if (existingEmail !== customerEmail || existingPhone !== customerPhone) {
            showNotification('⚠ E-Mail oder Telefonnummer stimmen nicht mit diesem Kunden-Code überein', true);
            customerCodeField.value = '';
            return;
          }
        } else if (existingEmail && existingEmail !== customerEmail) {
          // Only email filled, check if it matches
          showNotification('⚠ E-Mail stimmt nicht mit diesem Kunden-Code überein', true);
          customerCodeField.value = '';
          return;
        } else if (existingPhone && existingPhone !== customerPhone) {
          // Only phone filled, check if it matches
          showNotification('⚠ Telefonnummer stimmt nicht mit diesem Kunden-Code überein', true);
          customerCodeField.value = '';
          return;
        }

        // All checks passed - auto-fill immediately with basic info
        autoFillCustomerInfo(validationResult.customerInfo);

        // Enable field immediately after filling basic info (don't wait for address)
        customerCodeField.placeholder = originalPlaceholder;
        customerCodeField.disabled = false;
        customerCodeField.style.opacity = '1';
        isAutoFilling = false;

        showNotification('✓ Kundeninformationen wurden verifiziert und automatisch ausgefüllt');

        // OPTIMIZATION: Load address in background if missing (non-blocking, doesn't block UI)
        if (!validationResult.customerInfo.street || !validationResult.customerInfo.postal || !validationResult.customerInfo.city) {
          // Load address asynchronously without blocking the UI
          loadAddressFromOrders(code).then(addressData => {
            if (addressData) {
              const streetField = document.getElementById('deliveryStreet');
              const postalField = document.getElementById('deliveryPostal');
              const cityField = document.getElementById('deliveryCity');
              const noteField = document.getElementById('deliveryNote');

              if (streetField && !streetField.value && addressData.street) {
                streetField.value = addressData.street;
              }
              if (postalField && !postalField.value && addressData.postal) {
                postalField.value = addressData.postal;
              }
              if (cityField && !cityField.value && addressData.city) {
                cityField.value = addressData.city;
              }
              if (noteField && !noteField.value && addressData.note) {
                noteField.value = addressData.note;
              }

              if (addressData.street || addressData.postal || addressData.city) {
                showNotification('✓ Adresse wurde aus der Bestellhistorie aktualisiert');
              }
            }
          }).catch(e => {
            console.warn('Could not load address from orders:', e);
            // Silent fail - don't show error to user
          });
        }
      } else {
        // Show error notification
        showNotification(validationResult.message || '⚠ Keine Informationen zu diesem Kunden-Code gefunden', true);
        customerCodeField.value = '';
        customerCodeField.placeholder = originalPlaceholder;
        customerCodeField.disabled = false;
        customerCodeField.style.opacity = '1';
        isAutoFilling = false;
      }
    } catch (e) {
      console.error('Error loading customer info:', e);
      showNotification('⚠ Fehler beim Laden der Kundeninformationen', true);
      customerCodeField.placeholder = originalPlaceholder;
      customerCodeField.disabled = false;
      customerCodeField.style.opacity = '1';
      isAutoFilling = false;
    }
  };

  // Auto-format to uppercase while typing
  customerCodeField.addEventListener('input', function () {
    const cursorPos = this.selectionStart;
    this.value = this.value.toUpperCase();
    this.setSelectionRange(cursorPos, cursorPos);

    // OPTIMIZATION: Preload customer data when code is complete (7+ chars)
    // This way when user blurs, data is already cached
    // Use debounce to avoid too many queries while typing
    clearTimeout(preloadTimeout);
    preloadTimeout = setTimeout(() => {
      const code = customerCodeField.value.trim();
      if (code.length >= 7 && code.match(/^LEO-[A-Z0-9]+$/i) && !isAutoFilling) {
        // Preload in background (don't block UI)
        const codeUpper = code.toUpperCase().trim();
        const cacheKey = `code_${codeUpper}`;

        // Check if already cached
        const cached = customerCodeCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
          return; // Already cached
        }

        // Check localStorage
        try {
          const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
          if (savedCustomers[cacheKey]) {
            return; // Already in localStorage
          }
        } catch (e) {
          // Ignore
        }

        // Preload from Firebase in background (silent, no UI feedback)
        validateCustomerCode(code).catch(e => {
          // Silent fail - don't show error, just log
          console.log('Preload failed (will retry on blur):', e);
        });
      }
    }, 300); // Wait 300ms after user stops typing
  });

  // Trigger auto-fill when user leaves the field (blur) - main trigger
  customerCodeField.addEventListener('blur', function () {
    // Small delay to ensure value is updated
    setTimeout(() => {
      handleCustomerCodeInput();
    }, 50); // Reduced delay since we preload
  });

  // Also trigger on Enter key (immediate, no debounce)
  customerCodeField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCustomerCodeInput();
    }
  });
}

// Setup auto-fill for reservation customer code field
function setupReservationCustomerCodeAutoFill() {
  const reservationCustomerCodeField = document.getElementById('reservationCustomerCode');
  if (!reservationCustomerCodeField) return;

  let isAutoFilling = false;

  const handleReservationCustomerCodeInput = async () => {
    const code = reservationCustomerCodeField.value.trim().toUpperCase();

    // Update field value to uppercase
    if (reservationCustomerCodeField.value !== code) {
      reservationCustomerCodeField.value = code;
    }

    if (!code || isAutoFilling) return;

    // OPTIMIZATION: Only search when code is at least 7 characters (LEO-XXX)
    if (code.length < 7) {
      return; // Wait for more input
    }

    if (!code.match(/^LEO-[A-Z0-9]+$/i)) {
      showNotification('⚠ Kunden-Code hat falsches Format (LEO-XXXXXX)', true);
      return;
    }

    isAutoFilling = true;
    const originalPlaceholder = reservationCustomerCodeField.placeholder;
    reservationCustomerCodeField.placeholder = 'Wird geladen...';
    reservationCustomerCodeField.disabled = true;

    // Add visual feedback
    reservationCustomerCodeField.style.opacity = '0.7';

    try {
      const validationResult = await validateCustomerCode(code);

      if (validationResult.isValid && validationResult.customerInfo) {
        // Fill reservation form fields (form đặt bàn riêng - reservationModal)
        const firstNameField = document.getElementById('reserveFirstName');
        const lastNameField = document.getElementById('reserveLastName');
        const emailField = document.getElementById('reserveEmail');
        const phoneField = document.getElementById('reservePhone');

        // Also try payment modal reservation fields (if they exist)
        const firstNameFieldPayment = document.getElementById('reserveFirstNameInPayment');
        const lastNameFieldPayment = document.getElementById('reserveLastNameInPayment');
        const emailFieldPayment = document.getElementById('reserveEmailInPayment');
        const phoneFieldPayment = document.getElementById('reservePhoneInPayment');

        // Fill reservation modal fields (form đặt bàn riêng)
        if (firstNameField && !firstNameField.value) firstNameField.value = validationResult.customerInfo.firstName || '';
        if (lastNameField && !lastNameField.value) lastNameField.value = validationResult.customerInfo.lastName || '';
        if (emailField && !emailField.value) emailField.value = validationResult.customerInfo.email || '';
        if (phoneField && !phoneField.value) phoneField.value = validationResult.customerInfo.phone || '';

        // Fill payment modal reservation fields (if they exist)
        if (firstNameFieldPayment && !firstNameFieldPayment.value) firstNameFieldPayment.value = validationResult.customerInfo.firstName || '';
        if (lastNameFieldPayment && !lastNameFieldPayment.value) lastNameFieldPayment.value = validationResult.customerInfo.lastName || '';
        if (emailFieldPayment && !emailFieldPayment.value) emailFieldPayment.value = validationResult.customerInfo.email || '';
        if (phoneFieldPayment && !phoneFieldPayment.value) phoneFieldPayment.value = validationResult.customerInfo.phone || '';

        // Enable field immediately after filling (don't wait)
        reservationCustomerCodeField.placeholder = originalPlaceholder;
        reservationCustomerCodeField.disabled = false;
        reservationCustomerCodeField.style.opacity = '1';
        isAutoFilling = false;

        showNotification('✓ Kundeninformationen wurden automatisch ausgefüllt');
      } else {
        showNotification(validationResult.message || '⚠ Kein Kunde mit diesem Code gefunden', true);
        reservationCustomerCodeField.value = '';
        reservationCustomerCodeField.placeholder = originalPlaceholder;
        reservationCustomerCodeField.disabled = false;
        reservationCustomerCodeField.style.opacity = '1';
        isAutoFilling = false;
      }
    } catch (e) {
      console.error('Error loading customer info:', e);
      showNotification('⚠ Fehler beim Laden der Kundeninformationen', true);
      reservationCustomerCodeField.placeholder = originalPlaceholder;
      reservationCustomerCodeField.disabled = false;
      reservationCustomerCodeField.style.opacity = '1';
      isAutoFilling = false;
    }
  };

  // Auto-format to uppercase while typing
  reservationCustomerCodeField.addEventListener('input', function () {
    const cursorPos = this.selectionStart;
    this.value = this.value.toUpperCase();
    this.setSelectionRange(cursorPos, cursorPos);
  });

  // Trigger auto-fill when user leaves the field (blur) - main trigger
  reservationCustomerCodeField.addEventListener('blur', function () {
    // Small delay to ensure value is updated
    setTimeout(() => {
      handleReservationCustomerCodeInput();
    }, 100);
  });
  reservationCustomerCodeField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleReservationCustomerCodeInput();
    }
  });
}

// Setup early customer code entry (at top of page, before ordering)
function setupEarlyCustomerCodeEntry() {
  const customerCodeEarlyField = document.getElementById('customerCodeEarly');
  const loadCustomerInfoBtn = document.getElementById('loadCustomerInfoBtn');
  const customerInfoLoaded = document.getElementById('customerInfoLoaded');

  if (!customerCodeEarlyField) return;

  // Auto-format to uppercase
  customerCodeEarlyField.addEventListener('input', function () {
    this.value = this.value.toUpperCase();
  });

  // Load customer info function
  const loadCustomerInfo = async () => {
    const code = customerCodeEarlyField.value.trim();

    if (!code) {
      showNotification('⚠ Bitte geben Sie einen Kunden-Code ein', true);
      return;
    }

    if (code.length < 7) {
      showNotification('⚠ Kunden-Code muss mindestens 7 Zeichen lang sein (LEO-XXX)', true);
      return;
    }

    if (!code.match(/^LEO-[A-Z0-9]+$/i)) {
      showNotification('⚠ Kunden-Code hat falsches Format (LEO-XXXXXX)', true);
      return;
    }

    // Disable button and show loading
    if (loadCustomerInfoBtn) {
      loadCustomerInfoBtn.disabled = true;
      loadCustomerInfoBtn.textContent = 'Wird geladen...';
    }
    customerCodeEarlyField.disabled = true;

    try {
      const validationResult = await validateCustomerCode(code);

      if (validationResult.isValid && validationResult.customerInfo) {
        // Save customer info to localStorage for later use
        const customerInfo = validationResult.customerInfo;
        localStorage.setItem('leoEarlyCustomerInfo', JSON.stringify({
          ...customerInfo,
          customerCode: code.toUpperCase().trim().replace(/\s+/g, ''),
          loadedAt: Date.now()
        }));

        // Show success message
        if (customerInfoLoaded) {
          customerInfoLoaded.style.display = 'block';
        }
        showNotification('✓ Ihre Informationen wurden geladen! Sie können jetzt bestellen oder reservieren.', false);

        // Auto-fill payment modal fields if modal is open
        setTimeout(() => {
          autoFillFromEarlyEntry();
        }, 100);
      } else {
        showNotification(validationResult.message || '⚠ Kein Kunde mit diesem Code gefunden', true);
        if (customerInfoLoaded) {
          customerInfoLoaded.style.display = 'none';
        }
        localStorage.removeItem('leoEarlyCustomerInfo');
      }
    } catch (e) {
      console.error('Error loading customer info:', e);
      showNotification('⚠ Fehler beim Laden der Kundeninformationen', true);
      if (customerInfoLoaded) {
        customerInfoLoaded.style.display = 'none';
      }
    } finally {
      if (loadCustomerInfoBtn) {
        loadCustomerInfoBtn.disabled = false;
        loadCustomerInfoBtn.textContent = 'Laden';
      }
      customerCodeEarlyField.disabled = false;
    }
  };

  // Button click handler
  if (loadCustomerInfoBtn) {
    loadCustomerInfoBtn.addEventListener('click', loadCustomerInfo);
  }

  // Enter key handler
  customerCodeEarlyField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      loadCustomerInfo();
    }
  });

  // Auto-load if customer code is already in localStorage
  const savedInfo = localStorage.getItem('leoEarlyCustomerInfo');
  if (savedInfo) {
    try {
      const info = JSON.parse(savedInfo);
      // Check if info is not too old (24 hours)
      if (info.loadedAt && (Date.now() - info.loadedAt) < 24 * 60 * 60 * 1000) {
        customerCodeEarlyField.value = info.customerCode || '';
        if (customerInfoLoaded) {
          customerInfoLoaded.style.display = 'block';
        }
      } else {
        localStorage.removeItem('leoEarlyCustomerInfo');
      }
    } catch (e) {
      console.error('Error loading saved customer info:', e);
    }
  }
}

// Auto-fill payment modal from early entry
function autoFillFromEarlyEntry() {
  const savedInfo = localStorage.getItem('leoEarlyCustomerInfo');
  if (!savedInfo) return;

  try {
    const customerInfo = JSON.parse(savedInfo);

    // Fill order form fields
    const firstNameField = document.getElementById('customerFirstName');
    const lastNameField = document.getElementById('customerLastName');
    const emailField = document.getElementById('customerEmail');
    const phoneField = document.getElementById('customerPhone');
    const streetField = document.getElementById('deliveryStreet');
    const postalField = document.getElementById('deliveryPostal');
    const cityField = document.getElementById('deliveryCity');
    const noteField = document.getElementById('deliveryNote');
    const customerCodeField = document.getElementById('customerCode');

    if (firstNameField && !firstNameField.value) firstNameField.value = customerInfo.firstName || '';
    if (lastNameField && !lastNameField.value) lastNameField.value = customerInfo.lastName || '';
    if (emailField && !emailField.value) emailField.value = customerInfo.email || '';
    if (phoneField && !phoneField.value) phoneField.value = customerInfo.phone || '';
    if (streetField && !streetField.value) streetField.value = customerInfo.street || '';
    if (postalField && !postalField.value) postalField.value = customerInfo.postal || '';
    if (cityField && !cityField.value) cityField.value = customerInfo.city || '';
    if (noteField && !noteField.value) noteField.value = customerInfo.note || '';
    if (customerCodeField && !customerCodeField.value) customerCodeField.value = customerInfo.customerCode || '';

    // Fill reservation form fields
    const reserveFirstNameField = document.getElementById('reserveFirstNameInPayment');
    const reserveLastNameField = document.getElementById('reserveLastNameInPayment');
    const reserveEmailField = document.getElementById('reserveEmailInPayment');
    const reservePhoneField = document.getElementById('reservePhoneInPayment');
    const reservationCustomerCodeField = document.getElementById('reservationCustomerCode');

    if (reserveFirstNameField && !reserveFirstNameField.value) reserveFirstNameField.value = customerInfo.firstName || '';
    if (reserveLastNameField && !reserveLastNameField.value) reserveLastNameField.value = customerInfo.lastName || '';
    if (reserveEmailField && !reserveEmailField.value) reserveEmailField.value = customerInfo.email || '';
    if (reservePhoneField && !reservePhoneField.value) reservePhoneField.value = customerInfo.phone || '';
    if (reservationCustomerCodeField && !reservationCustomerCodeField.value) reservationCustomerCodeField.value = customerInfo.customerCode || '';
  } catch (e) {
    console.error('Error auto-filling from early entry:', e);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupCustomerCodeAutoFill();
    setupReservationCustomerCodeAutoFill();
    setupEarlyCustomerCodeEntry();
  });
} else {
  setupCustomerCodeAutoFill();
  setupReservationCustomerCodeAutoFill();
  setupEarlyCustomerCodeEntry();
}

// Generate customer code
function generateCustomerCode() {
  // Format: LEO-XXXXXX (6 random alphanumeric characters)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars like 0, O, I, 1
  let code = 'LEO-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Save customer information to localStorage and Firebase
async function saveCustomerInfo(customerData) {
  if (!customerData || !customerData.email || !customerData.phone) {
    return null; // Skip if no email or phone
  }

  const customerKey = customerData.email.toLowerCase().trim();
  const phoneKey = customerData.phone.replace(/[\s\-\+\(\)]/g, ''); // Normalize phone

  // Prepare customer info object
  let customerInfo = {
    firstName: customerData.firstName || '',
    lastName: customerData.lastName || '',
    email: customerData.email.toLowerCase().trim(),
    phone: customerData.phone,
    birthday: customerData.birthday || null,
    street: customerData.street || '',
    postal: customerData.postal || '',
    city: customerData.city || '',
    note: customerData.note || '',
    lastOrderDate: new Date().toISOString(),
    orderCount: 1, // Will be updated based on existing data
    customerCode: customerData.customerCode || null // Preserve existing code if any
  };

  // Validate customer uniqueness using the new validation function (1 email + 1 phone = 1 code)
  // Use validateCustomerUniqueness if available, otherwise fall back to old logic
  if (typeof validateCustomerUniqueness === 'function') {
    try {
      const validationResult = await validateCustomerUniqueness(
        customerInfo.email,
        customerInfo.phone,
        customerInfo.customerCode || null
      );

      if (!validationResult.isValid) {
        console.error('❌ Customer validation failed:', validationResult.message);
        // Still proceed but log the error
      } else if (validationResult.existingCustomerCode) {
        // Customer already exists with a code - use existing code
        customerInfo.customerCode = validationResult.existingCustomerCode;
        console.log('✅ Using existing customer code:', validationResult.existingCustomerCode);
      }
    } catch (e) {
      console.error('❌ Error validating customer uniqueness:', e);
    }
  }

  // Check if customer exists in Firebase first to preserve existing data
  // IMPORTANT: Check by email (document ID) AND phone to ensure same customer gets same code
  if (typeof db !== 'undefined' && db) {
    try {
      const customerRef = db.collection('customers').doc(customerKey);
      const customerDoc = await customerRef.get();

      if (customerDoc.exists) {
        const existingData = customerDoc.data();
        const existingPhone = (existingData.phone || '').replace(/[\s\-\+\(\)]/g, '');

        // Check if phone also matches (same email + same phone = same customer)
        if (existingPhone === phoneKey) {
          console.log('✅ Existing customer found (email + phone match):', customerKey, 'Code:', existingData.customerCode);

          // ALWAYS preserve existing code - never generate new one for existing customer
          if (existingData.customerCode) {
            customerInfo.customerCode = existingData.customerCode;
            console.log('✅ Preserved existing customer code:', existingData.customerCode);
          } else {
            // Customer exists but no code - generate one now
            customerInfo.customerCode = generateCustomerCode();
            console.log('⚠️ Customer exists but no code, generated new:', customerInfo.customerCode);
          }

          // Increment order count
          customerInfo.orderCount = (existingData.orderCount || 0) + 1;
          console.log('📊 Updated order count:', customerInfo.orderCount);
        } else {
          // Same email but different phone - this shouldn't happen, but handle it
          console.warn('⚠️ Email exists but phone different - treating as new customer');
          if (!customerInfo.customerCode) {
            customerInfo.customerCode = generateCustomerCode();
            console.log('🆕 Generated new code for email with different phone:', customerInfo.customerCode);
          }
        }
      } else {
        // New customer - generate code if not already set
        if (!customerInfo.customerCode) {
          customerInfo.customerCode = generateCustomerCode();
          console.log('🆕 New customer, generated code:', customerInfo.customerCode);
        }
      }
    } catch (e) {
      console.error('❌ Error checking existing customer:', e);
      // If error, generate new code for new customer
      if (!customerInfo.customerCode) {
        customerInfo.customerCode = generateCustomerCode();
        console.log('⚠️ Error occurred, generated code:', customerInfo.customerCode);
      }
    }
  } else {
    // No Firebase available - cannot save customer info
    // Firebase is required for web application (cross-device sync)
    console.error('❌ Firebase nicht verfügbar. Kundeninformationen können nicht gespeichert werden.');
    console.error('❌ Bitte öffnen Sie setup.html zur Konfiguration der Firebase-Datenbank.');
    return null; // Return null if Firebase is not available
  }

  // Save to Firebase (PRIMARY SOURCE - required for web application)
  if (typeof db !== 'undefined' && db && typeof firebase !== 'undefined') {
    try {
      const customerRef = db.collection('customers').doc(customerKey);
      const customerDoc = await customerRef.get();

      if (customerDoc.exists) {
        // Update existing customer - ALWAYS preserve existing code
        const existingData = customerDoc.data();

        // CRITICAL: Always use existing code if available, never overwrite
        if (existingData.customerCode) {
          customerInfo.customerCode = existingData.customerCode;
          console.log('✅ Preserving existing customer code in update:', existingData.customerCode);
        } else if (!customerInfo.customerCode) {
          // No existing code and no new code - generate one
          customerInfo.customerCode = generateCustomerCode();
          console.log('⚠️ No existing code, generated new in update:', customerInfo.customerCode);
        }

        await customerRef.update({
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          birthday: customerInfo.birthday || null,
          street: customerInfo.street,
          postal: customerInfo.postal,
          city: customerInfo.city,
          note: customerInfo.note,
          customerCode: customerInfo.customerCode ? customerInfo.customerCode.toString().toUpperCase().trim().replace(/\s+/g, '') : null, // Always store normalized (UPPERCASE, trimmed, no spaces)
          lastOrderDate: customerInfo.lastOrderDate,
          orderCount: customerInfo.orderCount,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Customer updated in Firebase with code:', customerInfo.customerCode);
      } else {
        // Create new customer
        // Normalize customerCode before saving
        const normalizedCode = customerInfo.customerCode ? customerInfo.customerCode.toString().toUpperCase().trim().replace(/\s+/g, '') : null;
        await customerRef.set({
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          birthday: customerInfo.birthday || null,
          street: customerInfo.street,
          postal: customerInfo.postal,
          city: customerInfo.city,
          note: customerInfo.note,
          customerCode: normalizedCode, // Always store normalized (UPPERCASE, trimmed, no spaces)
          lastOrderDate: customerInfo.lastOrderDate,
          orderCount: customerInfo.orderCount,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ New customer created in Firebase with code:', normalizedCode);
      }
      console.log('Customer saved to Firebase:', customerInfo.email, 'Code:', customerInfo.customerCode);

      // Cache to localStorage ONLY after successful Firebase save (for faster access on same device)
      try {
        const savedCustomers = JSON.parse(localStorage.getItem('leoCustomers') || '{}');
        savedCustomers[customerKey] = customerInfo;
        savedCustomers[`phone_${phoneKey}`] = customerInfo; // Also index by phone
        if (customerInfo.customerCode) {
          savedCustomers[`code_${customerInfo.customerCode.toUpperCase()}`] = customerInfo; // Also index by code
        }
        localStorage.setItem('leoCustomers', JSON.stringify(savedCustomers));
      } catch (e) {
        console.error('Error caching customer to localStorage:', e);
        // Non-critical error - continue even if cache fails
      }
    } catch (e) {
      console.error('Error saving customer to Firebase:', e);
      // Don't cache to localStorage if Firebase save failed
      return null;
    }
  } else {
    // Firebase not available - cannot save
    console.error('❌ Firebase nicht verfügbar. Kundeninformationen können nicht gespeichert werden.');
    return null;
  }

  // Return customer info with code for display
  return customerInfo;
}

// Expose functions globally
window.loadCustomerInfo = loadCustomerInfo;
window.loadAddressFromOrders = loadAddressFromOrders;
window.autoFillCustomerInfo = autoFillCustomerInfo;
window.setupCustomerCodeAutoFill = setupCustomerCodeAutoFill;
window.setupReservationCustomerCodeAutoFill = setupReservationCustomerCodeAutoFill;
window.setupEarlyCustomerCodeEntry = setupEarlyCustomerCodeEntry;
window.autoFillFromEarlyEntry = autoFillFromEarlyEntry;
window.validateCustomerCode = validateCustomerCode;
window.validateCustomerUniqueness = validateCustomerUniqueness;
window.showNotification = showNotification;
window.saveCustomerInfo = saveCustomerInfo;
window.generateCustomerCode = generateCustomerCode;
