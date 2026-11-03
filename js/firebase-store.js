// Firebase Realtime Database Configuration & Helper
// Project: mercadovendasrapidasmz

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAuNIi5orWaGobDmy35psdmxrVrXgtwicU",
  authDomain: "mercadovendasrapidasmz.firebaseapp.com",
  databaseURL: "https://mercadovendasrapidasmz-default-rtdb.firebaseio.com",
  projectId: "mercadovendasrapidasmz",
  storageBucket: "mercadovendasrapidasmz.firebasestorage.app",
  messagingSenderId: "463793885450",
  appId: "1:463793885450:web:3db5e4170ee343b4a1aaf3",
  measurementId: "G-8Q164RD64W"
};

const FIREBASE_DB_URL = "https://mercadovendasrapidasmz-default-rtdb.firebaseio.com/products.json";

// Database service using Firebase REST API (ultra-fast, zero SDK overhead)
const FirebaseStore = {
  // Get all products in real time
  async getProducts() {
    try {
      const res = await fetch(`${FIREBASE_DB_URL}?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          // If stored as array or object, convert cleanly to array
          if (Array.isArray(data)) {
            return data.filter(Boolean);
          } else if (typeof data === 'object') {
            return Object.values(data);
          }
        }
      }
    } catch (err) {
      console.warn('Firebase read error:', err);
    }
    return null;
  },

  // Save all products to Firebase
  async saveProducts(products) {
    try {
      const res = await fetch(FIREBASE_DB_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products)
      });
      return res.ok;
    } catch (err) {
      console.error('Firebase save error:', err);
      return false;
    }
  }
};
