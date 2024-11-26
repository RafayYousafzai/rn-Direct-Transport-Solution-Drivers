import app, { appOFL, realtimeDbOFL } from "../firebaseConfig";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { ref as dbRef, update } from "firebase/database";
import { ToastAndroid } from "react-native";

// Firebase instances
export const db = getFirestore(app);
export const storage = getStorage(app);

// Update booking in Firestore
export async function updateBooking(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Error updating booking:", error);
    return false;
  }
}

// Upload an image to Firebase Storage
export async function uploadImages(imageUri) {
  if (!imageUri) {
    console.error("Image URI is required.");
    return null;
  }

  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const imageName = `images/${Date.now()}`;
    const storageReference = storageRef(storage, imageName);

    await uploadBytes(storageReference, blob);
    const downloadURL = await getDownloadURL(storageReference);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}
// Upload the driver's location to Firebase Realtime Database
export async function uploadLocation(
  location,
  email,
  id,
  liveLocSharingBookings
) {
  // Validate location data
  if (!location?.coords?.latitude || !location?.coords?.longitude) {
    console.error("Invalid location data:", location);
    return;
  }

  // Validate email and booking ID
  if (!email || !id) {
    console.error("Missing email or booking ID for location update.");
    return;
  }

  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, "_");
    const { latitude, longitude } = location.coords;

    // Build references for Firebase updates
    const locationRef = dbRef(
      realtimeDbOFL,
      `driversLocations/${sanitizedEmail}/${id}`
    );
    const currentLocationRef = dbRef(
      realtimeDbOFL,
      `driversLocations/${sanitizedEmail}`
    );

    // Safely access live location path
    const bookingData = liveLocSharingBookings?.[0]?.[id];
    const path = Array.isArray(bookingData?.path) ? bookingData.path : [];
    const updatedPath = [...path, { latitude, longitude }];

    console.log(`Updating location for booking:`, liveLocSharingBookings);

    await update(locationRef, { latitude, longitude, path: updatedPath });
    await update(currentLocationRef, { current: { latitude, longitude } });

    if (__DEV__) {
      ToastAndroid.show("Location updated successfully!", ToastAndroid.SHORT);
    }
  } catch (error) {
    console.error("Failed to update location in Firebase:", error.message);
    if (__DEV__) {
      ToastAndroid.show("Update unsuccessful!", ToastAndroid.SHORT);
    }
  }
}

// Stop sharing the driver'
