import { Text, StyleSheet, ScrollView } from "react-native";
import { useAquarioContext } from "@/contexts/AquarioContext";
import { useRegistroContext } from "@/contexts/RegistroContext";
import RegistroForm, { MedicoesRegistro } from "@/components/RegistroForm";

export default function Parametros() {
    const {aquarios, idSelecionado} = useAquarioContext();
    const aquarioSelecionado = aquarios.find((a) => a.idAquario === idSelecionado);
    const {registros, adicionarRegistro} = useRegistroContext();

    function salvarRegistro(medicoes: MedicoesRegistro) {
        if (!aquarioSelecionado) {
            return;
        }
        adicionarRegistro({
            ...medicoes,
            idAquario: aquarioSelecionado.idAquario,
            dataHora: new Date().toISOString(),
        });
    }

    return (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
            <Text>Monitorando: {aquarioSelecionado?.nome}</Text>
            <RegistroForm onSalvar={salvarRegistro} />
            <Text>Registros salvos: {registros.length}</Text>
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
});