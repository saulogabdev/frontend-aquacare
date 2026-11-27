import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card, EstadoVazio, MensagemErro, Tela, TituloTela } from "@/components/ui";
import { cores, raio } from "@/theme";
import EspecieCard from "@/components/EspecieCard";
import PlantaCard from "@/components/PlantaCard";
import { useAquarioContext } from "@/contexts/AquarioContext";
import { useEspecieContext } from "@/contexts/EspecieContext";
import { usePeixesDoAquario } from "@/hooks/usePeixesDoAquario";
import { usePlantasDoAquario } from "@/hooks/usePlantasDoAquario";
import { CICLAGEM_DIAS } from "@/utils/ciclagem";

export default function Especies() {
    const { aquarios, idSelecionado } = useAquarioContext();
    const aquarioSelecionado = aquarios.find((a) => a.id === idSelecionado);
    const { animais, carregando, erro } = useEspecieContext();
    const { peixes, carregando: carregandoPeixes, erro: erroPeixes, adicionar, remover } = usePeixesDoAquario();
    const { catalogo, plantas, carregando: carregandoPlantas, erro: erroPlantas, adicionar: adicionarPlanta, remover: removerPlanta } = usePlantasDoAquario();
    const [aba, setAba] = useState<"peixes" | "plantas">("peixes");
    const [busca, setBusca] = useState("");
    const [erroRemover, setErroRemover] = useState("");

    const termo = busca.trim().toLowerCase();
    const animaisFiltrados = animais.filter(
        (a) => a.nomePopular.toLowerCase().includes(termo) || a.nomeCientifico.toLowerCase().includes(termo)
    );
    const plantasFiltradas = catalogo.filter(
        (p) => p.nomePopular.toLowerCase().includes(termo) || p.nomeCientifico.toLowerCase().includes(termo)
    );

    async function removerDoAquario(idAssociacao: number) {
        setErroRemover("");
        try {
            await removerPlanta(idAssociacao);
        } catch (e) {
            if (e instanceof Error) {
                setErroRemover(e.message);
            }
        }
    }

    function trocarAba(nova: "peixes" | "plantas") {
        setAba(nova);
        setBusca("");
        setErroRemover("");
    }

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

            <View style={styles.seletor}>
                {(["peixes", "plantas"] as const).map((opcao) => {
                    const ativa = aba === opcao;
                    return (
                        <Pressable key={opcao} style={[styles.opcaoSeletor, ativa && styles.opcaoAtiva]} onPress={() => trocarAba(opcao)}>
                            <Ionicons
                                name={opcao === "peixes" ? "fish" : "leaf"}
                                size={16}
                                color={ativa ? cores.primaria : cores.textoSecundario}
                            />
                            <Text style={[styles.textoSeletor, ativa && styles.textoSeletorAtivo]}>
                                {opcao === "peixes" ? "Peixes" : "Plantas"}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {aba === "plantas" && (
                <>
                    <Card>
                        <Text style={styles.tituloSecao}>
                            {aquarioSelecionado ? `Plantas no ${aquarioSelecionado.nome}` : "Nenhum aquário selecionado"}
                        </Text>
                        {carregandoPlantas && plantas.length === 0 && <ActivityIndicator color={cores.primaria} />}
                        {aquarioSelecionado && !carregandoPlantas && plantas.length === 0 && (
                            <EstadoVazio icone="leaf-outline" titulo="Nenhuma planta ainda" texto="Adicione pelo catálogo abaixo. O diagnóstico confere luz, CO₂ e compatibilidade com os peixes." />
                        )}
                        {plantas.map((item) => (
                            <View key={item.id} style={styles.linhaPeixe}>
                                <Ionicons name="leaf" size={18} color="#15803d" />
                                <Text style={styles.nomePeixe}>
                                    {item.planta?.nomePopular ?? `Planta #${item.idPlanta}`}
                                </Text>
                                <Text style={styles.quantidade}>{item.quantidade} un.</Text>
                                <Pressable onPress={() => removerDoAquario(item.id)} style={styles.botaoRemover} accessibilityLabel="Remover">
                                    <Ionicons name="trash-outline" size={18} color={cores.perigo} />
                                </Pressable>
                            </View>
                        ))}
                        <MensagemErro texto={erroRemover} />
                    </Card>

                    <View style={styles.busca}>
                        <Ionicons name="search" size={18} color={cores.textoFraco} />
                        <TextInput placeholderTextColor={cores.textoFraco}
                        style={styles.campoBusca}
                        placeholder="Buscar planta..."
                        value={busca}
                        onChangeText={setBusca}
                        />
                    </View>

                    <MensagemErro texto={erroPlantas} />
                    {!carregandoPlantas && erroPlantas === "" && plantasFiltradas.length === 0 && (
                        <Text style={styles.textoAviso}>Nenhuma planta encontrada.</Text>
                    )}

                    {plantasFiltradas.map((planta) => (
                        <PlantaCard
                            key={planta.idPlanta}
                            planta={planta}
                            onAdicionar={aquarioSelecionado ? (quantidade) => adicionarPlanta(planta.idPlanta, quantidade) : undefined}
                        />
                    ))}
                </>
            )}

            {aba === "peixes" && (
            <>
            {/* aviso, nao bloqueio */}
            {aquarioSelecionado && aquarioSelecionado.emCiclagem && (
                <View style={styles.avisoCiclagem}>
                    <Ionicons name="warning" size={20} color="#b45309" />
                    <Text style={styles.textoAvisoCiclagem}>
                        Este aquário está em ciclagem (dia {aquarioSelecionado.diasMontagem} de {CICLAGEM_DIAS}).
                        Não é indicado adicionar animais agora.
                    </Text>
                </View>
            )}

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
            </>
            )}
        </Tela>
    );
}

const styles = StyleSheet.create({
    seletor: {
        flexDirection: "row",
        backgroundColor: cores.bordaClara,
        borderRadius: raio.pilula,
        padding: 4,
        gap: 4,
    },
    opcaoSeletor: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 8,
        borderRadius: raio.pilula,
    },
    opcaoAtiva: {
        backgroundColor: cores.branco,
    },
    textoSeletor: {
        color: cores.textoSecundario,
        fontWeight: "600",
    },
    textoSeletorAtivo: {
        color: cores.primaria,
    },
    avisoCiclagem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#fef3c7",
        borderWidth: 1,
        borderColor: "#fcd34d",
        borderRadius: raio.medio,
        padding: 14,
    },
    textoAvisoCiclagem: {
        flex: 1,
        color: "#b45309",
        fontSize: 14,
    },
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
