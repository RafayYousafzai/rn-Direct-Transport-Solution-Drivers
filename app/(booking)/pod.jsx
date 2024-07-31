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
import useGlobalContext from "@/context/GlobalProvider";

const Pod = () => {
  const { selectedBooking } = useGlobalContext();

  const [selectedImages, setSelectedImages] = useState([]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prevImages) => [...newUris, ...prevImages]);
    } else {
      console.log("You did not select any image.");
    }
  };

  const pickCameraAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prevImages) => [...newUris, ...prevImages]);
    } else {
      console.log("You did not select any image.");
    }
  };

  const removeImage = (uri) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((image) => image !== uri)
    );
  };

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

              <View className="w-full p-4 bg-black-100 rounded-xl border-2 border-transparent flex justify-around items-center flex-row space-x-4">
                <TouchableOpacity
                  onPress={pickImageAsync}
                  className="flex justify-center items-center"
                >
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-8 h-8 mb-1"
                  />
                  <Text className="text-xs text-gray-100 font-plight">
                    Choose a file
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={pickCameraAsync}
                  className="flex justify-center items-center"
                >
                  <Image
                    source={icons.camera}
                    resizeMode="contain"
                    alt="camera"
                    className="w-8 h-8 mb-1"
                  />
                  <Text className="text-xs text-gray-100 font-plight">
                    Take a photo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Pod;
