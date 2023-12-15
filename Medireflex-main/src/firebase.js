// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDj3nVcextlyIcUDn_rL-aryQ1Kb7pjBWU",
  authDomain: "medireflex2.firebaseapp.com",
  projectId: "medireflex2",
  storageBucket: "medireflex2.appspot.com",
  messagingSenderId: "367934730768",
  appId: "1:367934730768:web:c0d25d8567c3dd3f01d095"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
