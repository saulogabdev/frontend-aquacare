import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Diagnostico, EstadoAquario } from "@/types";
import { raio, sombra } from "@/theme";
import AlertaItem from "@/components/AlertaItem";

type DiagnosticoCardProps = {
    diagnostico: Diagnostico;
};

// Cor e texto de cada estado ficam numa tabela, em vez de vários ternários espalhados.
const aparencia: Record<EstadoAquario, { rotulo: string; fundo: string; texto: string; borda: string; icone: keyof typeof Ionicons.glyphMap }> = {
    SAUDAVEL: { rotulo: "Saudável", fundo: "#dcfce7", texto: "#15803d", borda: "#86efac", icone: "checkmark-circle" },
    ATENCAO: { rotulo: "Atenção", fundo: "#fef3c7", texto: "#b45309", borda: "#fcd34d", icone: "warning" },
    CRITICO: { rotulo: "Crítico", fundo: "#fee2e2", texto: "#b91c1c", borda: "#fca5a5", icone: "alert-circle" },
};

export default function DiagnosticoCard({ diagnostico }: DiagnosticoCardProps) {
    const cores = aparencia[diagnostico.estado];

    return (
        // Card branco com a faixa da esquerda na cor do estado; os alertas (AlertaItem) têm a própria cor.
        <View style={[styles.cartao, { borderLeftColor: cores.texto }]}>
            <Text style={styles.titulo}>Diagnóstico do aquário</Text>
            <View style={[styles.linhaEstado, { backgroundColor: cores.fundo }]}>
                <Ionicons name={cores.icone} size={26} color={cores.texto} />
                <Text style={[styles.estado, { color: cores.texto }]}>{cores.rotulo}</Text>
                {diagnostico.alertas.length > 0 && (
                    <Text style={[styles.contagem, { color: cores.texto }]}>
                        {diagnostico.alertas.length} {diagnostico.alertas.length === 1 ? "alerta" : "alertas"}
                    </Text>
                )}
            </View>

            {diagnostico.alertas.length === 0 ? (
                <Text style={[styles.alerta, { color: cores.texto }]}>Nenhum problema encontrado no último registro.</Text>
            ) : (
                diagnostico.alertas.map((alerta, indice) => <AlertaItem key={indice} alerta={alerta} />)
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cartao: {
        ...sombra,
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: raio.medio,
        borderLeftWidth: 5,
        gap: 8,
    },
    titulo: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#6b7280",
        textTransform: "uppercase",
    },
    linhaEstado: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 10,
        borderRadius: raio.pequeno,
    },
    contagem: {
        marginLeft: "auto",
        fontSize: 13,
        fontWeight: "600",
    },
    estado: {
        fontSize: 22,
        fontWeight: "bold",
    },
    alerta: {
        fontSize: 14,
    },
});
