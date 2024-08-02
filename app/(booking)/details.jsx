import { StatusBar } from "expo-status-bar";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import renderList from "../../components/renderList";
import useGlobalContext from "@/context/GlobalProvider";

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

  return (
    <SafeAreaView className="px-4 bg-primary h-full">
      <StatusBar backgroundColor="#161622" style="light" />
      <ScrollView vertical={true}>
        <View className="my-20">
          <Text className="font-pblack text-white text-sm mb-4">
            Booking Details
          </Text>
          {renderList("Job Details", obInfo)}
          {renderList("More Details", UserInfo)}
          {renderList("Address Details", BookingInfo)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
