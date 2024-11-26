import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

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

  // Don't render pagination controls if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <View className="flex-row items-center justify-center space-x-4 mt-6">
      {/* Previous Button */}
      <TouchableOpacity
        onPress={handlePreviousPage}
        disabled={currentPage === 1}
        className={`px-5 py-3 rounded-full shadow-md w-24 texts ${
          currentPage === 1 ? "bg-gray-300" : "bg-indigo-500"
        }`}
      >
        <Text
          className={`text-sm ${
            currentPage === 1 ? "text-gray-500" : "text-white"
          }`}
        >
          Previous
        </Text>
      </TouchableOpacity>

      {/* Page Indicator */}
      <View className="px-6 py-3 rounded-full bg-gray-200 shadow-sm">
        <Text className="text-lg font-medium text-gray-800">
          Page {currentPage} of {totalPages}
        </Text>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={handleNextPage}
        disabled={currentPage === totalPages}
        className={`px-5 py-3 rounded-full shadow-md w-24 texts ${
          currentPage === totalPages ? "bg-gray-300" : "bg-indigo-500"
        }`}
      >
        <Text
          className={`text-sm text-center ${
            currentPage === totalPages ? "text-gray-500" : "text-white"
          }`}
        >
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
