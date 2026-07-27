// Firebase Module
// This file contains Firebase configuration and initialization

console.log('firebase.js loaded');

// ⚠️ KHÔNG SETUP FIREBASE = HỆ THỐNG KHÔNG HOẠT ĐỘNG THỰC TẾ!
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCk5qCcRWgbj7gzh0CQlY47lrQ6t9rvSmk",
  authDomain: "leo-sushi-c2756.firebaseapp.com",
  projectId: "leo-sushi-c2756",
  storageBucket: "leo-sushi-c2756.firebasestorage.app",
  messagingSenderId: "956266845251",
  appId: "1:956266845251:web:9254dd2360bc7fbcf730f6"
};

// Initialize Firebase
let db = null;

// Expose FIREBASE_CONFIG to global scope first
if (typeof window !== 'undefined') {
  window.FIREBASE_CONFIG = FIREBASE_CONFIG;
}

// Function to initialize Firebase
function initializeFirebase() {
  if (typeof firebase === 'undefined') {
    console.warn('⚠️ Firebase SDK not loaded yet, will retry...');
    return false;
  }
  
  try {
    // Check if Firebase app already exists
    let app;
    try {
      app = firebase.app();
      console.log('✅ Firebase app already exists, using existing instance');
    } catch (e) {
      // App doesn't exist, initialize it
      app = firebase.initializeApp(FIREBASE_CONFIG);
      console.log('✅ Firebase initialized successfully');
    }
    
    db = firebase.firestore();
    
    // Update window.db after initialization
    if (typeof window !== 'undefined') {
      window.db = db;
      console.log('✅ window.db set:', !!window.db);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    // If Firebase already initialized, get existing instance
    if (error.code === 'app/duplicate-app' || error.message.includes('already exists')) {
      console.log('⚠️ Firebase app already initialized, using existing instance');
      try {
        db = firebase.firestore();
        if (typeof window !== 'undefined') {
          window.db = db;
          console.log('✅ window.db set from existing app:', !!window.db);
        }
        return true;
      } catch (e) {
        console.error('❌ Error getting Firestore instance:', e);
        return false;
      }
    }
    return false;
  }
}

// Try to initialize immediately
if (typeof firebase !== 'undefined') {
  initializeFirebase();
} else {
  // Wait for Firebase SDK to load
  const checkFirebase = setInterval(() => {
    if (typeof firebase !== 'undefined') {
      clearInterval(checkFirebase);
      initializeFirebase();
    }
  }, 100);
  
  // Timeout after 5 seconds
  setTimeout(() => {
    clearInterval(checkFirebase);
    if (!db) {
      console.error('❌ Firebase SDK failed to load within 5 seconds');
    }
  }, 5000);
}

// Expose db to global scope for backward compatibility
if (typeof window !== 'undefined') {
  // Use Object.defineProperty to allow updates
  Object.defineProperty(window, 'db', {
    get: () => {
      // Always try to get the latest db instance
      if (db) return db;
      if (typeof firebase !== 'undefined') {
        try {
          db = firebase.firestore();
          return db;
        } catch (e) {
          return null;
        }
      }
      return null;
    },
    set: (value) => { 
      db = value;
      console.log('✅ window.db updated:', !!db);
    },
    configurable: true,
    enumerable: true
  });
  
  // Also set directly for immediate access
  if (db) {
    window.db = db;
  }
}
