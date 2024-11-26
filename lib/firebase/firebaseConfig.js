import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Import getDatabase for Realtime Database

// Firebase Configuration for Couriers App
const firebaseConfig = {
  apiKey: "AIzaSyANVScPB8u2z0NinfQn4ZkkmvQqLkpkJ5E",
  authDomain: "couriers-946ec.firebaseapp.com",
  projectId: "couriers-946ec",
  storageBucket: "couriers-946ec.appspot.com",
  messagingSenderId: "828818568390",
  appId: "1:828818568390:web:432896e276b7b88a8093c7",
  measurementId: "G-K2MVCFJHQ1",
};

// Firebase Configuration for Location-Tracking App
const firebaseConfigOFL = {
  apiKey: "AIzaSyD77nzoV_f6OnA2ebI6Ln-vj6V-0kNZWa8",
  authDomain: "location-tracking-9122b.firebaseapp.com",
  projectId: "location-tracking-9122b",
  storageBucket: "location-tracking-9122b.firebasestorage.app",
  messagingSenderId: "476599892713",
  appId: "1:476599892713:web:5a647dc2a720e89c9e8e78",
};

const app = initializeApp(firebaseConfig);

const appOFL = initializeApp(firebaseConfigOFL, "locationTrackingApp");

const realtimeDbOFL = getDatabase(appOFL);

export { realtimeDbOFL };
export default app;
