import { ScrollView, StyleSheet, Text, View } from "react-native";

import AquarioCard from "@/components/AquarioCard";
import AquarioForm from "@/components/AquarioForm";
import { useAquarioContext } from "@/contexts/AquarioContext";

export default function Index() {
  const { aquarios, idSelecionado, adicionarAquario, selecionarAquario } = useAquarioContext();
  const aquarioSelecionado = aquarios.find((a) => a.idAquario === idSelecionado);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <Text>AQUARIO SELECIONADO: {aquarioSelecionado?.nome}</Text>
      <AquarioForm onSalvar={adicionarAquario} />
      {aquarios.map((aquario) => (
        <AquarioCard key={aquario.idAquario} aquario={aquario} onPress={() => selecionarAquario(aquario.idAquario)} ativo={aquario.idAquario === idSelecionado} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  conteudo: {
    gap: 12,
    padding: 20,
  },
});
