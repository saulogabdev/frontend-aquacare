import { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { NovoAquario, TipoAgua } from "@/types";

type AquarioFormProps = {
    onSalvar: (novoAquario: NovoAquario) => void;
};

const opcoesTipoAgua: { valor: TipoAgua; rotulo: string }[] = [
    { valor: "DOCE", rotulo: "Doce" },
    { valor: "MARINHO", rotulo: "Marinho" },
];

export default function AquarioForm({ onSalvar }: AquarioFormProps) {
    const [nome, setNome] = useState("");
    const [litragem, setLitragem] = useState("");
    const [tipoAgua, setTipoAgua] = useState<TipoAgua>("DOCE");

    function salvarAquario() {
        const litros = Number(litragem);
        if (nome.trim() === "" || !(litros > 0)) {
            return;
        }

        const novoAquario: NovoAquario = {
            nome: nome.trim(),
            litragem: litros,
            tipoAgua: tipoAgua,
            nivelPlanta: "NENHUM",
            dataMontagem: new Date().toISOString(),
            isCiclado: false,
            injecaoCO2: false,
        };
        onSalvar(novoAquario);
        setNome("");
        setLitragem("");
        setTipoAgua("DOCE");
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.campo} placeholder="Nome do aquário" value={nome} onChangeText={setNome} />
            <TextInput style={styles.campo} placeholder="Litragem" value={litragem} onChangeText={setLitragem} keyboardType="numeric" />
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
            <Pressable style={styles.botaoAdicionar} onPress={salvarAquario}>
                <Text style={styles.textoBotaoAdicionar}>Adicionar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    campo: {
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        padding: 12,
    },
    botaoAdicionar: {
        backgroundColor: "#0891b2",
        padding: 12,
        borderRadius: 12,
        alignItems: "center",
    },
    textoBotaoAdicionar: {
        color: "#ffffff",
        fontWeight: "bold",
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