import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCMtp2vjCDqA9iOk4dzLI-Aa65uQ3_A35E",
  authDomain: "l-commerce-6dca4.firebaseapp.com",
  projectId: "l-commerce-6dca4",
  storageBucket: "l-commerce-6dca4.firebasestorage.app",
  messagingSenderId: "743330889993",
  appId: "1:743330889993:web:63b2db16156db12a1613d8"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
};

export default app;
