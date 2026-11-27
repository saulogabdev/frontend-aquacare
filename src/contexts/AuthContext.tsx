import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from "react";
import { buscarMeuUsuario, login } from "@/services/usuarioService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import { Usuario } from "@/types";
import { obterToken, salvarToken, removerToken } from "@/services/tokenStorage";
import { cancelarNotificacoes } from "@/utils/notificacoes";

type AuthContextType = {
    token: string | null,
    usuario: Usuario | null,
    carregando: boolean,
    aviso: string,
    entrar: (email: string, senha: string) => Promise<void>,
    sair: (aviso?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [carregando, setCarregando] = useState<boolean>(true);
    const [aviso, setAviso] = useState("");
    const [usuario, setUsuario] = useState<Usuario | null>(null);

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

    // mesma funcao entre renders, para poder entrar nas dependencias de efeitos
    const sair = useCallback(async (aviso: string = "") => {
        // cancela as notificacoes de quem saiu
        await cancelarNotificacoes();
        await removerToken();
        setAviso(aviso);
        setToken(null);
    }, []);

    useEffect(() => {
        async function carregarUsuario() {
            if (token === null) {
                setUsuario(null);
                return;
            }
            try {
                setUsuario(await buscarMeuUsuario(token));
            } catch (error) {
                if (ehSessaoExpirada(error)) {
                    await sair(MENSAGEM_SESSAO_EXPIRADA);
                }
                // sem conexao: o app segue funcionando, so sem o nome
            }
        }
        carregarUsuario();
    }, [token, sair]);

    return (
        <AuthContext.Provider value={{ token, usuario, carregando, aviso, entrar, sair }}>
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
