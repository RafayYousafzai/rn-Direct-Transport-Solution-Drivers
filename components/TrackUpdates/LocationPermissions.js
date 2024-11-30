import { Alert, Platform, Linking } from "react-native";
import * as Location from "expo-location";
import * as Battery from "expo-battery";

export default async function LocationPermissions() {
  let permissionsGranted = false;

  while (!permissionsGranted) {
    console.log("Checking permissions...");
    permissionsGranted = await requestPermissions();

    if (!permissionsGranted) {
      console.log("Permissions not granted, prompting again...");
      // await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("All permissions granted.");
  return true;
}

async function requestPermissions() {
  try {
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
              {
                text: "Cancel",
                onPress: () => resolve(false),
                style: "cancel",
              },
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

    // Check and prompt for battery optimization (Android only)
    if (Platform.OS === "android") {
      const isOptimized = await Battery.isBatteryOptimizationEnabledAsync();
      if (isOptimized) {
        const userResponse = await new Promise((resolve) => {
          Alert.alert(
            "Battery Optimization Enabled",
            "To ensure uninterrupted functionality, please disable battery optimization for this app.",
            [
              {
                text: "Cancel",
                onPress: () => resolve(false),
                style: "cancel",
              },
              {
                text: "Open Settings",
                onPress: () => {
                  Linking.openSettings();
                  resolve(false); // Wait for user to manually disable
                },
              },
            ]
          );
        });
        return userResponse;
      }
    }

    // All required permissions and settings are satisfied
    return true;
  } catch (error) {
    console.error("Error requesting permissions:", error);
    return false;
  }
}
