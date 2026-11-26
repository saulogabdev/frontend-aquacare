import { createContext, useState, ReactNode, useContext, useEffect, useCallback } from "react";
import { buscarMeuUsuario, login } from "@/services/usuarioService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import { Usuario } from "@/types";
import { obterToken, salvarToken, removerToken } from "@/services/tokenStorage";
import { cancelarNotificacoes } from "@/utils/notificacoes";

type AuthContextType = {
    token: string | null,
    // Dados do usuário logado (GET /usuarios/me): nome no cabeçalho e no Perfil, e a role (admin).
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
    // Mensagem mostrada na tela de login depois de uma saída automática (ex.: sessão expirada).
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

    // useCallback mantém a MESMA função entre os re-renders. Assim, outros Contexts podem
    // colocar o "sair" na lista de dependências de um useEffect sem disparar o efeito toda hora.
    const sair = useCallback(async (aviso: string = "") => {
        // Este celular não deve avisar lembretes de quem saiu da conta.
        await cancelarNotificacoes();
        await removerToken();
        setAviso(aviso);
        setToken(null);
    }, []);

    // Sempre que o token muda (entrou ou saiu), busca os dados do usuário logado.
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
                // Outros erros (ex.: sem conexão): o app continua funcionando, só sem o nome.
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
