import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from "react";
import { login } from "@/services/usuarioService";
import { obterToken, salvarToken, removerToken } from "@/services/tokenStorage";

type AuthContextType = {
    token: string | null,
    carregando: boolean,
    aviso: string,
    entrar: (email: string, senha: string) => Promise<void>,
    sair: (aviso?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);
    // Mensagem mostrada na tela de login depois de uma saída automática (ex.: sessão expirada).
    const [aviso, setAviso] = useState("");

    useEffect(() => {
        async function verificarToken() {
            try {
                const tokenArmazenado = await obterToken();
                setToken(tokenArmazenado);
            } finally {
                setCarregando(false);
            }
        }
        verificarToken();
    }, []);

    async function entrar(email: string, senha: string): Promise<void> {
        const token = await login(email, senha);
        await salvarToken(token);
        setAviso("");
        setToken(token);
    }

    // useCallback mantém a MESMA função entre os re-renders. Assim, outros Contexts podem
    // colocar o "sair" na lista de dependências de um useEffect sem disparar o efeito toda hora.
    const sair = useCallback(async (aviso: string = "") => {
        await removerToken();
        setAviso(aviso);
        setToken(null);
    }, []);

    return (
        <AuthContext.Provider value={{ token, carregando, aviso, entrar, sair }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const contexto = useContext(AuthContext);
    if (contexto === null) {
        throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
    }
    return contexto;
}
