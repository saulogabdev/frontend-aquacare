import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Aquario, NivelPlantas } from "@/types";
import { cores, gradientes, raio } from "@/theme";
import { formatarData } from "@/utils/formatar";

const rotuloPlantas: Record<NivelPlantas, string> = {
    BAIXA: "baixo",
    MEDIA: "médio",
    ALTA: "alto",
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
export default function BannerAquario({ aquario }: { aquario: Aquario }) {
    return (
        <LinearGradient colors={gradientes.marca} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.6 }} style={styles.banner}>
            <Text style={styles.nome}>{aquario.nome}</Text>
            <Text style={styles.detalhes}>
                {aquario.litragem}L  •  {aquario.tipoAgua === "DOCE" ? "Água doce" : "Marinho"}  •  Desde {formatarData(aquario.dataMontagem)}
            </Text>
            <View style={styles.chips}>
                <Chip icone="sync" texto={aquario.isCiclado ? "Ciclado" : "Não ciclado"} />
                {aquario.injecaoCO2 && <Chip icone="water" texto="CO₂ ativo" />}
                <Chip icone="leaf" texto={`Plantas: ${rotuloPlantas[aquario.nivelPlantas]}`} />
            </View>
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
});
