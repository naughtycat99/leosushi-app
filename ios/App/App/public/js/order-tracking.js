// Order Tracking with OpenStreetMap
// Uses Leaflet.js for map display and OSRM/GraphHopper for routing

// Initialize order tracking map
let trackingMap = null;
let trackingMarkers = {
  restaurant: null,
  customer: null,
  delivery: null
};
let trackingRoute = null;

const LEO_ORDER_HISTORY_KEY = 'leoOrderHistory';
const LEO_ORDER_HISTORY_LIMIT = 20;

function parseOrderJson(value, fallback) {
  if (typeof value !== 'string') return value || fallback;
  try { return JSON.parse(value); } catch (e) { return fallback; }
}

// Keep a privacy-scoped history on this device. It makes recent orders and
// one-click reorder available during a temporary API outage without storing
// payment tokens or other provider responses.
function rememberLeoOrder(orderData, officialOrderId) {
  if (!orderData) return null;
  const orderId = officialOrderId || orderData.order_id || orderData.orderId || orderData._id;
  if (!orderId) return null;

  const customer = parseOrderJson(orderData.customer, {});
  const deliveryAddress = parseOrderJson(orderData.delivery_address, null) ||
    parseOrderJson(orderData.delivery?.address, null) || {
      first_name: customer.firstName || customer.first_name || '',
      last_name: customer.lastName || customer.last_name || '',
      phone: customer.phone || '',
      street: customer.street || '',
      house_number: customer.houseNumber || customer.house_number || '',
      postal: customer.postal || '',
      city: customer.city || '',
      note: customer.note || ''
    };
  const existingSummary = parseOrderJson(orderData.summary, {});
  const summary = {
    subtotal: existingSummary.subtotal ?? orderData.subtotal ?? null,
    delivery_fee: existingSummary.delivery_fee ?? orderData.deliveryFee ?? null,
    discount: existingSummary.discount ?? orderData.discount ?? null,
    tip: existingSummary.tip ?? orderData.tip ?? null,
    total: existingSummary.total ?? orderData.order_total ?? orderData.total ?? null,
    shipper_name: existingSummary.shipper_name || null,
    shipper_accepted_at: existingSummary.shipper_accepted_at || null,
    delivered_at: existingSummary.delivered_at || null,
    delivered_by: existingSummary.delivered_by || null,
    scheduled_delivery_time: existingSummary.scheduled_delivery_time || orderData.scheduled_delivery_time || null,
    delivery_distance_km: existingSummary.delivery_distance_km ?? orderData.delivery_distance_km ?? null
  };
  const items = parseOrderJson(orderData.items, []).map(item => ({
    name: item.name || '',
    qty: Number(item.qty || item.quantity || 1),
    price: item.price ?? null,
    total: item.total ?? null,
    image: item.image || '',
    note: item.note || ''
  }));
  const snapshot = {
    order_id: String(orderId),
    status: orderData.status || 'pending',
    service_type: orderData.service_type || orderData.serviceType || 'delivery',
    created_at: orderData.created_at || orderData.createdAt || orderData.date || new Date().toISOString(),
    updated_at: orderData.updated_at || new Date().toISOString(),
    estimated_time: orderData.estimated_time || orderData.estimatedTime || null,
    branch_id: orderData.branch_id || orderData.branch?.id || orderData.branch || null,
    delivery_address: deliveryAddress,
    items,
    summary
  };

  try {
    const history = parseOrderJson(localStorage.getItem(LEO_ORDER_HISTORY_KEY), []);
    const safeHistory = Array.isArray(history) ? history : [];
    const existingIndex = safeHistory.findIndex(order => String(order.order_id || order._id) === String(orderId));
    if (existingIndex >= 0) {
      snapshot.created_at = safeHistory[existingIndex].created_at || snapshot.created_at;
      safeHistory.splice(existingIndex, 1);
    }
    safeHistory.unshift(snapshot);
    localStorage.setItem(LEO_ORDER_HISTORY_KEY, JSON.stringify(safeHistory.slice(0, LEO_ORDER_HISTORY_LIMIT)));

    const recentIds = parseOrderJson(localStorage.getItem('leoRecentOrders'), []);
    const ids = Array.isArray(recentIds) ? recentIds.filter(id => String(id) !== String(orderId)) : [];
    ids.unshift(String(orderId));
    localStorage.setItem('leoRecentOrders', JSON.stringify(ids.slice(0, LEO_ORDER_HISTORY_LIMIT)));
  } catch (error) {
    console.warn('Could not remember order on this device:', error);
  }
  return snapshot;
}

