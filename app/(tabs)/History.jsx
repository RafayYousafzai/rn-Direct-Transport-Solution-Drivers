import React from "react";
import { View, Text, FlatList, Pressable, SafeAreaView } from "react-native";
import { format } from "date-fns";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import EmptyState from "@/components/EmptyState";

const bookings = [
  {
    id: "1",
    date: new Date(),
    status: "Cancelled",
  },
  {
    id: "2",
    date: new Date(),
    status: "Picked Up",
  },
  {
    id: "3",
    date: new Date(),
    status: "Delivered",
  },
  {
    id: "3",
    date: new Date(),
    status: "Returned",
  },
  // Add more bookings as needed
];
// name="checkmark-circle"
const getStatusIcon = (status) => {
  switch (status) {
    case "Picked Up":
      return <Ionicons name="cube" size={24} color="orange" />;
    case "Delivered":
      return (
        <Ionicons name="checkmark-done-circle" size={24} color="#83c5be" />
      );
    case "Returned":
      return <FontAwesome name="undo" size={21} color="#b892ff" />;
    case "Cancelled":
      return <Ionicons name="close-circle" size={24} color="#e63946" />;
    default:
      return null;
  }
};

export default function History() {
  const renderBooking = ({ item }) => (
    <Pressable
      className="w-full p-4 my-2 bg-slate-800 rounded-lg shadow-md flex-row items-center justify-between"
      onPress={() => console.log(`Booking ID: ${item.id}`)}
    >
      <View className="flex-row items-center">
        <View className="mr-4">{getStatusIcon(item.status)}</View>
        <View>
          <Text className="text-lg text-white font-semibold">Jone</Text>
          <Text className="text-gray-200">
            {format(item.date, "MM/dd/yyyy HH:mm")}
          </Text>
        </View>
      </View>
      <Text
        className={`text-sm font-bold ${
          item.status === "Delivered"
            ? "text-blue-500"
            : item.status === "Picked Up"
            ? "text-orange-500"
            : item.status === "Cancelled"
            ? "text-red-500"
            : item.status === "Returned"
            ? "text-purple-500"
            : "text-gray-500"
        }`}
      >
        {item.status}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary p-4">
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        contentContainerStyle={{ width: "100%" }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Images Selected"
            subtitle="Please select an image to add in the bookings list"
            style="mt-16"
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full p-4  ">
            <Text className="font-pextrabold text-white mt-8 text-3xl text-center">
              Assigned Bookings
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
