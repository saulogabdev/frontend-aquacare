import { API_URL, apiFetch, erroDaResposta } from './api';
import { Usuario } from '@/types';

function cabecalhos(token: string) {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export async function login(email: string, senha: string): Promise<string> {
    const response = await apiFetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, 'Falha ao entrar');
    }
    
    const token = await response.text();
    return token;
}
export async function cadastrarUsuario(nome: string, email: string, senha: string): Promise<void> {
    const response = await apiFetch(`${API_URL}/usuarios/cadastrar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ nome, email, senha }),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, 'Falha ao criar a conta');
    }
}

export async function buscarMeuUsuario(token: string): Promise<Usuario> {
    const response = await apiFetch(`${API_URL}/usuarios/me`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
        throw await erroDaResposta(response, 'Falha ao carregar o usuário');
    }

    const usuario: Usuario = await response.json();
    return usuario;
}

export async function solicitarRecuperacaoSenha(email: string): Promise<void> {
    const response = await apiFetch(`${API_URL}/usuarios/recuperar-senha`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, 'Falha ao solicitar recuperação de senha');
    }
}

export async function redefinirSenha(token: string, novaSenha: string): Promise<void> {
    const response = await apiFetch(`${API_URL}/usuarios/redefinir-senha`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token, novaSenha }),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, 'Falha ao redefinir senha');
    }
}