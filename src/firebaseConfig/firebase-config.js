// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADVXYFW2fpf2Pv6Iv75Dr47fPnmB5sXaA",
  authDomain: "monkey-blogging-b375f.firebaseapp.com",
  projectId: "monkey-blogging-b375f",
  storageBucket: "monkey-blogging-b375f.appspot.com",
  messagingSenderId: "160215570473",
  appId: "1:160215570473:web:d09df586b8226a911f2438",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
