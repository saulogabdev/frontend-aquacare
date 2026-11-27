import { API_URL, apiFetch, erroDaResposta } from "./api";
import { DadosPlantaAquario, Planta, PlantaAquario } from "@/types";

function cabecalhos(token: string) {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export async function listarPlantas(token: string): Promise<Planta[]> {
    const response = await apiFetch(`${API_URL}/planta/listar-todos`, {
        method: "GET",
        headers: cabecalhos(token),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao listar as plantas");
    }

    const plantas: Planta[] = await response.json();
    return plantas;
}

export async function listarPlantasDoAquario(token: string, idAquario: number): Promise<PlantaAquario[]> {
    const response = await apiFetch(`${API_URL}/planta-aquario/aquario/${idAquario}`, {
        method: "GET",
        headers: cabecalhos(token),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao listar as plantas do aquário");
    }

    const associacoes: PlantaAquario[] = await response.json();
    return associacoes;
}

// responde 201 sem corpo; a analise das plantas fica no diagnostico
export async function associarPlanta(token: string, dados: DadosPlantaAquario): Promise<void> {
    const response = await apiFetch(`${API_URL}/planta-aquario/associar`, {
        method: "POST",
        headers: cabecalhos(token),
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao adicionar a planta");
    }
}

export async function removerPlantaDoAquario(token: string, idAssociacao: number): Promise<void> {
    const response = await apiFetch(`${API_URL}/planta-aquario/${idAssociacao}`, {
        method: "DELETE",
        headers: cabecalhos(token),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao remover a planta");
    }
}
