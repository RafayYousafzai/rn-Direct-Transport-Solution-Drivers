import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size="large" color="#000" />
      <StatusBar backgroundColor="#fff" translucent style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 12,
    color: "#000",
  },
});

export default LoadingScreen;
