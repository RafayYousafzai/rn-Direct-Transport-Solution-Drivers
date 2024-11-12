import { useEffect, useState } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import useGlobalContext from "@/context/GlobalProvider";

const LOCATION_TASK_NAME = "background-location-task";

// Define the background location task
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error("Location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("Background location:", locations[0]);
  }
});

export default function LocationTracker() {
  const { setLocation } = useGlobalContext();

  useEffect(() => {
    (async () => {
      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          "Enable Location Services",
          "Please enable location services in your device settings.",
          [{ text: "OK" }]
        );
        return;
      }

      // Request foreground permissions
      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "This app needs location access to function. Please allow location access in the app settings.",
          [
            {
              text: "Open Settings",
              onPress: () => Location.enableNetworkProviderAsync(),
            },
          ]
        );
        return;
      }

      // Request background permissions for continuous tracking
      let { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        Alert.alert(
          "Allow Background Location",
          "To track location continuously, please allow background location access in the app settings.",
          [{ text: "OK" }]
        );
        return;
      }

      // Start background location tracking
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update every 10 meters
        showsBackgroundLocationIndicator: true,
      });

      // Get initial location
      const initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation);
      console.log("Initial location:", initialLocation);
    })();
  }, []);

  useEffect(() => {
    // Subscribe to foreground location updates
    const foregroundSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update every 10 meters
      },
      (newLocation) => {
        setLocation(newLocation);
        console.log("Foreground location:", newLocation);
      }
    );

    // Clean up the foreground subscription on unmount
    return () => {
      foregroundSubscription.then((sub) => sub.remove());
    };
  }, []);

  return;
}
