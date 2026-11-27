import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthContext } from "@/contexts/AuthContext";
import { cores, gradientes, raio } from "@/theme";
import { iniciais } from "@/utils/formatar";

export function Logo({ tamanho = 36 }: { tamanho?: number }) {
    return (
        <LinearGradient
            colors={gradientes.marca}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.logo, { width: tamanho, height: tamanho, borderRadius: tamanho / 3 }]}
        >
            <Ionicons name="fish" size={tamanho * 0.6} color={cores.branco} />
        </LinearGradient>
    );
}

// espaco da barra de status (notch)
export default function Cabecalho() {
    const { usuario, sair } = useAuthContext();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.barra, { paddingTop: insets.top + 8 }]}>
            <View style={styles.marca}>
                <Logo />
                <Text style={styles.nomeApp}>AquaCare</Text>
            </View>
            <View style={styles.acoes}>
                {usuario && (
                    <LinearGradient colors={gradientes.marca} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
                        <Text style={styles.textoAvatar}>{iniciais(usuario.nome)}</Text>
                    </LinearGradient>
                )}
                <Pressable onPress={() => sair()} style={styles.botaoSair} accessibilityLabel="Sair">
                    <Ionicons name="log-out-outline" size={18} color={cores.textoSecundario} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    barra: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 12,
        backgroundColor: "rgba(255,255,255,0.92)",
        borderBottomWidth: 1,
        borderBottomColor: cores.bordaClara,
    },
    marca: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    logo: {
        alignItems: "center",
        justifyContent: "center",
    },
    nomeApp: {
        fontSize: 20,
        fontWeight: "800",
        color: cores.primaria,
    },
    acoes: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: raio.pilula,
        alignItems: "center",
        justifyContent: "center",
    },
    textoAvatar: {
        color: cores.branco,
        fontSize: 12,
        fontWeight: "800",
    },
    botaoSair: {
        width: 34,
        height: 34,
        borderRadius: raio.pilula,
        backgroundColor: cores.bordaClara,
        alignItems: "center",
        justifyContent: "center",
    },
});
