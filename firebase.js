// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import firebase from "firebase/compat";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoaVBgkw36CJBRMTqraY5gZtETgz6_rvk",
  authDomain: "tonic-7c982.firebaseapp.com",
  projectId: "tonic-7c982",
  storageBucket: "tonic-7c982.appspot.com",
  messagingSenderId: "977250548411",
  appId: "1:977250548411:web:44cbd21d80c782d90ac79e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, db, storage, ref, uploadBytes }