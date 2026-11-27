import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Aquario, Equipamento, NovoEquipamento } from "@/types";
import { useAuthContext } from "@/contexts/AuthContext";
import { cadastrarEquipamento, excluirEquipamento, listarEquipamentos } from "@/services/equipamentoService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import { CabecalhoCard, Card, EstadoVazio, MensagemErro } from "@/components/ui";
import EquipamentoForm, { infoTipo } from "@/components/EquipamentoForm";
import { cores, raio } from "@/theme";

function especificacao(e: Equipamento): string {
    if (e.tipo === "FILTRO") return `${e.vazaoLH ?? "—"} L/h`;
    if (e.tipo === "TERMOSTATO") return `${e.potenciaWatts ?? "—"} W`;
    return `${e.lumens ?? "—"} lm`;
}

export default function EquipamentosCard({ aquario, onMudou }: { aquario: Aquario; onMudou?: () => void }) {
    const { token, sair } = useAuthContext();
    const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const recarregar = useCallback(async () => {
        if (token === null) return;
        setCarregando(true);
        setErro("");
        try {
            setEquipamentos(await listarEquipamentos(token, aquario.id));
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
                return;
            }
            if (error instanceof Error) {
                setErro(error.message);
            }
        } finally {
            setCarregando(false);
        }
    }, [token, aquario.id, sair]);

    useFocusEffect(
        useCallback(() => {
            recarregar();
        }, [recarregar])
    );

    async function adicionar(novo: NovoEquipamento) {
        if (token === null) return;
        try {
            await cadastrarEquipamento(token, novo);
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
        setMostrarFormulario(false);
        await recarregar();
        onMudou?.();
    }

    async function excluir(idEquipamento: number) {
        if (token === null) return;
        setErro("");
        try {
            await excluirEquipamento(token, idEquipamento);
            await recarregar();
            onMudou?.();
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
                return;
            }
            if (error instanceof Error) {
                setErro(error.message);
            }
        }
    }

    return (
        <Card>
            <CabecalhoCard
                titulo="Equipamentos"
                acao={mostrarFormulario ? "Fechar" : "Adicionar"}
                onAcao={() => setMostrarFormulario(!mostrarFormulario)}
            />

            {mostrarFormulario && <EquipamentoForm idAquario={aquario.id} litragem={aquario.litragem} onSalvar={adicionar} />}

            {carregando && equipamentos.length === 0 && <ActivityIndicator color={cores.primaria} />}
            <MensagemErro texto={erro} />

            {!carregando && equipamentos.length === 0 && !mostrarFormulario && (
                <EstadoVazio icone="construct-outline" titulo="Nenhum equipamento" texto="Cadastre filtro, termostato e iluminação para conferir o dimensionamento." />
            )}

            {equipamentos.map((e) => {
                const info = infoTipo[e.tipo];
                const detalhes = [e.marca, e.modelo].filter(Boolean).join(" • ");
                return (
                    <View key={e.idEquipamento} style={styles.linha}>
                        <View style={styles.icone}>
                            <Ionicons name={info.icone} size={20} color={cores.primaria} />
                        </View>
                        <View style={styles.textos}>
                            <View style={styles.linhaNome}>
                                <Text style={styles.nome} numberOfLines={1}>{e.nome}</Text>
                                <Text style={styles.tipo}>{info.rotulo}</Text>
                            </View>
                            {detalhes !== "" && <Text style={styles.detalhes} numberOfLines={1}>{detalhes}</Text>}
                            <View style={styles.selos}>
                                <Text style={styles.spec}>{especificacao(e)}</Text>
                                <Text style={[styles.selo, e.dimensionadoCorretamente ? styles.seloOk : styles.seloAtencao]}>
                                    {e.dimensionadoCorretamente ? "✓ Bem dimensionado" : "⚠ Fora da faixa"}
                                </Text>
                            </View>
                        </View>
                        <Pressable onPress={() => excluir(e.idEquipamento)} style={styles.botaoExcluir} accessibilityLabel="Excluir equipamento">
                            <Ionicons name="trash-outline" size={18} color={cores.perigo} />
                        </Pressable>
                    </View>
                );
            })}

            {equipamentos.some((e) => !e.dimensionadoCorretamente) && (
                <Text style={styles.dica}>
                    Fora da faixa: confira as referências ao adicionar (filtro 3 a 5× o volume por hora, termostato cerca de 1 W/L,
                    iluminação 30 a 60 lm/L).
                </Text>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    linha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 10,
        borderRadius: raio.medio,
        borderWidth: 1,
        borderColor: cores.bordaClara,
    },
    icone: {
        width: 44,
        height: 44,
        borderRadius: raio.pequeno,
        backgroundColor: cores.primariaClara,
        alignItems: "center",
        justifyContent: "center",
    },
    textos: {
        flex: 1,
        gap: 2,
    },
    linhaNome: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    nome: {
        flexShrink: 1,
        fontWeight: "bold",
        color: cores.texto,
    },
    tipo: {
        fontSize: 10,
        fontWeight: "600",
        color: cores.textoSecundario,
        backgroundColor: cores.bordaClara,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: raio.pilula,
        overflow: "hidden",
    },
    detalhes: {
        fontSize: 12,
        color: cores.textoFraco,
    },
    selos: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 4,
    },
    spec: {
        fontSize: 11,
        fontWeight: "600",
        color: cores.textoSecundario,
        backgroundColor: "#f9fafb",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        overflow: "hidden",
    },
    selo: {
        fontSize: 11,
        fontWeight: "bold",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        overflow: "hidden",
    },
    seloOk: {
        backgroundColor: "#dcfce7",
        color: "#15803d",
    },
    seloAtencao: {
        backgroundColor: "#fef3c7",
        color: "#b45309",
    },
    botaoExcluir: {
        width: 36,
        height: 36,
        borderRadius: raio.pilula,
        alignItems: "center",
        justifyContent: "center",
    },
    dica: {
        fontSize: 12,
        color: "#b45309",
    },
});
