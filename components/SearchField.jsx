import { useState } from "react";
import { View, TouchableOpacity, Image, TextInput } from "react-native";

import { icons } from "../constants";

const SearchField = ({ initialQuery, handlePress }) => {
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-slate-200 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-slate-800 flex-1 font-pregular"
        value={query}
        placeholder="Search a video topic"
        placeholderTextColor="#343a40"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          handlePress(query);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchField;
