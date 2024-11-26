import { uploadLocation } from "@/lib/firebase/functions/post";
import Toast from "@/components/common/Toast";

async function handleLocationUpdate(location, user, liveLocSharingBookings) {
  const email = user?.email;
  if (!email) {
    console.error("User not authenticated");
    return;
  }

  const bookingsData = liveLocSharingBookings?.[0] || {};
  const liveBookings = Object.values(bookingsData || {}).filter(
    (booking) => booking?.sharing === true
  );

  if (!location?.coords) {
    console.error("Invalid location data:", location);
    return;
  }

  if (liveBookings.length > 0) {
    Toast(`Sending location for ${liveBookings.length} bookings`);

    try {
      const batchSize = 5;
      for (let i = 0; i < liveBookings.length; i += batchSize) {
        const batch = liveBookings.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (booking) => {
            const id = booking.id;
            if (__DEV__) {
              console.log(`Sending location to ${email} for booking ${id}`);
            }
            await uploadLocation(location, email, id, liveLocSharingBookings);
          })
        );
      }
    } catch (error) {
      console.error("Failed to upload locations:", error);
    }
  } else {
    if (__DEV__) {
      console.warn(`No active bookings to share location with.`);
    }
    Toast(`No active bookings to share location with.`);
  }
}

export { handleLocationUpdate };
