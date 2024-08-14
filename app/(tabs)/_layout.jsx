import { Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { icons } from "@/constants";
import useGlobalContext from "@/context/GlobalProvider";
import { useEffect } from "react";

export default function TabsLayout() {
  const { isLoggedIn, isLoading, user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/signin");
    }
  }, [isLoggedIn, isLoading, user]);

  const TabIcon = ({ icon, color, name, focused }) => {
    return (
      <View className="flex items-center justify-center gap-2">
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className="w-6 h-6"
        />
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{ color: color }}
        >
          {name}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#0055bc",
          tabBarInactiveTintColor: "#adb5bd",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#f1faee",
            borderTopWidth: 1,
            borderTopColor: "#ced4da",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Today"
          options={{
            title: "Today",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.calendar}
                color={color}
                name="Today"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="History"
          options={{
            title: "History",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.history}
                color={color}
                name="History"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#f1faee" style="light" />
    </>
  );
}
