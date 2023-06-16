import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { useFirebaseApp } from "reactfire";


export const firebaseConfig = {
  apiKey: "AIzaSyDRRHPNSHyCThobkU2nev64RZzqXLqNWmY",
  authDomain: "devlift-project-jd.firebaseapp.com",
  projectId: "devlift-project-jd",
  storageBucket: "devlift-project-jd.appspot.com",
  messagingSenderId: "778967934414",
  appId: "1:778967934414:web:c4b3529fb3cd5d43f8779f",
  measurementId: "G-S3TVJXY18R"
};
// Initialize Firebase
//const app = initializeApp(firebaseConfig);
// export const app = useFirebaseApp();
// const analytics = getAnalytics(app);
// export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// export const db = getDatabase(app);

