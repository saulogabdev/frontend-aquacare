import { Text, View, StyleSheet } from "react-native";

import AquarioCard from "@/components/AquarioCard";
import { Aquario } from "@/types";
import { useState } from "react";

const aquarios: Aquario[] = [
  { idAquario: 1, nome: "Aquário Amazônico", litragem: 100, tipoAgua: "DOCE", nivelPlanta: "MEDIO", dataMontagem: "2023-01-01", isCiclado: true, injecaoCO2: false },
  { idAquario: 2, nome: "Aquário de Corais", litragem: 60, tipoAgua: "MARINHO", nivelPlanta: "BAIXO", dataMontagem: "2023-01-01", isCiclado: false, injecaoCO2: false },
  { idAquario: 3, nome: "Aquário de Plantas", litragem: 80, tipoAgua: "DOCE", nivelPlanta: "ALTO", dataMontagem: "2023-01-01", isCiclado: true, injecaoCO2: true },
];


export default function Index() {
  const [idSelecionado, setIdSelecionado] = useState(1);

  return (
    <View style={styles.container}>
      <Text>AQUÁRIO ATIVO: {aquarios.find((a) => a.idAquario === idSelecionado)?.nome}</Text>
      {aquarios.map((aquario) => (
        <AquarioCard key={aquario.idAquario} aquario={aquario} onPress={() => setIdSelecionado(aquario.idAquario)} ativo={aquario.idAquario === idSelecionado}/>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    padding: 20,
  },
});
