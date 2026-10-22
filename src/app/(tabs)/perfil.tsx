import { View, Text, StyleSheet, Pressable } from "react-native";
import { login } from "@/services/usuarioService"

export default function Perfil() {
  async function testarApi() {
    try {
      const token = await login("saulo@teste.com", "123456");
      console.log("Token:", token)
    } catch (erro) {
      if (erro instanceof Error) {
        console.log("Erro:", erro.message)
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text>Perfil</Text>
      <Pressable onPress={testarApi} style={styles.botao}>
          <Text>Testar API (provisório)</Text>
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