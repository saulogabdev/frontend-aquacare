import { View, TextInput, Text, StyleSheet, Keyboard, KeyboardTypeOptions } from "react-native";
import { cores, raio } from "@/theme";
import { useState } from "react";
import { NovoRegistroParametro } from "@/types";
import { BotaoContorno, BotaoGradiente, MensagemErro } from "@/components/ui";

// O que o formulário sabe: só as medições. Quem completa com o aquário é a tela; a data, o servidor.
export type MedicoesRegistro = Omit<NovoRegistroParametro, "idAquario">;

type RegistroFormProps = {
    // Aquário marinho mostra também salinidade, cálcio e magnésio (o backend só os analisa no marinho).
    marinho: boolean;
    onSalvar: (medicoes: MedicoesRegistro) => Promise<void>;
    onCancelar?: () => void;
};

// "" → null (campo opcional vazio); "7,2" → 7.2; texto inválido → null.
function paraNumero(valor: string): number | null {
    valor = valor.replace(",", ".");
    if (valor.trim() === "") {
        return null;
    }
    const numero = Number(valor);
    if (isNaN(numero)) {
        return null;
    }
    return numero;
}

// Um campo com rótulo em cima (como no protótipo). Fica fora do componente principal para não ser recriado a cada tecla.
function Campo({ rotulo, valor, onMudar, teclado = "decimal-pad" }: {
    rotulo: string;
    valor: string;
    onMudar: (texto: string) => void;
    teclado?: KeyboardTypeOptions;
}) {
    return (
        <View style={styles.campoArea}>
            <Text style={styles.rotulo}>{rotulo}</Text>
            <TextInput
                placeholderTextColor={cores.textoFraco}
                style={styles.campo}
                value={valor}
                onChangeText={onMudar}
                keyboardType={teclado}
            />
        </View>
    );
}

export default function RegistroForm({ marinho, onSalvar, onCancelar }: RegistroFormProps) {
    // Obrigatórios (entram nas Equações 1 a 3 da amônia tóxica)
    const [ph, setPh] = useState("");
    const [temperatura, setTemperatura] = useState("");
    const [amonia, setAmonia] = useState("");
    // Opcionais
    const [nitrito, setNitrito] = useState("");
    const [nitrato, setNitrato] = useState("");
    const [gh, setGh] = useState("");
    const [kh, setKh] = useState("");
    const [co2, setCo2] = useState("");
    // Só marinho
    const [salinidade, setSalinidade] = useState("");
    const [calcio, setCalcio] = useState("");
    const [magnesio, setMagnesio] = useState("");

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    function limpar() {
        [setPh, setTemperatura, setAmonia, setNitrito, setNitrato, setGh, setKh, setCo2, setSalinidade, setCalcio, setMagnesio]
            .forEach((set) => set(""));
    }

    async function salvarRegistro() {
        const registroPh = paraNumero(ph);
        const registroTemperatura = paraNumero(temperatura);
        const registroAmonia = paraNumero(amonia);

        if (registroPh === null || registroTemperatura === null || registroAmonia === null) {
            setErro("Informe o pH, a temperatura e a amônia.");
            return;
        }

        Keyboard.dismiss();
        setSalvando(true);
        setErro("");

        const medicoes: MedicoesRegistro = {
            ph: registroPh,
            temperatura: registroTemperatura,
            amonia: registroAmonia,
            nitrito: paraNumero(nitrito),
            nitrato: paraNumero(nitrato),
            gh: paraNumero(gh),
            kh: paraNumero(kh),
            co2: paraNumero(co2),
            // Em água doce esses campos nem aparecem: vão sempre null.
            salinidade: marinho ? paraNumero(salinidade) : null,
            calcio: marinho ? paraNumero(calcio) : null,
            magnesio: marinho ? paraNumero(magnesio) : null,
        };

        try {
            await onSalvar(medicoes);
            // Só limpa os campos se salvou de verdade; se falhar, o usuário não perde o que digitou.
            limpar();
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
            <View style={styles.linha}>
                <Campo rotulo="pH *" valor={ph} onMudar={setPh} />
                <Campo rotulo="Temperatura (°C) *" valor={temperatura} onMudar={setTemperatura} />
            </View>
            <View style={styles.linha}>
                <Campo rotulo="Amônia (ppm) *" valor={amonia} onMudar={setAmonia} />
                <Campo rotulo="NO₂ (ppm)" valor={nitrito} onMudar={setNitrito} />
                <Campo rotulo="NO₃ (ppm)" valor={nitrato} onMudar={setNitrato} />
            </View>

            {/* Divisória, como no protótipo */}
            <View style={styles.divisoria}>
                <Text style={styles.textoDivisoria}>Parâmetros avançados</Text>
                <View style={styles.traco} />
            </View>

            <View style={styles.linha}>
                <Campo rotulo="GH (°dGH)" valor={gh} onMudar={setGh} />
                <Campo rotulo="KH (°dKH)" valor={kh} onMudar={setKh} />
                <Campo rotulo="CO₂ (ppm)" valor={co2} onMudar={setCo2} />
            </View>

            {marinho && (
                <View style={styles.linha}>
                    <Campo rotulo="Salinidade" valor={salinidade} onMudar={setSalinidade} />
                    <Campo rotulo="Cálcio (ppm)" valor={calcio} onMudar={setCalcio} />
                    <Campo rotulo="Magnésio (ppm)" valor={magnesio} onMudar={setMagnesio} />
                </View>
            )}

            <Text style={styles.nota}>* obrigatórios: são usados no cálculo da amônia tóxica.</Text>
            <MensagemErro texto={erro} />

            <View style={styles.botoes}>
                {onCancelar && (
                    <View style={styles.botao}>
                        <BotaoContorno texto="Cancelar" onPress={onCancelar} />
                    </View>
                )}
                <View style={styles.botao}>
                    <BotaoGradiente texto={salvando ? "Salvando..." : "Salvar"} onPress={salvarRegistro} carregando={salvando} icone="checkmark" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    linha: {
        flexDirection: "row",
        gap: 10,
    },
    campoArea: {
        flex: 1,
        gap: 4,
    },
    rotulo: {
        fontSize: 12,
        fontWeight: "600",
        color: "#374151",
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
    divisoria: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 4,
    },
    textoDivisoria: {
        fontSize: 11,
        fontWeight: "bold",
        color: cores.textoFraco,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    traco: {
        flex: 1,
        height: 1,
        backgroundColor: cores.bordaClara,
    },
    nota: {
        fontSize: 11,
        color: cores.textoFraco,
    },
    botoes: {
        flexDirection: "row",
        gap: 10,
        marginTop: 4,
    },
    botao: {
        flex: 1,
    },
});
