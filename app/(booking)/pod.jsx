import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import { router } from "expo-router";
import Toast from "react-native-toast-message";
import useGlobalContext from "@/context/GlobalProvider";

import { uploadImages, updateBooking } from "@/lib/firebase/functions/post";
import SignatureWrapper from "@/components/signature/SignatureWrapper";
import CustomButton from "@/components/common/CustomButton";
import ImageViewer from "@/components/common/ImageViewer";
import PicturePicker from "@/components/PicturePicker";
import EmptyState from "@/components/EmptyState";
import FormField from "@/components/FormField";
import { icons } from "@/constants";
import { format } from "date-fns";

const Pod = () => {
  const { selectedBooking } = useGlobalContext();
  const defaultImages = selectedBooking?.images || [];
  const [name, setName] = useState(selectedBooking?.receiverName || "");
  const [selectedImages, setSelectedImages] = useState(defaultImages);
  const [isLoading, setIsLoading] = useState(false);

  const removeImage = (uri) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image !== uri)
    );
  };

  const handleCompleteDelivery = async () => {
    setIsLoading(true);

    try {
      const currentDateTime = format(new Date(), "MM/dd/yyyy HH:mm:ss");
      const images = await Promise.all(
        selectedImages.map(async (image) => {
          const url = await uploadImages(image);
          return url;
        })
      );

      const updatedData = {
        ...selectedBooking,
        progressInformation: {
          ...selectedBooking.progressInformation,
          delivered: currentDateTime,
        },
        currentStatus: "delivered",
        receiverName: name,
        images,
      };

      await updateBooking("place_bookings", selectedBooking.docId, updatedData);

      // Show a success toast
      Toast.show({
        type: "success",
        text1: "Delivery Completed!",
        text2: "Your delivery was successfully uploaded 🎉",
      });
      router.push("Home");
    } catch (error) {
      console.error("Error uploading images:", error);

      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary pt-5">
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
      >
        <View className="w-[90%]">
          <FormField
            value={name}
            placeholder="Write Receiver Name"
            handleChangeText={(e) => setName(e)}
            otherStyles="mb-2"
          />
        </View>

        {/* Picture Picker */}
        <View className="w-[90%] mb-4">
          <PicturePicker
            title="Select an image"
            setSelectedImages={setSelectedImages}
          />
        </View>

        {/* Selected Images */}
        {selectedImages.length > 0 ? (
          selectedImages.map((image, index) => (
            <View className="relative w-[90%] mt-4" key={index}>
              <ImageViewer
                placeholderImageSource=""
                selectedImage={image}
                styles="w-full h-60"
              />
              <TouchableOpacity
                className="absolute top-7 right-2"
                onPress={() => removeImage(image)}
              >
                <Image
                  source={icons.remove}
                  resizeMode="contain"
                  alt="remove"
                  className="w-8 h-8"
                />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <EmptyState
            title="No Images Selected"
            style="mt-16"
            hideBackButton={true}
          />
        )}

        {/* Signature */}
        <View className="w-[90%] mt-6">
          <SignatureWrapper />
        </View>

        <View className="w-[90%] mt-4">
          {selectedBooking?.progressInformation?.delivered ? (
            <CustomButton title="Booking Delivered" />
          ) : name === "" ||
            selectedImages.length === 0 ||
            !selectedBooking.signUrl ? (
            <CustomButton
              title="Complete Delivery"
              containerStyles="bg-gray-500"
            />
          ) : (
            <CustomButton
              title="Complete Delivery"
              handlePress={handleCompleteDelivery}
              containerStyles="bg-green-600"
              isLoading={isLoading}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pod;
