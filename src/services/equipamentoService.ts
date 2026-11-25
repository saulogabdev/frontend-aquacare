import { API_URL, apiFetch, erroDaResposta } from "./api";
import { Equipamento, NovoEquipamento } from "@/types";

function cabecalhos(token: string) {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export async function listarEquipamentos(token: string, idAquario: number): Promise<Equipamento[]> {
    const response = await apiFetch(`${API_URL}/equipamento/aquario/${idAquario}`, {
        method: "GET",
        headers: cabecalhos(token),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao listar os equipamentos");
    }

    const equipamentos: Equipamento[] = await response.json();
    return equipamentos;
}

export async function cadastrarEquipamento(token: string, novo: NovoEquipamento): Promise<void> {
    const response = await apiFetch(`${API_URL}/equipamento/cadastrar`, {
        method: "POST",
        headers: cabecalhos(token),
        body: JSON.stringify(novo),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao cadastrar o equipamento");
    }
}

export async function excluirEquipamento(token: string, idEquipamento: number): Promise<void> {
    const response = await apiFetch(`${API_URL}/equipamento/${idEquipamento}`, {
        method: "DELETE",
        headers: cabecalhos(token),
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Falha ao excluir o equipamento");
    }
}
