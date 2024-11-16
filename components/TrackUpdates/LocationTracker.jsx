import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { handleLocationUpdate } from "@/lib/firebase/functions/locations_sharing";
import { GetUser } from "@/lib/firebase/functions/auth";

const WATCH_LOCATION_UPDATES = "background-location-updates";

let user = null;

const fetchUser = async () => {
  user = await GetUser();
};
fetchUser();

// Task Manager for background location updates
TaskManager.defineTask(WATCH_LOCATION_UPDATES, ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    handleLocationUpdate(locations[0], user);
  }
});

export default function LocationTracker() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const startTracking = async () => {
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          "Location Services Disabled",
          "Your location services are currently disabled. To use this app, Please enable 'Allow All the Time' location access in your device settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => Location.enableNetworkProviderAsync(),
            },
          ]
        );
        return;
      }

      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        Alert.alert(
          "Location Access Needed",
          "This app requires location access to provide tracking features for security. Please grant location permission to continue.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Grant Access",
              onPress: async () =>
                await Location.requestForegroundPermissionsAsync(),
            },
          ]
        );
        return;
      }

      if (Platform.OS === "android") {
        let { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== "granted") {
          Alert.alert(
            "Allow Background Location",
            "To ensure uninterrupted location tracking (even when the app is not in use), please allow background location access. This helps us provide the best tracking experience.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Grant Background Access",
                onPress: async () =>
                  await Location.requestBackgroundPermissionsAsync(),
              },
            ]
          );
          return;
        }
      }

      // Start background location tracking
      await Location.startLocationUpdatesAsync(WATCH_LOCATION_UPDATES, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
        distanceInterval: 0.5,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Direct Transport Solutions",
          notificationBody:
            "Your location is being tracked to ensure accurate routing and monitoring.",
        },
      });

      // Start foreground location tracking
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 0.5,
        },
        (newLocation) => {
          setLocation(newLocation); // Update UI
          handleLocationUpdate(newLocation, user); // Shared location handler
        }
      );
    };

    startTracking();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Location Tracker</Text>
      {location ? (
        <Text>Current Location: {JSON.stringify(location.coords)}</Text>
      ) : (
        <Text>Waiting for location...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
