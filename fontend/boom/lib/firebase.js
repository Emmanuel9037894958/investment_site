import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDw7pSD6G2lq9LmHEoRw8J2o_fqYTA_46o",
  authDomain: "energyvest.firebaseapp.com",
  projectId: "energyvest",
  storageBucket: "energyvest.firebasestorage.app",
  messagingSenderId: "945479759573",
  appId: "1:945479759573:web:8a02195ce82372a10e145c",
};

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;