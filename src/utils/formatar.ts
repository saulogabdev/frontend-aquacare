// O backend manda datas no formato "2026-11-18T14:32:10.123" (hora local, sem fuso).
// Formatamos "à mão", sem new Date(), para o horário não ser deslocado pelo fuso do aparelho.

// "2026-11-18T14:32:10" -> "18/11/2026"
export function formatarData(dataHora: string): string {
    const [data] = dataHora.split("T");
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// "2026-11-18T14:32:10" -> "18/11/2026 14:32"
export function formatarDataHora(dataHora: string): string {
    const [, hora = ""] = dataHora.split("T");
    return `${formatarData(dataHora)} ${hora.slice(0, 5)}`.trim();
}

// "Saulo Gabriel Souza" -> "SG"
export function iniciais(nome: string): string {
    return nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase();
}
