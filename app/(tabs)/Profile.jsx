import useGlobalContext from "@/context/GlobalProvider";
import {
  View,
  Text,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as ImagePicker from "expo-image-picker";
import FeatureCard from "@/components/common/FeatureCard";
import { signOut } from "@/lib/firebase/functions/auth";
import { icons } from "@/constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import { uploadImages, updateBooking } from "@/lib/firebase/functions/post";
import { unregisterIndieDevice } from "native-notify";

const img = "https://cdn-icons-png.flaticon.com/512/4128/4128176.png";
const resetPasswordLink = "https://dts.courierssydney.com.au/ResetPassword";

const Profile = () => {
  const { user, setIsLoggedIn } = useGlobalContext();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handlePressButtonAsync = async () => {
    try {
      const result = await WebBrowser.openBrowserAsync(resetPasswordLink);
      console.log(result);
    } catch (error) {
      console.error("Error opening browser:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      const res = unregisterIndieDevice(
        user.email,
        23374,
        "hZawrJYXBzBbQZgTgLVsZP"
      );
      console.log({ res });

      // Alert.alert("unregisterIndieDevice");
      await signOut();
      setIsLoggedIn(false);
      router.push("signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleProfilePicture = async () => {
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
        await updateBooking("users", user?.email, {
          ...user,
          pfp: url,
        });
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-2xl font-bold text-gray-800">Profile</Text>
        <Text className="text-lg text-gray-600 mt-2">
          Please sign in to view your profile.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white ">
      <View className="items-center mt-20 ">
        <Pressable onPress={handleProfilePicture} disabled={isLoading}>
          <Image
            source={{ uri: user?.pfp || img }}
            className="w-24 h-24 rounded-full mb-4"
          />
        </Pressable>
        <Text className="text-2xl font-bold text-gray-800">
          {user?.firstName}
        </Text>
        <Text className="text-lg text-gray-600 mt-2">{user?.email}</Text>
        <Text className="text-lg text-gray-600 mt-2">{user?.phone}</Text>
        <Text className="text-lg text-gray-600 mt-2">
          {user?.companyAddress}
        </Text>
      </View>
      <ScrollView className="w-full">
        <View className="w-full mt-10">
          <Pressable onPress={handlePressButtonAsync} disabled={isLoading}>
            <FeatureCard
              title="Reset your account password!"
              value="Reset Password"
              icon={icons.pencil}
            />
          </Pressable>
          <Pressable onPress={handleSignOut} disabled={isLoading}>
            <FeatureCard
              title="Logout from your account!"
              value="Sign out"
              icon={icons.cancel}
            />
          </Pressable>
          <Pressable onPress={handleProfilePicture} disabled={isLoading}>
            <FeatureCard
              title="Change my profile picture"
              value="Profile Picture"
              uri={user?.pfp || img}
            />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
