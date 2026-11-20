import { ActivityIndicator, Text, StyleSheet, ScrollView, View } from "react-native";
import RegistroCard from "@/components/RegistroCard";
import { useAquarioContext } from "@/contexts/AquarioContext";
import { useRegistroContext } from "@/contexts/RegistroContext";
import RegistroForm, { MedicoesRegistro } from "@/components/RegistroForm";
import { Alerta, RegistroParametro } from "@/types/registro";
import { useCallback, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { listarRegistros } from "@/services/registroService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import { useFocusEffect } from "expo-router";

export default function Parametros() {
    const {aquarios, idSelecionado} = useAquarioContext();
    const {token, sair} = useAuthContext();
    const aquarioSelecionado = aquarios.find((a) => a.id === idSelecionado);
    const {adicionarRegistro} = useRegistroContext();
    const [alertasPorAquario, setAlertasPorAquario] = useState<Record<number, Alerta[]>>({});
    const alertas = idSelecionado !== null ? alertasPorAquario[idSelecionado] ?? null : null;
    const [registros, setRegistros] = useState<RegistroParametro[]>([]);
    const [carregandoRegistros, setCarregandoRegistros] = useState(false);
    const [erroRegistros, setErroRegistros] = useState<string>("");

    const recarregarRegistros = useCallback(async () => {
      if (token === null || idSelecionado === null) return;
      setCarregandoRegistros(true);
      setErroRegistros("");
      try {
        setRegistros(await listarRegistros(token, idSelecionado));
      } catch (error) {
        if (ehSessaoExpirada(error)) {
          await sair(MENSAGEM_SESSAO_EXPIRADA);
          return;
        }
        if (error instanceof Error) {
          setErroRegistros(error.message);
        }
      } finally {
        setCarregandoRegistros(false);
      }
    }, [token, idSelecionado, sair]);

    useFocusEffect(
      useCallback(() => {
        recarregarRegistros();
      }, [recarregarRegistros])
    );
    
    async function salvarRegistro(medicoes: MedicoesRegistro) {
        if (!aquarioSelecionado) {
            return;
        }
        const novosAlertas = await adicionarRegistro({
            idAquario: aquarioSelecionado.id,
            ...medicoes
        });
        setAlertasPorAquario({ ...alertasPorAquario, [aquarioSelecionado.id]: novosAlertas });
        await recarregarRegistros();
    }


    const registrosOrdenados = [...registros].sort((a, b) => b.dataHora.localeCompare(a.dataHora));

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
            <Text>Monitorando: {aquarioSelecionado?.nome}</Text>
            <RegistroForm onSalvar={salvarRegistro} />

            {/* null = ainda não registrou nada: não mostra nada */}
            {alertas !== null && alertas.length === 0 && (
                <View style={[styles.cartao, styles.tudoCerto]}>
                    <Text style={[styles.textoAlerta, styles.textoTudoCerto]}>
                        Tudo certo! Nenhum parâmetro fora do ideal.
                    </Text>
                </View>
            )}

            {alertas !== null && alertas.length > 0 && (
                <View style={styles.listaAlertas}>
                    <Text style={styles.tituloAlertas}>Alertas do último registro</Text>
                    {alertas.map((alerta, indice) => {
                        const critico = alerta.severidade === "CRITICO";
                        return (
                            <View key={indice} style={[styles.cartao, critico ? styles.critico : styles.atencao]}>
                                <Text style={[styles.rotulo, critico ? styles.textoCritico : styles.textoAtencao]}>
                                    {critico ? "Crítico" : "Atenção"}
                                </Text>
                                <Text style={[styles.textoAlerta, critico ? styles.textoCritico : styles.textoAtencao]}>
                                    {alerta.mensagem}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )}

            <Text style={styles.tituloAlertas}>Registros</Text>
            {carregandoRegistros && <ActivityIndicator color="#0891b2" />}
            {erroRegistros !== "" && <Text style={styles.textoCritico}>{erroRegistros}</Text>}
            {!carregandoRegistros && erroRegistros === "" && registrosOrdenados.length === 0 && (
                <Text style={styles.semRegistros}>Nenhum registro ainda. Faça a primeira medição acima.</Text>
            )}
            {registrosOrdenados.map((registro) => (
                <RegistroCard key={registro.idParametro} registro={registro} />
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  semRegistros: {
    color: "#6b7280",
  },
  conteudo: {
    gap: 12,
    padding: 20,
  },
  listaAlertas: {
    gap: 8,
  },
  tituloAlertas: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartao: {
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  critico: {
    backgroundColor: "#fee2e2",
  },
  atencao: {
    backgroundColor: "#fef3c7",
  },
  tudoCerto: {
    backgroundColor: "#dcfce7",
  },
  rotulo: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  textoAlerta: {
    fontSize: 14,
  },
  textoCritico: {
    color: "#b91c1c",
  },
  textoAtencao: {
    color: "#b45309",
  },
  textoTudoCerto: {
    color: "#15803d",
    fontWeight: "bold",
  },
});