import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import useGlobalContext from "@/context/GlobalProvider";
import { images } from "@/constants";

const DashboardCard = ({ title, value, icon }) => (
  <View className="bg-black-200
   shadow-lg rounded-xl p-5 mb-4 flex-row items-center justify-between border-l-4 border-teal-500">
    <View className="flex-row items-center">
      <View className="bg-teal-500 p-3 rounded-full shadow-lg flex items-center justify-center">
        {icon}
      </View>
      <View className="ml-4">
        <Text className="text-slate-100 text-sm font-medium">{title}</Text>
        <Text className="text-2xl font-semibold text-slate-200 mt-1">{value}</Text>
      </View>
    </View>
    <View className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
      <Text className="text-gray-400 text-xs">i</Text>
    </View>
  </View>
);







const Dashboard = () => {
  const { bookings, user } = useGlobalContext();

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
        value="125"
        icon={<Text className="text-blue-500 text-3xl">📅</Text>}
      />
      <DashboardCard
        title="Future Deliveries"
        value="30"
        icon={<Text className="text-yellow-500 text-3xl">⏳</Text>}
      />
      <DashboardCard
        title="Completed Deliveries"
        value="95"
        icon={<Text className="text-green-500 text-3xl">✔️</Text>}
      />
      <DashboardCard
        title="Cancelled Deliveries"
        value="10"
        icon={<Text className="text-red-500 text-3xl">❌</Text>}
      />
    </ScrollView>
  );
};

export default Dashboard;
