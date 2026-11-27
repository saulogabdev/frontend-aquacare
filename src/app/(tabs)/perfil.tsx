import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAquarioContext } from "@/contexts/AquarioContext";
import { Card, Tela, TituloTela } from "@/components/ui";
import { cores, gradientes, raio } from "@/theme";
import { formatarData, iniciais } from "@/utils/formatar";

function Linha({ icone, rotulo, valor }: { icone: keyof typeof Ionicons.glyphMap; rotulo: string; valor: string }) {
    return (
        <View style={styles.linha}>
            <View style={styles.iconeLinha}>
                <Ionicons name={icone} size={18} color={cores.primaria} />
            </View>
            <View style={styles.textosLinha}>
                <Text style={styles.rotulo}>{rotulo}</Text>
                <Text style={styles.valor}>{valor}</Text>
            </View>
        </View>
    );
}

export default function Perfil() {
    const { usuario, sair } = useAuthContext();
    const { aquarios } = useAquarioContext();

    return (
        <Tela>
            <TituloTela titulo="Perfil" />

            <Card style={styles.cartaoUsuario}>
                <LinearGradient colors={gradientes.marca} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
                    <Text style={styles.textoAvatar}>{usuario ? iniciais(usuario.nome) : "?"}</Text>
                </LinearGradient>
                <Text style={styles.nome}>{usuario?.nome ?? "Carregando..."}</Text>
                {usuario && <Text style={styles.email}>{usuario.email}</Text>}
                {usuario?.role === "ADMIN" && <Text style={styles.selo}>Administrador</Text>}
            </Card>

            {usuario && (
                <Card>
                    <Linha icone="calendar-outline" rotulo="Membro desde" valor={formatarData(usuario.dataCadastro)} />
                    <Linha icone="fish-outline" rotulo="Aquários cadastrados" valor={String(aquarios.length)} />
                </Card>
            )}

            <Pressable style={styles.botaoSair} onPress={() => sair()}>
                <Ionicons name="log-out-outline" size={20} color={cores.perigo} />
                <Text style={styles.textoSair}>Sair da conta</Text>
            </Pressable>
        </Tela>
    );
}

const styles = StyleSheet.create({
    cartaoUsuario: {
        alignItems: "center",
        gap: 4,
        paddingVertical: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: raio.pilula,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    textoAvatar: {
        color: cores.branco,
        fontSize: 28,
        fontWeight: "800",
    },
    nome: {
        fontSize: 20,
        fontWeight: "800",
        color: cores.texto,
    },
    email: {
        color: cores.textoSecundario,
    },
    selo: {
        marginTop: 6,
        backgroundColor: "#ede9fe",
        color: "#6d28d9",
        fontWeight: "bold",
        fontSize: 12,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: raio.pilula,
        overflow: "hidden",
    },
    linha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    iconeLinha: {
        width: 38,
        height: 38,
        borderRadius: raio.pequeno,
        backgroundColor: cores.primariaClara,
        alignItems: "center",
        justifyContent: "center",
    },
    textosLinha: {
        flex: 1,
    },
    rotulo: {
        fontSize: 13,
        color: cores.textoSecundario,
    },
    valor: {
        fontSize: 15,
        fontWeight: "600",
        color: cores.texto,
    },
    botaoSair: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: cores.branco,
        borderWidth: 1,
        borderColor: "#fecaca",
        borderRadius: raio.pequeno,
        paddingVertical: 14,
    },
    textoSair: {
        color: cores.perigo,
        fontWeight: "bold",
        fontSize: 15,
    },
});
