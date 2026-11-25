import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Aquario } from "@/types";
import { cores, raio } from "@/theme";

type AquarioCardProps = {
    aquario: Aquario;
    ativo: boolean;
    onPress: () => void;
    // Opcionais: enquanto a edição/exclusão não estiver pronta (item 11, Parte B), os botões só avisam "em breve".
    onEditar?: () => void;
    onExcluir?: () => void;
}

export default function AquarioCard({ aquario, onPress, ativo, onEditar, onExcluir }: AquarioCardProps) {
    const doce = aquario.tipoAgua === "DOCE";
    const [emBreve, setEmBreve] = useState(false);

    // Se a tela passou a função, usa; se não, mostra o aviso "em breve" (para o botão não parecer quebrado).
    function acao(funcao?: () => void) {
        if (funcao) {
            funcao();
        } else {
            setEmBreve(true);
        }
    }
    return (
        <Pressable style={[styles.card, ativo && styles.cardAtivo]} onPress={onPress}>
            <View style={styles.linhaNome}>
                <Text style={styles.nome}>{aquario.nome}</Text>
                {ativo && <Ionicons name="checkmark-circle" size={18} color={cores.primaria} />}
            </View>
            <View style={styles.linha}>
                <Text style={styles.litragem}>{aquario.litragem}L</Text>
                <Text style={[styles.etiqueta, doce ? styles.etiquetaDoce : styles.etiquetaMarinho]}>
                    {doce ? "Doce" : "Marinho"}
                </Text>
            </View>

            {/* Botões como no protótipo. O Pressable de dentro "captura" o toque, então não seleciona o card. */}
            <View style={styles.acoes}>
                <Pressable style={[styles.botaoAcao, styles.botaoEditar]} onPress={() => acao(onEditar)}>
                    <Ionicons name="create-outline" size={15} color="#2563eb" />
                    <Text style={[styles.textoAcao, { color: "#2563eb" }]}>Editar</Text>
                </Pressable>
                <Pressable style={[styles.botaoAcao, styles.botaoExcluir]} onPress={() => acao(onExcluir)}>
                    <Ionicons name="trash-outline" size={15} color={cores.perigo} />
                    <Text style={[styles.textoAcao, { color: cores.perigo }]}>Excluir</Text>
                </Pressable>
            </View>
            {emBreve && <Text style={styles.emBreve}>Editar e excluir estarão disponíveis em breve.</Text>}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    acoes: {
        flexDirection: "row",
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: cores.bordaClara,
    },
    botaoAcao: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 8,
        borderRadius: 10,
    },
    botaoEditar: {
        backgroundColor: "#eff6ff",
    },
    botaoExcluir: {
        backgroundColor: cores.perigoClaro,
    },
    textoAcao: {
        fontSize: 14,
        fontWeight: "600",
    },
    emBreve: {
        marginTop: 8,
        fontSize: 12,
        color: cores.textoSecundario,
        textAlign: "center",
    },
    card: {
        backgroundColor: cores.branco,
        borderRadius: raio.medio,
        padding: 14,
        borderWidth: 2,
        borderColor: cores.bordaClara,
    },
    cardAtivo: {
        borderColor: "#06b6d4",
        backgroundColor: "#f0fdff",
    },
    linhaNome: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
    },
    nome: {
        fontWeight: "bold",
        fontSize: 16,
        color: cores.texto,
    },
    linha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
    },
    litragem: {
        color: cores.textoSecundario,
        fontSize: 14,
    },
    etiqueta: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: raio.pilula,
        fontSize: 11,
        fontWeight: "600",
        overflow: "hidden",
    },
    etiquetaDoce: {
        backgroundColor: "#cffafe",
        color: cores.primariaEscura,
    },
    etiquetaMarinho: {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
    },
});
