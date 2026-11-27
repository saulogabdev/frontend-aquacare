import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Planta, PlantaAquario } from "@/types";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAquarioContext } from "@/contexts/AquarioContext";
import {
    associarPlanta,
    listarPlantas,
    listarPlantasDoAquario,
    removerPlantaDoAquario,
} from "@/services/plantaService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";

export type PlantaDoAquario = PlantaAquario & { planta: Planta | undefined };

// tambem carrega o catalogo de plantas (so a aba especies usa)
export function usePlantasDoAquario() {
    const { token, sair } = useAuthContext();
    const { idSelecionado } = useAquarioContext();
    const [catalogo, setCatalogo] = useState<Planta[]>([]);
    const [associacoes, setAssociacoes] = useState<PlantaAquario[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const recarregar = useCallback(async () => {
        if (token === null) return;
        setCarregando(true);
        setErro("");
        try {
            setCatalogo(await listarPlantas(token));
            setAssociacoes(idSelecionado === null ? [] : await listarPlantasDoAquario(token, idSelecionado));
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

    useFocusEffect(
        useCallback(() => {
            recarregar();
        }, [recarregar])
    );

    const plantas: PlantaDoAquario[] = associacoes.map((associacao) => ({
        ...associacao,
        planta: catalogo.find((p) => p.idPlanta === associacao.idPlanta),
    }));

    async function adicionar(idPlanta: number, quantidade: number): Promise<void> {
        if (token === null || idSelecionado === null) {
            throw new Error("Selecione um aquário no Dashboard.");
        }
        try {
            await associarPlanta(token, { idPlanta, idAquario: idSelecionado, quantidade });
            await recarregar();
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
            await removerPlantaDoAquario(token, idAssociacao);
            await recarregar();
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
    }

    return { catalogo, plantas, carregando, erro, adicionar, remover };
}
