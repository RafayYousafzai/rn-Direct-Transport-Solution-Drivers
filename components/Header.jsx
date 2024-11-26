import { View, Text, Image } from "react-native";
import { images } from "@/constants";
import { format } from "date-fns";
import { useState, useEffect } from "react";

export default function Header() {
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "MMM dd, yyyy")
  );
  const [currentTime, setCurrentTime] = useState(format(new Date(), "hh:mm a"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(format(new Date(), "MMM dd, yyyy"));
      setCurrentTime(format(new Date(), "hh:mm a"));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex mb-2 h-20 mt-8 px-[4%] flex-row items-center justify-between">
      {/* Logo */}
      <Image
        source={images.logo}
        className="w-[160px] h-[50px]"
        resizeMode="contain"
      />

      {/* Date and Time */}
      <View>
        <Text className="text-right font-psemibold text-slate-800 text-lg">
          {currentDate}
        </Text>
        <Text className="text-right font-psemibold text-slate-800 text-base">
          {currentTime}
        </Text>
      </View>
    </View>
  );
}
