import React from "react";
import { View, Text, FlatList, SafeAreaView, Image } from "react-native";
import EmptyState from "@/components/EmptyState";
import BookingCard from "../../components/BookingCard";
import useGlobalContext from "@/context/GlobalProvider";
import { useRouter } from "expo-router";
import { images } from "@/constants";
import { useMemo } from "react";
import { startOfDay, isToday, parse } from "date-fns";

export default function History() {
  const { bookings, setSelectedBooking, user } = useGlobalContext();
  const router = useRouter();

  const parseDate = (dateString) => {
    try {
      const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
      return startOfDay(parsedDate);
    } catch (error) {
      console.error("Error parsing date:", error, "Date string:", dateString);
      return null;
    }
  };

  const todaysBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        if (!booking.date) return false;
        const bookingDate = parseDate(booking.date);
        return bookingDate && isToday(bookingDate);
      }),
    [bookings]
  );

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary p-4">
      <FlatList
        data={todaysBookings}
        keyExtractor={(item) => item.docId}
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
            subtitle="Please select an image to add in the bookings list"
            style="mt-16"
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6 h-20 mt-12">
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