import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";

const Pagination = ({ data, currentPage, setCurrentPage, itemsPerPage }) => {
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View className="flex-row justify-between mt-4">
      <TouchableOpacity
        onPress={handlePreviousPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg ${
          currentPage === 1 ? "bg-gray-300" : "bg-blue-500"
        }`}
      >
        <Text className="text-white">Previous</Text>
      </TouchableOpacity>

      <Text className="text-lg text-gray-800">
        Page {currentPage} of {totalPages}
      </Text>

      <TouchableOpacity
        onPress={handleNextPage}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg ${
          currentPage === totalPages ? "bg-gray-300" : "bg-blue-500"
        }`}
      >
        <Text className="text-white">Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
