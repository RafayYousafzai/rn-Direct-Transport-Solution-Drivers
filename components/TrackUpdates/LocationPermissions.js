import { Alert, Platform, Linking } from "react-native";
import * as Location from "expo-location";

export default async function LocationPermissions() {
  let permissionsGranted = false;

  while (!permissionsGranted) {
    permissionsGranted = await requestPermissions();
    if (!permissionsGranted) {
      console.log("Permissions not granted, prompting again...");
    }
  }

  return true; // Permissions granted successfully
}

async function requestPermissions() {
  // Check if location services are enabled
  const isLocationEnabled = await Location.hasServicesEnabledAsync();
  if (!isLocationEnabled) {
    const userResponse = await new Promise((resolve) => {
      Alert.alert(
        "Location Services Disabled",
        "Please enable 'Allow All the Time' location access in your device settings.",
        [
          { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings();
              resolve(false); // Wait for user to manually enable
            },
          },
        ]
      );
    });
    return userResponse;
  }

  // Request foreground location permissions
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus !== "granted") {
    const userResponse = await new Promise((resolve) => {
      Alert.alert(
        "Location Access Needed",
        "Grant location permissions to continue.",
        [
          { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings();
              resolve(false); // Wait for user to manually enable
            },
          },
        ]
      );
    });
    return userResponse;
  }

  // Request background location permissions (only for Android)
  if (Platform.OS === "android") {
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      const userResponse = await new Promise((resolve) => {
        Alert.alert(
          "Allow Background Location",
          "Please allow background location access for uninterrupted tracking.",
          [
            { text: "Cancel", onPress: () => resolve(false), style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
                resolve(false); // Wait for user to manually enable
              },
            },
          ]
        );
      });
      return userResponse;
    }
  }

  // All checks passed
  return true;
}
