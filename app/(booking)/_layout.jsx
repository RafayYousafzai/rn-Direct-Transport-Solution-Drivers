import { Tabs } from "expo-router";
import { View, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { icons } from "@/constants";

export default function BookingLayout() {
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
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="details"
          options={{
            title: "Details",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.docs}
                color={color}
                name="Details"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="pod"
          options={{
            title: "POD",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.photo}
                color={color}
                name="POD"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="status"
          options={{
            title: "Status",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.circle}
                color={color}
                name="Status"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
