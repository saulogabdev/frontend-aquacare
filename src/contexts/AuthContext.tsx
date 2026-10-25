import { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { login } from "@/services/usuarioService";
import { obterToken, salvarToken, removerToken } from "@/services/tokenStorage";

type AuthContextType = {
    token: string | null,
    carregando: boolean,
    entrar: (email: string, senha: string) => Promise<void>,
    sair: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);

    useEffect(() => {
        async function verificarToken() {
            try {
                const tokenArmazenado = await obterToken();
                setToken(tokenArmazenado);
                setCarregando(false);
            } finally {
                setCarregando(false);
            }
        }
        verificarToken();
    }, []);

    async function entrar(email: string, senha: string): Promise<void> {
        const token = await login(email, senha);
        setToken(token);
        await salvarToken(token);
    }

    async function sair() {
        setToken(null);
        await removerToken();
    }

    return (
        <AuthContext.Provider value={{ token, carregando, entrar, sair }}>
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