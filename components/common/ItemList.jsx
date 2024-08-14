import React from "react";
import { View, Text } from "react-native";

const ItemList = ({ items, title }) => {
  return (
    <View className="bg-white rounded-md shadow-lg  mt-4">
      <Text className="text-2xl font-extrabold text-gray-900  my-6 text-center">
        {title}
      </Text>
      <View>
        {items.map((item, index) => (
          <View
            key={index}
            className="mx-2 bg-blue-50 rounded-xl p-5 mb-4 shadow-sm border border-blue-200"
          >
            <View className="flex flex-row justify-between ">
              <Text className="text-lg font-bold text-blue-900 mb-2">
                {item.type}
              </Text>
              <Text className="text-md font-bold text-blue-900  mt-1">
                Quantity: {item.qty}
              </Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-base text-gray-700">
                Weight: {item.weight} kg
              </Text>
              <Text className="text-base text-gray-700">
                Width: {item.width} cm
              </Text>
            </View>
            <View className="flex flex-row justify-between mt-2">
              <Text className="text-base text-gray-700">
                Length: {item.length} cm
              </Text>
              <Text className="text-base text-gray-700">
                Height: {item.height} cm
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ItemList;
