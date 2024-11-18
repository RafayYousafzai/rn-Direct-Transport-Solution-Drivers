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

  //   console.log(
  //     "liveLocSharingBookings",
  //     liveLocSharingBookings,
  //     "liveBookings",
  //     liveBookings
  //   );

  if (liveBookings.length > 0) {
    ToastAndroid.show(
      `Sending location for ${liveBookings.length} bookings`,
      ToastAndroid.SHORT
    );

    try {
      await Promise.all(
        liveBookings.map(async (booking) => {
          const id = booking.id;
          ToastAndroid.show(
            `Sending location to ${email} for booking ${id}`,
            ToastAndroid.SHORT
          );
          await uploadLocation(location, email, id);
        })
      );
    } catch (error) {
      console.error("Failed to upload locations:", error);
    }
  } else {
    ToastAndroid.show(
      ` liveBookings length is ${liveBookings.length}   `,
      ToastAndroid.SHORT
    );
  }
}

export { handleLocationUpdate };
