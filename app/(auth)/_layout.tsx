import useGlobalContext from "@/context/GlobalProvider";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function AuthLayout() {
  const { isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (isLoggedIn) {
      router.navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <>
      <Stack>
        <Stack.Screen
          name="signin"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#f1faee" style="light" />
    </>
  );
}
