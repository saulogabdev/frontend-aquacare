import { API_URL } from "./api";
import { Aquario, NovoAquario } from "@/types";

export async function listarMeusAquarios(token: string): Promise<Aquario[]> {
    const response = await fetch(`${API_URL}/aquarios/meus`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Falha ao listar aquários (${response.status})`);
    }

    const aquarios: Aquario[] = await response.json();
    return aquarios;
}

export async function cadastrarAquario(token: string, novoAquario: NovoAquario): Promise<void> {
    const response = await fetch(`${API_URL}/aquarios/cadastrar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(novoAquario)
    });

    if (!response.ok) {
        const texto = await response.text();
        throw new Error(texto || `Falha ao cadastrar aquário (${response.status})`);
    }
}