function getRememberedLeoOrders() {
  try {
    const history = parseOrderJson(localStorage.getItem(LEO_ORDER_HISTORY_KEY), []);
    return Array.isArray(history) ? history : [];
  } catch (e) {
    return [];
  }
}

// Restaurant coordinates (Fallback to Florastraße 10A if dynamic fails)
function getBaseRestaurantCoords() {
  if (typeof window.getBranchCoords === 'function') {
    const coords = window.getBranchCoords();
    if (coords) return coords;
  }
  return { lat: 52.5659, lng: 13.3970 };
}

// Dynamically set based on branch
const TRACKING_REST_COORDS = getBaseRestaurantCoords();

// Initialize Leaflet map for order tracking
function initOrderTrackingMap(containerId, orderData) {
  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    console.error('Leaflet library not loaded. Please include Leaflet CSS and JS.');
    return null;
  }

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found`);
    return null;
  }

  // Initialize map centered on restaurant
  trackingMap = L.map(containerId, {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([TRACKING_REST_COORDS.lat, TRACKING_REST_COORDS.lng], 13);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(trackingMap);

  // Add restaurant marker
  const restaurantIcon = L.divIcon({
    className: 'restaurant-marker',
    html: '<div style="background: #e5cf8e; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">🍣</div>',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const branchObj = typeof window.getSelectedBranch === 'function' ? window.getSelectedBranch() : { name: 'LEO SUSHI', address: 'Florastraße 10A, 13187 Berlin' };
  trackingMarkers.restaurant = L.marker([TRACKING_REST_COORDS.lat, TRACKING_REST_COORDS.lng], {
    icon: restaurantIcon
  }).addTo(trackingMap).bindPopup(`<strong>${branchObj.name}</strong><br>${branchObj.address}`);

  // Add customer marker if address is available
  if (orderData && orderData.delivery_address) {
    const address = typeof orderData.delivery_address === 'string'
      ? JSON.parse(orderData.delivery_address)
      : orderData.delivery_address;

    if (address.street && address.postal && address.city) {
      geocodeAddress(`${address.street}, ${address.postal} ${address.city}`)
        .then(coords => {
          if (coords) {
            const customerIcon = L.divIcon({
              className: 'customer-marker',
              html: '<div style="background: #3b82f6; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 14px;">📍</div>',
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            });

            trackingMarkers.customer = L.marker([coords.lat, coords.lng], {
              icon: customerIcon
            }).addTo(trackingMap).bindPopup(`<strong>Lieferadresse</strong><br>${address.street}, ${address.postal} ${address.city}`);

            // Fit map to show both markers
            const group = new L.featureGroup([trackingMarkers.restaurant, trackingMarkers.customer]);
            trackingMap.fitBounds(group.getBounds().pad(0.2));

            // Draw route if order is in delivery
            if (orderData.status === 'confirmed' || orderData.status === 'in_delivery') {
              drawRoute(TRACKING_REST_COORDS, coords);
            }
          }
        })
        .catch(err => console.error('Error geocoding customer address:', err));
    }
  }

  return trackingMap;
}

// Geocode address using Nominatim (OpenStreetMap)
async function geocodeAddress(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&email=contact@leosushi.de`
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Draw route between two points using OSRM
async function drawRoute(start, end) {
  try {
    // Use OSRM routing service
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Convert [lng, lat] to [lat, lng]

      // Remove existing route if any
      if (trackingRoute) {
        trackingMap.removeLayer(trackingRoute);
      }

      // Draw new route
      trackingRoute = L.polyline(coordinates, {
        color: '#e5cf8e',
        weight: 4,
        opacity: 0.8
      }).addTo(trackingMap);

      // Calculate distance and duration
      const distance = (route.distance / 1000).toFixed(2); // Convert to km
      const duration = Math.round(route.duration / 60); // Convert to minutes

      return { distance, duration };
    }
  } catch (error) {
    console.error('Routing error:', error);
    // Fallback: draw straight line
    if (trackingRoute) {
      trackingMap.removeLayer(trackingRoute);
    }
    trackingRoute = L.polyline([[start.lat, start.lng], [end.lat, end.lng]], {
      color: '#e5cf8e',
      weight: 3,
      opacity: 0.6,
      dashArray: '10, 10'
    }).addTo(trackingMap);
  }

  return null;
}

