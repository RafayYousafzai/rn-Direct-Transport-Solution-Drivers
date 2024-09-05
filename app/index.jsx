import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import registerNNPushToken from "native-notify";
import { registerIndieID, unregisterIndieDevice } from "native-notify";

import useGlobalContext from "@/context/GlobalProvider";
import { getValueFor, remove } from "@/lib/SecureStore/SecureStore";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const APP_ID = 23374;
const APP_TOKEN = "hZawrJYXBzBbQZgTgLVsZP";

export default function Index() {
  // registerNNPushToken(23374, "hZawrJYXBzBbQZgTgLVsZP");
  const { isLoggedIn, isLoading, user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    const handleNavigationAndSplash = async () => {
      console.log({ user });

      try {
        if (!isLoading && user) {
          if (isLoggedIn) {
            const regis = await registerIndieID(user.email, APP_ID, APP_TOKEN);
            console.log(user.email, { regis, user, APP_ID, APP_TOKEN });

            Alert.alert(
              "Notification",
              "You will receive booking messages from now on."
            );
            router.replace("Home");
          } else {
            router.replace("signin");
          }
          await SplashScreen.hideAsync(); // Hide splash screen when navigation is done
        }
      } catch (error) {
        console.error("Navigation error:", error);
        await remove("user"); // Remove user on error
        router.replace("signin");
        await SplashScreen.hideAsync();
      }
    };

    if (!isLoading) {
      handleNavigationAndSplash();
    }
  }, [isLoggedIn, isLoading, router]); // Depend on user for navigation logic

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <ActivityIndicator size="large" color="#0000ff" />;
}
