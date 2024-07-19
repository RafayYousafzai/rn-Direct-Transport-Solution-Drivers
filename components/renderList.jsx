import { View, Text } from "react-native";
import React from "react";

export default function renderList(title, items) {
  return (
    <View className="mb-8 px-4">
      <Text className="text-3xl font-pmedium text-white my-1">{title}</Text>
      {items.map((item, index) => (
        <View className="flex flex-row my-2 " key={index}>
          <Text className="font-psemibold text-xl text-secondary-200">
            {item?.label || "Soon"}
          </Text>
          <Text className="font-psemibold ml-auto text-xl text-secondary-200">
            {item?.value || "Soon"}
          </Text>
        </View>
      ))}
    </View>
  );
}
