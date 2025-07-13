import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAiA8rdL0AzMy_I10meYuMkshWyPr-aYLM",
  authDomain: "daily-literature-3381e.firebaseapp.com",
  projectId: "daily-literature-3381e",
  storageBucket: "daily-literature-3381e.firebasestorage.app",
  messagingSenderId: "657943012885",
  appId: "1:657943012885:web:9dda87ab8664d73def901c",
  measurementId: "G-4L7GLX60MT  "
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);   
export default app;