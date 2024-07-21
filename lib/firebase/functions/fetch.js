import app from "../firebaseConfig";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
export const db = getFirestore(app);

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

export { fetchDocById, getCollection };
