import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { handleLocationUpdate } from "@/lib/firebase/functions/locations_sharing";
import useGlobalContext from "@/context/GlobalProvider";

const WATCH_LOCATION_UPDATES = "background-location-updates";

export default function LocationTracker() {
  const { user, liveLocSharingBookings } = useGlobalContext();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!user) return;

    TaskManager.defineTask(WATCH_LOCATION_UPDATES, async ({ data, error }) => {
      if (error) {
        console.error("Background location task error:", error);
        return;
      }

      if (data) {
        const { locations } = data;
        if (locations && locations.length > 0) {
          const location = locations[0];
          await handleLocationUpdate(location, user, liveLocSharingBookings);
        }
      }
    });

    const startTracking = async () => {
      try {
        const isLocationEnabled = await Location.hasServicesEnabledAsync();
        if (!isLocationEnabled) {
          Alert.alert(
            "Location Services Disabled",
            "Please enable 'Allow All the Time' location access in your device settings.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => Location.enableNetworkProviderAsync(),
              },
            ]
          );
          return;
        }

        const { status: foregroundStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus !== "granted") {
          Alert.alert(
            "Location Access Needed",
            "Grant location permissions to continue.",
            [
              { text: "Cancel", style: "cancel" },
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
          const { status: backgroundStatus } =
            await Location.requestBackgroundPermissionsAsync();
          if (backgroundStatus !== "granted") {
            Alert.alert(
              "Allow Background Location",
              "Please allow background location access for uninterrupted tracking.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Grant Access",
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
          timeInterval: 2000,
          distanceInterval: 0.3,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Direct Transport Solutions",
            notificationBody:
              "Tracking your location for routing and monitoring.",
          },
        });

        // Start foreground location tracking
        const foregroundSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 0.3,
          },
          async (newLocation) => {
            setLocation(newLocation);
            await handleLocationUpdate(
              newLocation,
              user,
              liveLocSharingBookings
            );
          }
        );

        return () => {
          foregroundSubscription?.remove(); // Clean up subscription
        };
      } catch (err) {
        console.error("Error starting location tracking:", err);
      }
    };

    startTracking();
  }, [user]);

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
