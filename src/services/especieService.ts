import { API_URL, apiFetch, erroDaResposta } from "./api";
import { Alerta, Animal, AnimalAquario, DadosAnimalAquario } from "@/types";

function cabecalhos(token: string) {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export async function listarAnimais(token: string): Promise<Animal[]> {
    const response = await apiFetch(`${API_URL}/animal/listar-todos`, {
        method: "GET",
        headers: cabecalhos(token),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao listar as espécies");
    }

    const animais: Animal[] = await response.json();
    return animais;
}

export async function listarAnimaisDoAquario(token: string, idAquario: number): Promise<AnimalAquario[]> {
    const response = await apiFetch(`${API_URL}/animal-aquario/aquario/${idAquario}`, {
        method: "GET",
        headers: cabecalhos(token),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao listar os peixes do aquário");
    }

    const associacoes: AnimalAquario[] = await response.json();
    return associacoes;
}

// incompatibilidade vem como 400 com o motivo
export async function associarAnimal(token: string, dados: DadosAnimalAquario): Promise<Alerta[]> {
    const response = await apiFetch(`${API_URL}/animal-aquario/associar`, {
        method: "POST",
        headers: cabecalhos(token),
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao adicionar a espécie");
    }

    const alertas: Alerta[] = await response.json();
    return alertas;
}

export async function atualizarQuantidade(token: string, idAssociacao: number, dados: DadosAnimalAquario): Promise<void> {
    const response = await apiFetch(`${API_URL}/animal-aquario/${idAssociacao}`, {
        method: "PUT",
        headers: cabecalhos(token),
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao atualizar a quantidade");
    }
}

export async function removerAnimalDoAquario(token: string, idAssociacao: number): Promise<void> {
    const response = await apiFetch(`${API_URL}/animal-aquario/${idAssociacao}`, {
        method: "DELETE",
        headers: cabecalhos(token),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao remover a espécie");
    }
}
