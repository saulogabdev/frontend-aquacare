import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ModalEncerrarCiclagem from "@/components/ModalEncerrarCiclagem";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Aquario, NivelPlantas } from "@/types";
import { cores, gradientes, raio } from "@/theme";
import { formatarData } from "@/utils/formatar";
import { CICLAGEM_DIAS, diasDesde, emCiclagem } from "@/utils/ciclagem";

const rotuloPlantas: Record<NivelPlantas, string> = {
    BAIXA: "baixo",
    MEDIA: "médio",
    ALTA: "alto",
};

type BannerAquarioProps = {
    aquario: Aquario;
    // Promise: o pop-up espera o PUT terminar (e mostra o erro, se falhar) antes de fechar.
    onEncerrarCiclagem: () => Promise<void>;
};

// Etiqueta translúcida dentro do banner ("Ciclado", "CO₂ ativo"...).
function Chip({ icone, texto }: { icone: keyof typeof Ionicons.glyphMap; texto: string }) {
    return (
        <View style={styles.chip}>
            <Ionicons name={icone} size={13} color={cores.branco} />
            <Text style={styles.textoChip}>{texto}</Text>
        </View>
    );
}

// Banner em degradê do aquário ativo (topo do Dashboard, como no protótipo).
export default function BannerAquario({ aquario, onEncerrarCiclagem }: BannerAquarioProps) {
    // O pop-up aparece quando este estado é true (o "visible" do Modal é controlado por estado).
    const [mostrarModal, setMostrarModal] = useState(false);
    const ciclando = emCiclagem(aquario);

    return (
        <LinearGradient colors={gradientes.marca} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.6 }} style={styles.banner}>
            <Text style={styles.nome}>{aquario.nome}</Text>
            <Text style={styles.detalhes}>
                {aquario.litragem}L  •  {aquario.tipoAgua === "DOCE" ? "Água doce" : "Marinho"}  •  Desde {formatarData(aquario.dataMontagem)}
            </Text>
            <View style={styles.chips}>
                <Chip icone="sync" texto={!ciclando ? "Ciclado" : `Em ciclagem · dia ${diasDesde(aquario.dataMontagem)} de ${CICLAGEM_DIAS}`} />
                {aquario.injecaoCO2 && <Chip icone="water" texto="CO₂ ativo" />}
                <Chip icone="leaf" texto={`Plantas: ${rotuloPlantas[aquario.nivelPlantas]}`} />
            </View>

            {/* Só aparece durante a ciclagem: abre o pop-up de confirmação */}
            {ciclando && (
                <Pressable style={styles.botaoCiclagem} onPress={() => setMostrarModal(true)}>
                    <Ionicons name="checkmark-done" size={16} color={cores.primariaEscura} />
                    <Text style={styles.textoBotaoCiclagem}>Encerrar ciclagem</Text>
                </Pressable>
            )}

            <ModalEncerrarCiclagem
                visivel={mostrarModal}
                diasMontagem={diasDesde(aquario.dataMontagem)}
                onCancelar={() => setMostrarModal(false)}
                onConfirmar={async () => {
                    await onEncerrarCiclagem(); // faz o PUT; se der erro, o modal mostra e continua aberto
                    setMostrarModal(false);     // só fecha se deu certo
                }}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    banner: {
        borderRadius: raio.medio,
        padding: 20,
        gap: 6,
    },
    nome: {
        color: cores.branco,
        fontSize: 24,
        fontWeight: "800",
    },
    detalhes: {
        color: "#ecfeff",
        fontSize: 13,
    },
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 8,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: raio.pilula,
    },
    textoChip: {
        color: cores.branco,
        fontSize: 12,
        fontWeight: "600",
    },
    botaoCiclagem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        alignSelf: "flex-start",
        marginTop: 10,
        backgroundColor: "rgba(255,255,255,0.95)",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: raio.pilula,
    },
    textoBotaoCiclagem: {
        color: cores.primariaEscura,
        fontWeight: "bold",
        fontSize: 13,
    },
});
