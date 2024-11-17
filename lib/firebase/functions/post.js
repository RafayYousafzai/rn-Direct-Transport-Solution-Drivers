import app from "../firebaseConfig";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { getDatabase, ref, update } from "firebase/database";
import { ToastAndroid } from "react-native";

export const db = getFirestore(app);
export const storage = getStorage(app);
const database = getDatabase(app);

async function updateBooking(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.log(error);
    console.log(`Something Went Wrong`);
    return false;
  }
}

async function uploadImages(imageUri) {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageName = `images/${Date.now()}`;
    const storageRef = ref(storage, imageName);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

async function uploadLocation(location, email, id) {
  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, "_");

    const { latitude, longitude } = location.coords;

    const locationRef = ref(
      database,
      `driversLocations/${sanitizedEmail}/${id}`
    );

    await update(locationRef, {
      latitude,
      longitude,
    });

    ToastAndroid.show("Request sent successfully!", ToastAndroid.SHORT);
  } catch (error) {
    console.error("Failed to update location in Firebase:", error);
    ToastAndroid.show("Request unsuccessfully!", ToastAndroid.SHORT);
  }
}
export { updateBooking, uploadImages, uploadLocation };
