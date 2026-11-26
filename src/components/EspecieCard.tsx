import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Keyboard } from "react-native";
import { Agressividade, Alerta, Animal, RegiaoNado } from "@/types";
import AlertaItem from "@/components/AlertaItem";
import { cores, sombra } from "@/theme";

type EspecieCardProps = {
    animal: Animal;
    // undefined = não há aquário selecionado (o botão de adicionar não aparece).
    // Devolve os alertas da associação (ex.: "aquário em ciclagem"), que o card mostra.
    onAdicionar?: (quantidade: number) => Promise<Alerta[]>;
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
    // Alertas da última vez que esta espécie foi adicionada (a espécie É adicionada; o alerta só informa).
    const [alertas, setAlertas] = useState<Alerta[]>([]);

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
        setAlertas([]);
        try {
            const novos = await onAdicionar(numero);
            setAlertas(novos);
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
                    <TextInput placeholderTextColor={cores.textoFraco}
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

            {/* Adicionado, mas com ressalvas: o SAD avisa e deixa o usuário decidir */}
            {alertas.length > 0 && (
                <View style={styles.alertas}>
                    <Text style={styles.adicionado}>✓ Adicionado ao aquário, com {alertas.length === 1 ? "um alerta" : "alertas"}:</Text>
                    {alertas.map((alerta, indice) => <AlertaItem key={indice} alerta={alerta} />)}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    alertas: {
        gap: 6,
        marginTop: 6,
    },
    adicionado: {
        fontSize: 13,
        fontWeight: "600",
        color: "#15803d",
    },
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
        color: cores.texto,
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
