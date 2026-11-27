import { ActivityIndicator, Pressable, Text, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card, EstadoVazio, MensagemErro, Tela, TituloTela } from "@/components/ui";
import { cores, gradientes, raio } from "@/theme";
import RegistroCard from "@/components/RegistroCard";
import { useAquarioContext } from "@/contexts/AquarioContext";
import { useRegistroContext } from "@/contexts/RegistroContext";
import { MedicoesRegistro } from "@/components/RegistroForm";
import ModalNovoRegistro from "@/components/ModalNovoRegistro";
import { LinearGradient } from "expo-linear-gradient";
import { RegistroParametro } from "@/types/registro";
import { useCallback, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { listarRegistros } from "@/services/registroService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import { useFocusEffect, useRouter } from "expo-router";
import GraficoParametros from "@/components/GraficoParametros";
import ParametrosIdeaisCard from "@/components/ParametrosIdeaisCard";
import AlertaItem from "@/components/AlertaItem";

export default function Parametros() {
    const router = useRouter();
    const {aquarios, idSelecionado} = useAquarioContext();
    const {token, sair} = useAuthContext();
    const aquarioSelecionado = aquarios.find((a) => a.id === idSelecionado);
    const {adicionarRegistro, editarRegistro, removerRegistro} = useRegistroContext();
    const [mostrarModal, setMostrarModal] = useState(false);
    // null = nenhum registro em edicao
    const [registroEditando, setRegistroEditando] = useState<RegistroParametro | null>(null);
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
        await adicionarRegistro({
            idAquario: aquarioSelecionado.id,
            ...medicoes
        });
        await recarregarRegistros();
    }

    async function salvarEdicao(medicoes: MedicoesRegistro) {
        if (!aquarioSelecionado || !registroEditando) {
            return;
        }
        await editarRegistro(registroEditando.idParametro, {
            idAquario: aquarioSelecionado.id,
            ...medicoes
        });
        await recarregarRegistros();
    }

    async function excluirRegistro(idParametro: number) {
        await removerRegistro(idParametro);
        await recarregarRegistros();
    }


    const registrosOrdenados = [...registros].sort((a, b) => b.dataHora.localeCompare(a.dataHora));
    const alertasUltimoRegistro = registrosOrdenados.length > 0 ? registrosOrdenados[0].alertas : null;

    return (
        <Tela>
            <TituloTela
                titulo="Parâmetros"
                subtitulo={aquarioSelecionado ? `Qualidade da água · ${aquarioSelecionado.nome}` : "Selecione um aquário no Dashboard"}
            />

            {aquarioSelecionado && <ParametrosIdeaisCard idAquario={aquarioSelecionado.id} />}

            {aquarioSelecionado && (
                <ModalNovoRegistro
                    visivel={mostrarModal}
                    marinho={aquarioSelecionado.tipoAgua === "MARINHO"}
                    nomeAquario={aquarioSelecionado.nome}
                    onSalvar={salvarRegistro}
                    onFechar={() => setMostrarModal(false)}
                />
            )}

            {/* mesmo painel, modo edicao */}
            {aquarioSelecionado && (
                <ModalNovoRegistro
                    visivel={registroEditando !== null}
                    marinho={aquarioSelecionado.tipoAgua === "MARINHO"}
                    nomeAquario={aquarioSelecionado.nome}
                    inicial={registroEditando ?? undefined}
                    onSalvar={salvarEdicao}
                    onFechar={() => setRegistroEditando(null)}
                />
            )}

            {alertasUltimoRegistro !== null && alertasUltimoRegistro.length === 0 && (
                <View style={[styles.resultado, styles.tudoCerto]}>
                    <Ionicons name="checkmark-circle" size={22} color="#15803d" />
                    <Text style={[styles.textoResultado, styles.textoTudoCerto]}>
                        Registro salvo. Nenhum parâmetro fora do ideal.
                    </Text>
                </View>
            )}

            {alertasUltimoRegistro !== null && alertasUltimoRegistro.length > 0 && (
                <Card>
                    <View style={styles.cabecalho}>
                        <Ionicons name="warning" size={20} color="#b45309" />
                        <Text style={styles.tituloCard}>Alertas do último registro</Text>
                    </View>
                    {alertasUltimoRegistro.map((alerta, indice) => <AlertaItem key={indice} alerta={alerta} />)}
                    <Pressable onPress={() => router.push("/")}>
                        <Text style={styles.link}>Ver diagnóstico do aquário →</Text>
                    </Pressable>
                </Card>
            )}

            {aquarioSelecionado && <GraficoParametros registros={registros} />}

            {aquarioSelecionado && (
                <View style={styles.secao}>
                    <View>
                        <Text style={styles.tituloSecao}>Registros Diários</Text>
                        <Text style={styles.contador}>{registrosOrdenados.length} registros</Text>
                    </View>
                    <Pressable onPress={() => setMostrarModal(true)}>
                        <LinearGradient colors={gradientes.marca} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.botaoNovo}>
                            <Ionicons name="add" size={18} color={cores.branco} />
                            <Text style={styles.textoBotaoNovo}>Novo</Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            )}
            {carregandoRegistros && registrosOrdenados.length === 0 && <ActivityIndicator color={cores.primaria} />}
            <MensagemErro texto={erroRegistros} />
            {aquarioSelecionado && !carregandoRegistros && erroRegistros === "" && registrosOrdenados.length === 0 && (
                <Card>
                    <EstadoVazio icone="calendar-outline" titulo="Nenhum registro ainda" texto="Toque em + Novo para registrar a primeira medição." />
                </Card>
            )}
            {registrosOrdenados.map((registro) => (
                <RegistroCard
                    key={registro.idParametro}
                    registro={registro}
                    onEditar={() => setRegistroEditando(registro)}
                    onExcluir={() => excluirRegistro(registro.idParametro)}
                />
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
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: -4,
    },
    botaoNovo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingLeft: 12,
        paddingRight: 16,
        paddingVertical: 10,
        borderRadius: 999,
    },
    textoBotaoNovo: {
        color: cores.branco,
        fontWeight: "bold",
        fontSize: 15,
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
