import useGlobalContext from "@/context/GlobalProvider";
import { View, Text, Image, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";

const img = "https://cdn-icons-png.flaticon.com/512/4128/4128176.png";
const resetPasswordLink = "https://dts.courierssydney.com.au/ResetPassword";

const Profile = () => {
  const { user } = useGlobalContext();
  const { firstName, email } = user;

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(resetPasswordLink);
    console.log(result);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <View className="items-center">
        <Image source={{ uri: img }} className="w-24 h-24 rounded-full mb-4" />
        <Text className="text-2xl font-bold text-gray-800">{firstName}</Text>
        <Text className="text-lg text-gray-600 mt-2">{email}</Text>
      </View>

      <TouchableOpacity
        onPress={_handlePressButtonAsync}
        className="mt-8 bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white text-lg">Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
