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
        className="w-[300px] h-[300px]"
      />

      <Text className="text-sm font-pmedium text-slate-700">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-slate-800 mt-2">
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
