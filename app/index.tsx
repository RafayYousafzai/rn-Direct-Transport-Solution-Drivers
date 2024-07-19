import { Link, useNavigation } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <Text className="text-secondary-100 font-pextrabold text-4xl">
        DTS Driver App.
      </Text>
      <Link
        className="bg-secondary-100 py-6 px-16 rounded-md m-4"
        href={"/signin"}
      >
        Go
      </Link>
    </View>
  );
}
