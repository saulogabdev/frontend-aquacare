import { View, Text, StyleSheet } from "react-native";
import { Diagnostico, EstadoAquario } from "@/types";

type DiagnosticoCardProps = {
    diagnostico: Diagnostico;
};

// Cor e texto de cada estado ficam numa tabela, em vez de vários ternários espalhados.
const aparencia: Record<EstadoAquario, { rotulo: string; fundo: string; texto: string; borda: string }> = {
    SAUDAVEL: { rotulo: "Saudável", fundo: "#dcfce7", texto: "#15803d", borda: "#86efac" },
    ATENCAO: { rotulo: "Atenção", fundo: "#fef3c7", texto: "#b45309", borda: "#fcd34d" },
    CRITICO: { rotulo: "Crítico", fundo: "#fee2e2", texto: "#b91c1c", borda: "#fca5a5" },
};

export default function DiagnosticoCard({ diagnostico }: DiagnosticoCardProps) {
    const cores = aparencia[diagnostico.estado];

    return (
        <View style={[styles.cartao, { backgroundColor: cores.fundo, borderColor: cores.borda }]}>
            <Text style={styles.titulo}>Diagnóstico do aquário</Text>
            <Text style={[styles.estado, { color: cores.texto }]}>{cores.rotulo}</Text>

            {diagnostico.alertas.length === 0 ? (
                <Text style={[styles.alerta, { color: cores.texto }]}>Nenhum problema encontrado no último registro.</Text>
            ) : (
                diagnostico.alertas.map((alerta, indice) => (
                    <Text
                        key={indice}
                        style={[styles.alerta, { color: alerta.severidade === "CRITICO" ? "#b91c1c" : "#b45309" }]}
                    >
                        • {alerta.mensagem}
                    </Text>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cartao: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 6,
    },
    titulo: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#6b7280",
        textTransform: "uppercase",
    },
    estado: {
        fontSize: 22,
        fontWeight: "bold",
    },
    alerta: {
        fontSize: 14,
    },
});
