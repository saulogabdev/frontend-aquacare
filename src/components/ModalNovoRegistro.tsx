import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import RegistroForm, { MedicoesRegistro } from "@/components/RegistroForm";
import { cores } from "@/theme";

type ModalNovoRegistroProps = {
    visivel: boolean;
    marinho: boolean;
    nomeAquario: string;
    onSalvar: (medicoes: MedicoesRegistro) => Promise<void>;
    onFechar: () => void;
};

// Painel que sobe de baixo ("bottom sheet"), como no protótipo.
// É um <Modal> com animação "slide" e o conteúdo colado embaixo da tela.
export default function ModalNovoRegistro({ visivel, marinho, nomeAquario, onSalvar, onFechar }: ModalNovoRegistroProps) {
    // Só fecha se salvou; se der erro, o formulário mostra a mensagem e o painel continua aberto.
    async function salvar(medicoes: MedicoesRegistro) {
        await onSalvar(medicoes);
        onFechar();
    }

    return (
        <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
            {/* KeyboardAvoidingView: empurra o painel para cima quando o teclado abre (no iPhone) */}
            <KeyboardAvoidingView style={styles.fundo} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                {/* Tocar na área escura fora do painel também fecha */}
                <Pressable style={styles.areaFora} onPress={onFechar} />

                <View style={styles.painel}>
                    <View style={styles.alca} />
                    <View style={styles.cabecalho}>
                        <View>
                            <Text style={styles.titulo}>Novo Registro</Text>
                            <Text style={styles.subtitulo}>{nomeAquario}</Text>
                        </View>
                        <Pressable onPress={onFechar} style={styles.fechar} accessibilityLabel="Fechar">
                            <Ionicons name="close" size={22} color={cores.textoSecundario} />
                        </Pressable>
                    </View>

                    <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
                        <RegistroForm marinho={marinho} onSalvar={salvar} onCancelar={onFechar} />
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fundo: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(15, 23, 42, 0.45)",
    },
    areaFora: {
        flex: 1,
    },
    painel: {
        backgroundColor: cores.branco,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: "88%",
        paddingBottom: 24,
    },
    alca: {
        alignSelf: "center",
        width: 40,
        height: 5,
        borderRadius: 999,
        backgroundColor: cores.borda,
        marginTop: 8,
    },
    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    titulo: {
        fontSize: 20,
        fontWeight: "800",
        color: cores.texto,
    },
    subtitulo: {
        fontSize: 13,
        color: cores.textoSecundario,
    },
    fechar: {
        width: 36,
        height: 36,
        borderRadius: 999,
        backgroundColor: cores.bordaClara,
        alignItems: "center",
        justifyContent: "center",
    },
    conteudo: {
        paddingHorizontal: 20,
        paddingTop: 8,
    },
});
