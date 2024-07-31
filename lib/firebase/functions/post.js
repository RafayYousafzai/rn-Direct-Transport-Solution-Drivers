import app from "../firebaseConfig";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const db = getFirestore(app);
export const storage = getStorage(app);

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
    console.log("fetched:", response);
    const blob = await response.blob();
    const imageName = `images/${Date.now()}`;
    const storageRef = ref(storage, imageName);

    const dsa = await uploadBytes(storageRef, blob);
    console.log(dsa);

    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

export { updateBooking, uploadImages };
