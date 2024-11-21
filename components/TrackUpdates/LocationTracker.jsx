import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { handleLocationUpdate } from "@/lib/firebase/functions/locations_sharing";
import useGlobalContext from "@/context/GlobalProvider";
import LocationPermissions from "./LocationPermissions";

const WATCH_LOCATION_UPDATES = "background-location-updates";

// Define the task globally and pass dependencies dynamically
if (!TaskManager.isTaskDefined(WATCH_LOCATION_UPDATES)) {
  TaskManager.defineTask(WATCH_LOCATION_UPDATES, async ({ data, error }) => {
    if (error) {
      console.error("Background location task error:", error.message);
      return;
    }

    if (data) {
      const { locations } = data;
      if (locations && locations.length > 0) {
        const location = locations[0];
        console.log("Background location update:", location);

        // Ensure the function handles user and bookings context
        const context = await getContext();
        if (context) {
          const { user, liveLocSharingBookings } = context;
          try {
            await handleLocationUpdate(location, user, liveLocSharingBookings);
          } catch (err) {
            console.error(
              "Error handling background location update:",
              err.message
            );
          }
        }
      }
    }
  });
}

const getContext = async () => {
  return {
    user: useGlobalContext().user,
    liveLocSharingBookings: useGlobalContext().liveLocSharingBookings,
  };
};

export default function LocationTracker() {
  const { user, liveLocSharingBookings } = useGlobalContext();
  const [foregroundSubscription, setForegroundSubscription] = useState(null);

  useEffect(() => {
    const startTracking = async () => {
      try {
        const permissionsGranted = await LocationPermissions();
        if (!permissionsGranted) {
          console.warn("Permissions not granted for location tracking.");
          return;
        }

        // Check if the task is already registered
        const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(
          WATCH_LOCATION_UPDATES
        );
        if (!isTaskRegistered) {
          console.log("Starting background location updates...");
          await Location.startLocationUpdatesAsync(WATCH_LOCATION_UPDATES, {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // 10 seconds
            distanceInterval: 1, // 1 meter
            showsBackgroundLocationIndicator: true,
            foregroundService: {
              notificationTitle: "Direct Transport Solutions",
              notificationBody:
                "Tracking your location for routing and monitoring.",
            },
          });
        }

        // Foreground location tracking
        const foregroundSub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // 10 seconds
            distanceInterval: 1, // 1 meter
          },
          (location) => {
            console.log("Foreground location update:", location);
            handleLocationUpdate(location, user, liveLocSharingBookings).catch(
              (err) =>
                console.error(
                  "Error handling foreground location update:",
                  err.message
                )
            );
          }
        );

        setForegroundSubscription(foregroundSub);
      } catch (err) {
        console.error("Error starting location tracking:", err.message);
      }
    };

    startTracking();

    return async () => {
      // Cleanup on unmount
      if (foregroundSubscription) {
        foregroundSubscription.remove();
        setForegroundSubscription(null);
      }

      const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(
        WATCH_LOCATION_UPDATES
      );
      if (isTaskRegistered) {
        await Location.stopLocationUpdatesAsync(WATCH_LOCATION_UPDATES);
      }
    };
  }, [user, liveLocSharingBookings]);

  return <View />;
}

// const foregroundSubscription = await Location.watchPositionAsync(
//   {
//     accuracy: Location.Accuracy.High,
//     timeInterval: 3000,
//     distanceInterval: 4,
//   },
//   async (newLocation) => {
//     await handleLocationUpdate(
//       newLocation,
//       user,
//       liveLocSharingBookings
//     );
//   }
// );
