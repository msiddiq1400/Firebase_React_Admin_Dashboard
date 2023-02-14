// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "admin-dashboard-cee61.firebaseapp.com",
  projectId: "admin-dashboard-cee61",
  storageBucket: "admin-dashboard-cee61.appspot.com",
  messagingSenderId: process.env.REACT_APP_MS_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
