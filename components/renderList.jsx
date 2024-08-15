import { View, Text } from "react-native";
import React from "react";

export default function renderList(title, items) {
  return (
    <View className="mb-2 bg-primary  rounded-lg shadow-md">
      <Text className="text-3xl font-bold text-slate-800 my-4">{title}</Text>
      <View className=" bg-primary  px-2 rounded-md">
        {items.map((item, index) => (
          <View className="flex flex-row items-center my-2 " key={index}>
            <Text className="font-black text-lg text-slate-800 w-1/2 ">
              {item?.label || "---"}{" "}
            </Text>
            <Text className="font-semibold ml-auto text-lg text-slate-700  w-1/2">
              {item?.value || "---"}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