// Update delivery position (for real-time tracking)
let _userInteracting = false;
let _customerCoords = null;

function updateDeliveryPosition(lat, lng, shipperName) {
  if (!trackingMap) return;

  // Remove existing delivery marker
  if (trackingMarkers.delivery) {
    trackingMap.removeLayer(trackingMarkers.delivery);
  }

  // Add new delivery marker with shipper name
  const displayName = shipperName || 'Fahrer';
  const deliveryIcon = L.divIcon({
    className: 'delivery-marker',
    html: '<div style="background: #10b981; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px; animation: pulse 2s infinite;">🚚</div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  trackingMarkers.delivery = L.marker([lat, lng], {
    icon: deliveryIcon
  }).addTo(trackingMap).bindPopup(`<strong>${displayName}</strong><br>Lieferung unterwegs`);

  // Only re-center map if user is NOT manually panning/zooming
  if (!_userInteracting) {
    // Fit bounds to show all markers
    const markers = [trackingMarkers.delivery];
    if (trackingMarkers.customer) markers.push(trackingMarkers.customer);
    if (trackingMarkers.restaurant) markers.push(trackingMarkers.restaurant);
    const group = L.featureGroup(markers);
    trackingMap.fitBounds(group.getBounds().pad(0.2));
  }

  // Draw route from DRIVER to CUSTOMER (not restaurant to driver)
  if (trackingMarkers.customer) {
    const customerLatLng = trackingMarkers.customer.getLatLng();
    drawRoute(
      { lat, lng },
      { lat: customerLatLng.lat, lng: customerLatLng.lng }
    ).then(result => {
      if (result) {
        // Update distance display if element exists
        const distEl = document.getElementById('tracking-distance');
        const etaEl = document.getElementById('tracking-eta');
        if (distEl) distEl.textContent = result.distance + ' km';
        if (etaEl) etaEl.textContent = '~' + result.duration + ' Min.';
      }
    });
  } else if (trackingMarkers.restaurant) {
    // Fallback: draw from restaurant to driver
    const restaurantLatLng = trackingMarkers.restaurant.getLatLng();
    drawRoute(
      { lat: restaurantLatLng.lat, lng: restaurantLatLng.lng },
      { lat, lng }
    );
  }
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistanceHaversine(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Calculate distance using OpenStreetMap routing (more accurate)
async function calculateDistanceOSRM(start, end) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const distance = data.routes[0].distance / 1000; // Convert to km
      const duration = Math.round(data.routes[0].duration / 60); // Convert to minutes
      return { distance, duration };
    }
  } catch (error) {
    console.error('OSRM routing error:', error);
    // Fallback to Haversine
    return {
      distance: calculateDistanceHaversine(start.lat, start.lng, end.lat, end.lng),
      duration: null
    };
  }

  return null;
}

