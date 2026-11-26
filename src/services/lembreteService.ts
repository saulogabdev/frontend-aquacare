import { API_URL, apiFetch, erroDaResposta } from './api';
import { Alerta, Lembrete, NovoLembrete } from '@/types';

function cabecalhos(token: string) {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export async function listarMeusLembretes(token: string): Promise<Lembrete[]> {
    const response = await apiFetch(`${API_URL}/lembrete/meus`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao listar lembretes");
    }

    const lembretes: Lembrete[] = await response.json();
    return lembretes;
}

export async function cadastrarLembrete(token: string, novoLembrete: NovoLembrete): Promise<void> {
    const response = await apiFetch(`${API_URL}/lembrete/cadastrar`, {
        method: 'POST',
        headers: cabecalhos(token),
        body: JSON.stringify(novoLembrete)
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao cadastrar lembrete");
    }
}

export async function atualizarLembrete(token: string, idLembrete: number, dados: NovoLembrete): Promise<void> {
    const response = await apiFetch(`${API_URL}/lembrete/${idLembrete}`, {
        method: 'PUT',
        headers: cabecalhos(token),
        body: JSON.stringify(dados)
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao atualizar lembrete");
    }
}

export async function excluirLembrete(token: string, idLembrete: number): Promise<void> {
    const response = await apiFetch(`${API_URL}/lembrete/${idLembrete}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao excluir lembrete");
    }
}