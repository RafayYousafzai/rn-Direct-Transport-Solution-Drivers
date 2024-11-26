import React, { useState } from "react";
import { FlatList, SafeAreaView } from "react-native";
import EmptyState from "@/components/EmptyState";
import BookingCard from "@/components/BookingCard";
import useGlobalContext from "@/context/GlobalProvider";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import Header from "@/components/Header";
import Pagination from "@/components/common/Pagination";

const itemsPerPage = 5;

export default function Completed() {
  const { bookings, setSelectedBooking } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const futureBookings = useMemo(() => {
    return bookings.filter((booking) => {
      return booking.currentStatus === "delivered";
    });
  }, [bookings]);

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return futureBookings.slice(startIndex, endIndex);
  }, [currentPage, futureBookings]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary  ">
      <FlatList
        data={paginatedBookings}
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
            title="No Complete Bookings"
            subtitle="You have no completed booking today."
            style="mt-16"
          />
        )}
        ListHeaderComponent={() => (
          <Header
            title={"Completed Bookings"}
            subtitle={` ${futureBookings.length} Deliveries`}
          />
        )}
        ListFooterComponent={() => (
          <Pagination
            data={futureBookings}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        )}
      />
    </SafeAreaView>
  );
}
