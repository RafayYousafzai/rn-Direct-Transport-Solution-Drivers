import React from "react";
import { View, Text, FlatList, SafeAreaView, Image } from "react-native";
import EmptyState from "@/components/EmptyState";
import BookingCard from "../../components/BookingCard";
import useGlobalContext from "@/context/GlobalProvider";
import { images } from "@/constants";
import { useRouter } from "expo-router";
import { parse, startOfDay, isBefore, isFuture } from "date-fns";
import { useMemo } from "react";

export default function History() {
  const { bookings, setSelectedBooking } = useGlobalContext();
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

  const pastBookings = useMemo(() => {
    const today = startOfDay(new Date());
    return bookings.filter((booking) => {
      if (!booking.date) return false;
      const bookingDate = parseDate(booking.date);
      return bookingDate && isBefore(bookingDate, today);
    });
  }, [bookings]);

  // const futureBookings = useMemo(() => {
  //   const today = startOfDay(new Date());
  //   // || booking.createdAt < today
  //   return bookings.filter((booking) => {
  //     if (!booking.date) return false;
  //     const bookingDate = parseDate(booking.date);
  //     return bookingDate && isFuture(bookingDate) && bookingDate > today;
  //   });
  // }, [bookings]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary p-4">
      <FlatList
        data={pastBookings}
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
            title="No Bookings History"
            subtitle="You have no bookings assigned to you today."
            style="mt-16"
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 space-y-6 mt-12 h-20">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100 capitalize">
                  Well Done! You Completed
                </Text>
                <Text className="text-2xl font-psemibold text-white capitalize">
                  {pastBookings.length} Deliveries
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
          </View>
        )}
      />
    </SafeAreaView>
  );
}
