import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import app from "../firebaseConfig";

const db = getFirestore(app);

async function signInWithEmail(usernameOrEmail, password) {
  try {
    const qWithUsername = query(
      collection(db, "users"),
      where("firstName", "==", usernameOrEmail),
      where("password", "==", password)
    );

    const qWithEmail = query(
      collection(db, "users"),
      where("email", "==", usernameOrEmail),
      where("password", "==", password)
    );

    const querySnapshotWithUsername = await getDocs(qWithUsername);
    const querySnapshotWithEmail = await getDocs(qWithEmail);

    if (querySnapshotWithUsername.empty && querySnapshotWithEmail.empty) {
      console.log("User not found or invalid credentials");
      return false;
    }

    let userData;
    if (!querySnapshotWithUsername.empty) {
      userData = querySnapshotWithUsername.docs[0].data();
    } else {
      userData = querySnapshotWithEmail.docs[0].data();
    }

    console.log("Sign in successful!", userData);
    return userData;
  } catch (error) {
    console.log(error.message);
  }
}

export { signInWithEmail };
