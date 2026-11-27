// formata a mao para o fuso do aparelho nao mudar o horario

export function formatarData(dataHora: string): string {
    const [data] = dataHora.split("T");
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(dataHora: string): string {
    const [, hora = ""] = dataHora.split("T");
    return `${formatarData(dataHora)} ${hora.slice(0, 5)}`.trim();
}

export function iniciais(nome: string): string {
    return nome
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join("")
        .toUpperCase();
}
