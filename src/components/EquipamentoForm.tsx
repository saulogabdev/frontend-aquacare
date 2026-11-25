import { useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NovoEquipamento, TipoEquipamento } from "@/types";
import { BotaoGradiente, MensagemErro } from "@/components/ui";
import { cores, raio } from "@/theme";

type EquipamentoFormProps = {
    idAquario: number;
    litragem: number;
    onSalvar: (novo: NovoEquipamento) => Promise<void>;
};

// Cada tipo de equipamento tem UM campo técnico obrigatório (é o que o backend usa no dimensionamento).
// A "faixa" é só um texto de ajuda com as referências do artigo; quem decide se está certo é o backend.
export const infoTipo: Record<TipoEquipamento, {
    rotulo: string;
    icone: keyof typeof Ionicons.glyphMap;
    campo: string;
    unidade: string;
    faixa: (litros: number) => string;
}> = {
    FILTRO: {
        rotulo: "Filtro",
        icone: "funnel-outline",
        campo: "Vazão",
        unidade: "L/h",
        faixa: (l) => `Recomendado: ${3 * l} a ${5 * l} L/h (3 a 5× o volume por hora)`,
    },
    TERMOSTATO: {
        rotulo: "Termostato",
        icone: "thermometer-outline",
        campo: "Potência",
        unidade: "W",
        faixa: (l) => `Recomendado: pelo menos ${l} W (cerca de 1 W por litro)`,
    },
    ILUMINACAO: {
        rotulo: "Iluminação",
        icone: "bulb-outline",
        campo: "Luminosidade",
        unidade: "lm",
        faixa: (l) => `Recomendado: ${30 * l} a ${60 * l} lm (30 a 60 lúmens por litro)`,
    },
};

const tipos: TipoEquipamento[] = ["FILTRO", "TERMOSTATO", "ILUMINACAO"];

export default function EquipamentoForm({ idAquario, litragem, onSalvar }: EquipamentoFormProps) {
    const [tipo, setTipo] = useState<TipoEquipamento>("FILTRO");
    const [nome, setNome] = useState("");
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [valor, setValor] = useState(""); // vazão, potência ou lúmens, conforme o tipo
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    const info = infoTipo[tipo];

    async function salvar() {
        const numero = Number(valor.replace(",", "."));
        if (nome.trim() === "") {
            setErro("Informe o nome do equipamento.");
            return;
        }
        // Obrigatório: sem esse valor o backend não consegue calcular o dimensionamento.
        if (!(numero > 0)) {
            setErro(`Informe a ${info.campo.toLowerCase()} (${info.unidade}).`);
            return;
        }

        Keyboard.dismiss();
        setSalvando(true);
        setErro("");

        // Só o campo do tipo escolhido vai preenchido; os outros vão null.
        const novo: NovoEquipamento = {
            idAquario,
            tipo,
            nome: nome.trim(),
            marca: marca.trim() === "" ? null : marca.trim(),
            modelo: modelo.trim() === "" ? null : modelo.trim(),
            vazaoLH: tipo === "FILTRO" ? Math.round(numero) : null,
            potenciaWatts: tipo === "TERMOSTATO" ? Math.round(numero) : null,
            lumens: tipo === "ILUMINACAO" ? numero : null,
        };

        try {
            await onSalvar(novo);
            setNome("");
            setMarca("");
            setModelo("");
            setValor("");
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
            {/* Tipo: ao trocar, o campo técnico muda junto */}
            <View style={styles.tipos}>
                {tipos.map((t) => {
                    const ativo = t === tipo;
                    return (
                        <Pressable key={t} style={[styles.tipo, ativo && styles.tipoAtivo]} onPress={() => setTipo(t)}>
                            <Ionicons name={infoTipo[t].icone} size={18} color={ativo ? cores.primaria : cores.textoFraco} />
                            <Text style={[styles.textoTipo, ativo && styles.textoTipoAtivo]}>{infoTipo[t].rotulo}</Text>
                        </Pressable>
                    );
                })}
            </View>

            <TextInput placeholderTextColor={cores.textoFraco} style={styles.campo} placeholder="Nome (ex.: Canister)" value={nome} onChangeText={setNome} />
            <View style={styles.linha}>
                <TextInput placeholderTextColor={cores.textoFraco} style={[styles.campo, styles.metade]} placeholder="Marca (opcional)" value={marca} onChangeText={setMarca} />
                <TextInput placeholderTextColor={cores.textoFraco} style={[styles.campo, styles.metade]} placeholder="Modelo (opcional)" value={modelo} onChangeText={setModelo} />
            </View>
            <TextInput
                placeholderTextColor={cores.textoFraco}
                style={styles.campo}
                placeholder={`${info.campo} (${info.unidade})`}
                value={valor}
                onChangeText={setValor}
                keyboardType="decimal-pad"
            />
            <Text style={styles.ajuda}>{info.faixa(litragem)}</Text>

            <MensagemErro texto={erro} />
            <BotaoGradiente texto={salvando ? "Salvando..." : "Adicionar equipamento"} onPress={salvar} carregando={salvando} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
    },
    tipos: {
        flexDirection: "row",
        gap: 8,
    },
    tipo: {
        flex: 1,
        alignItems: "center",
        gap: 4,
        paddingVertical: 10,
        borderRadius: raio.pequeno,
        borderWidth: 2,
        borderColor: cores.borda,
        backgroundColor: cores.branco,
    },
    tipoAtivo: {
        borderColor: "#06b6d4",
        backgroundColor: cores.primariaClara,
    },
    textoTipo: {
        fontSize: 12,
        fontWeight: "600",
        color: cores.textoSecundario,
    },
    textoTipoAtivo: {
        color: cores.primaria,
    },
    campo: {
        color: cores.texto,
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: raio.pequeno,
        padding: 12,
    },
    linha: {
        flexDirection: "row",
        gap: 8,
    },
    metade: {
        flex: 1,
    },
    ajuda: {
        fontSize: 12,
        color: cores.textoSecundario,
        marginTop: -4,
    },
});
