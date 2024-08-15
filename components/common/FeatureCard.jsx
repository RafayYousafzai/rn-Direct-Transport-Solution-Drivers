import { Image, Text, View } from "react-native";

const FeatureCard = ({ title, value, icon }) => (
  <View
    className="bg-secondary
     shadow-xl rounded-xl p-5 mb-4 flex-row items-center justify-between  border-l-4 border-slate-300"
  >
    <View className="flex-row items-center">
      <View className="bg-white p-3 rounded-full shadow-lg flex items-center justify-center">
        <Image source={icon} resizeMode="contain" className="w-6 h-6" />
      </View>
      <View className="ml-4">
        <Text className="text-slate-100 text-sm font-medium">{title}</Text>
        <Text className="text-2xl font-semibold text-slate-200 mt-1">
          {value}
        </Text>
      </View>
    </View>
  </View>
);

export default FeatureCard;
