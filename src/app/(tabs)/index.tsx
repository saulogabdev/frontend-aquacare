import { Text, View, StyleSheet } from "react-native";

import AquarioCard from "@/components/AquarioCard";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Dashboard</Text>
      <AquarioCard nome="Aquário Amazônico" litragem={100} tipoAgua="DOCE"/>
      <AquarioCard nome="Aquário de Corais" litragem={60} tipoAgua="MARINHO"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
});
