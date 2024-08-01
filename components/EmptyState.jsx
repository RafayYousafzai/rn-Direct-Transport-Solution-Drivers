import { router } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "../constants";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle, style }) => {
  return (
    <View className={`flex justify-center items-center px-4 ${style}`}>
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[180px]"
      />

      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>

      <CustomButton
        title="Back to Home"
        handlePress={() => router.push("/Home")}
        containerStyles="w-full my-5"
      />
    </View>
  );
};

export default EmptyState;