// Check delivery range using OpenStreetMap
async function checkDeliveryRangeOSM(street, postal, city) {
  if (!street || !postal || !city) {
    return { withinRange: false, distance: null, message: 'Bitte geben Sie eine vollständige Adresse ein.' };
  }

  // Validate postal code format
  if (!/^\d{5}$/.test(postal)) {
    return { withinRange: false, distance: null, message: 'Bitte geben Sie eine gültige 5-stellige PLZ ein.' };
  }

  try {
    // Geocode customer address
    const customerAddress = `${street}, ${postal} ${city}`;
    const customerCoords = await geocodeAddress(customerAddress);

    if (!customerCoords) {
      return {
        withinRange: false,
        distance: null,
        message: 'Adresse konnte nicht gefunden werden. Bitte überprüfen Sie die Eingabe.'
      };
    }

    // ALWAYS calculate straight-line distance first (Haversine)
    const haversineDistance = calculateDistanceHaversine(
      TRACKING_REST_COORDS.lat, TRACKING_REST_COORDS.lng,
      customerCoords.lat, customerCoords.lng
    );

    const limit = 5.0; // Consistent 5.0km straight-line radius

    if (haversineDistance <= limit) {
      return {
        withinRange: true,
        distance: haversineDistance.toFixed(2),
        message: `✓ Lieferung möglich (${haversineDistance.toFixed(2)} km - kostenlos)`
      };
    } else {
      return {
        withinRange: false,
        distance: haversineDistance.toFixed(2),
        message: `✗ Lieferung nicht möglich: ${haversineDistance.toFixed(2)} km (Limit: ${limit} km).`
      };
    }
  } catch (error) {
    console.error('Error checking delivery range:', error);
    // Fallback to strict postal code check
    const customerPostal = parseInt(postal);
    const valid5kmZips = [
      13187, 13189, 13156, 13158, 13127, 13086, 13088, 13089,
      13347, 13359, 13357, 10439, 10437, 10435, 10405, 10407, 13409
    ];
    if (valid5kmZips.includes(customerPostal)) {
      return {
        withinRange: true,
        distance: null,
        message: '✓ Lieferung voraussichtlich möglich (PLZ-Prüfung)'
      };
    }

    return {
      withinRange: false,
      distance: null,
      message: '✗ Adresse konnte nicht auf der Karte gefunden werden. Bitte Schreibweise (z.B. Str. vs Straße) überprüfen.'
    };
  }
}

// Real-time order tracking (polling)
let trackingInterval = null;

function startOrderTracking(orderId, updateCallback) {
  if (trackingInterval) {
    clearInterval(trackingInterval);
  }

  // Track user map interactions to avoid forced re-centering
  if (trackingMap) {
    trackingMap.on('mousedown touchstart dragstart', () => { _userInteracting = true; });
    trackingMap.on('mouseup touchend dragend', () => { setTimeout(() => { _userInteracting = false; }, 3000); });
  }

  // Determine polling interval: 5s for in_delivery, 10s otherwise
  let pollInterval = 10000;

  const pollFn = async () => {
    try {
      const apiBase = window.API_PHP_BASE_URL || (() => {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const path = window.location.pathname.includes('/leosushi') ? '/leosushi/api' : '/api';
        return `${protocol}//${host}${path}`;
      })();

      const response = await fetch(`${apiBase}/orders.php?action=get&order_id=${orderId}`);
      const result = await response.json();

      if (result.success && result.order) {
        const order = result.order;

        // Adjust polling speed based on status
        const newInterval = (order.status === 'in_delivery') ? 5000 : 10000;
        if (newInterval !== pollInterval) {
          pollInterval = newInterval;
          clearInterval(trackingInterval);
          trackingInterval = setInterval(pollFn, pollInterval);
          console.log(`🔄 Tracking interval changed to ${pollInterval/1000}s for status: ${order.status}`);
        }

        // Update delivery position if available
        if (order.delivery_location && order.delivery_location.lat && order.delivery_location.lng) {
          const shipperName = order.summary?.shipper_name || null;
          updateDeliveryPosition(order.delivery_location.lat, order.delivery_location.lng, shipperName);
        }

        // Call update callback
        if (updateCallback) {
          updateCallback(order);
        }
      }
    } catch (error) {
      console.error('Error fetching order tracking data:', error);
    }
  };

  // Initial poll immediately
  pollFn();

  // Then poll at interval
  trackingInterval = setInterval(pollFn, pollInterval);
}

function stopOrderTracking() {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
  _userInteracting = false;
}

// Export functions
if (typeof window !== 'undefined') {
  window.initOrderTrackingMap = initOrderTrackingMap;
  window.geocodeAddress = geocodeAddress;
  window.updateDeliveryPosition = updateDeliveryPosition;
  window.calculateDistanceHaversine = calculateDistanceHaversine;
  window.calculateDistanceOSRM = calculateDistanceOSRM;
  window.checkDeliveryRangeOSM = checkDeliveryRangeOSM;
  window.startOrderTracking = startOrderTracking;
  window.stopOrderTracking = stopOrderTracking;
  window.rememberLeoOrder = rememberLeoOrder;
  window.getRememberedLeoOrders = getRememberedLeoOrders;
}


