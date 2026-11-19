import { Stack } from "expo-router";
import { AquarioProvider } from "@/contexts/AquarioContext";
import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";
import { RegistroProvider } from "@/contexts/RegistroContext";
import { EspecieProvider } from "@/contexts/EspecieContext";

function NavegacaoRaiz() {
  const { token, carregando } = useAuthContext();

  if (carregando) {
    return null;
  }

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
          <EspecieProvider>
            <NavegacaoRaiz/>
          </EspecieProvider>
        </RegistroProvider>
      </AquarioProvider>
    </AuthProvider>
  );
}
