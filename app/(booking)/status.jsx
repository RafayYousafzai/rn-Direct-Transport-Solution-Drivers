import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { format } from "date-fns";
import useGlobalContext from "@/context/GlobalProvider";
import { updateBooking } from "@/lib/firebase/functions/post";

const statuses = ["pickedup", "delivered", "returned", "cancelled"];

export default function Status() {
  const { selectedBooking, setSelectedBooking } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const currentStatus = selectedBooking.currentStatus;

  const updateStatus = async (newStatus) => {
    setLoading(true);

    const currentDateTime = format(new Date(), "MM/dd/yyyy HH:mm:ss");

    const updatedData = {
      ...selectedBooking,
      progressInformation: {
        ...selectedBooking.progressInformation,
        [newStatus]: currentDateTime,
      },
      currentStatus: newStatus,
    };

    try {
      await updateBooking("place_bookings", selectedBooking.docId, updatedData);
      setSelectedBooking(updatedData);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary p-4">
      <Text className="text-3xl text-yellow-50 font-pextrabold mb-4">
        Change Status
      </Text>
      <View className="w-full flex flex-col items-center">
        {statuses.map((status, index) => (
          <Pressable
            key={index}
            onPress={() => updateStatus(status)}
            className={`w-[90%] p-4 my-2 rounded-xl ${
              currentStatus === status ? "bg-secondary-100" : "bg-secondary"
            }`}
          >
            <Text
              className={`text-center capitalize ${
                currentStatus === status ? "text-white" : "text-black"
              }`}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </View>
      {loading && (
        <ActivityIndicator size="large" color="#FBBF24" className="mt-4" />
      )}
    </SafeAreaView>
  );
}
