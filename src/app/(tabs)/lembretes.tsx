import { useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { CabecalhoCard, Card, EstadoVazio, MensagemErro, Tela, TituloTela } from "@/components/ui";
import LembreteForm from "@/components/LembreteForm";
import LembreteItem from "@/components/LembreteItem";
import { useAquarioContext } from "@/contexts/AquarioContext";
import { useLembretes } from "@/hooks/useLembretes";
import { raio } from "@/theme";
import { deLocalDateTime, paraLocalDateTime } from "@/utils/dataHora";
import { notificacoesPermitidas, pedirPermissaoNotificacoes } from "@/utils/notificacoes";

function porData(a: { dataHoraLembrete: string }, b: { dataHoraLembrete: string }) {
    return deLocalDateTime(a.dataHoraLembrete).getTime() - deLocalDateTime(b.dataHoraLembrete).getTime();
}

export default function Lembretes() {
    const { aquarios, idSelecionado } = useAquarioContext();
    const { lembretes, carregando, erro, adicionar, alternarConcluido, remover } = useLembretes();
    const [mostrarForm, setMostrarForm] = useState(false);
    // null = ainda nao verificou
    const [permitido, setPermitido] = useState<boolean | null>(null);
    // guardado em estado: chamar date.now() direto no render nao e permitido pelo react
    const [agora, setAgora] = useState(Date.now);

    useFocusEffect(
        useCallback(() => {
            setAgora(Date.now());
            notificacoesPermitidas().then(setPermitido);
        }, [])
    );

    const aquario = aquarios.find((a) => a.id === idSelecionado);

    if (!aquario) {
        return (
            <Tela>
                <TituloTela titulo="Lembretes" subtitulo="Trocas de água, testes e manutenção" />
                <Card>
                    <EstadoVazio icone="water-outline" titulo="Nenhum aquário selecionado" texto="Escolha um aquário no Dashboard." />
                </Card>
            </Tela>
        );
    }

    const idAquario = aquario.id;

    const doAquario = lembretes.filter((l) => l.idAquario === idAquario);
    const pendentes = doAquario.filter((l) => !l.concluido).sort(porData);
    const concluidos = doAquario.filter((l) => l.concluido).sort(porData).reverse();

    async function ativarNotificacoes() {
        setPermitido(await pedirPermissaoNotificacoes());
    }

    async function salvar(titulo: string, data: Date) {
        // pede a permissao no primeiro lembrete
        if (permitido === false) {
            await ativarNotificacoes();
        }
        await adicionar({
            idAquario,
            titulo,
            dataHoraLembrete: paraLocalDateTime(data), // sem fuso
            concluido: false,
            notificado: false,
        });
        setMostrarForm(false);
    }

    return (
        <Tela>
            <TituloTela titulo="Lembretes" subtitulo={aquario.nome} />

            {Platform.OS === "web" ? (
                <View style={styles.aviso}>
                    <Ionicons name="phone-portrait-outline" size={18} color="#b45309" />
                    <Text style={styles.textoAviso}>As notificações funcionam apenas no app do celular.</Text>
                </View>
            ) : (
                permitido === false && (
                    <Pressable style={styles.aviso} onPress={ativarNotificacoes}>
                        <Ionicons name="notifications-off-outline" size={18} color="#b45309" />
                        <Text style={styles.textoAviso}>
                            Notificações desativadas. Toque para permitir e ser avisado na hora de cada lembrete.
                        </Text>
                    </Pressable>
                )
            )}

            <Card>
                <CabecalhoCard
                    titulo="Próximos"
                    acao={mostrarForm ? undefined : "Novo"}
                    onAcao={() => setMostrarForm(true)}
                />

                {mostrarForm && <LembreteForm onSalvar={salvar} onCancelar={() => setMostrarForm(false)} />}

                <MensagemErro texto={erro} />

                {!mostrarForm && pendentes.length === 0 && !carregando && (
                    <EstadoVazio
                        icone="notifications-outline"
                        titulo="Nenhum lembrete pendente"
                        texto="Crie lembretes para trocas de água, testes e limpeza do filtro."
                    />
                )}

                {pendentes.map((lembrete) => (
                    <LembreteItem
                        key={lembrete.idLembrete}
                        lembrete={lembrete}
                        agora={agora}
                        onAlternar={() => alternarConcluido(lembrete)}
                        onExcluir={() => remover(lembrete.idLembrete)}
                    />
                ))}
            </Card>

            {concluidos.length > 0 && (
                <Card>
                    <CabecalhoCard titulo="Concluídos" />
                    {concluidos.map((lembrete) => (
                        <LembreteItem
                            key={lembrete.idLembrete}
                            lembrete={lembrete}
                        agora={agora}
                            onAlternar={() => alternarConcluido(lembrete)}
                            onExcluir={() => remover(lembrete.idLembrete)}
                        />
                    ))}
                </Card>
            )}
        </Tela>
    );
}

const styles = StyleSheet.create({
    aviso: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#fef3c7",
        borderRadius: raio.pequeno,
        padding: 12,
    },
    textoAviso: {
        flex: 1,
        color: "#b45309",
        fontSize: 13,
    },
});
