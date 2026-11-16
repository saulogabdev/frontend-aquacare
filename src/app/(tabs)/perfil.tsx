import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAuthContext } from "@/contexts/AuthContext";

export default function Perfil() {
  const { sair } = useAuthContext();

  return (
    <View style={styles.container}>
      <Text>Perfil</Text>
      <Pressable onPress={() => sair()} style={styles.botao}>
          <Text>Sair</Text>
      </Pressable>
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  botao: {
    padding: 12,
    backgroundColor: "#cffafe",
    borderRadius: 8
  },
});