import { ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cores, gradientes, raio, sombra } from "@/theme";

type NomeIcone = keyof typeof Ionicons.glyphMap;

export function Tela({ children }: { children: ReactNode }) {
    return (
        <LinearGradient colors={gradientes.fundo} style={styles.tela}>
            <ScrollView
                contentContainerStyle={styles.conteudoTela}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                {children}
            </ScrollView>
        </LinearGradient>
    );
}

export function TituloTela({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
    return (
        <View style={styles.tituloTela}>
            <Text style={styles.titulo}>{titulo}</Text>
            {subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
        </View>
    );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
    return <View style={[styles.card, style]}>{children}</View>;
}

export function CabecalhoCard({ titulo, acao, onAcao }: { titulo: string; acao?: string; onAcao?: () => void }) {
    return (
        <View style={styles.cabecalhoCard}>
            <Text style={styles.tituloCard}>{titulo}</Text>
            {acao && onAcao && (
                <Pressable onPress={onAcao}>
                    <LinearGradient colors={gradientes.marca} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.pilula}>
                        <Ionicons name="add" size={16} color={cores.branco} />
                        <Text style={styles.textoPilula}>{acao}</Text>
                    </LinearGradient>
                </Pressable>
            )}
        </View>
    );
}

export function BotaoGradiente({ texto, onPress, carregando = false, icone }: {
    texto: string;
    onPress: () => void;
    carregando?: boolean;
    icone?: NomeIcone;
}) {
    return (
        <Pressable onPress={onPress} disabled={carregando} style={carregando && styles.desabilitado}>
            <LinearGradient colors={gradientes.marca} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.botao}>
                {carregando ? (
                    <ActivityIndicator color={cores.branco} />
                ) : (
                    icone && <Ionicons name={icone} size={18} color={cores.branco} />
                )}
                <Text style={styles.textoBotao}>{texto}</Text>
            </LinearGradient>
        </Pressable>
    );
}

export function BotaoContorno({ texto, onPress }: { texto: string; onPress: () => void }) {
    return (
        <Pressable onPress={onPress} style={styles.botaoContorno}>
            <Text style={styles.textoBotaoContorno}>{texto}</Text>
        </Pressable>
    );
}

export function EstadoVazio({ icone, titulo, texto }: { icone: NomeIcone; titulo: string; texto?: string }) {
    return (
        <View style={styles.vazio}>
            <View style={styles.iconeVazio}>
                <Ionicons name={icone} size={28} color="#d1d5db" />
            </View>
            <Text style={styles.tituloVazio}>{titulo}</Text>
            {texto && <Text style={styles.textoVazio}>{texto}</Text>}
        </View>
    );
}

export function MensagemErro({ texto }: { texto: string }) {
    if (texto === "") return null;
    return <Text style={styles.erro}>{texto}</Text>;
}

const styles = StyleSheet.create({
    tela: {
        flex: 1,
    },
    conteudoTela: {
        padding: 20,
        paddingBottom: 32,
        gap: 16,
    },
    tituloTela: {
        marginBottom: -4,
    },
    titulo: {
        fontSize: 26,
        fontWeight: "800",
        color: cores.texto,
    },
    subtitulo: {
        fontSize: 15,
        color: cores.textoSecundario,
        marginTop: 2,
    },
    card: {
        backgroundColor: cores.branco,
        borderRadius: raio.medio,
        padding: 16,
        gap: 12,
        ...sombra,
    },
    cabecalhoCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },
    tituloCard: {
        fontSize: 18,
        fontWeight: "bold",
        color: cores.texto,
    },
    pilula: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingLeft: 10,
        paddingRight: 14,
        paddingVertical: 8,
        borderRadius: raio.pilula,
    },
    textoPilula: {
        color: cores.branco,
        fontWeight: "600",
        fontSize: 14,
    },
    botao: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderRadius: raio.pequeno,
    },
    textoBotao: {
        color: cores.branco,
        fontWeight: "600",
        fontSize: 15,
    },
    desabilitado: {
        opacity: 0.6,
    },
    botaoContorno: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: raio.pequeno,
        borderWidth: 1,
        borderColor: cores.borda,
    },
    textoBotaoContorno: {
        color: "#374151",
        fontWeight: "600",
    },
    vazio: {
        alignItems: "center",
        paddingVertical: 20,
        gap: 4,
    },
    iconeVazio: {
        width: 56,
        height: 56,
        borderRadius: raio.medio,
        backgroundColor: "#f9fafb",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    tituloVazio: {
        fontWeight: "bold",
        color: "#1f2937",
    },
    textoVazio: {
        fontSize: 14,
        color: cores.textoSecundario,
        textAlign: "center",
        paddingHorizontal: 16,
    },
    erro: {
        color: cores.perigo,
        textAlign: "center",
    },
});
