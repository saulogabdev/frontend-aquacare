import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Alerta, Animal, AnimalAquario } from "@/types";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAquarioContext } from "@/contexts/AquarioContext";
import { useEspecieContext } from "@/contexts/EspecieContext";
import {
    associarAnimal,
    listarAnimaisDoAquario,
    removerAnimalDoAquario,
} from "@/services/especieService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";

export type PeixeDoAquario = AnimalAquario & { animal: Animal | undefined };

export function usePeixesDoAquario() {
    const { token, sair } = useAuthContext();
    const { idSelecionado } = useAquarioContext();
    const { animais } = useEspecieContext();
    const [associacoes, setAssociacoes] = useState<AnimalAquario[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const recarregar = useCallback(async () => {
        if (token === null || idSelecionado === null) {
            setAssociacoes([]);
            return;
        }
        setCarregando(true);
        setErro("");
        try {
            setAssociacoes(await listarAnimaisDoAquario(token, idSelecionado));
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
    }, [token, idSelecionado, sair]);

    // Recarrega toda vez que a tela que usa o hook aparece (e quando troca o aquário).
    useFocusEffect(
        useCallback(() => {
            recarregar();
        }, [recarregar])
    );

    // Valor calculado (não é estado): cada associação com os dados da espécie.
    const peixes: PeixeDoAquario[] = associacoes.map((associacao) => ({
        ...associacao,
        animal: animais.find((a) => a.idAnimal === associacao.idAnimal),
    }));

    async function adicionar(idAnimal: number, quantidade: number): Promise<Alerta[]> {
        if (token === null || idSelecionado === null) {
            throw new Error("Selecione um aquário no Dashboard.");
        }
        try {
            const alertas = await associarAnimal(token, { idAnimal, idAquario: idSelecionado, quantidade });
            await recarregar();
            return alertas;
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
    }

    async function remover(idAssociacao: number): Promise<void> {
        if (token === null) return;
        try {
            await removerAnimalDoAquario(token, idAssociacao);
            await recarregar();
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
    }

    return { peixes, carregando, erro, adicionar, remover };
}
