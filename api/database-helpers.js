// Database Helper Functions
// These functions replace Firebase calls with MySQL API calls

// Save order to MySQL via API
async function saveOrderToFirebase(orderData) {
  // This function name is kept for backward compatibility
  // but it now saves to MySQL via API
  if (typeof window === 'undefined' || !window.api) {
    console.warn('⚠️ API client not available, skipping order save');
    return;
  }

  try {
    const result = await window.api.orders.saveOrder(orderData);
    if (result.success) {
      console.log('✅ Order saved to MySQL successfully:', orderData.order_id);
    } else {
      console.error('❌ Failed to save order:', result.message);
    }
  } catch (error) {
    console.error('❌ Failed to save order to MySQL:', error);
  }
}

// Get order from MySQL via API
async function getOrderFromFirebase(orderId) {
  // This function name is kept for backward compatibility
  if (typeof window === 'undefined' || !window.api) {
    console.warn('⚠️ API client not available');
    return null;
  }

  try {
    const result = await window.api.orders.getOrder(orderId);
    if (result.success) {
      return result.order;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to get order from MySQL:', error);
    return null;
  }
}

// Save reservation to MySQL via API
async function saveReservationToFirebase(reservationData) {
  // This function name is kept for backward compatibility
  // but it now saves to MySQL via API
  if (typeof window === 'undefined' || !window.api) {
    console.warn('⚠️ API client not available, skipping reservation save');
    return;
  }

  try {
    const result = await window.api.reservations.saveReservation(reservationData);
    if (result.success) {
      console.log('✅ Reservation saved to MySQL successfully:', reservationData.reservation_id);
    } else {
      console.error('❌ Failed to save reservation:', result.message);
    }
  } catch (error) {
    console.error('❌ Failed to save reservation to MySQL:', error);
  }
}

// Get reservation from MySQL via API
async function getReservationFromFirebase(reservationId) {
  // This function name is kept for backward compatibility
  if (typeof window === 'undefined' || !window.api) {
    console.warn('⚠️ API client not available');
    return null;
  }

  try {
    const result = await window.api.reservations.getReservation(reservationId);
    if (result.success) {
      return result.reservation;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to get reservation from MySQL:', error);
    return null;
  }
}

// Expose to window for backward compatibility
if (typeof window !== 'undefined') {
  window.saveOrderToFirebase = saveOrderToFirebase;
  window.getOrderFromFirebase = getOrderFromFirebase;
  window.saveReservationToFirebase = saveReservationToFirebase;
  window.getReservationFromFirebase = getReservationFromFirebase;
}


