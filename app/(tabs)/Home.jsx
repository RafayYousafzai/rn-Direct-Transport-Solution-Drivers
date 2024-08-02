import { View, Text, ScrollView, Image, Pressable } from "react-native";
import React, { useMemo } from "react";
import useGlobalContext from "@/context/GlobalProvider";
import { startOfDay, isToday, parse, isBefore, isFuture } from "date-fns";
import { images } from "@/constants";
import { icons } from "@/constants";
import { signOut } from "@/lib/firebase/functions/auth";
import { useRouter } from "expo-router";

const DashboardCard = ({ title, value, icon }) => (
  <View
    className="bg-black-200
   shadow-lg rounded-xl p-5 mb-4 flex-row items-center justify-between border-l-4 border-teal-500"
  >
    <View className="flex-row items-center">
      <View className="bg-teal-500 p-3 rounded-full shadow-lg flex items-center justify-center">
        <Image source={icon} resizeMode="contain" className="w-6 h-6" />
      </View>
      <View className="ml-4">
        <Text className="text-slate-100 text-sm font-medium">{title}</Text>
        <Text className="text-2xl font-semibold text-slate-200 mt-1">
          {value}
        </Text>
      </View>
    </View>
    {/* <View className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
      <Text className="text-gray-400 text-xs">i</Text>
    </View> */}
  </View>
);

const Dashboard = () => {
  const { bookings, user, setIsLoggedIn } = useGlobalContext();
  const router = useRouter();

  // console.log(user);

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

  const handleSnout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      router.push("signin");
    } catch (error) {
      setIsLoggedIn(false);
      console.log(error);
    }
  };

  return (
    <ScrollView className="flex bg-primary p-4">
      <View className="flex my-6  space-y-6 h-20 mt-12">
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
      </View>
      <Text className="text-lg font-pextrabold text-gray-100 mb-3">
        Dashboard
      </Text>

      <DashboardCard
        title="Today's Deliveries"
        value={todaysBookings.length}
        icon={icons.today}
      />
      <DashboardCard
        title="Future Deliveries"
        value={futureBookings.length}
        icon={icons.future}
      />
      <DashboardCard
        title="Deliveries Completed"
        value={
          bookings.filter((booking) => booking.currentStatus === "delivered")
            .length
        }
        icon={icons.approved}
      />
      <DashboardCard
        title="Deliveries Cancelled"
        value={
          bookings.filter((booking) => booking.currentStatus === "cancelled")
            .length
        }
        icon={icons.cancel}
      />
      <Pressable onPress={handleSnout}>
        <DashboardCard
          title="Press here to logout from your account!"
          value="Sign out"
          icon={icons.logout}
        />
      </Pressable>
    </ScrollView>
  );
};

export default Dashboard;
