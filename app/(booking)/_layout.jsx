import { Tabs } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { icons } from "@/constants";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Optional: For a nice back arrow icon

export default function BookingLayout() {
  const navigation = useNavigation();

  const TabIcon = ({ icon, color, name, focused }) => {
    return (
      <View className="flex items-center justify-center gap-2">
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className="w-6 h-6"
        />
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{ color: color }}
        >
          {name}
        </Text>
      </View>
    );
  };

  const HeaderWithBackButton = ({ title }) => {
    return (
      <View className="flex flex-row items-center p-4 mt-6 bg-primary">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#0055bc" />
        </TouchableOpacity>
        <Text className="font-psemibold text-lg">{title}</Text>
      </View>
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#0055bc",
          tabBarInactiveTintColor: "#adb5bd",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#f1faee",
            borderTopWidth: 1,
            borderTopColor: "#ced4da",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="details"
          options={{
            header: () => <HeaderWithBackButton title="Details" />,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.docs}
                color={color}
                name="Details"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="pod"
          options={{
            header: () => <HeaderWithBackButton title="POD" />,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.photo}
                color={color}
                name="POD"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="status"
          options={{
            header: () => <HeaderWithBackButton title="Status" />,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.circle}
                color={color}
                name="Status"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#f1faee" style="light" />
    </>
  );
}
