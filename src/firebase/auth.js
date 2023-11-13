// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6vyy9OAQQ3yVzow-XLKv-6G28D4N5rG0",
  authDomain: "wholesome-7e669.firebaseapp.com",
  projectId: "wholesome-7e669",
  storageBucket: "wholesome-7e669.appspot.com",
  messagingSenderId: "634791042728",
  appId: "1:634791042728:web:2b80af64c82b37a7ddac9d",
  measurementId: "G-504X3JVGWS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// const analytics = getAnalytics(app);