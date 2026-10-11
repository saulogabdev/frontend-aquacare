import { View, Text, StyleSheet, Pressable } from "react-native";
import { Aquario } from "@/types";

type AquarioCardProps = {
    aquario: Aquario;
    ativo: boolean;
    onPress: () => void;
}

export default function AquarioCard({ aquario, onPress, ativo }: AquarioCardProps) {
    return (
        <Pressable style={[styles.card, ativo && styles.cardAtivo]} onPress={onPress}>
            <View style={styles.linhaNome}>
                <Text style={styles.nome}>{aquario.nome}</Text>
                {ativo && <Text style={{color: "#0891b2"}}>✓</Text>}
            </View>
            <View style={styles.linha}>
                <Text style={styles.litragem}>{aquario.litragem}L</Text>
                <Text style={[styles.etiquetaTipoAgua, aquario.tipoAgua === "DOCE" ? styles.etiquetaDoce : styles.etiquetaMarinho]}>
                    {aquario.tipoAgua}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 14,
        borderWidth: 2,
        borderColor: "#f3f4f6",
    },
    nome: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#111827",
    },
    linha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
    },
    litragem: {
        color: "#6b7280",
    },
    etiquetaTipoAgua: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        fontSize: 11,
    },
    etiquetaMarinho: {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
    },
    etiquetaDoce: {
        backgroundColor: "#cffafe",
        color: "#0e7490",
    },
    cardAtivo: {
        borderColor: "#06b6d4",
        backgroundColor: "#ecfeff",
    },
    linhaNome: {
        flexDirection: "row",
        gap: 6,
        alignItems: "center",
    },


})