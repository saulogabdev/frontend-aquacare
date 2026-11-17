import { NovoRegistroParametro, Alerta } from "@/types"
import { createContext, ReactNode, useContext} from "react";
import { cadastrarRegistro } from "@/services/registroService";
import { useAuthContext } from "./AuthContext";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";

type RegistroContextType = {
    adicionarRegistro: (novoRegistro: NovoRegistroParametro) => Promise<Alerta[]>;
}
const RegistroContext = createContext<RegistroContextType | null>(null);

export function RegistroProvider({ children }: { children: ReactNode }) {
    
    const { token, sair } = useAuthContext();

    async function adicionarRegistro(novoRegistro: NovoRegistroParametro) {
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
            throw error; // Repassa o erro para o formulário, que vai mostrar a mensagem e manter os campos preenchidos.
        }
    }

    const value: RegistroContextType = {
        adicionarRegistro
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