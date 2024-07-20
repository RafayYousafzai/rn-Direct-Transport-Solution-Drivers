import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import renderList from "../../components/renderList";
import CustomButton from "../../components/CustomButton";

export default function Booking() {
  const [form, setForm] = useState({
    contact: "",
    email: "",
    service: "Standard",
    date: "",
    time: "12:00 AM",
    dropReference1: "",
    pickupReference1: "",
    items: [],
    distanceData: {},
    address: {
      Origin: {},
      Destination: {},
    },
    deliveryIns: "",
    docId: "",
    userName: "",
    userEmail: "",
  });

  const BookingInfo = [
    { label: "User Name", value: form.userName },
    { label: "Time", value: form.time },
    { label: "Service", value: form.service },
    { label: "Date", value: form.date },
    { label: "Contact", value: form.contact },
    { label: "Job No.", value: form.docId },
    { label: "User Email", value: form.userEmail },
  ];

  const UserInfo = [
    { label: "User Name", value: form.userName },
    { label: "Time", value: form.time },
    { label: "Service", value: form.service },
    { label: "Date", value: form.date },
    { label: "Contact", value: form.contact },
    { label: "Job No.", value: form.docId },
    { label: "User Email", value: form.userEmail },
  ];

  return (
    <SafeAreaView className="px-4 bg-primary h-full">
      <ScrollView  vertical={true}>
        <View className="mt-20">
          <Text className=" font-pblack text-gray-100 text-sm">
            Booking Details
          </Text>
        </View>
        {renderList("User Details", UserInfo)}
        {renderList("Booking Details", BookingInfo)}
        <CustomButton title={"ADD POD"} containerStyles={"m-2"} />
        <CustomButton title={"Change Status"} containerStyles={"m-2"} />
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
