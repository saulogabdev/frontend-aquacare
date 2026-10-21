import { API_URL } from './api';

export async function login(email: string, senha: string): Promise<string> {
    const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
        const mensagemErro = await response.text();
        throw new Error(mensagemErro);
    }
    
    const token = await response.text();
    return token;
}