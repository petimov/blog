// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "blog-5ad16.firebaseapp.com",
  projectId: "blog-5ad16",
  storageBucket: "blog-5ad16.appspot.com",
  messagingSenderId: "774415647132",
  appId: "1:774415647132:web:07a12d420ce934ba074859"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);