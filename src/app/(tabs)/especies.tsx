import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card, EstadoVazio, MensagemErro, Tela, TituloTela } from "@/components/ui";
import { cores, raio } from "@/theme";
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
        <Tela>
            <TituloTela titulo="Espécies" subtitulo="Catálogo e espécies do seu aquário" />

            {/* Peixes do aquário selecionado */}
            <Card>
                <Text style={styles.tituloSecao}>
                    {aquarioSelecionado ? `No aquário ${aquarioSelecionado.nome}` : "Nenhum aquário selecionado"}
                </Text>
                {carregandoPeixes && <ActivityIndicator color="#0891b2" />}
                <MensagemErro texto={erroPeixes} />
                {aquarioSelecionado && !carregandoPeixes && peixes.length === 0 && (
                    <EstadoVazio icone="fish-outline" titulo="Nenhuma espécie ainda" texto="Adicione pelo catálogo abaixo: sem espécies, o diagnóstico não consegue avaliar a água." />
                )}
                {peixes.map((peixe) => (
                    <View key={peixe.id} style={styles.linhaPeixe}>
                        <Ionicons name="fish" size={18} color={cores.primaria} />
                        <Text style={styles.nomePeixe}>
                            {peixe.animal?.nomePopular ?? `Espécie #${peixe.idAnimal}`}
                        </Text>
                        <Text style={styles.quantidade}>{peixe.quantidade} un.</Text>
                        <Pressable onPress={() => removerPeixe(peixe.id)} style={styles.botaoRemover} accessibilityLabel="Remover">
                            <Ionicons name="trash-outline" size={18} color={cores.perigo} />
                        </Pressable>
                    </View>
                ))}
                <MensagemErro texto={erroRemover} />
            </Card>

            {/* Catálogo */}
            <View style={styles.busca}>
                <Ionicons name="search" size={18} color={cores.textoFraco} />
                <TextInput placeholderTextColor={cores.textoFraco}
                style={styles.campoBusca}
                placeholder="Buscar espécie..."
                value={busca}
                onChangeText={setBusca}
                />
            </View>

            {carregando && <ActivityIndicator color="#0891b2" />}
            <MensagemErro texto={erro} />
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
        </Tela>
    );
}

const styles = StyleSheet.create({
    tituloSecao: {
        fontSize: 18,
        fontWeight: "bold",
        color: cores.texto,
    },
    linhaPeixe: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        borderRadius: raio.pequeno,
        borderWidth: 1,
        borderColor: cores.bordaClara,
    },
    nomePeixe: {
        flex: 1,
        color: cores.texto,
        fontWeight: "600",
    },
    quantidade: {
        color: cores.textoSecundario,
        fontWeight: "bold",
    },
    botaoRemover: {
        width: 34,
        height: 34,
        borderRadius: raio.pilula,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: cores.perigoClaro,
    },
    busca: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: cores.branco,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: raio.pequeno,
        paddingHorizontal: 12,
    },
    campoBusca: {
        color: cores.texto,
        flex: 1,
        paddingVertical: 12,
    },
    textoAviso: {
        color: cores.textoSecundario,
        textAlign: "center",
    },
});
