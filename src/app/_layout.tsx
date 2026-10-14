import { Stack } from "expo-router";
import { AquarioProvider } from "@/contexts/AquarioContext";
import { RegistroProvider } from "@/contexts/RegistroContext";

export default function RootLayout() {
  return (
    <AquarioProvider>
      <RegistroProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        </Stack>
      </RegistroProvider>
    </AquarioProvider>
  );
}
