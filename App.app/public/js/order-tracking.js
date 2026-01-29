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

// Restaurant coordinates (Florastraße 10A, 13187 Berlin)
const RESTAURANT_COORDS = {
  lat: 52.5505,
  lng: 13.4304
};

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
  }).setView([RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng], 13);

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

  trackingMarkers.restaurant = L.marker([RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng], {
    icon: restaurantIcon
  }).addTo(trackingMap).bindPopup('<strong>LEO SUSHI</strong><br>Florastraße 10A, 13187 Berlin');

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
              drawRoute(RESTAURANT_COORDS, coords);
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
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'LEO SUSHI Order Tracking'
        }
      }
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
function updateDeliveryPosition(lat, lng) {
  if (!trackingMap) return;
  
  // Remove existing delivery marker
  if (trackingMarkers.delivery) {
    trackingMap.removeLayer(trackingMarkers.delivery);
  }
  
  // Add new delivery marker
  const deliveryIcon = L.divIcon({
    className: 'delivery-marker',
    html: '<div style="background: #10b981; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px; animation: pulse 2s infinite;">🚚</div>',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
  
  trackingMarkers.delivery = L.marker([lat, lng], {
    icon: deliveryIcon
  }).addTo(trackingMap).bindPopup('<strong>Lieferung unterwegs</strong>');
  
  // Center map on delivery position
  trackingMap.setView([lat, lng], 15);
  
  // Update route from restaurant to delivery position
  if (trackingMarkers.restaurant) {
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
    
    // Calculate distance using OSRM
    const distanceInfo = await calculateDistanceOSRM(RESTAURANT_COORDS, customerCoords);
    
    if (!distanceInfo) {
      // Fallback to Haversine
      const distance = calculateDistanceHaversine(
        RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng,
        customerCoords.lat, customerCoords.lng
      );
      distanceInfo = { distance, duration: null };
    }
    
    const distance = distanceInfo.distance;
    const limit = window.DELIVERY_DISTANCE_LIMIT_KM || 5;
    
    if (distance <= limit) {
      return {
        withinRange: true,
        distance: distance.toFixed(2),
        duration: distanceInfo.duration,
        message: `✓ Lieferung möglich (${distance.toFixed(2)} km - kostenlos)`
      };
    } else {
      return {
        withinRange: false,
        distance: distance.toFixed(2),
        duration: distanceInfo.duration,
        message: `✗ Lieferung nicht möglich: ${distance.toFixed(2)} km (Limit: ${limit} km). Bitte wählen Sie stattdessen "Tisch reservieren".`
      };
    }
  } catch (error) {
    console.error('Error checking delivery range:', error);
    // Fallback to simple postal code check
    const customerPostal = parseInt(postal);
    const restaurantPostal = parseInt(window.RESTAURANT_ADDRESS?.postal || '13187');
    const postalDiff = Math.abs(customerPostal - restaurantPostal);
    
    if (postalDiff <= 1600) {
      return {
        withinRange: true,
        distance: null,
        message: '✓ Lieferung möglich (innerhalb 4km - kostenlos)'
      };
    } else {
      return {
        withinRange: false,
        distance: null,
        message: '✗ Lieferung nicht möglich: Adresse liegt außerhalb des 4km-Radius.'
      };
    }
  }
}

// Real-time order tracking (polling)
let trackingInterval = null;

function startOrderTracking(orderId, updateCallback) {
  if (trackingInterval) {
    clearInterval(trackingInterval);
  }
  
  // Poll for order updates every 10 seconds
  trackingInterval = setInterval(async () => {
    try {
      const apiBase = window.API_PHP_BASE_URL || (() => {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const path = window.location.pathname.includes('/leosushi') ? '/leosushi/api' : '/api';
        return `${protocol}//${host}${path}`;
      })();
      
      const response = await fetch(`${apiBase}/orders.php?action=get&orderId=${orderId}`);
      const result = await response.json();
      
      if (result.success && result.order) {
        const order = result.order;
        
        // Update delivery position if available
        if (order.delivery_location && order.delivery_location.lat && order.delivery_location.lng) {
          updateDeliveryPosition(order.delivery_location.lat, order.delivery_location.lng);
        }
        
        // Call update callback
        if (updateCallback) {
          updateCallback(order);
        }
      }
    } catch (error) {
      console.error('Error fetching order tracking data:', error);
    }
  }, 10000); // Poll every 10 seconds
}

function stopOrderTracking() {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
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
}


