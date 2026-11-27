import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ParametroAlerta, RegistroParametro, Severidade } from "@/types";
import { cores, raio, sombra } from "@/theme";
import { formatarDataHora } from "@/utils/formatar";

type RegistroCardProps = {
    registro: RegistroParametro;
    onEditar?: () => void;
    onExcluir?: () => Promise<void>;
};

function valor(numero: number | null, sufixo = ""): string {
    return numero === null ? "—" : `${numero}${sufixo}`;
}

const corStatus = {
    OK: { cor: "#15803d", fundo: "#f0fdf4" },
    ATENCAO: { cor: "#b45309", fundo: "#fffbeb" },
    CRITICO: { cor: "#b91c1c", fundo: "#fef2f2" },
    NAO_MEDIDO: { cor: "#9ca3af", fundo: "#f9fafb" },
};

export default function RegistroCard({ registro, onEditar, onExcluir }: RegistroCardProps) {
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
    const [excluindo, setExcluindo] = useState(false);
    const [erro, setErro] = useState("");

    async function excluir() {
        if (!onExcluir) return;
        setExcluindo(true);
        setErro("");
        try {
            await onExcluir();
        } catch (e) {
            if (e instanceof Error) {
                setErro(e.message);
            }
            setExcluindo(false);
        }
    }

    // pior severidade dos alertas deste registro para o parametro
    function status(parametro: ParametroAlerta | null, medido: boolean): keyof typeof corStatus {
        if (!medido) return "NAO_MEDIDO";
        const severidades: Severidade[] = (registro.alertas ?? [])
            .filter((a) => a.parametro === parametro)
            .map((a) => a.severidade);
        if (severidades.includes("CRITICO")) return "CRITICO";
        if (severidades.includes("ATENCAO")) return "ATENCAO";
        return "OK";
    }

    // nitrato nao tem regra no backend
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
                <View style={styles.acoes}>
                    {onEditar && (
                        <Pressable onPress={onEditar} hitSlop={8} accessibilityLabel="Editar registro">
                            <Ionicons name="create-outline" size={20} color={cores.textoFraco} />
                        </Pressable>
                    )}
                    {onExcluir && !confirmandoExclusao && (
                        <Pressable onPress={() => setConfirmandoExclusao(true)} hitSlop={8} accessibilityLabel="Excluir registro">
                            <Ionicons name="trash-outline" size={20} color={cores.textoFraco} />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* o alert com botoes nao funciona na web */}
            {confirmandoExclusao && (
                <View style={styles.confirmacao}>
                    <Text style={styles.textoConfirmacao}>Excluir este registro e seus alertas?</Text>
                    <Pressable onPress={() => setConfirmandoExclusao(false)} disabled={excluindo}>
                        <Text style={styles.cancelar}>Não</Text>
                    </Pressable>
                    <Pressable onPress={excluir} disabled={excluindo}>
                        <Text style={styles.excluir}>{excluindo ? "Excluindo..." : "Excluir"}</Text>
                    </Pressable>
                </View>
            )}
            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
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
    acoes: {
        flexDirection: "row",
        gap: 14,
        marginLeft: 8,
    },
    confirmacao: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        backgroundColor: cores.perigoClaro,
        borderRadius: raio.pequeno,
        padding: 10,
    },
    textoConfirmacao: {
        flex: 1,
        color: cores.texto,
        fontSize: 13,
    },
    cancelar: {
        color: cores.textoSecundario,
        fontWeight: "600",
    },
    excluir: {
        color: cores.perigo,
        fontWeight: "bold",
    },
    erro: {
        color: cores.perigo,
        fontSize: 13,
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
        flex: 1,
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
