import app from "../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { ref, get, getDatabase } from "firebase/database";
import { ToastAndroid } from "react-native";

export const db = getFirestore(app);
const database = getDatabase(app);

async function fetchDocById(docId, collectionName) {
  const docRef = doc(db, collectionName, docId);
  try {
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      notify("Doc not found.");
      return null;
    }
    return docSnapshot.data();
  } catch (error) {
    console.log("Error fetching Doc:", error);
  }
}

async function getCollection(collectionName) {
  try {
    const q = collection(db, collectionName);
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data());
    return documents;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function fetchUserDataByEmail(email) {
  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, "_");
    const userRef = ref(database, `driversLocations/${sanitizedEmail}`);

    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log("Fetched User Data:", userData);

      ToastAndroid.show("User data fetched successfully!", ToastAndroid.SHORT);

      return userData;
    } else {
      ToastAndroid.show("No user data found!", ToastAndroid.SHORT);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch user data from Firebase:", error);
    ToastAndroid.show("Failed to fetch user data!", ToastAndroid.SHORT);
    return null;
  }
}

export { fetchUserDataByEmail };

export { fetchDocById, getCollection };
