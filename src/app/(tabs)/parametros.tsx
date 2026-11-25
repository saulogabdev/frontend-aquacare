import { ActivityIndicator, Pressable, Text, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card, EstadoVazio, MensagemErro, Tela, TituloTela } from "@/components/ui";
import { cores, raio } from "@/theme";
import RegistroCard from "@/components/RegistroCard";
import { useAquarioContext } from "@/contexts/AquarioContext";
import { useRegistroContext } from "@/contexts/RegistroContext";
import RegistroForm, { MedicoesRegistro } from "@/components/RegistroForm";
import { Alerta, RegistroParametro } from "@/types/registro";
import { useCallback, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { listarRegistros } from "@/services/registroService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import { useFocusEffect, useRouter } from "expo-router";
import GraficoParametros from "@/components/GraficoParametros";
import ParametrosIdeaisCard from "@/components/ParametrosIdeaisCard";

export default function Parametros() {
    // SDK 58: o recomendado é pegar o router pelo hook, e não importar o objeto "router" direto.
    const router = useRouter();
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
        <Tela>
            <TituloTela
                titulo="Parâmetros"
                subtitulo={aquarioSelecionado ? `Qualidade da água · ${aquarioSelecionado.nome}` : "Selecione um aquário no Dashboard"}
            />

            {/* Faixa ideal para as espécies do aquário (GET /aquarios/{id}/parametros-ideais) */}
            {aquarioSelecionado && <ParametrosIdeaisCard idAquario={aquarioSelecionado.id} />}

            {aquarioSelecionado && (
                <Card>
                    <View style={styles.cabecalho}>
                        <Ionicons name="water" size={20} color={cores.primaria} />
                        <Text style={styles.tituloCard}>Novo registro</Text>
                    </View>
                    <RegistroForm onSalvar={salvarRegistro} />
                </Card>
            )}

            {/* Resultado do último registro: a resposta do POST (alertas da ÁGUA). O diagnóstico geral fica no Dashboard. */}
            {alertas !== null && alertas.length === 0 && (
                <View style={[styles.resultado, styles.tudoCerto]}>
                    <Ionicons name="checkmark-circle" size={22} color="#15803d" />
                    <Text style={[styles.textoResultado, styles.textoTudoCerto]}>
                        Registro salvo. Nenhum parâmetro fora do ideal.
                    </Text>
                </View>
            )}

            {alertas !== null && alertas.length > 0 && (
                <Card>
                    <View style={styles.cabecalho}>
                        <Ionicons name="warning" size={20} color="#b45309" />
                        <Text style={styles.tituloCard}>Alertas do último registro</Text>
                    </View>
                    {alertas.map((alerta, indice) => {
                        const critico = alerta.severidade === "CRITICO";
                        return (
                            <View key={indice} style={[styles.alerta, critico ? styles.critico : styles.atencao]}>
                                <Text style={[styles.rotulo, critico ? styles.textoCritico : styles.textoAtencao]}>
                                    {critico ? "Crítico" : "Atenção"}
                                </Text>
                                <Text style={[styles.textoResultado, critico ? styles.textoCritico : styles.textoAtencao]}>
                                    {alerta.mensagem}
                                </Text>
                            </View>
                        );
                    })}
                    <Pressable onPress={() => router.push("/")}>
                        <Text style={styles.link}>Ver diagnóstico do aquário →</Text>
                    </Pressable>
                </Card>
            )}

            {aquarioSelecionado && <GraficoParametros registros={registros} />}

            {aquarioSelecionado && (
                <View style={styles.secao}>
                    <Text style={styles.tituloSecao}>Registros Diários</Text>
                    <Text style={styles.contador}>{registrosOrdenados.length} registros</Text>
                </View>
            )}
            {carregandoRegistros && registrosOrdenados.length === 0 && <ActivityIndicator color={cores.primaria} />}
            <MensagemErro texto={erroRegistros} />
            {aquarioSelecionado && !carregandoRegistros && erroRegistros === "" && registrosOrdenados.length === 0 && (
                <Card>
                    <EstadoVazio icone="calendar-outline" titulo="Nenhum registro ainda" texto="Faça a primeira medição no formulário acima." />
                </Card>
            )}
            {registrosOrdenados.map((registro) => (
                <RegistroCard key={registro.idParametro} registro={registro} />
            ))}
        </Tela>
    )
}

const styles = StyleSheet.create({
    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    tituloCard: {
        fontSize: 18,
        fontWeight: "bold",
        color: cores.texto,
    },
    resultado: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 14,
        borderRadius: raio.medio,
    },
    alerta: {
        padding: 12,
        borderRadius: raio.pequeno,
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
    textoResultado: {
        flex: 1,
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
    link: {
        color: cores.primaria,
        fontWeight: "bold",
    },
    secao: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: -4,
    },
    tituloSecao: {
        fontSize: 20,
        fontWeight: "800",
        color: cores.texto,
    },
    contador: {
        color: cores.textoFraco,
        fontSize: 13,
    },
});
