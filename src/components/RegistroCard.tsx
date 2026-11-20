import { View, Text, StyleSheet } from "react-native";
import { RegistroParametro } from "@/types";

type RegistroCardProps = {
    registro: RegistroParametro;
};

// "2026-11-18T14:32:10.123" -> "18/11/2026 14:32"
// Formatado à mão (sem new Date) porque o backend manda a hora local sem fuso:
// converter com Date poderia deslocar o horário dependendo do aparelho.
function formatarDataHora(dataHora: string): string {
    const [data, hora = ""] = dataHora.split("T");
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano} ${hora.slice(0, 5)}`;
}

// null (não medido) aparece como "—"
function valor(numero: number | null, sufixo = ""): string {
    return numero === null ? "—" : `${numero}${sufixo}`;
}

export default function RegistroCard({ registro }: RegistroCardProps) {
    // Lista de colunas: evita repetir o mesmo bloco de JSX cinco vezes.
    const colunas = [
        { rotulo: "pH", valor: valor(registro.ph) },
        { rotulo: "Temp", valor: valor(registro.temperatura, "°") },
        { rotulo: "Amônia", valor: valor(registro.amonia) },
        { rotulo: "NO₂", valor: valor(registro.nitrito) },
        { rotulo: "NO₃", valor: valor(registro.nitrato) },
    ];

    return (
        <View style={styles.cartao}>
            <Text style={styles.data}>{formatarDataHora(registro.dataHora)}</Text>
            <View style={styles.colunas}>
                {colunas.map((coluna) => (
                    <View key={coluna.rotulo} style={styles.coluna}>
                        <Text style={styles.rotulo}>{coluna.rotulo}</Text>
                        <Text style={styles.valor}>{coluna.valor}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cartao: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 16,
        gap: 12,
    },
    data: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    colunas: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    coluna: {
        alignItems: "center",
        flex: 1,
        gap: 2,
    },
    rotulo: {
        fontSize: 12,
        color: "#6b7280",
    },
    valor: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0e7490",
    },
});
