import { View, Text, Image, TouchableOpacity } from "react-native";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useGlobalContext from "@/context/GlobalProvider";

export default function BookingLayout() {
  const navigation = useNavigation();
  const { selectedBooking } = useGlobalContext();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTitle: "",
          headerStyle: {
            backgroundColor: "#1384e1",
            shadowColor: "transparent",
            elevation: 0,
            borderBottomWidth: 0,
            height: 100,
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="arrow-back-circle"
                style={{ marginBottom: 2 }}
                size={24}
                color="#fff"
              />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {selectedBooking?.userName + " " || ""} -{" "}
                <Text className="uppercase text-sm ">
                  {selectedBooking?.currentStatus}
                </Text>
              </Text>
            </TouchableOpacity>
          ),

          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => router.push("Home")}
            >
              <Ionicons name="home" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      ></Stack>
      <StatusBar backgroundColor="#1384e1" translucent style="light" />
    </>
  );
}
