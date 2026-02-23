import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA9Tluk2L_6QN4jr46dKCrrrQssnqlnYXk",
  authDomain: "gkm-slots.firebaseapp.com",
  databaseURL: "https://gkm-slots-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "gkm-slots",
  storageBucket: "gkm-slots.firebasestorage.app",
  messagingSenderId: "788420612551",
  appId: "1:788420612551:web:a583e9711d4cb06bd349e2",
  measurementId: "G-6VQ90F52Q3",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
