import { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet, Keyboard } from "react-native";
import { cores } from "@/theme";
import { NovoAquario, TipoAgua } from "@/types";
import { BotaoGradiente } from "@/components/ui";

type AquarioFormProps = {
    onSalvar: (novoAquario: NovoAquario) => Promise<void>;
};

const opcoesTipoAgua: { valor: TipoAgua; rotulo: string }[] = [
    { valor: "DOCE", rotulo: "Doce" },
    { valor: "MARINHO", rotulo: "Marinho" },
];

export default function AquarioForm({ onSalvar }: AquarioFormProps) {
    const [nome, setNome] = useState("");
    const [litragem, setLitragem] = useState("");
    const [tipoAgua, setTipoAgua] = useState<TipoAgua>("DOCE");
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    async function salvarAquario() {
        const litros = Number(litragem);
        if (nome.trim() === "" || !(litros > 0)) {
            setErro("Informe o nome e a litragem do aquário.");
            return;
        }

        Keyboard.dismiss();
        setSalvando(true);
        setErro("");

        const novoAquario: NovoAquario = {
            nome: nome.trim(),
            litragem: litros,
            tipoAgua: tipoAgua,
            nivelPlanta: "BAIXA",
            isCiclado: false,
            injecaoCO2: false,
        };

        try {
            await onSalvar(novoAquario);
            // Só limpa os campos se salvou de verdade; se falhar, o usuário não perde o que digitou.
            setNome("");
            setLitragem("");
            setTipoAgua("DOCE");
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
            <TextInput placeholderTextColor={cores.textoFraco} style={styles.campo} placeholder="Nome do aquário" value={nome} onChangeText={setNome} />
            <TextInput placeholderTextColor={cores.textoFraco} style={styles.campo} placeholder="Litragem" value={litragem} onChangeText={setLitragem} keyboardType="numeric" />
            <View style={styles.opcoes}>
                {opcoesTipoAgua.map((opcao) => {
                    const selecionada = opcao.valor === tipoAgua;
                    return (
                        <Pressable
                            key={opcao.valor}
                            style={[styles.opcao, selecionada && styles.opcaoSelecionada]}
                            onPress={() => setTipoAgua(opcao.valor)}
                        >
                            <Text style={[styles.textoOpcao, selecionada && styles.textoOpcaoSelecionada]}>
                                {opcao.rotulo}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
            <BotaoGradiente texto={salvando ? "Salvando..." : "Criar aquário"} onPress={salvarAquario} carregando={salvando} />
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
        borderColor: "#e5e7eb",
        borderRadius: 12,
        padding: 12,
    },
    erro: {
        color: "#dc2626",
        textAlign: "center",
    },
    opcoes: {
        flexDirection: "row",
        gap: 8,
    },
    opcao: {
        flex: 1,
        alignItems: "center",
        padding: 10,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#e5e7eb",
        backgroundColor: "#ffffff",
    },
    opcaoSelecionada: {
        borderColor: "#06b6d4",
        backgroundColor: "#ecfeff",
    },
    textoOpcao: {
        color: "#6b7280",
        fontWeight: "600",
    },
    textoOpcaoSelecionada: {
        color: "#0891b2",
    },
});