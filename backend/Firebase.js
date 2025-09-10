import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC_C98UCdYl88HGiKDeb3Ctua43yhTEvLs",
  authDomain: "street-e1e3e.firebaseapp.com",
  projectId: "street-e1e3e",
  storageBucket: "street-e1e3e.firebasestorage.app",
  messagingSenderId: "491114079996",
  appId: "1:491114079996:web:5d27d82606cfae207fd979",
  measurementId: "G-WQ3TRFJHP3"
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app