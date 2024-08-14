import { View, Text, Image } from "react-native";
import { images } from "@/constants";

export default function Header({ title, subtitle }) {
  return (
    <View className="flex my-6  space-y-6 h-20 mt-12">
      <View className="flex justify-between items-start flex-row mb-6">
        <View className="mt-1.5">
          <Image
            source={images.logo}
            className="w-32 h-10"
            resizeMode="contain"
          />
        </View>
        <View>
          <Text className="font-pmedium text-sm text-slate-700 capitalize">
            {title}
          </Text>
          <Text className="text-2xl font-psemibold text-slate-800 capitalize">
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
}
