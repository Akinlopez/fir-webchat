import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHahM5cqXLzh1jc9ii8e4l_w0mPbs0PEo",
  authDomain: "fir-webchat-feb3e.firebaseapp.com",
  projectId: "fir-webchat-feb3e",
  storageBucket: "fir-webchat-feb3e.appspot.com",
  messagingSenderId: "628774257810",
  appId: "1:628774257810:web:c3e4efc0044b189c3a524b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default firebaseConfig;
