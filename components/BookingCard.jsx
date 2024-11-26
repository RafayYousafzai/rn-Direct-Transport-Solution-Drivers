import { Pressable, Text, View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import truncateWithEllipsis from "@/utils/truncateWithEllipsis";

const BookingCard = ({ item, setSelectedBooking, router }) => {
  const getStatusIcon = (status) => {
    // Replace this with actual logic to return an icon based on status
    return <MaterialIcons name="info" size={24} color="white" />;
  };

  return (
    <Pressable
      onPress={() => {
        setSelectedBooking(item);
        router.push("details");
      }}
      className="p-4 m-[2%] bg-secondary rounded-lg shadow-xl flex-row items-center"
    >
      <View className="flex-row items-center">
        {/* <View className="mr-4">{getStatusIcon(item.currentStatus)}</View> */}
        <View className="flex-1 flex flex-wrap flex-row">
          <View className="w-1/3 ">
            <Text className="text-sm uppercase text-white font-semibold">
              {item.id}
            </Text>
            <Text className="text-slate-100 text-sm mb-1">
              {item.returnType}
            </Text>
          </View>
          <View className="w-1/3">
            <Text className="text-sm uppercase text-white font-semibold">
              {item.pickupSuburb}
            </Text>
            <Text className="text-slate-100 text-sm mb-1 capitalize">
              {truncateWithEllipsis(item.address.Origin.label, 10)}
            </Text>
          </View>
          <View className="w-1/3 ">
            <Text className="text-sm uppercase text-white font-semibold">
              {item.deliverySuburb}
            </Text>
            <Text className="text-slate-100 text-sm mb-1">
              {truncateWithEllipsis(item.address.Destination.label, 10)}
            </Text>
          </View>
        </View>
        <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
      </View>
    </Pressable>
  );
};

export default BookingCard;
