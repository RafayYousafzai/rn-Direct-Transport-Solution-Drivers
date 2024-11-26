import React from "react";
import * as ImagePicker from "expo-image-picker";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { icons } from "@/constants";

export default function PicturePicker({ setSelectedImages, title }) {
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prevImages) => [...newUris, ...prevImages]);
    }
  };

  const pickCameraAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const newUris = result.assets.map((asset) => asset.uri);
      setSelectedImages((prevImages) => [...newUris, ...prevImages]);
    }
  };

  return (
    <View className="my-6 ">
      <View className="  space-y-2">
        <Text className="text-base text-slate-700 font-pmedium">{title}</Text>

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
            <Text className="text-xs text-slate-700 font-plight">
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
            <Text className="text-xs text-slate-700 font-plight">
              Take a photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
