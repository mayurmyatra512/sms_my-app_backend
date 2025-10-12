// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6kdlfWPhe7zNkmoETC0P0hKQxUfB3axw",
  authDomain: "smsoiwclideria.firebaseapp.com",
  projectId: "smsoiwclideria",
  storageBucket: "smsoiwclideria.firebasestorage.app",
  messagingSenderId: "151630600888",
  appId: "1:151630600888:web:8122180bb9429c976bf24d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


export default app; // Export the Firebase app instance