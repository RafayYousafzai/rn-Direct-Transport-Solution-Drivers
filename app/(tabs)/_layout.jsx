import { Tabs, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { icons } from "@/constants";
import useGlobalContext from "@/context/GlobalProvider";
import { useEffect } from "react";
import LocationTracker from "@/components/TrackUpdates/LocationTracker";

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
      <View className="flex pt-3 items-center justify-center gap-2">
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
      <LocationTracker />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1384e1",
          tabBarInactiveTintColor: "#adb5bd",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#ced4da",
            height: 80,
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
          name="Active"
          options={{
            title: "Active",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.calendar}
                color={color}
                name="Active"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Completed"
          options={{
            title: "Completed",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.future}
                color={color}
                name="Completed"
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
        <Tabs.Screen
          name="Profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.user}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#fff" translucent style="dark" />
    </>
  );
}
