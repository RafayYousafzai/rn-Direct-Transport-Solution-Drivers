import React, { useState } from "react";
import { View, Text, Pressable, SafeAreaView } from "react-native";
import { format } from "date-fns";

const statuses = [
  "Allocated",
  "Picked Up",
  "Delivered",
  "Returned",
  "Cancelled",
];

export default function Status() {
  const invoice = { currentStatus: "Allocated", progressInformation: {} };
  const [booking, setBooking] = useState(invoice);

  const [loading, setLoading] = useState(false);

  const currentStatus = booking.currentStatus;

  const updateStatus = async (newStatus) => {
    setLoading(true);

    const currentDateTime = format(new Date(), "MM/dd/yyyy HH:mm:ss");

    const updatedData = {
      ...booking,
      progressInformation: {
        ...booking.progressInformation,
        [newStatus]: currentDateTime,
      },
      currentStatus: newStatus,
    };

    setBooking(updatedData);
    console.log(updatedData);

    try {
      //   await updateDoc("place_bookings", booking.docId, updatedData);
    } catch (error) {
      console.error("Error updating status:", error);
    }

    setLoading(false);
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
              className={`text-center ${
                currentStatus === status ? "text-white" : "text-black"
              }`}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}
