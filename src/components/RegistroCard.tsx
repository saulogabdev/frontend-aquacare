import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { RegistroParametro } from "@/types";
import { cores, raio, sombra } from "@/theme";
import { formatarDataHora } from "@/utils/formatar";

type RegistroCardProps = {
    registro: RegistroParametro;
};

// null (não medido) aparece como "—"
function valor(numero: number | null, sufixo = ""): string {
    return numero === null ? "—" : `${numero}${sufixo}`;
}

export default function RegistroCard({ registro }: RegistroCardProps) {
    // Cada parâmetro tem uma cor de identificação (como no protótipo). Não é a cor do alerta:
    // pintar de verde/amarelo/vermelho depende do backend mandar o "parametro" em cada alerta.
    const colunas = [
        { rotulo: "pH", valor: valor(registro.ph), cor: "#0891b2", fundo: "#ecfeff" },
        { rotulo: "Temp", valor: valor(registro.temperatura, "°"), cor: "#ea580c", fundo: "#fff7ed" },
        { rotulo: "Amônia", valor: valor(registro.amonia), cor: "#dc2626", fundo: "#fef2f2" },
        { rotulo: "NO₂", valor: valor(registro.nitrito), cor: "#db2777", fundo: "#fdf2f8" },
        { rotulo: "NO₃", valor: valor(registro.nitrato), cor: "#7c3aed", fundo: "#faf5ff" },
    ];

    return (
        <View style={styles.cartao}>
            <View style={styles.linhaData}>
                <Ionicons name="calendar-outline" size={18} color={cores.textoFraco} />
                <Text style={styles.data}>{formatarDataHora(registro.dataHora)}</Text>
            </View>
            <View style={styles.colunas}>
                {colunas.map((coluna) => (
                    <View key={coluna.rotulo} style={[styles.coluna, { backgroundColor: coluna.fundo }]}>
                        <Text style={styles.rotulo}>{coluna.rotulo}</Text>
                        <Text style={[styles.valor, { color: coluna.cor }]}>{coluna.valor}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cartao: {
        backgroundColor: cores.branco,
        borderRadius: raio.medio,
        padding: 16,
        gap: 12,
        ...sombra,
    },
    linhaData: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    data: {
        fontSize: 16,
        fontWeight: "bold",
        color: cores.texto,
    },
    colunas: {
        flexDirection: "row",
        gap: 6,
    },
    coluna: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 8,
        borderRadius: raio.pequeno,
        gap: 2,
    },
    rotulo: {
        fontSize: 10,
        color: cores.textoSecundario,
    },
    valor: {
        fontSize: 15,
        fontWeight: "800",
    },
});
