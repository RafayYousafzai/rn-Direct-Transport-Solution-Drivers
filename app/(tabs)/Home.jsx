import { Text, ScrollView, Pressable } from "react-native";
import React, { useMemo } from "react";
import useGlobalContext from "@/context/GlobalProvider";
import { startOfDay, isToday, parse, isBefore, isFuture } from "date-fns";
import { icons } from "@/constants";
import Header from "@/components/Header";
import FeatureCard from "@/components/common/FeatureCard";

const Dashboard = () => {
  const { bookings, user } = useGlobalContext();

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

  const futureBookings = useMemo(() => {
    const today = startOfDay(new Date());
    return bookings.filter((booking) => {
      if (!booking.date) return false;
      const bookingDate = parseDate(booking.date);
      return bookingDate && isFuture(bookingDate) && bookingDate > today;
    });
  }, [bookings]);

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
    <ScrollView className="flex bg-primary">
      <Header title={"Welcome Back"} subtitle={user?.firstName} />

      <Text className="text-lg ml-2 font-pextrabold text-slate-700 mb-3">
        Dashboard
      </Text>

      <FeatureCard
        href="/Today"
        title="Today's Deliveries"
        value={todaysBookings.length}
        icon={icons.today}
      />
      <FeatureCard
        href="/Future"
        title="Future Deliveries"
        value={futureBookings.length}
        icon={icons.future}
      />
      <FeatureCard
        href="/History"
        title="Deliveries Completed"
        value={
          bookings.filter((booking) => booking.currentStatus === "delivered")
            .length
        }
        icon={icons.approved}
      />
      <FeatureCard
        href="/History"
        title="Deliveries Cancelled"
        value={
          bookings.filter((booking) => booking.currentStatus === "cancelled")
            .length
        }
        icon={icons.cancel}
      />
    </ScrollView>
  );
};

export default Dashboard;
