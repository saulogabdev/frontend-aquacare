import { View, TextInput, Text, StyleSheet, Keyboard } from "react-native";
import { useState } from "react";
import { NovoRegistroParametro } from "@/types";
import { BotaoGradiente } from "@/components/ui";

export type MedicoesRegistro = Omit<NovoRegistroParametro, "idAquario">;

type RegistroFormProps = {
    onSalvar: (medicoes: MedicoesRegistro) => Promise<void>;
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
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState("");

    async function salvarRegistro() {
        const registroPh = paraNumero(ph);
        const registroTemperatura = paraNumero(temperatura);
        const registroAmonia = paraNumero(amonia);
        const registroNitrito = paraNumero(nitrito);
        const registroNitrato = paraNumero(nitrato);

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
            nitrito: registroNitrito,
            nitrato: registroNitrato,
            gh: null,
            kh: null,
            co2: null,
            salinidade: null,
            calcio: null,
            magnesio: null,
        }

        try {
            await onSalvar(medicoes);
            // Só limpa os campos se salvou de verdade; se falhar, o usuário não perde o que digitou.
            setPh("");
            setTemperatura("");
            setAmonia("");
            setNitrito("");
            setNitrato("");
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
            <TextInput style={styles.campo} placeholder="pH" value={ph} onChangeText={setPh} keyboardType="decimal-pad" />
            <TextInput style={styles.campo} placeholder="Temperatura (°C)" value={temperatura} onChangeText={setTemperatura} keyboardType="decimal-pad" />
            <TextInput style={styles.campo} placeholder="Amônia (ppm)" value={amonia} onChangeText={setAmonia} keyboardType="decimal-pad" />
            <TextInput style={styles.campo} placeholder="Nitrito (ppm) — opcional" value={nitrito} onChangeText={setNitrito} keyboardType="decimal-pad" />
            <TextInput style={styles.campo} placeholder="Nitrato (ppm) — opcional" value={nitrato} onChangeText={setNitrato} keyboardType="decimal-pad" />
            {erro !== "" && <Text style={styles.erro}>{erro}</Text>}
            <BotaoGradiente texto={salvando ? "Salvando..." : "Salvar registro"} onPress={salvarRegistro} carregando={salvando} icone="checkmark" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    campo: {
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        padding: 12,
    },
    erro: {
        color: "#dc2626",
    },
});
