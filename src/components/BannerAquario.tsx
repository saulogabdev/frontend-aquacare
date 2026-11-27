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
    onEncerrarCiclagem: () => Promise<void>;
};

function Chip({ icone, texto }: { icone: keyof typeof Ionicons.glyphMap; texto: string }) {
    return (
        <View style={styles.chip}>
            <Ionicons name={icone} size={13} color={cores.branco} />
            <Text style={styles.textoChip}>{texto}</Text>
        </View>
    );
}

export default function BannerAquario({ aquario, onEncerrarCiclagem }: BannerAquarioProps) {
    const [mostrarModal, setMostrarModal] = useState(false);
    const ciclando = aquario.emCiclagem;

    return (
        <LinearGradient colors={gradientes.marca} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.6 }} style={styles.banner}>
            <Text style={styles.nome}>{aquario.nome}</Text>
            <Text style={styles.detalhes}>
                {aquario.litragem}L  •  {aquario.tipoAgua === "DOCE" ? "Água doce" : "Marinho"}  •  Desde {formatarData(aquario.dataMontagem)}
            </Text>
            <View style={styles.chips}>
                <Chip icone="sync" texto={!ciclando ? "Ciclado" : `Em ciclagem · dia ${aquario.diasMontagem} de ${CICLAGEM_DIAS}`} />
                {aquario.injecaoCO2 && <Chip icone="water" texto="CO₂ ativo" />}
                <Chip icone="leaf" texto={`Plantas: ${rotuloPlantas[aquario.nivelPlantas]}`} />
            </View>

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
                    await onEncerrarCiclagem();
                    setMostrarModal(false);
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
