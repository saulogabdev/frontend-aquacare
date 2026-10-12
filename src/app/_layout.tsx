import { Stack } from "expo-router";
import { AquarioProvider } from "@/contexts/AquarioContext";

export default function RootLayout() {
  return (
    <AquarioProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
      </Stack>
    </AquarioProvider>
  );
}
