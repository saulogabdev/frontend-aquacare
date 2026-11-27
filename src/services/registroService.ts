import { API_URL, apiFetch, erroDaResposta } from "./api"
import { NovoRegistroParametro, Alerta, RegistroParametro } from "@/types/registro";

function cabecalhos(token: string) {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export async function cadastrarRegistro(token: string, registro: NovoRegistroParametro): Promise<Alerta[]> {
    const response = await apiFetch(`${API_URL}/registro/cadastrar`, {
        method: "POST",
        headers: cabecalhos(token),
        body: JSON.stringify(registro)
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Erro ao registrar parâmetro");
    }

    const alertas: Alerta[] = await response.json();
    return alertas;
}

export async function listarRegistros(token: string, idAquario: number): Promise<RegistroParametro[]> {
    const response = await apiFetch(`${API_URL}/registro/aquario/${idAquario}`, {
        method: "GET",
        headers: cabecalhos(token)
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Erro ao listar registros");
    }

    const registros: RegistroParametro[] = await response.json();
    return registros;
}

// mantem a data e devolve os alertas recalculados
export async function atualizarRegistro(token: string, idParametro: number, registro: NovoRegistroParametro): Promise<Alerta[]> {
    const response = await apiFetch(`${API_URL}/registro/${idParametro}`, {
        method: "PUT",
        headers: cabecalhos(token),
        body: JSON.stringify(registro)
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Erro ao atualizar o registro");
    }

    const alertas: Alerta[] = await response.json();
    return alertas;
}

export async function excluirRegistro(token: string, idParametro: number): Promise<void> {
    const response = await apiFetch(`${API_URL}/registro/${idParametro}`, {
        method: "DELETE",
        headers: cabecalhos(token)
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Erro ao excluir o registro");
    }
}
