/**
 * Firebase configuration and initialization module.
 * This module handles the setup of Firebase services for the application.
 * @module
 */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ============================================================================
// Configuration
// ============================================================================

/**
 * Firebase configuration object containing necessary credentials and endpoints
 * @type {Object}
 */
const firebaseConfig = {
  apiKey: "AIzaSyBSf37rHVcrf5qKgIZZU2lIu4obtST8r1A",
  authDomain: "yello-dcea4.firebaseapp.com",
  projectId: "yello-dcea4",
  storageBucket: "yello-dcea4.firebasestorage.app",
  messagingSenderId: "935217219988",
  appId: "1:935217219988:web:6d0d757aedb55888a8a781",
  measurementId: "G-28F58DNLD4"
};

// ============================================================================
// Firebase Initialization
// ============================================================================

/**
 * Initialize Firebase application instance
 * @type {FirebaseApp}
 */
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);
export default db;