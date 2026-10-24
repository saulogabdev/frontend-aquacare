import { Stack } from "expo-router";
import { AquarioProvider } from "@/contexts/AquarioContext";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { RegistroProvider } from "@/contexts/RegistroContext";

function NavegacaoRaiz() {
  const { token } = useAuthContext();

  return (
    <Stack>
      <Stack.Protected guard={token !== null}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={token === null}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AquarioProvider>
        <RegistroProvider>
          <NavegacaoRaiz/>
        </RegistroProvider>
      </AquarioProvider>
    </AuthProvider>
  );
}
