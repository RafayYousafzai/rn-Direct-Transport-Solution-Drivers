import { initializeApp } from "firebase/app";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC5YFlQwsRe0egpJsgKdLflBjo_1UHQV74",
  authDomain: "couriers-946ec.firebaseapp.com",
  projectId: "couriers-946ec",
  storageBucket: "couriers-946ec.appspot.com",
  messagingSenderId: "828818568390",
  appId: "1:828818568390:web:aa706c769c69c92f8093c7",
  measurementId: "G-HD9NTD86S6",
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export default app;
