import { Aquario } from "@/types";

export const CICLAGEM_DIAS = 30;

export function diasDesde(dataHora: string): number {
    const [ano, mes, dia] = dataHora.split("T")[0].split("-").map(Number);
    const montagem = new Date(ano, mes - 1, dia);
    const UM_DIA = 1000 * 60 * 60 * 24;
    return Math.floor((Date.now() - montagem.getTime()) / UM_DIA);
}

export function emCiclagem(aquario: Aquario): boolean {
    return !aquario.isCiclado && diasDesde(aquario.dataMontagem) < CICLAGEM_DIAS;
}

