// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj3nVcextlyIcUDn_rL-aryQ1Kb7pjBWU",
  authDomain: "medireflex2.firebaseapp.com",
  projectId: "medireflex2",
  storageBucket: "medireflex2.appspot.com",
  messagingSenderId: "367934730768",
  appId: "1:367934730768:web:c0d25d8567c3dd3f01d095"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);