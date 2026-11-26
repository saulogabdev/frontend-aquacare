import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MensagemErro } from "@/components/ui";
import { Aquario } from "@/types";
import { cores, raio } from "@/theme";

type ModalExcluirAquarioProps = {
    // null = modal fechado. Com um aquário, o modal abre perguntando sobre ELE.
    aquario: Aquario | null;
    // Chamado só quando o usuário confirma. Se der erro, o modal continua aberto mostrando a mensagem.
    onConfirmar: (aquario: Aquario) => Promise<void>;
    onCancelar: () => void;
};

// O que o backend apaga junto (exclusão em cascata). Mostrado para o usuário saber o que vai perder.
const APAGADOS_JUNTO = ["Registros de parâmetros e alertas", "Espécies associadas", "Equipamentos", "Lembretes"];

// Confirmação antes de excluir um aquário: a exclusão é IRREVERSÍVEL e leva todo o histórico.
// Mesmo padrão do ModalEncerrarCiclagem (Modal em vez de Alert, que não funciona na web).
export default function ModalExcluirAquario({ aquario, onConfirmar, onCancelar }: ModalExcluirAquarioProps) {
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState("");

    async function confirmar() {
        if (aquario === null) return;
        setExcluindo(true);
        setErro("");
        try {
            await onConfirmar(aquario);
        } catch (e) {
            if (e instanceof Error) {
                setErro(e.message);
            }
        } finally {
            setExcluindo(false);
        }
    }

    function cancelar() {
        if (excluindo) return; // não deixa fechar no meio da exclusão
        setErro("");
        onCancelar();
    }

    return (
        <Modal visible={aquario !== null} transparent animationType="fade" onRequestClose={cancelar}>
            <View style={styles.fundo}>
                <View style={styles.caixa}>
                    <ScrollView contentContainerStyle={styles.conteudo}>
                        <View style={styles.icone}>
                            <Ionicons name="trash" size={26} color={cores.perigo} />
                        </View>
                        <Text style={styles.titulo}>Excluir {aquario?.nome}?</Text>
                        <Text style={styles.subtitulo}>Esta ação não pode ser desfeita.</Text>

                        <View style={styles.lista}>
                            <Text style={styles.textoLista}>Também serão apagados:</Text>
                            {APAGADOS_JUNTO.map((item) => (
                                <View key={item} style={styles.itemLista}>
                                    <Ionicons name="close-circle" size={16} color={cores.perigo} />
                                    <Text style={styles.textoItem}>{item}</Text>
                                </View>
                            ))}
                        </View>

                        <MensagemErro texto={erro} />

                        <Pressable
                            style={[styles.botaoExcluir, excluindo && styles.desabilitado]}
                            onPress={confirmar}
                            disabled={excluindo}
                        >
                            {excluindo ? (
                                <ActivityIndicator color={cores.branco} />
                            ) : (
                                <Ionicons name="trash-outline" size={18} color={cores.branco} />
                            )}
                            <Text style={styles.textoExcluir}>{excluindo ? "Excluindo..." : "Excluir aquário"}</Text>
                        </Pressable>
                        <Pressable onPress={cancelar} disabled={excluindo} style={styles.botaoCancelar}>
                            <Text style={styles.textoCancelar}>Cancelar</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fundo: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        justifyContent: "center",
        padding: 20,
    },
    caixa: {
        backgroundColor: cores.branco,
        borderRadius: 20,
        maxHeight: "90%",
        width: "100%",
        maxWidth: 480,
        alignSelf: "center",
    },
    conteudo: {
        padding: 20,
        gap: 12,
    },
    icone: {
        alignSelf: "center",
        width: 56,
        height: 56,
        borderRadius: raio.pilula,
        backgroundColor: cores.perigoClaro,
        alignItems: "center",
        justifyContent: "center",
    },
    titulo: {
        fontSize: 20,
        fontWeight: "800",
        color: cores.texto,
        textAlign: "center",
    },
    subtitulo: {
        color: cores.textoSecundario,
        textAlign: "center",
        marginTop: -6,
    },
    lista: {
        backgroundColor: cores.perigoClaro,
        borderRadius: raio.pequeno,
        padding: 12,
        gap: 6,
    },
    textoLista: {
        fontSize: 13,
        fontWeight: "600",
        color: "#991b1b",
    },
    itemLista: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    textoItem: {
        fontSize: 13,
        color: "#374151",
    },
    botaoExcluir: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: cores.perigo,
        borderRadius: raio.pequeno,
        paddingVertical: 14,
    },
    desabilitado: {
        opacity: 0.7,
    },
    textoExcluir: {
        color: cores.branco,
        fontWeight: "bold",
        fontSize: 16,
    },
    botaoCancelar: {
        alignItems: "center",
        paddingVertical: 10,
    },
    textoCancelar: {
        color: cores.textoSecundario,
        fontWeight: "600",
    },
});
