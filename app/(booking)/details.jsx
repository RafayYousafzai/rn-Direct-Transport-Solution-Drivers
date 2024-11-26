import {
  View,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useGlobalContext from "@/context/GlobalProvider";
import { format } from "date-fns";
import { updateBooking } from "@/lib/firebase/functions/post";
import { useState } from "react";
import { router } from "expo-router";

export default function Booking() {
  const { selectedBooking } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    setLoading(true);
    const currentDateTime = format(new Date(), "MM/dd/yyyy HH:mm:ss");
    const newStatus = "pickedup";
    try {
      const updatedData = {
        ...selectedBooking,
        progressInformation: {
          ...selectedBooking.progressInformation,
          [newStatus]: currentDateTime,
        },
        currentStatus: newStatus,
      };
      await updateBooking("place_bookings", selectedBooking.docId, updatedData);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="px-4 bg-primary h-full pt-10">
      <ScrollView vertical={true}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center ">
          <View>
            <View className="bg-white rounded-lg shadow-md">
              {/* Code Section */}
              <Text className="text-sm text-gray-500">
                Code:{" "}
                <Text className="font-semibold">
                  {selectedBooking?.userName}
                </Text>
              </Text>
              <Text className="text-sm text-gray-500">
                Ref:{"    "}
                <Text className="font-semibold">
                  {selectedBooking?.pickupReference1 || "No Ref Provided"}
                </Text>
              </Text>
            </View>
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              {selectedBooking?.id}
            </Text>
            <Text className="text-base text-gray-800">
              Tracking: {selectedBooking?.returnType || "N/A"}
            </Text>
          </View>
        </View>

        {/* Main Job Details */}

        {/* Pickup Section */}
        <Text className="text-lg font-semibold text-gray-800 mt-8">
          {selectedBooking?.address?.Origin?.suburb || "Pickup Suburb"}
        </Text>
        <View className="mt-4 p-4 bg-white rounded-lg shadow-md   border border-gray-300">
          <Text className="text-sm text-gray-600">
            {selectedBooking?.address?.Origin?.label || "Pickup Address"}
          </Text>
          <Text className="text-sm text-gray-600 mt-2">
            {/* Items: {selectedBooking?.items || "No items listed"} */}
          </Text>
          {selectedBooking?.currentStatus !== "pickedup" ? (
            <Pressable
              onPress={updateStatus}
              disabled={loading} // Disable while loading
              className={`  py-2 h-12 items-center flex flex-row justify-center rounded-lg ${
                loading ? "bg-gray-400" : "bg-green-600"
              }`}
            >
              <Text className="   text-center align-middle text-white font-semibold">
                {loading ? "Processing" : "Pickup Job"}{" "}
              </Text>
              {loading && <ActivityIndicator />}
            </Pressable>
          ) : (
            <Pressable
              disabled
              className="mt-4 bg-gray-400  h-12 items-center flex flex-row justify-center py-2 rounded-lg"
            >
              <Text className="text-center text-white font-semibold">
                Picked Up
              </Text>
            </Pressable>
          )}
        </View>
        {/* Pickup Button */}

        {/* Drop Section */}
        <Text className="text-lg font-semibold text-gray-800 mt-8">
          {selectedBooking?.address?.Destination?.suburb || "Drop Suburb"}
        </Text>
        <View className="mt-4 p-4 bg-white rounded-lg shadow-md   border border-gray-300">
          <Text className="text-sm text-gray-600">
            {selectedBooking?.address?.Destination?.label || "Drop Address"}
          </Text>
          <Text className="text-sm text-gray-600 mt-2">
            Drop Reference: {selectedBooking?.dropReference || "N/A"}
          </Text>
          <Text className="text-sm text-gray-600">
            Drop Phone: {selectedBooking?.deliveryPhone || "N/A"}
          </Text>
        </View>

        {selectedBooking?.currentStatus === "pickedup" ? (
          <Pressable
            onPress={() => router.push("pod")}
            disabled={loading}
            className={`mt-20  py-2 h-12 items-center flex flex-row justify-center rounded-lg ${
              loading ? "bg-gray-400" : "bg-green-600"
            }`}
          >
            <Text className="   text-center align-middle text-white font-semibold">
              Next
            </Text>
          </Pressable>
        ) : (
          <Pressable
            disabled
            className="mt-4 bg-gray-400  h-12 items-center flex flex-row justify-center py-2 rounded-lg"
          >
            <Text className="text-center text-white font-semibold">
              Picked Up
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
