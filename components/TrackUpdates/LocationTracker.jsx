import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    console.log("Background location update:", locations[0]);
    // Send location data to the server
    sendLocationToServer(locations[0]);
  }
});

async function sendLocationToServer(location) {
  try {
    console.log({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: location.timestamp,
    });
  } catch (error) {
    console.error("Failed to send location:", error);
  }
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

      // Request background permissions if supported
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
        distanceInterval: 5, // Update every 5 meters
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Tracking Location",
          notificationBody: "Your location is being tracked.",
        },
      });

      // Start foreground tracking
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 5,
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
