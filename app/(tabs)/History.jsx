import React from "react";
import { View, Text, FlatList, SafeAreaView, Image } from "react-native";
import EmptyState from "@/components/EmptyState";
import BookingCard from "../../components/BookingCard";
import useGlobalContext from "@/context/GlobalProvider";
import { images } from "@/constants";
import { useRouter } from "expo-router";

export default function History() {
  const { bookings, setSelectedBooking, user } = useGlobalContext();
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
          <View className="flex my-6 px-4 space-y-6 mt-12 h-20">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100 capitalize">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white capitalize">
                  {user?.firstName}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logo}
                  className="w-32 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
