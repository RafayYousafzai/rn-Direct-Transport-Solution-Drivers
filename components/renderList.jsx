import { View, Text } from "react-native";
import React from "react";

export default function renderList(title, items) {
  return (
    <>
      <Text className="text-3xl font-pbold text-white my-4">{title}</Text>
      {items.map((item, index) => (
        <View className="flex flex-row my-2 " key={index}>
          <Text className="font-psemibold text-xl text-white">
            {item?.label || "Soon"}
          </Text>
          <Text className="font-psemibold ml-auto text-xl text-white">
            {item?.value || "Soon"}
          </Text>
        </View>
      ))}
    </               >
  );
}
