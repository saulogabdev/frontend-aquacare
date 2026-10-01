import { View, Text, StyleSheet } from "react-native";

type AquarioCardProps = {
    nome: string;
    tipoAgua: string;
    litragem: number;
}

export default function AquarioCard({nome, tipoAgua, litragem}: AquarioCardProps) {
    return (
        <View style={[styles.card]}>
            <Text style={[styles.nome]}>{nome}</Text>
            <View style={[styles.linha]}>
                <Text style={[styles.litragem]}>{litragem}L</Text>
                <Text style={[styles.etiquetaTipoAgua, tipoAgua === "DOCE" ? styles.etiquetaDoce : styles.etiquetaMarinho]}>
                    {tipoAgua}
                </Text>
            </View>
        </View>
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
    }


})