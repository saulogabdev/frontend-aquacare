import { Text, View, StyleSheet } from "react-native";

export default function Especies() {
    return (
        <View style={styles.container}>
            <Text>Espécies</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});