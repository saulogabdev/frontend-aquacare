import { NovoRegistroParametro, Alerta } from "@/types"
import { createContext, ReactNode, useContext} from "react";
import { atualizarRegistro, cadastrarRegistro, excluirRegistro } from "@/services/registroService";
import { useAuthContext } from "./AuthContext";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";

type RegistroContextType = {
    adicionarRegistro: (novoRegistro: NovoRegistroParametro) => Promise<Alerta[]>;
    editarRegistro: (idParametro: number, dados: NovoRegistroParametro) => Promise<Alerta[]>;
    removerRegistro: (idParametro: number) => Promise<void>;
}
const RegistroContext = createContext<RegistroContextType | null>(null);

export function RegistroProvider({ children }: { children: ReactNode }) {
    
    const { token, sair } = useAuthContext();

    async function adicionarRegistro(novoRegistro: NovoRegistroParametro): Promise<Alerta[]> {
        if (token === null) {
            throw new Error("Usuário não autenticado");
        }

        try {
            const alertas = await cadastrarRegistro(token, novoRegistro);
            return alertas;
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
    }

    // o backend recalcula os alertas
    async function editarRegistro(idParametro: number, dados: NovoRegistroParametro): Promise<Alerta[]> {
        if (token === null) {
            throw new Error("Usuário não autenticado");
        }

        try {
            const alertas = await atualizarRegistro(token, idParametro, dados);
            return alertas;
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
    }

    async function removerRegistro(idParametro: number): Promise<void> {
        if (token === null) {
            throw new Error("Usuário não autenticado");
        }

        try {
            await excluirRegistro(token, idParametro);
        } catch (error) {
            if (ehSessaoExpirada(error)) {
                await sair(MENSAGEM_SESSAO_EXPIRADA);
            }
            throw error;
        }
    }

    const value: RegistroContextType = {
        adicionarRegistro,
        editarRegistro,
        removerRegistro,
    };

    return (
        <RegistroContext.Provider value={value}>
            {children}
        </RegistroContext.Provider>
    );
}

export function useRegistroContext() {
    const contexto = useContext(RegistroContext);
    if (!contexto) {
        throw new Error("useRegistroContext deve ser usado dentro de um RegistroProvider");
    }
    return contexto;
}