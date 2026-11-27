import { Aquario, NovoAquario } from "@/types";
import { listarMeusAquarios, cadastrarAquario, atualizarAquario, excluirAquario } from "@/services/aquarioService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { useAuthContext } from "./AuthContext";

type AquarioContextType = {
    aquarios: Aquario[];
    idSelecionado: number | null;
    adicionarAquario: (novoAquario: NovoAquario) => Promise<void>;
    selecionarAquario: (idAquario: number) => void;
    editarAquario: (idAquario: number, dadosAtualizados: NovoAquario) => Promise<void>;
    removerAquario: (idAquario: number) => Promise<void>;
    erro: string;
    carregando: boolean;
}

const AquarioContext = createContext<AquarioContextType | null>(null);

export function AquarioProvider({ children }: { children: ReactNode }) {
    const { token, sair } = useAuthContext();
    const [aquarios, setAquarios] = useState<Aquario[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [idSelecionado, setIdSelecionado] = useState<number | null>(null);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarAquarios() {
            if (token === null) {
                setAquarios([]);
                setIdSelecionado(null);
                setErro("");
                return;
            }
            setCarregando(true);
            setErro("");
            try {
                const listaAquarios = await listarMeusAquarios(token);
                setAquarios(listaAquarios);
                if (listaAquarios.length > 0) {
                    setIdSelecionado(listaAquarios[0].id);
                }
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
        }
        carregarAquarios();
    }, [token, sair]);


    
    // o erro sobe para o formulario; o catch so trata a sessao expirada
    async function adicionarAquario(novoAquario: NovoAquario): Promise<void> {
        if (token === null) {
            throw new Error("Usuário não autenticado");
        }

        try {
            await cadastrarAquario(token, novoAquario);
            // a api nao devolve o aquario cadastrado, entao busca a lista de novo
            const listaAtualizada = await listarMeusAquarios(token);

            setAquarios(listaAtualizada);

            setIdSelecionado(listaAtualizada.reduce((idMaior, aquario) => Math.max(idMaior, aquario.id), 0));
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
    }

    async function removerAquario(idAquario: number): Promise<void> {
        if (token === null) {
            throw new Error("Usuário não autenticado");
        }

        try {
            await excluirAquario(token, idAquario);
            if (idSelecionado === idAquario) {
                setIdSelecionado(null);
            }
            const listaAtualizada = await listarMeusAquarios(token);
            setAquarios(listaAtualizada);
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
    }

    async function editarAquario(idAquario: number, dadosAtualizados: NovoAquario): Promise<void> {
        if (token === null) {
            throw new Error("Usuário não autenticado");
        }

        try {
            await atualizarAquario(token, idAquario, dadosAtualizados);

            const listaAtualizada = await listarMeusAquarios(token);
            setAquarios(listaAtualizada);
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
    }

    function selecionarAquario(idAquario: number) {
        setIdSelecionado(idAquario);
    }

    const value: AquarioContextType = {
        aquarios,
        idSelecionado,
        adicionarAquario,
        selecionarAquario,
        removerAquario,
        editarAquario,
        erro,
        carregando,
    };

    return (
        <AquarioContext.Provider value={value}>
            {children}
        </AquarioContext.Provider>
    );
}

export function useAquarioContext() {
    const contexto = useContext(AquarioContext);
    if (contexto === null) {
        throw new Error("useAquarioContext deve ser usado dentro de um AquarioProvider");
    }
    return contexto;
}

