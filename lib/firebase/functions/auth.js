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
import { remove, save, getValueFor } from "@/lib/SecureStore/SecureStore";
import { fetchDocById } from "../functions/fetch";

import app from "../firebaseConfig";
import { router } from "expo-router";

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

async function GetUser() {
  try {
    const value = await getValueFor("user");

    if (value) {
      const user = JSON.parse(value);

      const userData = await fetchDocById(user.email, "users");
      await save("user", JSON.stringify(userData));
      return userData;
    } else {
      router.navigate("signin");
      return null;
    }
  } catch (error) {
    console.log(error.message);
    router.navigate("signin");

    return null;
  }
}

export { signInWithEmail, GetUser };
