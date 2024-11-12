import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { uploadLocation } from "@/lib/firebase/functions/post";
import { GetUser } from "@/lib/firebase/functions/auth";

const LOCATION_TASK_NAME = "background-location-task";

let user = null;

const fetchUser = async () => {
  user = await GetUser();
};
fetchUser();

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("Background location update:", locations[0]);
    sendLocationToServer(locations[0]);
  }
});

async function sendLocationToServer(location) {
  await uploadLocation(location, user);
}

export default function LocationTracker() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const startTracking = async () => {
      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          "Enable Location Services",
          "Please enable location services in your device settings."
        );
        return;
      }

      // Request foreground permissions
      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please enable location access."
        );
        return;
      }

      // Request background permissions if android
      if (Platform.OS === "android") {
        let { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== "granted") {
          Alert.alert(
            "Allow Background Location",
            "Please enable background location access."
          );
          return;
        }
      }

      // Start background tracking
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000, // Update every 2 seconds
        distanceInterval: 2, // Update every 5 meters
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Direct Transport Solutions",
          notificationBody: "Your location is being tracked.",
        },
      });

      // Start foreground tracking
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 2,
        },
        (newLocation) => {
          setLocation(newLocation);
          sendLocationToServer(newLocation);
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
