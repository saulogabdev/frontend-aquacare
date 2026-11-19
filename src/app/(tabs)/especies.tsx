import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import EspecieCard from "@/components/EspecieCard";
import { useAquarioContext } from "@/contexts/AquarioContext";
import { useEspecieContext } from "@/contexts/EspecieContext";
import { usePeixesDoAquario } from "@/hooks/usePeixesDoAquario";

export default function Especies() {
    const { aquarios, idSelecionado } = useAquarioContext();
    const aquarioSelecionado = aquarios.find((a) => a.id === idSelecionado);
    const { animais, carregando, erro } = useEspecieContext();
    const { peixes, carregando: carregandoPeixes, erro: erroPeixes, adicionar, remover } = usePeixesDoAquario();
    const [busca, setBusca] = useState("");
    const [erroRemover, setErroRemover] = useState("");

    // Filtro calculado a cada render (não é estado): procura no nome popular e no científico.
    const termo = busca.trim().toLowerCase();
    const animaisFiltrados = animais.filter(
        (a) => a.nomePopular.toLowerCase().includes(termo) || a.nomeCientifico.toLowerCase().includes(termo)
    );

    async function removerPeixe(idAssociacao: number) {
        setErroRemover("");
        try {
            await remover(idAssociacao);
        } catch (e) {
            if (e instanceof Error) {
                setErroRemover(e.message);
            }
        }
    }

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
            <Text style={styles.titulo}>Espécies</Text>

            {/* Peixes do aquário selecionado */}
            <View style={styles.secao}>
                <Text style={styles.tituloSecao}>
                    {aquarioSelecionado ? `No aquário ${aquarioSelecionado.nome}` : "Nenhum aquário selecionado"}
                </Text>
                {carregandoPeixes && <ActivityIndicator color="#0891b2" />}
                {erroPeixes !== "" && <Text style={styles.erro}>{erroPeixes}</Text>}
                {aquarioSelecionado && !carregandoPeixes && peixes.length === 0 && (
                    <Text style={styles.textoAviso}>
                        Nenhuma espécie ainda. Adicione abaixo: sem espécies, o diagnóstico não consegue avaliar a água.
                    </Text>
                )}
                {peixes.map((peixe) => (
                    <View key={peixe.id} style={styles.linhaPeixe}>
                        <Text style={styles.nomePeixe}>
                            {peixe.animal?.nomePopular ?? `Espécie #${peixe.idAnimal}`}
                        </Text>
                        <Text style={styles.quantidade}>{peixe.quantidade} un.</Text>
                        <Pressable onPress={() => removerPeixe(peixe.id)}>
                            <Text style={styles.remover}>Remover</Text>
                        </Pressable>
                    </View>
                ))}
                {erroRemover !== "" && <Text style={styles.erro}>{erroRemover}</Text>}
            </View>

            {/* Catálogo */}
            <TextInput
                style={styles.busca}
                placeholder="Buscar espécie..."
                value={busca}
                onChangeText={setBusca}
            />

            {carregando && <ActivityIndicator color="#0891b2" />}
            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
            {!carregando && erro === "" && animaisFiltrados.length === 0 && (
                <Text style={styles.textoAviso}>Nenhuma espécie encontrada.</Text>
            )}

            {animaisFiltrados.map((animal) => (
                <EspecieCard
                    key={animal.idAnimal}
                    animal={animal}
                    onAdicionar={aquarioSelecionado ? (quantidade) => adicionar(animal.idAnimal, quantidade) : undefined}
                />
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    conteudo: {
        gap: 12,
        padding: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#111827",
    },
    secao: {
        backgroundColor: "#ecfeff",
        borderRadius: 16,
        padding: 16,
        gap: 8,
    },
    tituloSecao: {
        fontWeight: "bold",
        color: "#0e7490",
    },
    linhaPeixe: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    nomePeixe: {
        flex: 1,
        color: "#111827",
    },
    quantidade: {
        color: "#374151",
        fontWeight: "bold",
    },
    remover: {
        color: "#dc2626",
        marginLeft: 8,
    },
    busca: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        padding: 12,
    },
    textoAviso: {
        color: "#6b7280",
    },
    erro: {
        color: "#dc2626",
    },
});
