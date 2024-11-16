import { uploadLocation } from "@/lib/firebase/functions/post";
import { ToastAndroid, Platform } from "react-native";
import { fetchUserDataByEmail } from "./fetch";

async function handleLocationUpdate(location, user) {
  const email = user?.email;

  if (!email) {
    console.log("User not authenticated");
    return;
  }

  ToastAndroid.show(`Sending location to ${email}`, ToastAndroid.SHORT);

  const bookings = fetchUserDataByEmail(email);

  const liveBookings = bookings.filter((booking) => booking.sharing === true);
  console.log(liveBookings);

  //   await uploadLocation(location, email);
}

export { handleLocationUpdate };
