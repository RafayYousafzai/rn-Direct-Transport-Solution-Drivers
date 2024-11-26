import { View, Text, Image } from "react-native";
import { images } from "@/constants";

export default function Header({ title, subtitle }) {
  return (
    <View className="flex mb-2 space-y-6 h-20 mt-12 px-[4%]">
      <View className="flex justify-between items-start flex-row mb-6">
        <View className="">
          <Image
            source={images.logo}
            className="w-[160px] h-[50px]"
            resizeMode="contain"
          />
        </View>
        <View>
          <Text className="font-pmedium text-md text-slate-700 capitalize">
            {title}
          </Text>
          <Text className="text-xl text-right font-psemibold text-slate-800 capitalize">
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}
