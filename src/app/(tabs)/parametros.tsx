import { View, Text, StyleSheet } from "react-native";

export default function Parametros() {
    return (
        <View style={styles.container}>
            <Text>Parâmetros</Text>
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