import React, { useEffect } from "react";
import useGlobalContext from "@/context/GlobalProvider";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { remove } from "@/lib/SecureStore/SecureStore";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { isLoggedIn, isLoading } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    const handleNavigationAndSplash = async () => {
      try {
        if (!isLoading) {
          if (isLoggedIn) {
            router.replace("Home");
          } else {
            router.replace("signin");
          }
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error("Navigation error:", error);
        await remove("user");
        router.replace("signin");
        await SplashScreen.hideAsync();
      }
    };

    // Call navigation function when the component is mounted
    handleNavigationAndSplash();

    // Add a timeout as a fallback in case of unforeseen delays
    const timeoutId = setTimeout(() => {
      if (!isLoading) {
        isLoggedIn ? router.replace("Home") : router.replace("signin");
        SplashScreen.hideAsync();
      }
    }, 1000); // 5 seconds fallback

    // Clear timeout if component is unmounted or if navigation completes
    return () => clearTimeout(timeoutId);
  }, [isLoggedIn, isLoading, router]);

  return (
    <View className="flex-1 items-center align-middle justify-center">
      <ActivityIndicator />
    </View>
  );
}
