import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import CampoDataHora from "@/components/CampoDataHora";
import { BotaoContorno, BotaoGradiente, MensagemErro } from "@/components/ui";
import { cores, raio } from "@/theme";
import { proximaHoraCheia } from "@/utils/dataHora";

const SUGESTOES = ["Trocar parte da água", "Testar parâmetros", "Limpar o filtro", "Fertilizar as plantas"];
const TAMANHO_MAXIMO = 100; // a coluna titulo no banco tem tamanho 100

type LembreteFormProps = {
    onSalvar: (titulo: string, data: Date) => Promise<void>;
    onCancelar: () => void;
};

export default function LembreteForm({ onSalvar, onCancelar }: LembreteFormProps) {
    const [titulo, setTitulo] = useState("");
    const [data, setData] = useState(proximaHoraCheia);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    async function salvar() {
        // o backend nao valida titulo nem data
        if (titulo.trim() === "") {
            setErro("Informe o que precisa ser feito.");
            return;
        }
        if (data.getTime() <= Date.now()) {
            setErro("Escolha um horário no futuro.");
            return;
        }
        Keyboard.dismiss();
        setSalvando(true);
        setErro("");
        try {
            await onSalvar(titulo.trim(), data);
        } catch (e) {
            if (e instanceof Error) {
                setErro(e.message);
            }
        } finally {
            setSalvando(false);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholderTextColor={cores.textoFraco}
                style={styles.campo}
                placeholder="O que fazer? Ex.: trocar 30% da água"
                value={titulo}
                onChangeText={setTitulo}
                maxLength={TAMANHO_MAXIMO}
            />
            <View style={styles.sugestoes}>
                {SUGESTOES.map((sugestao) => (
                    <Pressable key={sugestao} style={styles.sugestao} onPress={() => setTitulo(sugestao)}>
                        <Text style={styles.textoSugestao}>{sugestao}</Text>
                    </Pressable>
                ))}
            </View>

            <CampoDataHora valor={data} onMudar={setData} />

            <MensagemErro texto={erro} />

            <View style={styles.botoes}>
                <View style={styles.botao}>
                    <BotaoContorno texto="Cancelar" onPress={onCancelar} />
                </View>
                <View style={styles.botao}>
                    <BotaoGradiente texto={salvando ? "Salvando..." : "Salvar"} onPress={salvar} carregando={salvando} icone="checkmark" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    campo: {
        color: cores.texto,
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: raio.pequeno,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
    },
    sugestoes: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    sugestao: {
        backgroundColor: cores.primariaClara,
        borderRadius: raio.pilula,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    textoSugestao: {
        color: cores.primariaEscura,
        fontSize: 12,
        fontWeight: "600",
    },
    botoes: {
        flexDirection: "row",
        gap: 10,
    },
    botao: {
        flex: 1,
    },
});
