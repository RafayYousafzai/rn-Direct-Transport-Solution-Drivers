import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import LocationPermissions from "./LocationPermissions";
import { getValueFor } from "../../lib/SecureStore/SecureStore";
import Toast from "../common/Toast";

const WATCH_LOCATION_UPDATES = "background-location-updates";

// Define background task for location updates
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
        handleLocationUpdate(location);
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
  const [foregroundSubscription, setForegroundSubscription] = useState(null);

  useEffect(() => {
    const startTracking = async () => {
      try {
        // Request location permissions
        const permissions = await LocationPermissions();
        if (!permissions) {
          console.error("Location permissions denied.");
          return;
        }

        // Check if the background task is already registered
        const isTaskRegistered = await TaskManager.isTaskRegisteredAsync(
          WATCH_LOCATION_UPDATES
        );
        if (!isTaskRegistered) {
          // Start background location tracking
          await Location.startLocationUpdatesAsync(WATCH_LOCATION_UPDATES, {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1,
            distanceInterval: 1,
            showsBackgroundLocationIndicator: true,
            foregroundService: {
              notificationTitle: "Location Tracking Active",
              notificationBody:
                "We are actively tracking your location for routing and monitoring.",
              notificationColor: "#0856bc",
            },
          });
        }

        // Start foreground location tracking
        const foregroundSub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1,
            distanceInterval: 1,
            mayShowUserSettingsDialog: true,
          },
          (location) => handleLocationUpdate(location)
        );

        setForegroundSubscription(foregroundSub);
      } catch (err) {
        console.error("Error starting location tracking:", err.message);
      }
    };

    startTracking();

    return async () => {
      // Cleanup foreground and background tasks
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
  }, []);

  return <View />;
}

// Handle location updates and send to server
const handleLocationUpdate = async (location) => {
  Toast("Updating");
  try {
    const userJson = await getValueFor("user");
    const user = JSON.parse(userJson);
    const data = JSON.stringify({ email: user.email, location });

    const response = await fetch(
      "https://direct-transport-server.vercel.app/api/locations/update_current_location",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }
    );

    if (!response.ok) {
      console.error("Failed to send location data:", response.statusText);
    } else {
      console.log("Location update successful.");
    }
  } catch (err) {
    console.error("Error during location update:", err.message);
  }
};
