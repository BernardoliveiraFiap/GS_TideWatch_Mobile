import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyATx6fcoqiPoh2clwBeabeQ6r4a6DG6G9s",
  authDomain: "293414242238-knkn2tv16qapiuhfqifl89d8vfbcm8l2.apps.googleusercontent.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:293414242238:android:9df0b2c7a880d76f771bef",
  measurementId: "YOUR_MEASUREMENT_ID",
};

let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
}

const auth = getAuth(firebaseApp);

export { firebaseApp, auth };
