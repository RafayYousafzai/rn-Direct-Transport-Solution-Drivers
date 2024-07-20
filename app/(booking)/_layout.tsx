import React from "react";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function BookingLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarStyle: {
            borderTopWidth: 0,
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
            backgroundColor: "#141422",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            backgroundColor: "#141422",
          },
        }}
      >
        <Tabs.Screen
          name="details"
          options={{
            title: "Details",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document" size={25} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="pod"
          options={{
            title: "POD",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="camera" size={24} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="status"
          options={{
            title: "Status",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="eye" size={28} color={color} />
            ),
            headerShown: false,
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
