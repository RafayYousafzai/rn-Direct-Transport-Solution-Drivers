import app from "../firebaseConfig";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
export const db = getFirestore(app);

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

export { updateBooking };
