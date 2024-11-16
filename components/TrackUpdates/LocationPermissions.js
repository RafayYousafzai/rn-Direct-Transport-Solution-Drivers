// LocationTracker.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { requestLocationPermissions } from "./LocationPermissions";
import { handleLocationUpdate } from "@/lib/firebase/functions/locations_sharing";

const WATCH_LOCATION_UPDATES = "background-location-updates";

TaskManager.defineTask(WATCH_LOCATION_UPDATES, ({ data, error }) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    handleLocationUpdate(locations[0]);
  }
});

export default function LocationTracker() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const startTracking = async () => {
      const permissionsGranted = await requestLocationPermissions();
      if (!permissionsGranted) return;

      // Start background location tracking
      await Location.startLocationUpdatesAsync(WATCH_LOCATION_UPDATES, {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 0.3,
        showsBackgroundLocationIndicator: true,
        foregroundService: {
          notificationTitle: "Direct Transport Solutions",
          notificationBody:
            "Your location is being tracked to ensure accurate routing and monitoring.",
        },
      });

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 0.3,
        },
        (newLocation) => {
          setLocation(newLocation);
          handleLocationUpdate(newLocation);
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
