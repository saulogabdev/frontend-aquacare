import { API_URL, apiFetch, erroDaResposta } from "./api"
import { NovoRegistroParametro, Alerta } from "@/types/registro";

export async function cadastrarRegistro(token: string, registro: NovoRegistroParametro): Promise<Alerta[]> {
    const response = await apiFetch(`${API_URL}/registro/cadastrar`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(registro)
    });

    if (!response.ok) {
        throw await erroDaResposta(response, "Erro ao registrar parâmetro");
    }

    const alertas: Alerta[] = await response.json();
    return alertas;
}