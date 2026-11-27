import { View, TextInput, Text, StyleSheet, Keyboard, KeyboardTypeOptions } from "react-native";
import { cores, raio } from "@/theme";
import { useState } from "react";
import { NovoRegistroParametro, RegistroParametro } from "@/types";
import { BotaoContorno, BotaoGradiente, MensagemErro } from "@/components/ui";

export type MedicoesRegistro = Omit<NovoRegistroParametro, "idAquario">;

type RegistroFormProps = {
    // marinho mostra tambem salinidade, calcio e magnesio
    marinho: boolean;
    onSalvar: (medicoes: MedicoesRegistro) => Promise<void>;
    onCancelar?: () => void;
    inicial?: RegistroParametro;
};

// "" -> null; "7,2" -> 7.2; invalido -> null
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

// null -> "" para o campo nao mostrar null
function paraTexto(numero: number | null | undefined): string {
    return numero === null || numero === undefined ? "" : String(numero);
}

// fora do componente para nao ser recriado a cada tecla
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

export default function RegistroForm({ marinho, onSalvar, onCancelar, inicial }: RegistroFormProps) {
    const editando = inicial !== undefined;
    // obrigatorios (usados no calculo da amonia toxica)
    const [ph, setPh] = useState(paraTexto(inicial?.ph));
    const [temperatura, setTemperatura] = useState(paraTexto(inicial?.temperatura));
    const [amonia, setAmonia] = useState(paraTexto(inicial?.amonia));
    // opcionais
    const [nitrito, setNitrito] = useState(paraTexto(inicial?.nitrito));
    const [nitrato, setNitrato] = useState(paraTexto(inicial?.nitrato));
    const [gh, setGh] = useState(paraTexto(inicial?.gh));
    const [kh, setKh] = useState(paraTexto(inicial?.kh));
    const [co2, setCo2] = useState(paraTexto(inicial?.co2));
    // so marinho
    const [salinidade, setSalinidade] = useState(paraTexto(inicial?.salinidade));
    const [calcio, setCalcio] = useState(paraTexto(inicial?.calcio));
    const [magnesio, setMagnesio] = useState(paraTexto(inicial?.magnesio));

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
            salinidade: marinho ? paraNumero(salinidade) : null,
            calcio: marinho ? paraNumero(calcio) : null,
            magnesio: marinho ? paraNumero(magnesio) : null,
        };

        try {
            await onSalvar(medicoes);
            // so limpa se salvou; na edicao o painel fecha
            if (!editando) {
                limpar();
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
            <View style={styles.linha}>
                <Campo rotulo="pH *" valor={ph} onMudar={setPh} />
                <Campo rotulo="Temperatura (°C) *" valor={temperatura} onMudar={setTemperatura} />
            </View>
            <View style={styles.linha}>
                <Campo rotulo="Amônia (ppm) *" valor={amonia} onMudar={setAmonia} />
                <Campo rotulo="NO₂ (ppm)" valor={nitrito} onMudar={setNitrito} />
                <Campo rotulo="NO₃ (ppm)" valor={nitrato} onMudar={setNitrato} />
            </View>

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
                    <BotaoGradiente texto={salvando ? "Salvando..." : editando ? "Salvar alterações" : "Salvar"} onPress={salvarRegistro} carregando={salvando} icone="checkmark" />
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
