import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alerta } from "@/types";
import { raio } from "@/theme";

// Um alerta do SAD: o problema (mensagem) + o que fazer (recomendação).
// Usado no diagnóstico do Dashboard, nos alertas da aba Parâmetros e ao adicionar uma espécie.
const cores = {
    CRITICO: { fundo: "#fee2e2", texto: "#b91c1c", rotulo: "Crítico", icone: "alert-circle" as const },
    ATENCAO: { fundo: "#fef3c7", texto: "#b45309", rotulo: "Atenção", icone: "warning" as const },
};

export default function AlertaItem({ alerta }: { alerta: Alerta }) {
    const c = cores[alerta.severidade];

    return (
        <View style={[styles.alerta, { backgroundColor: c.fundo }]}>
            <View style={styles.linhaRotulo}>
                <Ionicons name={c.icone} size={15} color={c.texto} />
                <Text style={[styles.rotulo, { color: c.texto }]}>{c.rotulo}</Text>
            </View>
            <Text style={[styles.mensagem, { color: c.texto }]}>{alerta.mensagem}</Text>

            {/* A recomendação: é o "apoio à decisão" — o sistema diz o que fazer, e não só o que está errado */}
            {alerta.recomendacao && (
                <View style={styles.recomendacao}>
                    <Ionicons name="bulb-outline" size={15} color="#374151" />
                    <Text style={styles.textoRecomendacao}>{alerta.recomendacao}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    alerta: {
        padding: 12,
        borderRadius: raio.pequeno,
        gap: 4,
    },
    linhaRotulo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    rotulo: {
        fontSize: 11,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    mensagem: {
        fontSize: 14,
        fontWeight: "600",
    },
    recomendacao: {
        flexDirection: "row",
        gap: 6,
        marginTop: 6,
        backgroundColor: "rgba(255,255,255,0.7)",
        borderRadius: 8,
        padding: 8,
    },
    textoRecomendacao: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
        color: "#374151",
    },
});
