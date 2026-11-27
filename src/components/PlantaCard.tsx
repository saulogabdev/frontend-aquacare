import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Dificuldade, Nivel, Planta } from "@/types";
import { cores, sombra } from "@/theme";

type PlantaCardProps = {
    planta: Planta;
    // undefined = sem aquario selecionado
    onAdicionar?: (quantidade: number) => Promise<void>;
};

const rotuloDificuldade: Record<Dificuldade, string> = {
    FACIL: "Fácil",
    MEDIO: "Média",
    DIFICIL: "Difícil",
};

const rotuloLuz: Record<Nivel, string> = {
    BAIXA: "Luz baixa",
    MEDIA: "Luz média",
    ALTA: "Luz alta",
};

export default function PlantaCard({ planta, onAdicionar }: PlantaCardProps) {
    const [aberto, setAberto] = useState(false);
    const [quantidade, setQuantidade] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const [adicionada, setAdicionada] = useState(false);

    async function confirmar() {
        if (!onAdicionar) return;
        const numero = Number(quantidade);
        if (!Number.isInteger(numero) || numero <= 0) {
            setErro("Informe uma quantidade inteira maior que zero.");
            return;
        }
        Keyboard.dismiss();
        setSalvando(true);
        setErro("");
        setAdicionada(false);
        try {
            await onAdicionar(numero);
            setAdicionada(true);
            setAberto(false);
            setQuantidade("");
        } catch (e) {
            if (e instanceof Error) {
                setErro(e.message);
            }
        } finally {
            setSalvando(false);
        }
    }

    function cancelar() {
        setAberto(false);
        setQuantidade("");
        setErro("");
    }

    return (
        <View style={styles.cartao}>
            <View style={styles.linhaNome}>
                <Ionicons name="leaf" size={18} color="#15803d" />
                <Text style={styles.nome}>{planta.nomePopular}</Text>
            </View>
            <Text style={styles.cientifico}>{planta.nomeCientifico}</Text>
            {planta.descricao !== "" && <Text style={styles.descricao}>{planta.descricao}</Text>}

            <View style={styles.etiquetas}>
                <Text style={styles.etiqueta}>{rotuloDificuldade[planta.dificuldade]}</Text>
                <Text style={styles.etiqueta}>{rotuloLuz[planta.iluminacao]}</Text>
                {planta.co2Necessario && <Text style={[styles.etiqueta, styles.etiquetaCo2]}>Precisa de CO₂</Text>}
                <Text style={styles.etiqueta}>pH {planta.phMin}–{planta.phMax}</Text>
                <Text style={styles.etiqueta}>{planta.tempMin}–{planta.tempMax} °C</Text>
                <Text style={styles.etiqueta}>até {planta.alturaCm} cm</Text>
            </View>

            {onAdicionar && !aberto && (
                <Pressable style={styles.botaoSecundario} onPress={() => setAberto(true)}>
                    <Text style={styles.textoBotaoSecundario}>+ Adicionar ao aquário</Text>
                </Pressable>
            )}

            {onAdicionar && aberto && (
                <View style={styles.formulario}>
                    <TextInput
                        placeholderTextColor={cores.textoFraco}
                        style={styles.campo}
                        placeholder="Quantidade (mudas)"
                        value={quantidade}
                        onChangeText={setQuantidade}
                        keyboardType="number-pad"
                        autoFocus
                    />
                    <Pressable
                        style={[styles.botao, salvando && styles.botaoDesabilitado]}
                        onPress={confirmar}
                        disabled={salvando}
                    >
                        <Text style={styles.textoBotao}>{salvando ? "Salvando..." : "Confirmar"}</Text>
                    </Pressable>
                    <Pressable onPress={cancelar} disabled={salvando}>
                        <Text style={styles.cancelar}>Cancelar</Text>
                    </Pressable>
                </View>
            )}

            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

            {/* a api nao devolve alertas ao associar planta, a analise fica no diagnostico */}
            {adicionada && (
                <Text style={styles.adicionada}>
                    ✓ Adicionada ao aquário. Confira o diagnóstico no Dashboard.
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cartao: {
        ...sombra,
        backgroundColor: cores.branco,
        borderRadius: 16,
        padding: 16,
        gap: 6,
    },
    linhaNome: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    nome: {
        fontSize: 17,
        fontWeight: "bold",
        color: cores.texto,
    },
    cientifico: {
        fontStyle: "italic",
        color: cores.textoSecundario,
    },
    descricao: {
        color: "#374151",
        fontSize: 13,
    },
    etiquetas: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 4,
    },
    etiqueta: {
        backgroundColor: "#f0fdf4",
        color: "#15803d",
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        overflow: "hidden",
    },
    etiquetaCo2: {
        backgroundColor: "#fef3c7",
        color: "#b45309",
        fontWeight: "bold",
    },
    formulario: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 6,
    },
    campo: {
        color: cores.texto,
        flex: 1,
        backgroundColor: cores.branco,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: 12,
        padding: 10,
    },
    botao: {
        backgroundColor: "#15803d",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    botaoDesabilitado: {
        opacity: 0.6,
    },
    textoBotao: {
        color: cores.branco,
        fontWeight: "bold",
    },
    botaoSecundario: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#15803d",
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: "center",
    },
    textoBotaoSecundario: {
        color: "#15803d",
        fontWeight: "bold",
    },
    cancelar: {
        color: cores.textoSecundario,
    },
    erro: {
        color: cores.perigo,
        marginTop: 4,
    },
    adicionada: {
        color: "#15803d",
        fontWeight: "600",
        fontSize: 13,
        marginTop: 4,
    },
});
