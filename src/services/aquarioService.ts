import { API_URL } from "./api";
import { Aquario } from "../types/aquario";

export async function listarAquarios(token: string): Promise<Aquario[]> {
    const response = await fetch(`${API_URL}/aquarios`, {
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