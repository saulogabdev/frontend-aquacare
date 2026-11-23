import { useState } from "react";
import { Link } from "expo-router";
import { Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Logo } from "@/components/Cabecalho";
import { BotaoGradiente } from "@/components/ui";
import { cores, gradientes, raio, sombra } from "@/theme";
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
        <LinearGradient colors={gradientes.fundo} style={styles.fundo}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.marca}>
                <Logo tamanho={56} />
                <Text style={styles.titulo}>Criar conta</Text>
                <Text style={styles.subtitulo}>Cadastre-se para monitorar seus aquários.</Text>
            </View>

            <TextInput style={styles.campo} placeholder="Nome" value={nome} onChangeText={setNome} />
            <TextInput style={styles.campo} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.campo} placeholder="Senha (mínimo 6 caracteres)" secureTextEntry autoCapitalize="none" value={senha} onChangeText={setSenha} />
            <TextInput style={styles.campo} placeholder="Confirmar senha" secureTextEntry autoCapitalize="none" value={confirmacao} onChangeText={setConfirmacao} />

            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

            <BotaoGradiente texto={carregando ? "Criando conta..." : "Criar conta"} onPress={criarConta} carregando={carregando} />

            <Link href="/login" replace style={styles.link}>
                Já tenho conta. Entrar
            </Link>
        </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    fundo: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        gap: 12,
        justifyContent: "center",
        padding: 24,
    },
    marca: {
        alignItems: "center",
        gap: 6,
        marginBottom: 12,
    },
    titulo: {
        fontWeight: "800",
        fontSize: 26,
        color: cores.texto,
        marginTop: 8,
    },
    subtitulo: {
        color: cores.textoSecundario,
        textAlign: "center",
    },
    campo: {
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
});
