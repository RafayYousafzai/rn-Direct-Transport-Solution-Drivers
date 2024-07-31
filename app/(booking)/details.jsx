import { StatusBar } from "expo-status-bar";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import renderList from "../../components/renderList";
import useGlobalContext from "@/context/GlobalProvider";

export default function Booking() {
  const { selectedBooking } = useGlobalContext();

  const BookingInfo = [
    { label: "User Name", value: selectedBooking?.userName },
    { label: "Time", value: selectedBooking?.time },
    { label: "Service", value: selectedBooking?.service },
    { label: "Date", value: selectedBooking?.date },
    { label: "Contact", value: selectedBooking?.contact },
    { label: "Job No.", value: selectedBooking?.docId },
    { label: "User Email", value: selectedBooking?.userEmail },
  ];

  const UserInfo = [
    { label: "User Name", value: selectedBooking?.userName },
    { label: "Time", value: selectedBooking?.time },
    { label: "Service", value: selectedBooking?.service },
    { label: "Date", value: selectedBooking?.date },
    { label: "Contact", value: selectedBooking?.contact },
    { label: "Job No.", value: selectedBooking?.docId },
    { label: "User Email", value: selectedBooking?.userEmail },
  ];

  return (
    <SafeAreaView className="px-4 bg-primary h-full">
      <ScrollView vertical={true}>
        <View className="my-20">
          <Text className="font-pblack text-white text-sm">
            Booking Details
          </Text>
          {renderList("User Details", UserInfo)}
          {renderList("Booking Details", BookingInfo)}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
