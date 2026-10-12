import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";

import AquarioCard from "@/components/AquarioCard";
import { Aquario, TipoAgua } from "@/types";
import { useState } from "react";

const aquariosIniciais: Aquario[] = [
  { idAquario: 1, nome: "Aquário Amazônico", litragem: 100, tipoAgua: "DOCE", nivelPlanta: "MEDIO", dataMontagem: "2023-01-01", isCiclado: true, injecaoCO2: false },
  { idAquario: 2, nome: "Aquário de Corais", litragem: 60, tipoAgua: "MARINHO", nivelPlanta: "BAIXO", dataMontagem: "2023-01-01", isCiclado: false, injecaoCO2: false },
  { idAquario: 3, nome: "Aquário de Plantas", litragem: 80, tipoAgua: "DOCE", nivelPlanta: "ALTO", dataMontagem: "2023-01-01", isCiclado: true, injecaoCO2: true },
];

const opcoesTipoAgua: { valor: TipoAgua; rotulo: string }[] = [
  { valor: "DOCE", rotulo: "Doce" },
  { valor: "MARINHO", rotulo: "Marinho" },
];

export default function Index() {
  const [idSelecionado, setIdSelecionado] = useState(1);
  const [aquarios, setAquarios] = useState<Aquario[]>(aquariosIniciais);
  const [nome, setNome] = useState("");
  const [litragem, setLitragem] = useState("");
  const [tipoAgua, setTipoAgua] = useState<TipoAgua>("DOCE");

  const aquarioSelecionado = aquarios.find((a) => a.idAquario === idSelecionado);

  function adicionarAquario() {
    const litros = Number(litragem);
    if (nome.trim() === "" || !(litros > 0)) {
      return;
    }

    const novoAquario: Aquario = {
      idAquario: Date.now(),
      nome: nome.trim(),
      litragem: litros,
      tipoAgua: tipoAgua,
      nivelPlanta: "NENHUM",
      dataMontagem: new Date().toISOString(),
      isCiclado: false,
      injecaoCO2: false,
    };
    setAquarios([...aquarios, novoAquario]);
    setNome("");
    setLitragem("");
    setTipoAgua("DOCE");
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.campo} placeholder="Nome do aquário" value={nome} onChangeText={setNome}/>
      <TextInput style={styles.campo} placeholder="Litragem" value={litragem} onChangeText={setLitragem} keyboardType="numeric"/>
      <View style={styles.opcoes}>
        {opcoesTipoAgua.map((opcao) => {
          const selecionada = opcao.valor === tipoAgua;
          return (
            <Pressable
              key={opcao.valor}
              style={[styles.opcao, selecionada && styles.opcaoSelecionada]}
              onPress={() => setTipoAgua(opcao.valor)}
            >
              <Text style={[styles.textoOpcao, selecionada && styles.textoOpcaoSelecionada]}>
                {opcao.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable style={styles.botaoAdicionar} onPress={adicionarAquario}>
        <Text style={styles.textoBotaoAdicionar}>Adicionar</Text>
      </Pressable>

      <Text>AQUÁRIO ATIVO: {aquarioSelecionado?.nome}</Text>
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
  campo: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
  },
  botaoAdicionar: {
    backgroundColor: "#0891b2",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  textoBotaoAdicionar: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  opcoes: {
    flexDirection: "row",
    gap: 8,
  },
  opcao: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  opcaoSelecionada: {
    borderColor: "#06b6d4",
    backgroundColor: "#ecfeff",
  },
  textoOpcao: {
    color: "#6b7280",
    fontWeight: "600",
  },
  textoOpcaoSelecionada: {
    color: "#0891b2",
  },
});
