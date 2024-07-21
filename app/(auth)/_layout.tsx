import useGlobalContext from "@/context/GlobalProvider";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function AuthLayout() {
  const { isLoggedIn } = useGlobalContext();

  useEffect(() => {
    if (isLoggedIn) {
      router.navigate("/Dashboard");
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

      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
}
