import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AquarioForm from "@/components/AquarioForm";
import { Aquario, NovoAquario } from "@/types";
import { cores } from "@/theme";

type ModalEditarAquarioProps = {
    // null = fechado
    aquario: Aquario | null;
    onSalvar: (aquario: Aquario, dados: NovoAquario) => Promise<void>;
    onFechar: () => void;
};

export default function ModalEditarAquario({ aquario, onSalvar, onFechar }: ModalEditarAquarioProps) {
    return (
        <Modal visible={aquario !== null} transparent animationType="slide" onRequestClose={onFechar}>
            <KeyboardAvoidingView style={styles.fundo} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <Pressable style={styles.areaFora} onPress={onFechar} />

                <View style={styles.painel}>
                    <View style={styles.alca} />
                    <View style={styles.cabecalho}>
                        <View>
                            <Text style={styles.titulo}>Editar aquário</Text>
                            <Text style={styles.subtitulo}>{aquario?.nome}</Text>
                        </View>
                        <Pressable onPress={onFechar} style={styles.fechar} accessibilityLabel="Fechar">
                            <Ionicons name="close" size={22} color={cores.textoSecundario} />
                        </Pressable>
                    </View>

                    <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
                        {aquario && (
                            // key: com outro aquario o formulario e recriado com os valores certos
                            <AquarioForm
                                key={aquario.id}
                                inicial={aquario}
                                onSalvar={(dados) => onSalvar(aquario, dados)}
                                onCancelar={onFechar}
                            />
                        )}
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
