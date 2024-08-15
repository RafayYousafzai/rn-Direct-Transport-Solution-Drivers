import React, { useEffect } from "react";
import useGlobalContext from "@/context/GlobalProvider";
import { useRouter } from "expo-router";
import { Text, SafeAreaView, TouchableOpacity, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { remove } from "@/lib/SecureStore/SecureStore";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const { isLoggedIn, isLoading, user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    const handleNavigationAndSplash = async () => {
      try {
        if (!isLoading) {
          isLoggedIn ? router.push("Home") : router.push("signin");
        }
      } catch (error) {
        console.log(error);
        remove("user");
        router.navigate("signin");
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    handleNavigationAndSplash();
  }, [isLoggedIn, isLoading, user, router]);

  return (
    <SafeAreaView className="flex-1 bg-primary justify-center items-center">
      {isLoading ? (
        <Text className="text-slate-800 text-xl">Loading...</Text>
      ) : (
        <View className="w-3/4 p-4 ">
          <Text className="text-slate-950 text-2xl font-bold mb-4 text-center">
            Welcome!
          </Text>
          <TouchableOpacity
            onPress={() => router.push(isLoggedIn ? "Home" : "signin")}
            className="bg-secondary-100 py-3 px-6 rounded-lg mt-4"
          >
            <Text className="text-white text-center text-lg">
              {isLoggedIn ? "Go to Home" : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
