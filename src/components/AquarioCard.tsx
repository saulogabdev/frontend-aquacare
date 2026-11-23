import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Aquario } from "@/types";
import { cores, raio } from "@/theme";

type AquarioCardProps = {
    aquario: Aquario;
    ativo: boolean;
    onPress: () => void;
}

export default function AquarioCard({ aquario, onPress, ativo }: AquarioCardProps) {
    const doce = aquario.tipoAgua === "DOCE";
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
        </Pressable>
    );
}

const styles = StyleSheet.create({
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
