import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  FlatList,
  Pressable,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ImageViewer from "../../components/common/ImageViewer";
import CustomButton from "../../components/common/CustomButton";
import EmptyState from "../../components/EmptyState";
import { icons } from "../../constants";

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
          <View className="relative">
            <ImageViewer
              placeholderImageSource=""
              selectedImage={item}
              styles="w-full h-60 mt-6"
            />

            <TouchableOpacity
              className="absolute top-7 right-2"
              onPress={() => removeImage(item)}
            >
              <Image
                source={icons.remove}
                resizeMode="contain"
                alt="remove"
                className="w-8 h-8  "
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Images Selected"
            subtitle="Please select an image to add in the bookings list"
            style="mt-16"
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-16">
            {selectedImages.length > 0 && (
              <CustomButton
                title="Add to Booking"
                handlePress={() => null}
                isLoading={false}
              />
            )}

            <View className="mt-7 space-y-2">
              <Text className="text-base text-gray-100 font-pmedium">
                Thumbnail Image
              </Text>

              <TouchableOpacity onPress={pickImageAsync}>
                <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose a file
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Pod;
