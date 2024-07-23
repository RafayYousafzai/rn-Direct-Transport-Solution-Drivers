import useGlobalContext from "@/context/GlobalProvider";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, SafeAreaView } from "react-native";

export default function index() {
  const { isLoggedIn, isLoading } = useGlobalContext();

  return (
    <SafeAreaView className="flex-1 bg-primary pt-40">
      {isLoading ? (
        <Text className="text-white ">Loading...</Text>
      ) : (
        <>
          {isLoggedIn ? (
            <>
              <Text className="text-white">Welcome</Text>
              <Link className="text-white" href={"/details"}>
                Dashboard
              </Link>
            </>
          ) : (
            <Link className="text-white" href={"/signin"}>
              Sign In
            </Link>
          )}
        </>
      )}
      <StatusBar />
    </SafeAreaView>
  );
}
