import { API_URL, erroDaResposta } from './api';

export async function login(email: string, senha: string): Promise<string> {
    const response = await fetch(`${API_URL}/usuarios/login`, {
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