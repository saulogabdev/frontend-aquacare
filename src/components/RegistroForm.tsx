import { View, TextInput, Pressable, Text, StyleSheet, Keyboard } from "react-native";
import { useState } from "react";
import { NovoRegistroParametro } from "@/types";

// O que o formulário sabe: só as medições. Quem completa com o aquário e a data é a tela.
export type MedicoesRegistro = Omit<NovoRegistroParametro, "idAquario" | "dataHora">;

type RegistroFormProps = {
    onSalvar: (medicoes: MedicoesRegistro) => void;
};

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

export default function RegistroForm({ onSalvar }: RegistroFormProps) {
    const [ph, setPh] = useState("");
    const [temperatura, setTemperatura] = useState("");
    const [amonia, setAmonia] = useState("");
    const [nitrito, setNitrito] = useState("");
    const [nitrato, setNitrato] = useState("");

    function salvarRegistro() {
        const registroPh = paraNumero(ph);
        const registroTemperatura = paraNumero(temperatura);
        const registroAmonia = paraNumero(amonia);
        const registroNitrito = paraNumero(nitrito);
        const registroNitrato = paraNumero(nitrato);

        if (registroPh === null || registroTemperatura === null || registroAmonia === null) return;

        Keyboard.dismiss();

        const medicoes: MedicoesRegistro = {
            ph: registroPh,
            temperatura: registroTemperatura,
            amonia: registroAmonia,
            nitrito: registroNitrito,
            nitrato: registroNitrato,
            gh: null,
            kh: null,
            co2: null,
            salinidade: null,
            calcio: null,
            magnesio: null,
        }
        onSalvar(medicoes);
        setPh("");
        setTemperatura("");
        setAmonia("");
        setNitrito("");
        setNitrato("");
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.campo} placeholder="pH" value={ph} onChangeText={setPh} keyboardType="decimal-pad" />
            <TextInput style={styles.campo} placeholder="Temperatura (°C)" value={temperatura} onChangeText={setTemperatura} keyboardType="decimal-pad" />
            <TextInput style={styles.campo} placeholder="Amônia (ppm)" value={amonia} onChangeText={setAmonia} keyboardType="decimal-pad" />
            <TextInput style={styles.campo} placeholder="Nitrito (ppm) — opcional" value={nitrito} onChangeText={setNitrito} keyboardType="decimal-pad" />
            <TextInput style={styles.campo} placeholder="Nitrato (ppm) — opcional" value={nitrato} onChangeText={setNitrato} keyboardType="decimal-pad" />
            <Pressable style={styles.botaoAdicionar} onPress={salvarRegistro}>
                <Text style={styles.textoBotaoAdicionar}>Salvar</Text>
            </Pressable>
        </View>
    )
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
});
