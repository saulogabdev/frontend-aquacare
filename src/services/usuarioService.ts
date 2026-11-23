import { API_URL, apiFetch, erroDaResposta } from './api';

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
        // Ex.: 400 "E-mail já cadastrado." (mensagem do backend)
        throw await erroDaResposta(response, 'Falha ao criar a conta');
    }
}
