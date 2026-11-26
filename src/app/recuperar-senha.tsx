import { useState } from "react";
import { Link } from "expo-router";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Logo } from "@/components/Cabecalho";
import { BotaoGradiente } from "@/components/ui";
import { cores, gradientes, raio, sombra } from "@/theme";
import { redefinirSenha, solicitarRecuperacaoSenha } from "@/services/usuarioService";

// A tela tem 3 etapas, controladas por um único estado (parecido com um enum em Java):
// "email"   → o usuário informa o e-mail e pede o código;
// "codigo"  → cola o código recebido e escolhe a nova senha;
// "pronto"  → senha trocada, só falta voltar ao login.
type Etapa = "email" | "codigo" | "pronto";

// Mesmas regras de senha do cadastro, para não aceitar aqui uma senha que lá seria recusada.
function validarNovaSenha(codigo: string, senha: string, confirmacao: string): string {
    if (codigo === "" || senha === "") {
        return "Informe o código e a nova senha.";
    }
    if (senha.length < 6) {
        return "A senha precisa ter pelo menos 6 caracteres.";
    }
    if (senha !== confirmacao) {
        return "As senhas não conferem.";
    }
    return "";
}

export default function RecuperarSenha() {
    const [etapa, setEtapa] = useState<Etapa>("email");
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    async function enviarCodigo() {
        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            setErro("Informe um e-mail válido.");
            return;
        }
        Keyboard.dismiss();
        setCarregando(true);
        setErro("");
        try {
            await solicitarRecuperacaoSenha(email.trim());
            setEtapa("codigo");
        } catch (e) {
            // Ex.: 400 "Email não encontrado." (mensagem do backend)
            if (e instanceof Error) {
                setErro(e.message);
            }
        } finally {
            setCarregando(false);
        }
    }

    async function trocarSenha() {
        // O código vem colado do e-mail: tira espaços e quebras de linha que vierem junto.
        const codigoLimpo = codigo.replace(/\s/g, "");
        const mensagem = validarNovaSenha(codigoLimpo, senha, confirmacao);
        if (mensagem !== "") {
            setErro(mensagem);
            return;
        }
        Keyboard.dismiss();
        setCarregando(true);
        setErro("");
        try {
            await redefinirSenha(codigoLimpo, senha);
            setEtapa("pronto");
        } catch (e) {
            // Ex.: 404 "Token não encontrado." ou 400 "Token foi expirado ou já foi usado."
            if (e instanceof Error) {
                setErro(e.message);
            }
        } finally {
            setCarregando(false);
        }
    }

    // Volta para a etapa do e-mail (código expirou, não chegou, e-mail digitado errado...).
    function pedirOutroCodigo() {
        setEtapa("email");
        setCodigo("");
        setErro("");
    }

    return (
        <LinearGradient colors={gradientes.fundo} style={styles.fundo}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <View style={styles.marca}>
                <Logo tamanho={56} />
                <Text style={styles.titulo}>Recuperar senha</Text>
            </View>

            {etapa === "email" && (
                <>
                    <Text style={styles.explicacao}>
                        Informe o e-mail da sua conta. Vamos enviar um código para você criar uma nova senha.
                    </Text>
                    <TextInput placeholderTextColor={cores.textoFraco} style={styles.campo} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
                    {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
                    <BotaoGradiente texto={carregando ? "Enviando..." : "Enviar código"} onPress={enviarCodigo} carregando={carregando} icone="mail" />
                </>
            )}

            {etapa === "codigo" && (
                <>
                    <Text style={styles.explicacao}>
                        Enviamos um código para <Text style={styles.destaque}>{email.trim()}</Text>.
                        Copie o código do e-mail e cole abaixo. Ele vale por 30 minutos.
                    </Text>
                    <TextInput placeholderTextColor={cores.textoFraco} style={styles.campo} placeholder="Código recebido" autoCapitalize="none" autoCorrect={false} value={codigo} onChangeText={setCodigo} />
                    <TextInput placeholderTextColor={cores.textoFraco} style={styles.campo} placeholder="Nova senha (mínimo 6 caracteres)" secureTextEntry autoCapitalize="none" value={senha} onChangeText={setSenha} />
                    <TextInput placeholderTextColor={cores.textoFraco} style={styles.campo} placeholder="Confirmar nova senha" secureTextEntry autoCapitalize="none" value={confirmacao} onChangeText={setConfirmacao} />
                    {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
                    <BotaoGradiente texto={carregando ? "Salvando..." : "Redefinir senha"} onPress={trocarSenha} carregando={carregando} icone="key" />
                    <Pressable onPress={pedirOutroCodigo} disabled={carregando}>
                        <Text style={styles.linkSecundario}>Não recebeu ou expirou? Enviar outro código</Text>
                    </Pressable>
                </>
            )}

            {etapa === "pronto" && (
                <View style={styles.sucesso}>
                    <Ionicons name="checkmark-circle" size={48} color="#15803d" />
                    <Text style={styles.textoSucesso}>Senha alterada! Agora é só entrar com a nova senha.</Text>
                </View>
            )}

            {/* replace: troca a tela em vez de empilhar, igual entre login e cadastro */}
            <Link href="/login" replace style={styles.link}>
                {etapa === "pronto" ? "Ir para o login" : "Lembrei a senha. Entrar"}
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
        marginBottom: 8,
    },
    titulo: {
        fontWeight: "800",
        fontSize: 26,
        color: cores.texto,
        marginTop: 8,
    },
    explicacao: {
        color: cores.textoSecundario,
        textAlign: "center",
        lineHeight: 20,
    },
    destaque: {
        fontWeight: "bold",
        color: cores.texto,
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
    sucesso: {
        alignItems: "center",
        gap: 10,
        backgroundColor: cores.branco,
        borderRadius: raio.medio,
        padding: 20,
        ...sombra,
    },
    textoSucesso: {
        color: cores.texto,
        textAlign: "center",
        fontWeight: "600",
    },
    linkSecundario: {
        color: cores.textoSecundario,
        textAlign: "center",
        textDecorationLine: "underline",
    },
    link: {
        color: cores.primaria,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 4,
    },
});
