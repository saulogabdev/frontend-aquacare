import { View, Text, StyleSheet } from "react-native";
import { useAquarioContext } from "@/contexts/AquarioContext";

export default function Parametros() {
    const {aquarios, idSelecionado} = useAquarioContext();
    const aquarioSelecionado = aquarios.find((a) => a.idAquario === idSelecionado);

    return (
        <View style={styles.container}>
            <Text>Monitorando: {aquarioSelecionado?.nome}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});