import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ParametrosIdeais } from "@/types";
import { useAuthContext } from "@/contexts/AuthContext";
import { buscarParametrosIdeais } from "@/services/aquarioService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import { Card, EstadoVazio, MensagemErro } from "@/components/ui";
import { cores, raio } from "@/theme";

// intersecao das faixas de todas as especies (calculada no backend)
export default function ParametrosIdeaisCard({ idAquario }: { idAquario: number }) {
    const { token, sair } = useAuthContext();
    const [ideais, setIdeais] = useState<ParametrosIdeais | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const recarregar = useCallback(async () => {
        if (token === null) return;
        setCarregando(true);
        setErro("");
        try {
            setIdeais(await buscarParametrosIdeais(token, idAquario));
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
                return;
            }
            if (error instanceof Error) {
                setErro(error.message);
            }
        } finally {
            setCarregando(false);
        }
    }, [token, idAquario, sair]);

    useFocusEffect(
        useCallback(() => {
            recarregar();
        }, [recarregar])
    );

    // minimo maior que o maximo = especies sem faixa em comum (o backend nao avisa)
    const faixaViavel = ideais !== null && ideais.phMin <= ideais.phMax && ideais.tempMin <= ideais.tempMax;

    return (
        <Card>
            <View style={styles.cabecalho}>
                <Ionicons name="options-outline" size={20} color={cores.primaria} />
                <Text style={styles.titulo}>Parâmetros Ideais</Text>
            </View>

            {carregando && ideais === null && <ActivityIndicator color={cores.primaria} />}
            <MensagemErro texto={erro} />

            {!carregando && erro === "" && ideais === null && (
                <EstadoVazio icone="fish-outline" titulo="Sem espécies no aquário" texto="Adicione espécies para calcular a faixa ideal." />
            )}

            {ideais !== null && !faixaViavel && (
                <View style={styles.avisoFaixa}>
                    <Ionicons name="alert-circle" size={22} color="#b91c1c" />
                    <Text style={styles.textoAvisoFaixa}>
                        As espécies do aquário não têm uma faixa de pH ou de temperatura em comum. Ajuste as espécies para
                        obter uma faixa ideal segura.
                    </Text>
                </View>
            )}

            {ideais !== null && faixaViavel && (
                <>
                    <View style={styles.ideais}>
                        <View style={[styles.ideal, { backgroundColor: "#ecfeff" }]}>
                            <Text style={styles.rotuloIdeal}>pH</Text>
                            <Text style={[styles.valorIdeal, { color: "#0891b2" }]}>
                                {ideais.phMin.toFixed(1)} – {ideais.phMax.toFixed(1)}
                            </Text>
                        </View>
                        <View style={[styles.ideal, { backgroundColor: "#fff7ed" }]}>
                            <Text style={styles.rotuloIdeal}>Temperatura</Text>
                            <Text style={[styles.valorIdeal, { color: "#ea580c" }]}>
                                {ideais.tempMin} – {ideais.tempMax} °C
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.nota}>Faixa que atende todas as espécies do aquário ao mesmo tempo.</Text>
                </>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: cores.texto,
    },
    ideais: {
        flexDirection: "row",
        gap: 10,
    },
    ideal: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 14,
        borderRadius: raio.pequeno,
        gap: 2,
    },
    rotuloIdeal: {
        fontSize: 12,
        color: cores.textoSecundario,
    },
    valorIdeal: {
        fontSize: 18,
        fontWeight: "800",
    },
    nota: {
        fontSize: 12,
        color: cores.textoFraco,
        textAlign: "center",
    },
    avisoFaixa: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#fef2f2",
        borderWidth: 1,
        borderColor: "#fecaca",
        borderRadius: raio.pequeno,
        padding: 12,
    },
    textoAvisoFaixa: {
        flex: 1,
        color: "#b91c1c",
        fontSize: 13,
    },
});
