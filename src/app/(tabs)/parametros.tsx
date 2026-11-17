import { Text, StyleSheet, ScrollView, View } from "react-native";
import { useAquarioContext } from "@/contexts/AquarioContext";
import { useRegistroContext } from "@/contexts/RegistroContext";
import RegistroForm, { MedicoesRegistro } from "@/components/RegistroForm";
import { Alerta } from "@/types/registro";
import { useState } from "react";

export default function Parametros() {
    const {aquarios, idSelecionado} = useAquarioContext();
    const aquarioSelecionado = aquarios.find((a) => a.id === idSelecionado);
    const {adicionarRegistro} = useRegistroContext();
    const [alertas, setAlertas] = useState<Alerta[] | null>(null);

    async function salvarRegistro(medicoes: MedicoesRegistro) {
        if (!aquarioSelecionado) {
            return;
        }
        const novosAlertas = await adicionarRegistro({
            idAquario: aquarioSelecionado.id,
            ...medicoes
        });
        setAlertas(novosAlertas);
    }

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
            <Text>Monitorando: {aquarioSelecionado?.nome}</Text>
            <RegistroForm onSalvar={salvarRegistro} />

            {/* null = ainda não registrou nada: não mostra nada */}
            {alertas !== null && alertas.length === 0 && (
                <View style={[styles.cartao, styles.tudoCerto]}>
                    <Text style={[styles.textoAlerta, styles.textoTudoCerto]}>
                        Tudo certo! Nenhum parâmetro fora do ideal.
                    </Text>
                </View>
            )}

            {alertas !== null && alertas.length > 0 && (
                <View style={styles.listaAlertas}>
                    <Text style={styles.tituloAlertas}>Alertas do último registro</Text>
                    {alertas.map((alerta, indice) => {
                        const critico = alerta.severidade === "CRITICO";
                        return (
                            <View key={indice} style={[styles.cartao, critico ? styles.critico : styles.atencao]}>
                                <Text style={[styles.rotulo, critico ? styles.textoCritico : styles.textoAtencao]}>
                                    {critico ? "Crítico" : "Atenção"}
                                </Text>
                                <Text style={[styles.textoAlerta, critico ? styles.textoCritico : styles.textoAtencao]}>
                                    {alerta.mensagem}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  conteudo: {
    gap: 12,
    padding: 20,
  },
  listaAlertas: {
    gap: 8,
  },
  tituloAlertas: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartao: {
    padding: 12,
    borderRadius: 12,
    gap: 4,
  },
  critico: {
    backgroundColor: "#fee2e2",
  },
  atencao: {
    backgroundColor: "#fef3c7",
  },
  tudoCerto: {
    backgroundColor: "#dcfce7",
  },
  rotulo: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  textoAlerta: {
    fontSize: 14,
  },
  textoCritico: {
    color: "#b91c1c",
  },
  textoAtencao: {
    color: "#b45309",
  },
  textoTudoCerto: {
    color: "#15803d",
    fontWeight: "bold",
  },
});