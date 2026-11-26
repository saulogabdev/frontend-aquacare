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

// Para o texto da notificação: "Lembrete do aquário Plantado 60L".
function buscarNome(aquarios: Aquario[]) {
    return (idAquario: number) => aquarios.find((a) => a.id === idAquario)?.nome ?? "";
}

// Ao abrir o app (e ao trocar de conta): busca TODOS os lembretes do usuário e reagenda as
// notificações deste celular. É o que faz um segundo celular "ficar sabendo" dos lembretes
// criados em outro. Usado no layout das abas, que monta assim que o usuário entra.
export function useSincronizarLembretesAoAbrir() {
    const { token } = useAuthContext();
    const { aquarios } = useAquarioContext();

    useEffect(() => {
        if (token === null) return;
        listarMeusLembretes(token)
            .then((lembretes) => sincronizarNotificacoes(lembretes, buscarNome(aquarios)))
            .catch(() => {
                // Sem conexão ou sessão expirada: as outras telas já avisam; aqui não há o que mostrar.
            });
    }, [token, aquarios]);
}

// Lembretes do usuário para a aba Lembretes. A lista vem com TODOS os aquários (a sincronização
// precisa de todos); a tela filtra o aquário ativo.
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
            // Toda vez que a lista muda, a agenda do celular é refeita a partir dela.
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

    // Envolve cada operação: exige token, trata sessão expirada e recarrega (e reagenda) no fim.
    // O erro sobe para quem chamou (o formulário ou o item mostram a mensagem).
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

    // O PUT do backend SUBSTITUI tudo: por isso mandamos o lembrete inteiro, só com "concluido" trocado.
    // Se mandássemos só { concluido }, o título e a data seriam apagados.
    function alternarConcluido(lembrete: Lembrete) {
        const { idLembrete, ...dados } = lembrete;
        return executar((t) => atualizarLembrete(t, idLembrete, { ...dados, concluido: !lembrete.concluido }));
    }

    function remover(idLembrete: number) {
        return executar((t) => excluirLembrete(t, idLembrete));
    }

    return { lembretes, carregando, erro, adicionar, alternarConcluido, remover };
}
