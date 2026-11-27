import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Lembrete } from "@/types";
import { cores } from "@/theme";
import { deLocalDateTime, descreverDataHora } from "@/utils/dataHora";

type LembreteItemProps = {
    lembrete: Lembrete;
    // vem da tela para o render continuar puro
    agora: number;
    onAlternar: () => Promise<void>;
    onExcluir: () => Promise<void>;
};

export default function LembreteItem({ lembrete, agora, onAlternar, onExcluir }: LembreteItemProps) {
    const [ocupado, setOcupado] = useState(false);
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [erro, setErro] = useState("");

    const data = deLocalDateTime(lembrete.dataHoraLembrete);
    const atrasado = !lembrete.concluido && data.getTime() < agora;

    async function executar(acao: () => Promise<void>) {
        setOcupado(true);
        setErro("");
        try {
            await acao();
        } catch (e) {
            if (e instanceof Error) {
                setErro(e.message);
            }
            setOcupado(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.linha}>
                <Pressable
                    onPress={() => executar(onAlternar)}
                    disabled={ocupado}
                    hitSlop={8}
                    accessibilityLabel={lembrete.concluido ? "Marcar como pendente" : "Marcar como concluído"}
                >
                    <Ionicons
                        name={lembrete.concluido ? "checkmark-circle" : "ellipse-outline"}
                        size={26}
                        color={lembrete.concluido ? "#15803d" : cores.textoFraco}
                    />
                </Pressable>

                <View style={styles.textos}>
                    <Text style={[styles.titulo, lembrete.concluido && styles.tituloConcluido]}>{lembrete.titulo}</Text>
                    <Text style={[styles.data, atrasado && styles.dataAtrasada]}>
                        {atrasado ? "Atrasado · " : ""}{descreverDataHora(data)}
                    </Text>
                </View>

                {!confirmandoExclusao && (
                    <Pressable onPress={() => setConfirmandoExclusao(true)} disabled={ocupado} hitSlop={8} accessibilityLabel="Excluir">
                        <Ionicons name="trash-outline" size={20} color={cores.textoFraco} />
                    </Pressable>
                )}
            </View>

            {/* o alert com botoes nao funciona na web */}
            {confirmandoExclusao && (
                <View style={styles.confirmacao}>
                    <Text style={styles.textoConfirmacao}>Excluir este lembrete?</Text>
                    <Pressable onPress={() => setConfirmandoExclusao(false)} disabled={ocupado}>
                        <Text style={styles.cancelar}>Não</Text>
                    </Pressable>
                    <Pressable onPress={() => executar(onExcluir)} disabled={ocupado}>
                        <Text style={styles.excluir}>{ocupado ? "Excluindo..." : "Excluir"}</Text>
                    </Pressable>
                </View>
            )}

            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: cores.bordaClara,
        gap: 6,
    },
    linha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    textos: {
        flex: 1,
        gap: 2,
    },
    titulo: {
        fontSize: 15,
        fontWeight: "600",
        color: cores.texto,
    },
    tituloConcluido: {
        color: cores.textoFraco,
        textDecorationLine: "line-through",
    },
    data: {
        fontSize: 13,
        color: cores.textoSecundario,
    },
    dataAtrasada: {
        color: cores.perigo,
        fontWeight: "600",
    },
    confirmacao: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 16,
    },
    textoConfirmacao: {
        flex: 1,
        color: cores.texto,
        fontSize: 13,
    },
    cancelar: {
        color: cores.textoSecundario,
        fontWeight: "600",
    },
    excluir: {
        color: cores.perigo,
        fontWeight: "bold",
    },
    erro: {
        color: cores.perigo,
        fontSize: 13,
    },
});
