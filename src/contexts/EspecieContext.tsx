import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Animal } from "@/types";
import { listarAnimais } from "@/services/especieService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import { useAuthContext } from "./AuthContext";

// Catálogo de espécies: é o mesmo para todos os aquários e é usado por mais de uma tela
// (aba Espécies e Dashboard), por isso fica num Context e é carregado uma vez só.
type EspecieContextType = {
    animais: Animal[];
    carregando: boolean;
    erro: string;
};

const EspecieContext = createContext<EspecieContextType | null>(null);

export function EspecieProvider({ children }: { children: ReactNode }) {
    const { token, sair } = useAuthContext();
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregarAnimais() {
            if (token === null) {
                setAnimais([]);
                setErro("");
                return;
            }
            setCarregando(true);
            setErro("");
            try {
                setAnimais(await listarAnimais(token));
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
        carregarAnimais();
    }, [token, sair]);

    return (
        <EspecieContext.Provider value={{ animais, carregando, erro }}>
            {children}
        </EspecieContext.Provider>
    );
}

export function useEspecieContext() {
    const contexto = useContext(EspecieContext);
    if (!contexto) {
        throw new Error("useEspecieContext deve ser usado dentro de um EspecieProvider");
    }
    return contexto;
}
