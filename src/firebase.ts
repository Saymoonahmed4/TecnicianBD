import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuEYXMZMurlWZH-DYxvcjPo-dj5wPw1v0",
  authDomain: "tecnician-bd.firebaseapp.com",
  projectId: "tecnician-bd",
  storageBucket: "tecnician-bd.firebasestorage.app",
  messagingSenderId: "1009109305147",
  appId: "1:1009109305147:web:4bf131193af402964d991e",
  measurementId: "G-DGNYP9HQ0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
