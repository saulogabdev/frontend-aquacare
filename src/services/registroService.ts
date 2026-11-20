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