import React, { useState } from "react";
import { Text, SafeAreaView, FlatList, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "../../components/common/ImageViewer";
import CustomButton from "../../components/common/CustomButton";
import EmptyState from "../../components/EmptyState";

const Pod = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([result.assets[0].uri, ...selectedImages]);
    } else {
      console.log("You did not select any image.");
    }
  };

  const removeImage = (uri) =>
    setSelectedImages(selectedImages.filter((image) => image !== uri));

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary">
      <FlatList
        data={selectedImages}
        keyExtractor={(item) => item}
        contentContainerStyle={{ width: 350 }}
        renderItem={({ item }) => (
          <>
            <ImageViewer
              placeholderImageSource=""
              selectedImage={item}
              styles="w-full h-60 mt-6"
            />
            <Pressable
              onPress={() => removeImage(item)}
              className="w-full bg-red-600 rounded-lg mt-2 p-2"
            >
              <Text className="mx-auto font-pregular text-lg">
                Remove this image
              </Text>
            </Pressable>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Images Selected"
            subtitle="Please select an image to add in the bookings list"
          />
        )}
        ListHeaderComponent={() => (
          <>
            {selectedImages.length > 0 && (
              <CustomButton
                title="Add to Booking"
                handlePress={() => null}
                containerStyles="w-full mt-8"
                textStyles="text-white"
                isLoading={false}
              />
            )}
            <CustomButton
              title="Select an image"
              handlePress={pickImageAsync}
              containerStyles="w-full mt-8"
              textStyles="text-white"
            />
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default Pod;
