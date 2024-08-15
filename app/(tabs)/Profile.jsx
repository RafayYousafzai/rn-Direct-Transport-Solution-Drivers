import useGlobalContext from "@/context/GlobalProvider";
import { View, Text, Image, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import FeatureCard from "@/components/common/FeatureCard";
import { signOut } from "@/lib/firebase/functions/auth";
import { icons } from "@/constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { uploadImages, updateBooking } from "@/lib/firebase/functions/post";

const img = "https://cdn-icons-png.flaticon.com/512/4128/4128176.png";
const resetPasswordLink = "https://dts.courierssydney.com.au/ResetPassword";

const Profile = () => {
  const { user, setIsLoggedIn } = useGlobalContext();
  const { firstName, email, phone, pfp } = user || {}; // Destructuring with a fallback to avoid undefined errors
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const _handlePressButtonAsync = async () => {
    try {
      const result = await WebBrowser.openBrowserAsync(resetPasswordLink);
      console.log(result);
    } catch (error) {
      console.error("Error opening browser:", error);
    }
  };

  const handleSnout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      router.push("signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handlePfp = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        allowsMultipleSelection: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets.length > 0) {
        setIsLoading(true);

        const newUri = result.assets[0].uri;

        const url = await uploadImages(newUri);
        await updateBooking("users", email, {
          ...user,
          pfp: url,
        });

        setSuccessMessage("Profile picture updated successfully!");
      }
    } catch (error) {
      setSuccessMessage("Something went wrong!");
      console.error("Error uploading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      <View className="items-center">
        <Pressable
          onPress={handlePfp}
          disabled={isLoading}
          className={
            isLoading ? " animate-pulse" : "w-24 h-24 rounded-full"
          }
        >
          <Image
            source={{ uri: pfp || img }}
            className="w-24 h-24 rounded-full mb-4"
          />
        </Pressable>
        <Text className="text-2xl font-bold text-gray-800">{firstName}</Text>
        <Text className="text-lg text-gray-600 mt-2">{email}</Text>
        <Text className="text-lg text-gray-600 mt-2">{phone}</Text>
      </View>
      <View className=" w-full mt-36">
        <Pressable onPress={_handlePressButtonAsync} disabled={isLoading}>
          <FeatureCard
            title="Reset your account password!"
            value="Reset Password"
            icon={icons.pencil}
          />
        </Pressable>
        <Pressable onPress={handleSnout} disabled={isLoading}>
          <FeatureCard
            title="Logout from your account!"
            value="Sign out"
            icon={icons.cancel}
          />
        </Pressable>
      </View>
      {successMessage ? (
        <Text className="text-green-500 text-lg mt-4">{successMessage}</Text>
      ) : null}
    </View>
  );
};

export default Profile;
