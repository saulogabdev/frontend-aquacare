import { useState } from "react";
import { Link } from "expo-router";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { useAuthContext } from "@/contexts/AuthContext";
import { cadastrarUsuario } from "@/services/usuarioService";

// Validação simples no app, antes de chamar a API: dá uma mensagem clara na hora.
// (A validação "de verdade" continua no backend: @NotBlank, @Email e e-mail repetido.)
function validar(nome: string, email: string, senha: string, confirmacao: string): string {
    if (nome.trim() === "" || email.trim() === "" || senha === "") {
        return "Preencha nome, e-mail e senha.";
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
        return "Informe um e-mail válido.";
    }
    if (senha.length < 6) {
        return "A senha precisa ter pelo menos 6 caracteres.";
    }
    if (senha !== confirmacao) {
        return "As senhas não conferem.";
    }
    return "";
}

export default function Cadastro() {
    const { entrar } = useAuthContext();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    async function criarConta() {
        const mensagem = validar(nome, email, senha, confirmacao);
        if (mensagem !== "") {
            setErro(mensagem);
            return;
        }

        Keyboard.dismiss();
        setCarregando(true);
        setErro("");
        try {
            await cadastrarUsuario(nome.trim(), email.trim(), senha);
            // Conta criada: já entra direto, sem obrigar a digitar tudo de novo no login.
            // Com o token salvo, o Stack.Protected tira esta tela e mostra as abas.
            await entrar(email.trim(), senha);
        } catch (e) {
            if (e instanceof Error) {
                setErro(e.message);
            }
        } finally {
            setCarregando(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.titulo}>Criar conta</Text>
            <Text style={styles.subtitulo}>Cadastre-se para monitorar seus aquários.</Text>

            <TextInput style={styles.campo} placeholder="Nome" value={nome} onChangeText={setNome} />
            <TextInput style={styles.campo} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.campo} placeholder="Senha (mínimo 6 caracteres)" secureTextEntry autoCapitalize="none" value={senha} onChangeText={setSenha} />
            <TextInput style={styles.campo} placeholder="Confirmar senha" secureTextEntry autoCapitalize="none" value={confirmacao} onChangeText={setConfirmacao} />

            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

            <Pressable style={[styles.botao, carregando && styles.botaoDesabilitado]} onPress={criarConta} disabled={carregando}>
                <Text style={styles.textoBotao}>{carregando ? "Criando conta..." : "Criar conta"}</Text>
            </Pressable>

            <Link href="/login" replace style={styles.link}>
                Já tenho conta. Entrar
            </Link>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        gap: 12,
        justifyContent: "center",
        padding: 20,
    },
    titulo: {
        fontWeight: "bold",
        fontSize: 24,
        color: "#111827",
        textAlign: "center",
    },
    subtitulo: {
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 8,
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
    botaoDesabilitado: {
        opacity: 0.6,
    },
    textoBotao: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    erro: {
        color: "#dc2626",
        textAlign: "center",
    },
    link: {
        color: "#0891b2",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 4,
    },
});
