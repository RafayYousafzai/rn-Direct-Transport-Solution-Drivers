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
import { useEffect, useState } from "react";
import { router } from "expo-router";
import PicturePicker from "@/components/PicturePicker";
import { uploadImages, updateBooking } from "@/lib/firebase/functions/post";
import ItemList from "../../components/common/ItemList";

function CustomButton({ onPress, loading, disabled, children }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`h-12 mt-3 items-center flex flex-row justify-center rounded-lg ${
        loading || disabled ? "bg-gray-400" : "bg-green-600"
      }`}
    >
      <Text className="text-center text-white font-semibold">{children}</Text>
      {loading && <ActivityIndicator />}
    </Pressable>
  );
}

export default function Booking() {
  const { selectedBooking } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const updateStatus = async () => {
    setLoading(true);
    const currentDateTime = format(new Date(), "MM/dd/yyyy HH:mm:ss");
    try {
      const updatedData = {
        ...selectedBooking,
        progressInformation: {
          ...selectedBooking.progressInformation,
          pickedup: currentDateTime,
        },
        currentStatus: "pickedup",
      };
      await updateBooking("place_bookings", selectedBooking.docId, updatedData);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(selectedBooking.pickupImages);

  const handlePickupImages = async () => {
    if (!selectedImages?.length) return;

    setLoading(true);

    try {
      const images = await Promise.all(
        selectedImages.map(async (image) => {
          const url = await uploadImages(image);
          return url;
        })
      );

      await updateBooking("place_bookings", selectedBooking.docId, {
        ...selectedBooking,
        pickupImages: images,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePickupImages();
  }, [selectedImages]);

  return (
    <SafeAreaView className=" bg-primary h-full  ">
      <ScrollView className="px-4" vertical>
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <View>
            <View className="bg-white rounded-lg shadow-md">
              <Text className="text-sm text-gray-500">
                Customer:{" "}
                <Text className="font-semibold">
                  {selectedBooking?.userName}
                </Text>
              </Text>
              <Text className="text-sm text-gray-500">
                Ref:{" "}
                <Text className="font-semibold">
                  {selectedBooking?.pickupReference1 || "Ref Not Provided"}
                </Text>
              </Text>
            </View>
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-900">
              {selectedBooking?.id}
            </Text>
            <Text className="text-base text-gray-800">
              Job Code: {selectedBooking?.returnType || "N/A"}
            </Text>
          </View>
        </View>

        {/* Pickup Section */}
        <Text className="text-lg font-semibold text-gray-800 mt-8">
          {selectedBooking?.pickupSuburb || "Pickup Suburb"}
        </Text>
        <View className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
          <Text className="text-sm text-gray-600">
            {selectedBooking?.address?.Origin?.label || "Pickup Address"}
          </Text>
          <Text className="text-sm text-gray-600">
            Pick Phone: {selectedBooking?.pickupPhone || "N/A"}
          </Text>
          {selectedBooking?.currentStatus === "allocated" ||
          selectedBooking?.currentStatus === "Allocated" ? (
            <CustomButton onPress={updateStatus} loading={loading}>
              {loading ? "Processing" : "Pickup Job"}
            </CustomButton>
          ) : (
            <CustomButton disabled>Picked Up</CustomButton>
          )}
        </View>

        {/* Drop Section */}
        <Text className="text-lg font-semibold text-gray-800 mt-8">
          {selectedBooking?.deliverySuburb || "Drop Suburb"}
        </Text>
        <View className="mt-4 p-4 bg-white rounded-lg shadow-md border border-gray-300">
          <Text className="text-sm text-gray-600">
            {selectedBooking?.address?.Destination?.label || "Drop Address"}
          </Text>
          <Text className="text-sm text-gray-600">
            Drop Reference: {selectedBooking?.deliveryIns || "N/A"}
          </Text>
          <Text className="text-sm text-gray-600">
            Drop Phone: {selectedBooking?.deliveryPhone || "N/A"}
          </Text>
        </View>

        <ItemList title={"Items"} items={selectedBooking.items} />

        {/* Pickup Images Section */}
        <View className="mb-4">
          {selectedBooking?.progressInformation?.pickedup ? (
            selectedBooking?.pickupImages?.length > 0 ? (
              <>
                <CustomButton
                  onPress={() => router.push("pod")}
                  loading={loading}
                >
                  {loading ? "Loading..." : "Complete Delivery"}
                </CustomButton>
              </>
            ) : (
              <PicturePicker
                title="Please Add Pick Up Images To Continue."
                setSelectedImages={setSelectedImages}
              />
            )
          ) : (
            <CustomButton disabled>Picked Up</CustomButton>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
