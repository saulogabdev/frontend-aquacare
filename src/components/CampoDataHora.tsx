import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cores, raio } from "@/theme";
import { descreverDataHora, juntarDiaEHora } from "@/utils/dataHora";

type CampoDataHoraProps = {
    valor: Date;
    onMudar: (data: Date) => void;
};

function doisDigitos(numero: number) {
    return String(numero).padStart(2, "0");
}

// Escolha de dia e hora. Cada sistema tem o seu jeito nativo:
// - iOS: dois seletores "compactos" na própria tela (tocar abre um calendário/relógio flutuante);
// - Android: dois botões que abrem as janelas (diálogos) de calendário e de relógio;
// - Web: a biblioteca não funciona (e notificações também não), então só mostra o valor.
export default function CampoDataHora({ valor, onMudar }: CampoDataHoraProps) {
    const hoje = new Date();

    if (Platform.OS === "ios") {
        return (
            <View style={styles.linha}>
                <Text style={styles.rotulo}>Quando</Text>
                <View style={styles.seletoresIos}>
                    <DateTimePicker
                        value={valor}
                        mode="date"
                        display="compact"
                        locale="pt-BR"
                        minimumDate={hoje}
                        onValueChange={(_, dia) => onMudar(juntarDiaEHora(dia, valor))}
                    />
                    <DateTimePicker
                        value={valor}
                        mode="time"
                        display="compact"
                        locale="pt-BR"
                        onValueChange={(_, hora) => onMudar(juntarDiaEHora(valor, hora))}
                    />
                </View>
            </View>
        );
    }

    if (Platform.OS === "android") {
        function abrir(modo: "date" | "time") {
            DateTimePickerAndroid.open({
                value: valor,
                mode: modo,
                is24Hour: true,
                minimumDate: modo === "date" ? hoje : undefined,
                onValueChange: (_, escolhida) => {
                    onMudar(modo === "date" ? juntarDiaEHora(escolhida, valor) : juntarDiaEHora(valor, escolhida));
                },
            });
        }

        return (
            <View style={styles.botoesAndroid}>
                <Pressable style={styles.botao} onPress={() => abrir("date")}>
                    <Ionicons name="calendar-outline" size={18} color={cores.primaria} />
                    <Text style={styles.textoBotao}>
                        {doisDigitos(valor.getDate())}/{doisDigitos(valor.getMonth() + 1)}/{valor.getFullYear()}
                    </Text>
                </Pressable>
                <Pressable style={styles.botao} onPress={() => abrir("time")}>
                    <Ionicons name="time-outline" size={18} color={cores.primaria} />
                    <Text style={styles.textoBotao}>
                        {doisDigitos(valor.getHours())}:{doisDigitos(valor.getMinutes())}
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <Text style={styles.web}>
            {descreverDataHora(valor)} (para escolher outro horário, use o app no celular)
        </Text>
    );
}

const styles = StyleSheet.create({
    linha: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rotulo: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
    },
    seletoresIos: {
        flexDirection: "row",
        gap: 4,
    },
    botoesAndroid: {
        flexDirection: "row",
        gap: 10,
    },
    botao: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: cores.borda,
        borderRadius: raio.pequeno,
        paddingVertical: 12,
    },
    textoBotao: {
        color: cores.texto,
        fontSize: 15,
        fontWeight: "600",
    },
    web: {
        color: cores.textoSecundario,
        fontSize: 13,
    },
});
