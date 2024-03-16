// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrkzvLKkQfymq0ypSGnf46VCmH7HVvqts",
  authDomain: "kyoros-f71b1.firebaseapp.com",
  projectId: "kyoros-f71b1",
  storageBucket: "kyoros-f71b1.appspot.com",
  messagingSenderId: "461541994029",
  appId: "1:461541994029:web:3d9da636b7ca0c3070d2a4",
  measurementId: "G-FJ4531VJF3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const messaging = getMessaging(app);