import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ParametroAlerta, RegistroParametro, Severidade } from "@/types";
import { cores, raio, sombra } from "@/theme";
import { formatarDataHora } from "@/utils/formatar";

type RegistroCardProps = {
    registro: RegistroParametro;
};

// null (não medido) aparece como "—"
function valor(numero: number | null, sufixo = ""): string {
    return numero === null ? "—" : `${numero}${sufixo}`;
}

// Cor de cada situação (como no protótipo): verde = ok, amarelo = atenção, vermelho = crítico, cinza = não medido.
const corStatus = {
    OK: { cor: "#15803d", fundo: "#f0fdf4" },
    ATENCAO: { cor: "#b45309", fundo: "#fffbeb" },
    CRITICO: { cor: "#b91c1c", fundo: "#fef2f2" },
    NAO_MEDIDO: { cor: "#9ca3af", fundo: "#f9fafb" },
};

export default function RegistroCard({ registro }: RegistroCardProps) {
    // Pior severidade dos alertas DESTE registro para um parâmetro (o backend diz a qual parâmetro cada alerta
    // se refere desde 25/11). Ex.: dois alertas de PH, um ATENCAO e um CRITICO → CRITICO.
    function status(parametro: ParametroAlerta | null, medido: boolean): keyof typeof corStatus {
        if (!medido) return "NAO_MEDIDO";
        const severidades: Severidade[] = (registro.alertas ?? [])
            .filter((a) => a.parametro === parametro)
            .map((a) => a.severidade);
        if (severidades.includes("CRITICO")) return "CRITICO";
        if (severidades.includes("ATENCAO")) return "ATENCAO";
        return "OK";
    }

    // O nitrato não tem regra no backend (parametro null): fica verde quando medido.
    const colunas = [
        { rotulo: "pH", valor: valor(registro.ph), status: status("PH", true) },
        { rotulo: "Temp", valor: valor(registro.temperatura, "°"), status: status("TEMPERATURA", true) },
        { rotulo: "Amônia", valor: valor(registro.amonia), status: status("AMONIA", true) },
        { rotulo: "NO₂", valor: valor(registro.nitrito), status: status("NITRITO", registro.nitrito !== null) },
        { rotulo: "NO₃", valor: valor(registro.nitrato), status: status(null, registro.nitrato !== null) },
    ];
    const quantidadeAlertas = registro.alertas?.length ?? 0;

    return (
        <View style={styles.cartao}>
            <View style={styles.linhaData}>
                <Ionicons name="calendar-outline" size={18} color={cores.textoFraco} />
                <Text style={styles.data}>{formatarDataHora(registro.dataHora)}</Text>
                {quantidadeAlertas > 0 && (
                    <Text style={styles.contagem}>
                        {quantidadeAlertas} {quantidadeAlertas === 1 ? "alerta" : "alertas"}
                    </Text>
                )}
            </View>
            <View style={styles.colunas}>
                {colunas.map((coluna) => (
                    <View key={coluna.rotulo} style={[styles.coluna, { backgroundColor: corStatus[coluna.status].fundo }]}>
                        <Text style={styles.rotulo}>{coluna.rotulo}</Text>
                        <Text style={[styles.valor, { color: corStatus[coluna.status].cor }]}>{coluna.valor}</Text>
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
    contagem: {
        marginLeft: "auto",
        fontSize: 12,
        fontWeight: "bold",
        color: "#b91c1c",
        backgroundColor: "#fee2e2",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
        overflow: "hidden",
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
