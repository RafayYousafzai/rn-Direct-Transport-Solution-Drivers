import React, { useEffect } from "react";
import useGlobalContext from "@/context/GlobalProvider";
import { useRouter } from "expo-router";
import { Text, SafeAreaView } from "react-native";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { isLoggedIn, isLoading } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    const handleNavigationAndSplash = async () => {
      try {
        if (!isLoading) {
          isLoggedIn ? router.push("Home") : router.push("signin");
        }
        await SplashScreen.hideAsync();
      } catch (error) {
        console.log(error);
      }
    };

    handleNavigationAndSplash();
  }, [isLoggedIn, isLoading]);

  return (
    <SafeAreaView>
      {isLoading ? <Text className="text-white">Loading...</Text> : null}
    </SafeAreaView>
  );
}
