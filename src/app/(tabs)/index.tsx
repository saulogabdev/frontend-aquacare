import { StyleSheet, Text, View } from "react-native";

import AquarioCard from "@/components/AquarioCard";
import AquarioForm from "@/components/AquarioForm";
import { useAquarioContext } from "@/contexts/AquarioContext";

export default function Index() {
  const { aquarios, idSelecionado, adicionarAquario, selecionarAquario } = useAquarioContext();
  const aquarioSelecionado = aquarios.find((a) => a.idAquario === idSelecionado);

  return (
    <View style={styles.container}>
      <Text>AQUARIO SELECIONADO: {aquarioSelecionado?.nome}</Text>
      <AquarioForm onSalvar={adicionarAquario} />
      {aquarios.map((aquario) => (
        <AquarioCard key={aquario.idAquario} aquario={aquario} onPress={() => selecionarAquario(aquario.idAquario)} ativo={aquario.idAquario === idSelecionado} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 20,
  }
});
