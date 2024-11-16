import { uploadLocation } from "@/lib/firebase/functions/post";
import { ToastAndroid, Platform } from "react-native";

async function handleLocationUpdate(location, user) {
  const email = user?.email;

  if (!email) {
    console.log("User not authenticated");
    return;
  }

  if (Platform.OS === "android") {
    ToastAndroid.show(`Sending location to ${email}`, ToastAndroid.SHORT);
  } else {
    console.log(`Sending location to ${email}`);
  }

  await uploadLocation(location, email);
}

export { handleLocationUpdate };
