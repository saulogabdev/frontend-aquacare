import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BotaoGradiente, MensagemErro } from "@/components/ui";
import { cores, raio } from "@/theme";
import { CICLAGEM_DIAS } from "@/utils/ciclagem";

type ModalEncerrarCiclagemProps = {
    visivel: boolean;
    diasMontagem: number;
    // Chamado só quando o usuário confirma. Se der erro, o modal continua aberto mostrando a mensagem.
    onConfirmar: () => Promise<void>;
    onCancelar: () => void;
};

// Pop-up de confirmação antes de encerrar a ciclagem antes dos 30 dias.
// Usa o <Modal> do React Native (e não o Alert.alert) porque os botões do Alert não funcionam na web.
export default function ModalEncerrarCiclagem({ visivel, diasMontagem, onConfirmar, onCancelar }: ModalEncerrarCiclagemProps) {
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    async function confirmar() {
        setSalvando(true);
        setErro("");
        try {
            await onConfirmar();
        } catch (e) {
            if (e instanceof Error) {
                setErro(e.message);
            }
        } finally {
            setSalvando(false);
        }
    }

    function cancelar() {
        setErro("");
        onCancelar();
    }

    return (
        <Modal visible={visivel} transparent animationType="fade" onRequestClose={cancelar}>
            {/* Fundo escurecido */}
            <View style={styles.fundo}>
                <View style={styles.caixa}>
                    <ScrollView contentContainerStyle={styles.conteudo}>
                        <View style={styles.icone}>
                            <Ionicons name="sync" size={28} color="#b45309" />
                        </View>
                        <Text style={styles.titulo}>Encerrar a ciclagem?</Text>
                        <Text style={styles.subtitulo}>
                            Seu aquário está no dia {diasMontagem} de {CICLAGEM_DIAS}.
                        </Text>

                        <Text style={styles.paragrafo}>
                            A <Text style={styles.negrito}>ciclagem</Text> é o tempo que as bactérias do filtro levam para se
                            estabelecer. São elas que transformam a <Text style={styles.negrito}>amônia</Text> (eliminada pelos
                            peixes) em <Text style={styles.negrito}>nitrito</Text> e depois em{" "}
                            <Text style={styles.negrito}>nitrato</Text>, bem menos tóxico. Sem essa colônia, a amônia e o
                            nitrito se acumulam e podem matar os peixes.
                        </Text>

                        <View style={styles.dica}>
                            <Ionicons name="flask-outline" size={18} color={cores.primariaEscura} />
                            <Text style={styles.textoDica}>
                                Se você usou um <Text style={styles.negrito}>acelerador biológico</Text> (bactérias vivas),
                                a ciclagem pode terminar antes. Mesmo assim, só encerre se os testes mostrarem{" "}
                                <Text style={styles.negrito}>amônia e nitrito zerados</Text>.
                            </Text>
                        </View>

                        <MensagemErro texto={erro} />

                        <BotaoGradiente
                            texto={salvando ? "Salvando..." : "Encerrar ciclagem"}
                            onPress={confirmar}
                            carregando={salvando}
                            icone="checkmark"
                        />
                        <Pressable onPress={cancelar} disabled={salvando} style={styles.botaoCancelar}>
                            <Text style={styles.textoCancelar}>Continuar em ciclagem</Text>
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
        backgroundColor: "#fef3c7",
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
    paragrafo: {
        fontSize: 14,
        lineHeight: 21,
        color: "#374151",
    },
    negrito: {
        fontWeight: "bold",
    },
    dica: {
        flexDirection: "row",
        gap: 8,
        backgroundColor: cores.primariaClara,
        borderRadius: raio.pequeno,
        padding: 12,
    },
    textoDica: {
        flex: 1,
        fontSize: 13,
        lineHeight: 19,
        color: cores.primariaEscura,
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
