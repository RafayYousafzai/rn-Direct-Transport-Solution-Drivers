import useGlobalContext from "@/context/GlobalProvider";
import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import FeatureCard from "@/components/common/FeatureCard";
import { signOut } from "@/lib/firebase/functions/auth";
import { icons } from "@/constants";

const img = "https://cdn-icons-png.flaticon.com/512/4128/4128176.png";
const resetPasswordLink = "https://dts.courierssydney.com.au/ResetPassword";

const Profile = () => {
  const { user } = useGlobalContext();
  const { firstName, email } = user;

  const _handlePressButtonAsync = async () => {
    let result = await WebBrowser.openBrowserAsync(resetPasswordLink);
    console.log(result);
  };

  const handleSnout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      router.push("signin");
    } catch (error) {
      setIsLoggedIn(false);
      console.log(error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <View className="items-center">
        <Image source={{ uri: img }} className="w-24 h-24 rounded-full mb-4" />
        <Text className="text-2xl font-bold text-gray-800">{firstName}</Text>
        <Text className="text-lg text-gray-600 mt-2">{email}</Text>
      </View>
      <View className=" w-full mt-36">
        <Pressable onPress={_handlePressButtonAsync}>
          <FeatureCard
            title="Reset your account password!"
            value="Reset Password"
            icon={icons.pencil}
          />
        </Pressable>
        <Pressable onPress={handleSnout}>
          <FeatureCard
            title="Logout from your account!"
            value="Sign out"
            icon={icons.cancel}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default Profile;
