import { uploadLocation } from "@/lib/firebase/functions/post";
import { ToastAndroid } from "react-native";

async function handleLocationUpdate(location, user, liveLocSharingBookings) {
  const email = user?.email;
  if (!email) {
    console.log("User not authenticated");
    return;
  }

  const bookingsData = liveLocSharingBookings?.[0] || {};

  const liveBookings = Object.values(bookingsData).filter(
    (booking) => booking && booking.sharing === true
  );

  console.log(
    "liveLocSharingBookings",
    liveLocSharingBookings,
    "liveBookings",
    liveBookings
  );

  if (liveBookings.length > 0) {
    ToastAndroid.show(
      `Sending location for ${liveBookings.length} bookings`,
      ToastAndroid.SHORT
    );

    for (const booking of liveBookings) {
      const id = booking.id;
      ToastAndroid.show(
        `Sending location to ${email} for booking ${id}`,
        ToastAndroid.SHORT
      );
      try {
        await uploadLocation(location, email, id);
      } catch (error) {
        console.error(`Failed to upload location for booking ${id}:`, error);
      }
    }
  } else {
    ToastAndroid.show(
      ` liveBookings length is ${liveBookings.length}   `,
      ToastAndroid.SHORT
    );
  }
}

export { handleLocationUpdate };
