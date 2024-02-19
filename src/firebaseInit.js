// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOi7a7Tti2PMAnqjeqj-Fmh88CxmHIQQk",
  authDomain: "expense-e46d6.firebaseapp.com",
  projectId: "expense-e46d6",
  storageBucket: "expense-e46d6.appspot.com",
  messagingSenderId: "191615629880",
  appId: "1:191615629880:web:5338c73eafd109d864c4cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);