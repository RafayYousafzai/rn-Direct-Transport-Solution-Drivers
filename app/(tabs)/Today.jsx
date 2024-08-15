import React, { useState, useMemo } from "react";
import { FlatList, SafeAreaView } from "react-native";
import EmptyState from "@/components/EmptyState";
import BookingCard from "@/components/BookingCard";
import useGlobalContext from "@/context/GlobalProvider";
import { useRouter } from "expo-router";
import { startOfDay, isToday, parse } from "date-fns";
import Header from "@/components/Header";
import Pagination from "@/components/common/Pagination";

const itemsPerPage = 5;

export default function History() {
  const { bookings, setSelectedBooking } = useGlobalContext();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

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

  // Calculate paginated data based on current page
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return todaysBookings.slice(startIndex, endIndex);
  }, [currentPage, todaysBookings]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary p-4">
      <FlatList
        data={paginatedBookings}
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
            title="No Bookings Assigned for Today"
            subtitle="You have no bookings assigned to you today."
            style="mt-16"
          />
        )}
        ListHeaderComponent={() => (
          <Header
            title={"Today's Bookings "}
            subtitle={` ${todaysBookings.length} Deliveries`}
          />
        )}
        ListFooterComponent={() => (
          <Pagination
            data={todaysBookings}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        )}
      />
    </SafeAreaView>
  );
}
