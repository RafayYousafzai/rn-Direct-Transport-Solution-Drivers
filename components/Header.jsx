import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { images } from "@/constants";

export default function Header() {
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSydneyTime = async (retryCount = 3) => {
    try {
      setError(false); // Reset error state
      const response = await fetch(
        "https://timeapi.io/api/Time/current/zone?timeZone=Australia/Sydney"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Sydney time");
      }

      const data = await response.json();
      const dateTime = new Date(data.dateTime);
      const formattedDate = dateTime.toLocaleDateString("en-AU", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      const formattedTime = dateTime.toLocaleTimeString("en-AU", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setCurrentDateTime({ date: formattedDate, time: formattedTime });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Sydney time:", err);

      if (retryCount > 0) {
        console.log(`Retrying... Attempts left: ${retryCount}`);
        setTimeout(() => fetchSydneyTime(retryCount - 1), 2000); // Retry after 2 seconds
      } else {
        setError(true);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSydneyTime(); // Initial fetch
    const interval = setInterval(() => fetchSydneyTime(), 60000); // Update every minute
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
        {loading ? (
          <ActivityIndicator size="small" color="#1384e1" />
        ) : error ? (
          <Text className="text-red-500 text-center font-semibold">
            Failed to fetch time
          </Text>
        ) : (
          <>
            <Text className="text-right font-psemibold text-slate-800 text-lg">
              {currentDateTime?.date}
            </Text>
            <Text className="text-right font-psemibold text-slate-800 text-base">
              {currentDateTime?.time}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}
