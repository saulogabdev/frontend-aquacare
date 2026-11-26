import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Logo } from "@/components/Cabecalho";
import { BotaoGradiente } from "@/components/ui";
import { cores, gradientes, raio, sombra } from "@/theme";
import { useAuthContext } from "@/contexts/AuthContext";
import { Link } from "expo-router";

export default function Login() {
    const { entrar, aviso } = useAuthContext();
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function fazerLogin() {
        setCarregando(true);
        setErro("");

        try {
            await entrar(email, senha);
        } catch (erro) {
            if (erro instanceof Error) {
                setErro(erro.message);
            }
        } finally {
            setCarregando(false);
        }
    }
    
    return (
        <LinearGradient colors={gradientes.fundo} style={styles.fundo}>
        <View style={styles.container}>
            <View style={styles.marca}>
                <Logo tamanho={64} />
                <Text style={styles.titulo}>AquaCare</Text>
                <Text style={styles.subtitulo}>Monitoramento inteligente do seu aquário</Text>
            </View>
            {aviso !== "" && erro === "" && <Text style={styles.aviso}>{aviso}</Text>}
            <TextInput placeholderTextColor={cores.textoFraco} style={styles.campo} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput placeholderTextColor={cores.textoFraco} style={styles.campo} placeholder="Senha" secureTextEntry autoCapitalize="none" value={senha} onChangeText={setSenha} />
            <Link href="/recuperar-senha" replace style={styles.esqueci}>
                Esqueci minha senha
            </Link>
            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
            <BotaoGradiente texto={carregando ? "Entrando..." : "Entrar"} onPress={() => fazerLogin()} carregando={carregando} />
            <Link href="/cadastro" replace style={styles.link}>
                Não tem conta? Criar conta
            </Link>
        </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    fundo: {
        flex: 1,
    },
    container: {
        gap: 12,
        flex: 1,
        justifyContent: "center",
        padding: 24,
    },
    marca: {
        alignItems: "center",
        gap: 6,
        marginBottom: 16,
    },
    titulo: {
        fontWeight: "800",
        fontSize: 30,
        color: cores.primaria,
        marginTop: 8,
    },
    subtitulo: {
        color: cores.textoSecundario,
        textAlign: "center",
    },
    campo: {
        color: cores.texto,
        backgroundColor: cores.branco,
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: raio.pequeno,
        padding: 14,
        ...sombra,
    },
    erro: {
        color: cores.perigo,
        textAlign: "center",
    },
    link: {
        color: cores.primaria,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 4,
    },
    esqueci: {
        color: cores.textoSecundario,
        textAlign: "right",
        fontSize: 13,
    },
    aviso: {
        backgroundColor: "#fef3c7",
        color: "#b45309",
        padding: 12,
        borderRadius: raio.pequeno,
        textAlign: "center",
        overflow: "hidden",
    },
});
