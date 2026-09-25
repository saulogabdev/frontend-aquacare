import { Text, View, StyleSheet } from "react-native";

export default function Lembretes() {
    return (
        <View style={styles.container}>
            <Text>Lembretes</Text>
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
