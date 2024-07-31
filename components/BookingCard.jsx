import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const getStatusIcon = (status) => {
  console.log(status);
  switch (status) {
    case "pickedup":
      return <FontAwesome5 name="truck" size={21} color="#ffddd2" />;
    case "delivered":
      return (
        <Ionicons name="checkmark-done-circle" size={24} color="#83c5be" />
      );
    case "returned":
      return <FontAwesome name="undo" size={21} color="#b892ff" />;
    case "cancelled":
      return <Ionicons name="close-circle" size={24} color="#e63946" />;
    default:
      return <Ionicons name="cube" size={24} color="orange" />;
  }
};

const BookingCard = ({ item, setSelectedBooking, router }) => {
  return (
    <Pressable
      onPress={() => {
        setSelectedBooking(item);
        router.push("details");
      }}
      className="w-full p-4 my-2 bg-slate-800 rounded-lg shadow-md flex-row items-center justify-between"
    >
      <View className="flex-row items-center w-full">
        <View className="mr-4">{getStatusIcon(item.currentStatus)}</View>
        <View className=" w-full">
          <Text className="text-lg text-white font-semibold">
            {item.contact}
          </Text>
          <Text className="text-gray-200 text-sm mb-1">{item.userEmail}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs font-bold uppercase ${
                item.status === "pickedup"
                  ? "text-blue-500"
                  : item.status === "returned"
                  ? "text-orange-500"
                  : item.status === "cancelled"
                  ? "text-red-500"
                  : item.status === "delivered"
                  ? "text-purple-500"
                  : "text-gray-500"
              }`}
            >
              {item.currentStatus}
            </Text>
            <Text className="text-gray-200  ml-auto mr-10">{item.date}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default BookingCard;
