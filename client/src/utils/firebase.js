import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "examnotesai-38456.firebaseapp.com",
  projectId: "examnotesai-38456",
  storageBucket: "examnotesai-38456.firebasestorage.app",
  messagingSenderId: "832332505490",
  appId: "1:832332505490:web:4ea151dde14040855b214b",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
