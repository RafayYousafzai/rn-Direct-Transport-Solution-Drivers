import { StatusBar } from "expo-status-bar";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import renderList from "../../components/renderList";
import useGlobalContext from "@/context/GlobalProvider";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function Booking() {
  const { selectedBooking } = useGlobalContext();

  const BookingInfo = [
    {
      label: "Pickup Company Name",
      value: selectedBooking?.pickupCompanyName,
    },
    {
      label: "Pickup Address",
      value: selectedBooking?.address?.Origin?.label,
    },
    {
      label: "Pickup Reference",
      value: selectedBooking?.pickupReference1,
    },
    {
      label: "Drop Company Name",
      value: selectedBooking?.dropCompanyName,
    },
    {
      label: "Delivery Address",
      value: selectedBooking?.address?.Destination?.label,
    },
    {
      label: "Delivery Instructions",
      value: selectedBooking?.deliveryIns,
    },
  ];

  const obInfo = [
    { label: "Job No.", value: selectedBooking?.docId },
    {
      label: "Job Type",
      value: selectedBooking?.returnType,
    },
    { label: "Service", value: selectedBooking?.service },
    { label: "Name", value: selectedBooking?.userName },
    { label: "Email", value: selectedBooking?.userEmail },
  ];
  const UserInfo = [
    { label: "Date", value: selectedBooking?.date },
    { label: "Time", value: selectedBooking?.time },
    { label: "Contact", value: selectedBooking?.contact },
    { label: "Internal Reference", value: selectedBooking?.internalReference },
  ];

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

  return (
    <SafeAreaView className="px-4 bg-primary h-full">
      <StatusBar backgroundColor="#f1faee" style="light" />
      <ScrollView vertical={true}>
        <View className="my-20">
          {/* <Text className="font-pblack text-slate-800 text-sm mb-4">
            Booking Details
          </Text>
          <View className=" flex-row   ">
            {getStatusIcon(selectedBooking?.currentStatus || "")}
            <Text className="font-pblack uppercase mt-[2px] text-slate-800 text-md mb-4">
              {selectedBooking?.currentStatus || ""}
            </Text>
          </View> */}
          {renderList("Job Details", obInfo)}
          {renderList("More Details", UserInfo)}
          {renderList("Address Details", BookingInfo)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
