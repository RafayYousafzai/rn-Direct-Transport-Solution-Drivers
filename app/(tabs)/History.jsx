import React from "react";
import { View, Text, FlatList, SafeAreaView } from "react-native";
import EmptyState from "@/components/EmptyState";
import BookingCard from "../../components/BookingCard";
import useGlobalContext from "@/context/GlobalProvider";
import { useRouter } from "expo-router";

export default function History() {
  const { bookings, setSelectedBooking } = useGlobalContext();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary p-4">
      <FlatList
        data={bookings.filter(
          (booking) => booking.currentStatus === "delivered"
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookingCard
            item={item}
            setSelectedBooking={setSelectedBooking}
            router={router}
          />
        )}
        contentContainerStyle={{ width: "100%" }}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Images Selected"
            subtitle="No bookings yet!"
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
