import { useState } from "react";
import { View, TextInput, Pressable, Text, StyleSheet, Keyboard } from "react-native";
import { cores } from "@/theme";
import { Aquario, NovoAquario, TipoAgua, NivelPlantas } from "@/types";
import { BotaoContorno, BotaoGradiente } from "@/components/ui";

type AquarioFormProps = {
    onSalvar: (novoAquario: NovoAquario) => Promise<void>;
    inicial?: Aquario;
    onCancelar?: () => void;
};

const opcoesTipoAgua: { valor: TipoAgua; rotulo: string }[] = [
    { valor: "DOCE", rotulo: "Doce" },
    { valor: "MARINHO", rotulo: "Marinho" },
];

const opcoesPlantas: { valor: NivelPlantas; rotulo: string }[] = [
    { valor: "BAIXA", rotulo: "Poucas" },
    { valor: "MEDIA", rotulo: "Médias" },
    { valor: "ALTA", rotulo: "Muitas" },
];

export default function AquarioForm({ onSalvar, inicial, onCancelar }: AquarioFormProps) {
    const [nome, setNome] = useState(inicial ? inicial.nome : "");
    const [litragem, setLitragem] = useState(inicial ? inicial.litragem.toString() : "");
    const [tipoAgua, setTipoAgua] = useState<TipoAgua>(inicial?.tipoAgua || "DOCE");
    // Para aquários que já existiam antes do app (montados há tempo): não entram em ciclagem.
    const [isCiclado, setIsCiclado] = useState(inicial?.isCiclado || false);
    const [nivelPlantas, setNivelPlantas] = useState<NivelPlantas>(inicial?.nivelPlantas || "BAIXA");
    const [injecaoCO2, setInjecaoCO2] = useState(inicial?.injecaoCO2 || false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");
    const editando = inicial !== undefined;

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
            nivelPlantas: nivelPlantas,
            isCiclado: isCiclado,
            injecaoCO2: injecaoCO2,
        };

        try {
            await onSalvar(novoAquario);
            if (!editando) {
                setNome("");
                setLitragem("");
                setTipoAgua("DOCE");
                setIsCiclado(false);
                setNivelPlantas("BAIXA");
                setInjecaoCO2(false);
            }
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
            {/* Plantas e CO₂: usados no diagnóstico (iluminação e CO₂ das plantas, backend de 26/11) */}
            <Text style={styles.rotulo}>Quantidade de plantas</Text>
            <View style={styles.opcoes}>
                {opcoesPlantas.map((opcao) => {
                    const selecionada = opcao.valor === nivelPlantas;
                    return (
                        <Pressable
                            key={opcao.valor}
                            style={[styles.opcao, selecionada && styles.opcaoSelecionada]}
                            onPress={() => setNivelPlantas(opcao.valor)}
                        >
                            <Text style={[styles.textoOpcao, selecionada && styles.textoOpcaoSelecionada]}>
                                {opcao.rotulo}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
            {/* Liga/desliga: mesmo visual dos botões Doce/Marinho */}
            <Pressable
                style={[styles.opcao, injecaoCO2 && styles.opcaoSelecionada]}
                onPress={() => setInjecaoCO2(!injecaoCO2)}
            >
                <Text style={[styles.textoOpcao, injecaoCO2 && styles.textoOpcaoSelecionada]}>
                    {injecaoCO2 ? "✓ Tem injeção de CO₂" : "Tem injeção de CO₂?"}
                </Text>
            </Pressable>

            {/* Só ao CRIAR: na edição, a ciclagem tem o próprio botão no banner ("Encerrar ciclagem"),
                e o valor atual de isCiclado continua sendo enviado (o estado começou com ele). */}
            {!editando && (
                <Pressable
                    style={[styles.opcao, isCiclado && styles.opcaoSelecionada]}
                    onPress={() => setIsCiclado(!isCiclado)}
                >
                    <Text style={[styles.textoOpcao, isCiclado && styles.textoOpcaoSelecionada]}>
                        {isCiclado ? "✓ Já está ciclado" : "Já está ciclado? (aquário montado há mais tempo)"}
                    </Text>
                </Pressable>
            )}

            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

            <View style={styles.botoes}>
                {onCancelar && (
                    <View style={styles.botao}>
                        <BotaoContorno texto="Cancelar" onPress={onCancelar} />
                    </View>
                )}
                <View style={styles.botao}>
                    <BotaoGradiente
                        texto={salvando ? "Salvando..." : editando ? "Salvar alterações" : "Criar aquário"}
                        onPress={salvarAquario}
                        carregando={salvando}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    rotulo: {
        fontSize: 13,
        fontWeight: "600",
        color: "#374151",
        marginBottom: -4,
    },
    botoes: {
        flexDirection: "row",
        gap: 10,
    },
    botao: {
        flex: 1,
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