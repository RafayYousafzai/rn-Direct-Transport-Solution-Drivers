import React from "react";
import { View, Text, Button } from "react-native";
import BackgroundGeolocation from "react-native-background-geolocation";

const App = () => {
  const initializeGeolocation = () => {
    console.log("Initializing BackgroundGeolocation...");

    BackgroundGeolocation.ready({
      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      stopOnTerminate: false,
      startOnBoot: true,
      debug: true, // Enable sounds and verbose logs
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
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
      })
      .catch((error) =>
        console.error("Error during BackgroundGeolocation.ready():", error)
      );
  };

  return (
    <View>
      <Text>Background Geolocation Demo</Text>
      <Button title="Start Geolocation" onPress={initializeGeolocation} />
    </View>
  );
};

export default App;
