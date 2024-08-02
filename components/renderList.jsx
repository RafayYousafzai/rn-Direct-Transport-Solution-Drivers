import { View, Text } from "react-native";
import React from "react";

export default function renderList(title, items) {
  return (
    <View className=" bg-gray-900 rounded-lg shadow-md">
      <Text className="text-3xl font-bold text-white my-4">{title}</Text>
      <View className="p-4 bg-gray-800 rounded-md">
        {items.map((item, index) => (
          <View className="flex flex-row items-center my-2 " key={index}>
            <Text className="font-black text-lg text-slate-200 w-1/2 ">
              {item?.label || "---"}{" "}
            </Text>
            <Text className="font-semibold ml-auto text-lg text-slate-300 w-1/2">
              {item?.value || "---"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
