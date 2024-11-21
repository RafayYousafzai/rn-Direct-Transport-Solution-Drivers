import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { handleLocationUpdate } from "@/lib/firebase/functions/locations_sharing";
import useGlobalContext from "@/context/GlobalProvider";
import LocationPermissions from "./LocationPermissions";


export default function LocationTracker({ WATCH_LOCATION_UPDATES }) {
  const { user, liveLocSharingBookings } = useGlobalContext();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!user) return;

    const checkAndDefineTask = async () => {
      const registeredTasks = await TaskManager.getRegisteredTasksAsync();
      const taskExists = registeredTasks.some(
        (task) => task.taskName === WATCH_LOCATION_UPDATES
      );

      if (!taskExists) {
        TaskManager.defineTask(
          WATCH_LOCATION_UPDATES,
          async ({ data, error }) => {
            if (error) {
              console.error("Background location task error:", error);
              return;
            }

            if (data) {
              const { locations } = data;
              if (locations && locations.length > 0) {
                const location = locations[0];
                await handleLocationUpdate(
                  location,
                  user,
                  liveLocSharingBookings
                );
              }
            }
          }
        );
      }
    };

    const startTracking = async () => {
      try {
        await checkAndDefineTask();

        const permissionsGranted = await LocationPermissions();
        if (!permissionsGranted) {
          console.warn(
            "Permissions were not granted, stopping location tracking."
          );
          return;
        }

        const isTaskRunning = await Location.hasStartedLocationUpdatesAsync(
          WATCH_LOCATION_UPDATES
        );
        if (isTaskRunning) {
          await Location.stopLocationUpdatesAsync(WATCH_LOCATION_UPDATES);
        }

        await Location.startLocationUpdatesAsync(WATCH_LOCATION_UPDATES, {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 1,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Direct Transport Solutions",
            notificationBody:
              "Tracking your location for routing and monitoring.",
          },
        });

        const foregroundSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 1,
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

    return async () => {
      const isTaskRunning = await Location.hasStartedLocationUpdatesAsync(
        WATCH_LOCATION_UPDATES
      );
      if (isTaskRunning) {
        await Location.stopLocationUpdatesAsync(WATCH_LOCATION_UPDATES);
      }
    };
  }, [user, liveLocSharingBookings]);

  return (
    <View>
      {/* <Text style={styles.title}>Driver Location Tracker</Text>
      {location ? (
        <Text>Current Location: {JSON.stringify(location.coords)}</Text>
      ) : (
        <Text>Waiting for location...</Text>
      )} */}
    </View>
  );
}
