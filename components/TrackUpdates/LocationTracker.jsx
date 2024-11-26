import React, { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { handleLocationUpdate } from "@/lib/firebase/functions/locations_sharing";
import useGlobalContext from "@/context/GlobalProvider";
import LocationPermissions from "./LocationPermissions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WATCH_LOCATION_UPDATES = "background-location-updates";

TaskManager.defineTask(WATCH_LOCATION_UPDATES, async ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error.message);
    return;
  }

  if (data) {
    const { locations } = data;
    if (locations && locations.length > 0) {
      const location = locations[0];

      try {
        const user = await AsyncStorage.getItem("user");
        const liveLocSharingBookings = await AsyncStorage.getItem(
          "liveLocSharingBookings"
        );

        if (!user || !liveLocSharingBookings) {
          console.error("User or liveLocSharingBookings not available");
          return;
        }

        await handleLocationUpdate(
          location,
          JSON.parse(user),
          JSON.parse(liveLocSharingBookings)
        );
      } catch (err) {
        console.error(
          "Error handling background location update:",
          err.message
        );
      }
    }
  }
});

export default function LocationTracker() {
  const { user, liveLocSharingBookings } = useGlobalContext();
  const [foregroundSubscription, setForegroundSubscription] = useState(null);
  const liveLocSharingBookingsRef = useRef(liveLocSharingBookings);

  // Update the ref whenever liveLocSharingBookings changes
  useEffect(() => {
    liveLocSharingBookingsRef.current = liveLocSharingBookings;
  }, [liveLocSharingBookings]);

  useEffect(() => {
    const startTracking = async () => {
      try {
        await LocationPermissions();

        const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(
          WATCH_LOCATION_UPDATES
        );
        if (!isTaskRegistered) {
          await Location.startLocationUpdatesAsync(WATCH_LOCATION_UPDATES, {
            accuracy: Location.Accuracy.High,
            timeInterval: 1800000,
            distanceInterval: 1000,
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
            timeInterval: 1800000,
            distanceInterval: 1000,
            mayShowUserSettingsDialog: true,
          },
          (location) =>
            handleLocationUpdate(
              location,
              user,
              liveLocSharingBookingsRef.current
            )
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
  }, [user]); // Only depend on user

  return <View />;
}
