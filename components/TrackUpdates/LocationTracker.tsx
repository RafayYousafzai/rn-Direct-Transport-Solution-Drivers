import { getValueFor } from "@/lib/SecureStore/SecureStore";
import React, { useEffect } from "react";
import BackgroundGeolocation from "react-native-background-geolocation";

const handleLocationUpdate = async (location: any) => {
  console.log("Updating Location");
  try {
    const userJson: any = await getValueFor("user");
    const user = JSON.parse(userJson);
    const data = JSON.stringify({ email: user.email, location });

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
    }
  } catch (err: any) {
    console.error("Error during location update:", err.message);
  }
};

const App = () => {
  useEffect(() => {
    initializeGeolocation();

    // Cleanup on unmount
    return () => {
      BackgroundGeolocation.removeAllListeners();
      BackgroundGeolocation.stop();
    };
  }, []);

  const initializeGeolocation = () => {
    console.log("Initializing BackgroundGeolocation...");

    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 50,
      stopOnTerminate: false,
      startOnBoot: true,
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_OFF,
    })
      .then((state) => {
        console.log("BackgroundGeolocation ready:", state);

        if (!state.enabled) {
          BackgroundGeolocation.start()
            .then(() => console.log("BackgroundGeolocation started"))
            .catch((error) =>
              console.error("Error starting BackgroundGeolocation:", error)
            );
        }

        // Listen for location updates
        BackgroundGeolocation.onLocation((location) => {
          console.log("New location received:", location);
          handleLocationUpdate(location.coords);
        });
      })
      .catch((error) =>
        console.error("Error during BackgroundGeolocation.ready():", error)
      );
  };

  return null;
};

export default App;