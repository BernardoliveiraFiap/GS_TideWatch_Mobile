import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyATx6fcoqiPoh2clwBeabeQ6r4a6DG6G9s",
  authDomain: "br.com.tidewatch",
  projectId: "tidewatch-4bb07",
  storageBucket: "tidewatch-4bb07.appspot.com",
  messagingSenderId: "293414242238",
  appId: "1:293414242238:android:aad978b76c4a3fcf771bef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);
