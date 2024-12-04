import React, { useEffect } from "react";
import { View, Text, ToastAndroid, Platform } from "react-native";
import BackgroundGeolocation from "react-native-background-geolocation";

// Function to handle API calls
const handleLocationUpdate = async (location) => {
  try {
    // const userJson = await getValueFor("user"); // Replace with your secure storage retrieval logic
    // const user = JSON.parse(userJson);
    const data = JSON.stringify({ email: "rafay@gmail.com", location });

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
      if (Platform.OS === "android") {
        ToastAndroid.show("Location updated successfully!", ToastAndroid.SHORT);
      }
    }
  } catch (err) {
    console.error("Error during location update:", err.message);
  }
};

const LocationTracker = () => {
  useEffect(() => {
    // Step 1: Configure BackgroundGeolocation
    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 1, // Minimum distance in meters for location updates
      stopOnTerminate: false, // Continue tracking after app termination
      startOnBoot: true, // Start tracking when the device boots
    }).then((state) => {
      console.log("[BackgroundGeolocation] Ready: ", state);

      if (!state.enabled) {
        BackgroundGeolocation.start();
      }
    });

    // Step 2: Subscribe to location updates
    const locationSubscription = BackgroundGeolocation.onLocation(
      (location) => {
        console.log("[Location Update]", location);
        // Call the API to update location
        handleLocationUpdate(location);
      },
      (error) => {
        console.error("[Location Error]", error);
      }
    );

    // Step 3: Subscribe to motion change events (optional)
    const motionChangeSubscription = BackgroundGeolocation.onMotionChange(
      (event) => {
        console.log("[Motion Change]", event);
      }
    );

    // Cleanup on component unmount
    return () => {
      locationSubscription.remove();
      motionChangeSubscription.remove();
      BackgroundGeolocation.stop();
    };
  }, []);

  return (
    <View>
      <Text>Background Geolocation Tracker</Text>
    </View>
  );
};

export default LocationTracker;
