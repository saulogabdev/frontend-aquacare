import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard } from "react-native";
import { Agressividade, Animal, RegiaoNado } from "@/types";
import { sombra } from "@/theme";

type EspecieCardProps = {
    animal: Animal;

    onAdicionar?: (quantidade: number) => Promise<void>;
};

const rotuloAgressividade: Record<Agressividade, string> = {
    PACIFICO: "Pacífico",
    SEMI_AGRESSIVO: "Semi-agressivo",
    AGRESSIVO: "Agressivo",
};

const rotuloRegiao: Record<RegiaoNado, string> = {
    TOPO: "Topo",
    MEIO: "Meio",
    FUNDO: "Fundo",
};

export default function EspecieCard({ animal, onAdicionar }: EspecieCardProps) {
    const [aberto, setAberto] = useState(false);
    const [quantidade, setQuantidade] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

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
        try {
            await onAdicionar(numero);
            setAberto(false);
            setQuantidade("");
        } catch (e) {
            // Aqui aparece, por exemplo, a mensagem de incompatibilidade que o backend devolve.
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
            <Text style={styles.nome}>{animal.nomePopular}</Text>
            <Text style={styles.cientifico}>{animal.nomeCientifico}</Text>

            <View style={styles.etiquetas}>
                <Text style={styles.etiqueta}>pH {animal.phMin}–{animal.phMax}</Text>
                <Text style={styles.etiqueta}>{animal.tempMin}–{animal.tempMax} °C</Text>
                <Text style={styles.etiqueta}>{rotuloAgressividade[animal.agressividade]}</Text>
                <Text style={styles.etiqueta}>Nado: {rotuloRegiao[animal.regiaoNado]}</Text>
                <Text style={styles.etiqueta}>{animal.tamanhoMedio} cm</Text>
                {animal.quantidadeMinimaGrupo !== null && (
                    <Text style={styles.etiqueta}>Grupo mín.: {animal.quantidadeMinimaGrupo}</Text>
                )}
            </View>

            {onAdicionar && !aberto && (
                <Pressable style={styles.botaoSecundario} onPress={() => setAberto(true)}>
                    <Text style={styles.textoBotaoSecundario}>+ Adicionar ao aquário</Text>
                </Pressable>
            )}

            {onAdicionar && aberto && (
                <View style={styles.formulario}>
                    <TextInput
                        style={styles.campo}
                        placeholder="Quantidade"
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
        </View>
    );
}

const styles = StyleSheet.create({
    cartao: {
        ...sombra,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        gap: 6,
    },
    nome: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#111827",
    },
    cientifico: {
        fontStyle: "italic",
        color: "#6b7280",
    },
    etiquetas: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 4,
    },
    etiqueta: {
        backgroundColor: "#ecfeff",
        color: "#0e7490",
        fontSize: 12,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        overflow: "hidden",
    },
    formulario: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 6,
    },
    campo: {
        flex: 1,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        padding: 10,
    },
    botao: {
        backgroundColor: "#0891b2",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    botaoDesabilitado: {
        opacity: 0.6,
    },
    textoBotao: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    botaoSecundario: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#0891b2",
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: "center",
    },
    textoBotaoSecundario: {
        color: "#0891b2",
        fontWeight: "bold",
    },
    cancelar: {
        color: "#6b7280",
    },
    erro: {
        color: "#dc2626",
        marginTop: 4,
    },
});
