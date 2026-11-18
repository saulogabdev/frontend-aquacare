import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import AquarioCard from "@/components/AquarioCard";
import AquarioForm from "@/components/AquarioForm";
import { useAquarioContext,  } from "@/contexts/AquarioContext";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Diagnostico } from "@/types/registro";
import { buscarDiagnostico } from "@/services/aquarioService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import DiagnosticoCard from "@/components/DiagnosticoCard";

export default function Index() {
  const { aquarios, idSelecionado, adicionarAquario, selecionarAquario, erro, carregando } = useAquarioContext();
  const aquarioSelecionado = aquarios.find((a) => a.id === idSelecionado);
  const listaVazia = !carregando && erro === "" && aquarios.length === 0;
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
  const [carregandoDiagnostico, setCarregandoDiagnostico] = useState<boolean>(false);
  const [erroDiagnostico, setErroDiagnostico] = useState("");
  const { token, sair } = useAuthContext();

  useFocusEffect(
    useCallback(() => {
      async function carregarDiagnostico() {
        if (token === null) return;
        setCarregandoDiagnostico(true);
        setErroDiagnostico("");
        try {
          const novoDiagnostico = await buscarDiagnostico(token, idSelecionado);
          setDiagnostico(novoDiagnostico);
        } catch (error) {
          if (ehSessaoExpirada(error)) {
            await sair(MENSAGEM_SESSAO_EXPIRADA);
            return;
          }
          if (error instanceof Error) {
            setErroDiagnostico(error.message);
          }
        } finally {
          setCarregandoDiagnostico(false);
        }
      }
      carregarDiagnostico();
    }, [token, sair, idSelecionado])
  );

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <Text>AQUARIO SELECIONADO: {aquarioSelecionado?.nome}</Text>
      <AquarioForm onSalvar={adicionarAquario} />

      {carregando && (
        <View style={styles.aviso}>
          <ActivityIndicator color="#0891b2" />
          <Text style={styles.textoAviso}>Carregando aquários...</Text>
        </View>
      )}

      {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

      {listaVazia && (
        <Text style={styles.textoAviso}>Você ainda não tem aquários. Cadastre o primeiro!</Text>
      )}

      {aquarios.map((aquario) => (
        <AquarioCard key={aquario.id} aquario={aquario} onPress={() => selecionarAquario(aquario.id)} ativo={aquario.id === idSelecionado} />
      ))}

      {carregandoDiagnostico && <Text>Carregando diagnóstico...</Text>}
      {erroDiagnostico !== "" && <Text>{erroDiagnostico}</Text>}
      {diagnostico && <DiagnosticoCard diagnostico={diagnostico} />}
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
  aviso: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  textoAviso: {
    color: "#6b7280",
    textAlign: "center",
  },
  erro: {
    color: "#dc2626",
    textAlign: "center",
  },
});
