/**
 * Address Autocomplete using Photon API (OpenStreetMap)
 * Specifically biased towards the restaurant's location in Berlin Pankow.
 */

const RESTAURANT_COORDS = { lat: 52.5659, lng: 13.3970 };
const SUGGESTIONS_LIMIT = 20; // Fetch more to filter down to local results
const DELIVERY_RADIUS_KM = 5.0;

// Haversine formula for distance between two GPS points
function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Debug log to confirm script loading
console.log('📍 Address Autocomplete script loaded');

function initAddressAutocomplete() {
    const streetInput = document.getElementById('deliveryStreet');
    const suggestionsContainer = document.getElementById('addressSuggestions');
    const postalInput = document.getElementById('deliveryPostal');
    const cityInput = document.getElementById('deliveryCity');

    if (!streetInput || !suggestionsContainer) {
        console.warn('⚠️ Address Autocomplete: Required elements not found', {
            input: !!streetInput,
            container: !!suggestionsContainer
        });
        return;
    }

    console.log('✅ Address Autocomplete initialized on:', streetInput);

    let debounceTimer;

    streetInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = streetInput.value.trim();
        console.log('⌨️ User typing:', query);

        if (query.length < 1) {
            hideSuggestions();
            return;
        }

        debounceTimer = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);
    });

    // Show suggestions when focusing or clicking on input (if not empty)
    streetInput.addEventListener('focus', () => {
        const query = streetInput.value.trim();
        if (query.length >= 1) {
            fetchSuggestions(query);
        }
    });

    streetInput.addEventListener('click', () => {
        const query = streetInput.value.trim();
        if (query.length >= 1 && suggestionsContainer.style.display === 'none') {
            fetchSuggestions(query);
        }
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!streetInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            hideSuggestions();
        }
    });

    async function fetchSuggestions(query) {
        try {
            console.log('🔍 Fetching suggestions for:', query);
            // Using Photon API with location bias for Berlin Pankow
            const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${RESTAURANT_COORDS.lat}&lon=${RESTAURANT_COORDS.lng}&limit=${SUGGESTIONS_LIMIT}&lang=de`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            console.log('📦 API Data received:', data);

            if (data && data.features && data.features.length > 0) {
                // Calculate distance and filter suggestions within delivery radius
                const localFeatures = data.features.map(feature => {
                    const coords = feature.geometry.coordinates;
                    const dist = haversineKm(
                        RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lng,
                        coords[1], coords[0] // GeoJSON: [lng, lat]
                    );
                    feature.properties._distance = dist;
                    return feature;
                }).filter(feature => feature.properties._distance <= 5.0);

                // Sort by distance (closest first)
                localFeatures.sort((a, b) => a.properties._distance - b.properties._distance);

                console.log(`📍 Found ${localFeatures.length} suggestions within ${DELIVERY_RADIUS_KM}km`);

                if (localFeatures.length > 0) {
                    renderSuggestions(localFeatures.slice(0, 7)); // Show top 7 local ones
                } else {
                    hideSuggestions();
                }
            } else {
                console.log('📭 No suggestions found');
                hideSuggestions();
            }
        } catch (error) {
            console.error('❌ Error fetching address suggestions:', error);
            hideSuggestions();
        }
    }

    function renderSuggestions(features) {
        suggestionsContainer.innerHTML = '';
        console.log('🎨 Rendering suggestions...');

        if (features.length > 0) {
            const header = document.createElement('div');
            header.style.padding = '8px 16px';
            header.style.fontSize = '12px';
            header.style.color = 'var(--gold)';
            header.style.borderBottom = '1px solid rgba(229, 207, 142, 0.2)';
            header.style.background = 'rgba(229, 207, 142, 0.05)';
            header.innerHTML = '📍 Adressen im Umkreis von 5km:';
            suggestionsContainer.appendChild(header);
        }
        
        features.forEach(feature => {
            const props = feature.properties;
            const name = props.name || '';
            const street = props.street || '';
            const houseNumber = props.housenumber || '';
            const city = props.city || '';
            const postcode = props.postcode || '';
            const district = props.district || '';

            // Improved selection for mainLine (Street + House Number)
            let mainLine = '';
            
            if (street) {
                // If we have a separate street property, use it as base
                mainLine = street;
                if (houseNumber) {
                    mainLine += ' ' + houseNumber;
                } else if (name && name !== street) {
                    // Sometimes name is more specific than street (like a POI)
                    mainLine = name + ' (' + street + ')';
                }
            } else {
                // Fallback to name if street is missing
                mainLine = name;
                if (houseNumber && !name.includes(houseNumber)) {
                    mainLine += ' ' + houseNumber;
                }
            }

            // Format sub line: Postal + City (District) + Distance
            let subLine = '';
            if (postcode) subLine += postcode + ' ';
            if (city) subLine += city;
            if (district && district !== city) subLine += ` (${district})`;
            
            // Add distance indicator
            const d = props._distance;
            if (typeof d === 'number') {
                subLine += ` — ${d.toFixed(1)} km entfernt`;
            }

            if (!mainLine) return; // Skip if no street name

            const div = document.createElement('div');
            div.className = 'suggestion-item';
            
            // Format full address for display
            const fullAddress = `${mainLine}, ${subLine}`;
            
            div.innerHTML = `
                <span class="suggestion-main">${mainLine}</span>
                <span class="suggestion-sub">${subLine}</span>
            `;

            div.addEventListener('click', () => {
                console.log('✅ Selected address:', mainLine, postcode, city, feature.geometry.coordinates);
                
                // Fill inputs
                streetInput.value = mainLine;
                if (postcode) postalInput.value = postcode;
                if (city) cityInput.value = city;

                hideSuggestions();

                // Get coordinates from Photon (GeoJSON format is [lng, lat])
                const coords = {
                    lat: feature.geometry.coordinates[1],
                    lng: feature.geometry.coordinates[0]
                };

                // Trigger validation events for checkout.js
                // We use a small timeout to ensure inputs are updated before the check runs
                setTimeout(() => {
                    if (typeof window.checkAndUpdateDeliveryStatus === 'function') {
                        console.log('🚀 Calling checkAndUpdateDeliveryStatus with coords:', coords);
                        window.checkAndUpdateDeliveryStatus(coords);
                    } else {
                        const event = new Event('blur', { bubbles: true });
                        streetInput.dispatchEvent(event);
                    }
                }, 10);
            });

            suggestionsContainer.appendChild(div);
        });

        if (features.length > 0) {
            showSuggestions();
        } else {
            hideSuggestions();
        }
    }

    function showSuggestions() {
        console.log('👀 Showing suggestions dropdown');
        suggestionsContainer.style.display = 'block';
    }

    function hideSuggestions() {
        suggestionsContainer.style.display = 'none';
        suggestionsContainer.innerHTML = '';
    }
}

// Run immediately and also on DOMContentLoaded just in case
initAddressAutocomplete();
document.addEventListener('DOMContentLoaded', initAddressAutocomplete);
