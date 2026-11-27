import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Aquario, Lembrete, NovoLembrete } from "@/types";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAquarioContext } from "@/contexts/AquarioContext";
import {
    atualizarLembrete,
    cadastrarLembrete,
    excluirLembrete,
    listarMeusLembretes,
} from "@/services/lembreteService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import { sincronizarNotificacoes } from "@/utils/notificacoes";

function buscarNome(aquarios: Aquario[]) {
    return (idAquario: number) => aquarios.find((a) => a.id === idAquario)?.nome ?? "";
}

// sincroniza ao entrar no app, assim outro celular tambem recebe os lembretes
export function useSincronizarLembretesAoAbrir() {
    const { token } = useAuthContext();
    const { aquarios } = useAquarioContext();

    useEffect(() => {
        if (token === null) return;
        listarMeusLembretes(token)
            .then((lembretes) => sincronizarNotificacoes(lembretes, buscarNome(aquarios)))
            .catch(() => {
            });
    }, [token, aquarios]);
}

// a lista vem com todos os aquarios (a sincronizacao precisa de todos)
export function useLembretes() {
    const { token, sair } = useAuthContext();
    const { aquarios } = useAquarioContext();
    const [lembretes, setLembretes] = useState<Lembrete[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const recarregar = useCallback(async () => {
        if (token === null) return;
        setCarregando(true);
        setErro("");
        try {
            const lista = await listarMeusLembretes(token);
            setLembretes(lista);
            // a agenda do celular e refeita a partir da lista
            await sincronizarNotificacoes(lista, buscarNome(aquarios));
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
                return;
            }
            if (error instanceof Error) {
                setErro(error.message);
            }
        } finally {
            setCarregando(false);
        }
    }, [token, aquarios, sair]);

    useFocusEffect(
        useCallback(() => {
            recarregar();
        }, [recarregar])
    );

    async function executar(operacao: (token: string) => Promise<void>) {
        if (token === null) {
            throw new Error("Entre novamente para continuar.");
        }
        try {
            await operacao(token);
            await recarregar();
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
    }

    function adicionar(novo: NovoLembrete) {
        return executar((t) => cadastrarLembrete(t, novo));
    }

    // o put substitui tudo: manda o lembrete inteiro
    function alternarConcluido(lembrete: Lembrete) {
        const { idLembrete, ...dados } = lembrete;
        return executar((t) => atualizarLembrete(t, idLembrete, { ...dados, concluido: !lembrete.concluido }));
    }

    function remover(idLembrete: number) {
        return executar((t) => excluirLembrete(t, idLembrete));
    }

    return { lembretes, carregando, erro, adicionar, alternarConcluido, remover };
}
