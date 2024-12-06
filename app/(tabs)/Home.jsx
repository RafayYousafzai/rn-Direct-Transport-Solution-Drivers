import { Text, ScrollView, Pressable } from "react-native";
import React, { useMemo } from "react";
import useGlobalContext from "@/context/GlobalProvider";
import { startOfDay, isToday, parse, isBefore, isFuture } from "date-fns";
import { icons } from "@/constants";
import Header from "@/components/Header";
import FeatureCard from "@/components/common/FeatureCard";
import { unregisterIndieDevice } from "native-notify";
import { signOut } from "@/lib/firebase/functions/auth";
import { router } from "expo-router";
import LocationTracker from "@/components/TrackUpdates/LocationTracker";

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
      return (
        (bookingDate && isBefore(bookingDate, today)) ||
        booking.currentStatus === "delivered"
      );
    });
  }, [bookings]);

  const futureBookings = useMemo(() => {
    return bookings.filter((booking) => {
      return booking.currentStatus === "delivered";
    });
  }, [bookings]);

  const todaysBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        if (!booking.date) return false;
        const bookingDate = parseDate(booking.date);
        return (
          bookingDate &&
          isToday(bookingDate) &&
          (booking.currentStatus === "allocated" ||
            booking.currentStatus === "Allocated" ||
            booking.currentStatus === "pickedup")
        );
      }),
    [bookings]
  );
  const handleSignOut = async () => {
    try {
      const res = unregisterIndieDevice(
        user.email,
        23374,
        "hZawrJYXBzBbQZgTgLVsZP"
      );
      console.log({ res });

      await signOut();
      router.replace("signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <ScrollView className="flex bg-primary">
      <LocationTracker />
      <Header title={"Welcome Back"} subtitle={user?.firstName} />

      <Text className="text-lg ml-2 font-pextrabold text-slate-700 mb-3">
        Dashboard
      </Text>

      <FeatureCard
        href="/Active"
        title="Active Deliveries"
        value={todaysBookings.length}
        icon={icons.today}
      />
      <FeatureCard
        href="/Completed"
        title="Completed Deliveries"
        value={futureBookings.length}
        icon={icons.future}
      />
      <FeatureCard
        href="/History"
        title="Work History"
        value={pastBookings.length}
        icon={icons.approved}
      />
      {/* <FeatureCard
        href="/History"
        title="Deliveries Cancelled"
        value={
          bookings.filter((booking) => booking.currentStatus === "cancelled")
            .length
        }
        icon={icons.cancel}
      /> */}
      <Pressable onPress={handleSignOut}>
        <FeatureCard
          title="Logout from your account!"
          value="Sign out"
          icon={icons.cancel}
        />
      </Pressable>
    </ScrollView>
  );
};

export default Dashboard;
