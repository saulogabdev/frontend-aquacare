import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useAuthContext } from "@/contexts/AuthContext";

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
        <View style={styles.container}>
            <Text style={styles.titulo}>Aquacare</Text>
            {aviso !== "" && erro === "" && <Text style={styles.aviso}>{aviso}</Text>}
            <TextInput style={styles.campo} placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.campo} placeholder="Senha" secureTextEntry autoCapitalize="none" value={senha} onChangeText={setSenha} />
            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
            <Pressable style={styles.botao} onPress={() => fazerLogin()} disabled={carregando}>
                <Text style={styles.textoBotao}>{carregando ? "Entrando..." : "Entrar"}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    titulo: {
        fontWeight: "bold",
        fontSize: 24,
        color: "#111827",
        textAlign: "center",
    },
    container: {
        gap: 12,
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    campo: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        padding: 12,
    },
    botao: {
        backgroundColor: "#0891b2",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    textoBotao: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    erro: {
        color: "#dc2626",
        textAlign: "center",
    },
    aviso: {
        backgroundColor: "#fef3c7",
        color: "#b45309",
        padding: 12,
        borderRadius: 12,
        textAlign: "center",
        overflow: "hidden",
    },
});