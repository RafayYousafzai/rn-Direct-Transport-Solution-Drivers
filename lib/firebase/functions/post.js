import app from "../firebaseConfig";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import { getDatabase, ref, update } from "firebase/database";
import { ToastAndroid } from "react-native";
import Toast from "@/components/common/Toast";

export const db = getFirestore(app);
export const storage = getStorage(app);
const database = getDatabase(app);

const timestamp = Date.now();

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
  if (!location?.coords) {
    console.error("Invalid location data:", location);
    return;
  }

  if (!email || !id) {
    console.error("Missing email or booking ID for location update.");
    return;
  }

  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, "_");
    const locationRef = ref(
      database,
      `driversLocations/${sanitizedEmail}/${id}`
    );

    const { latitude, longitude } = location.coords;

    await update(locationRef, {
      latitude,
      longitude,
    });

    if (__DEV__) {
      Toast("Location updated successfully!", ToastAndroid.SHORT);
    }
  } catch (error) {
    console.error("Failed to update location in Firebase:", error);

    if (__DEV__) {
      Toast("Update unsuccessful!", ToastAndroid.SHORT);
    }
  }
}

async function stopLocationSharing(email, id) {
  if (!email && !id) {
    console.log("User not find");
    return;
  }

  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, "_");

    const locationRef = ref(
      database,
      `driversLocations/${sanitizedEmail}/${id}`
    );

    await update(locationRef, {
      sharing: false,
      endAt: timestamp,
    });

    notify("Good");
    console.log("Location updated for:", sanitizedEmail);
  } catch (error) {
    console.error("Failed to update location in Firebase:", error);
  }
}

export { updateBooking, uploadImages, uploadLocation, stopLocationSharing };
