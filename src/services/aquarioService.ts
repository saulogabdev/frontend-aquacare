import { API_URL, apiFetch, erroDaResposta } from "./api";
import { Aquario, NovoAquario, Diagnostico, ParametrosIdeais } from "@/types";

function cabecalhos(token: string) {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export async function listarMeusAquarios(token: string): Promise<Aquario[]> {
    const response = await apiFetch(`${API_URL}/aquarios/meus`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao listar aquários");
    }

    const aquarios: Aquario[] = await response.json();
    return aquarios;
}

export async function cadastrarAquario(token: string, novoAquario: NovoAquario): Promise<void> {
    const response = await apiFetch(`${API_URL}/aquarios/cadastrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(novoAquario)
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao cadastrar aquário");
    }
}

export async function buscarDiagnostico(token: string, idAquario: number | null): Promise<Diagnostico | null> {
    if (idAquario === null) {
        return null;
    }

    const response = await apiFetch(`${API_URL}/aquarios/${idAquario}/diagnostico`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    // se a api devolver 400, significa que não há diagnóstico
    if (response.status === 400) {
        return null;
    }

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao buscar diagnostico");
    }

    const diagnostico: Diagnostico = await response.json();
    return diagnostico;
}

export async function atualizarAquario(token: string, idAquario: number, dados: NovoAquario): Promise<void> {
    const response = await apiFetch(`${API_URL}/aquarios/${idAquario}`, {
        method: 'PUT',
        headers: cabecalhos(token),
        body: JSON.stringify(dados)
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao atualizar aquário");
    }
}
// 400 = aquário sem espécies (não há o que cruzar). Não é erro: vira null, como no diagnóstico.
export async function buscarParametrosIdeais(token: string, idAquario: number): Promise<ParametrosIdeais | null> {
    const response = await apiFetch(`${API_URL}/aquarios/${idAquario}/parametros-ideais`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 400) {
        return null;
    }

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao buscar os parâmetros ideais");
    }

    const ideais: ParametrosIdeais = await response.json();
    return ideais;
}
