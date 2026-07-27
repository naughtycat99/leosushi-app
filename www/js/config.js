// Production Log Suppression
(function () {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isDebug = window.location.search.includes('debug=true');

  if (!isLocalhost && !isDebug) {
    // Save original console methods if needed later (optional)
    const originalLog = console.log;

    // Override log methods to do nothing
    console.log = function () { };
    console.info = function () { };
    console.debug = function () { };

    // Note: console.warn and console.error are kept for critical debugging
  } else {
    if (isDebug) {
      console.log('🐞 Debug mode enabled: Console logs are visible.');
    }
  }
})();

// Configuration Constants
// EmailJS Configuration
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_leosushi',
  TEMPLATE_ID: 'template_8h2m13f', // Order confirmation template (Order Confirmation - đặt món)
  CUSTOMER_TEMPLATE_ID: 'template_8h2m13f', // Customer order confirmation template (Order Confirmation - đặt món)
  RESERVATION_TEMPLATE_ID: 'template_gzuklud', // Reservation confirmation template (Reservierungsbestätigung - LEO SUSHI - đặt bàn)
  PUBLIC_KEY: 'E3SDev1AydFrByo3D',
  OWNER_EMAIL: 'leoshushi@gmail.com'
};

// PayPal Configuration
const PAYPAL_CONFIG = {
  CLIENT_ID: 'AVX7OWzjn1GaFrih0WfAIBFScH66UYxBTAdMiB9WcUCOWUDX4msBREdpRdxgJiRQpiN0ExswysrQNL-K',
  CURRENCY: 'EUR',
  LOCALE: 'de_DE'
};

// Firebase Configuration is now in js/firebase.js
// const FIREBASE_CONFIG = {
//   apiKey: "AIzaSyCk5qCcRWgbj7gzh0CQlY47lrQ6t9rvSmk",
//   authDomain: "leo-sushi-c2756.firebaseapp.com",
//   projectId: "leo-sushi-c2756",
//   storageBucket: "leo-sushi-c2756.firebasestorage.app",
//   messagingSenderId: "956266845251",
//   appId: "1:956266845251:web:9254dd2360bc7fbcf730f6"
// };

// Google Sheets API Configuration
const GOOGLE_SHEETS_CONFIG = {
  WEB_APP_URL: '',
  ORDERS_SHEET_NAME: 'Orders',
  RESERVATIONS_SHEET_NAME: 'Reservations',
  API_KEY: '',
  SPREADSHEET_ID: ''
};

// Google Places Configuration
const GOOGLE_PLACES_CONFIG = {
  apiKey: '',
  placeId: '',
  useAPI: false
};

// Restaurant Configuration
const RESTAURANT_ADDRESS = {
  street: 'Florastraße 10A',
  postal: '13187',
  city: 'Berlin',
  full: 'Florastraße 10A, 13187 Berlin'
};

const DELIVERY_DISTANCE_LIMIT_KM = 5;

// Reservation Configuration
const TOTAL_TABLES = 16;
const RESERVATION_DURATION_MINUTES = 30;

// Fallback Reviews
const FALLBACK_REVIEWS = [
  {
    author_name: 'ZMalle2000',
    rating: 5,
    text: 'Sehr nices vietnamesisches japanisches Restaurant – schnelle, freundliche Bedienung, leckeres Essen.',
    time: Date.now()
  },
  {
    author_name: 'Niko',
    rating: 5,
    text: 'Sehr sehr lecker und super netter Service. Erdbeer Lassi: wow. Geheimtipp!',
    time: Date.now()
  },
  {
    author_name: 'Sara K',
    rating: 5,
    text: 'Schöne Auswahl, hübsch angerichtet, faire Preise – ein Kieztreffpunkt.',
    time: Date.now()
  }
];

// Expose configs to global scope (must be after all declarations)
if (typeof window !== 'undefined') {
  window.EMAILJS_CONFIG = EMAILJS_CONFIG;
  window.PAYPAL_CONFIG = PAYPAL_CONFIG;
  window.GOOGLE_SHEETS_CONFIG = GOOGLE_SHEETS_CONFIG;
  window.GOOGLE_PLACES_CONFIG = GOOGLE_PLACES_CONFIG;
  window.RESTAURANT_ADDRESS = RESTAURANT_ADDRESS;
  window.DELIVERY_DISTANCE_LIMIT_KM = DELIVERY_DISTANCE_LIMIT_KM;
  window.TOTAL_TABLES = TOTAL_TABLES;
  window.RESERVATION_DURATION_MINUTES = RESERVATION_DURATION_MINUTES;
  window.FALLBACK_REVIEWS = FALLBACK_REVIEWS;
}
