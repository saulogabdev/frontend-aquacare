import { createContext, useState, ReactNode, useContext } from "react";
import { login } from "@/services/usuarioService";

type AuthContextType = {
    token: string | null,
    entrar: (email: string, senha: string) => Promise<void>,
    sair: () => void
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    async function entrar(email: string, senha: string): Promise<void> {
        const token = await login(email, senha);
        setToken(token);
    }

    function sair() {
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, entrar, sair }}>
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