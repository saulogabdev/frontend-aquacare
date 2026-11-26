// Conversões entre o Date do JavaScript e o LocalDateTime do Java (backend).
//
// O LocalDateTime é data e hora SEM fuso: "2026-11-27T18:00:00" quer dizer "18h no relógio de quem marcou".
// O cuidado é NÃO usar date.toISOString(): ele converte para UTC, e um lembrete das 18:00 (Brasília)
// chegaria ao backend como "21:00". Por isso montamos o texto "à mão", com a hora local do aparelho.

function doisDigitos(numero: number): string {
    return String(numero).padStart(2, "0");
}

// Date -> "2026-11-27T18:00:00" (hora local)
export function paraLocalDateTime(data: Date): string {
    const dia = `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
    const hora = `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:00`;
    return `${dia}T${hora}`;
}

// "2026-11-27T18:00:00" (ou com ".123" no fim) -> Date na hora local.
// new Date(ano, mes, dia, ...) sempre usa o fuso do aparelho, que é o que queremos.
export function deLocalDateTime(texto: string): Date {
    const [dia, hora = "00:00:00"] = texto.split("T");
    const [ano, mes, diaDoMes] = dia.split("-").map(Number);
    const [horas, minutos] = hora.split(":").map(Number);
    return new Date(ano, mes - 1, diaDoMes, horas, minutos); // mês no JavaScript começa em 0
}

const diasDaSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

// Date -> "sex, 27/11 às 18:00" (para mostrar na lista)
export function descreverDataHora(data: Date): string {
    const semana = diasDaSemana[data.getDay()];
    return `${semana}, ${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)} às ${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

// Junta o DIA de uma data com a HORA de outra (o seletor escolhe dia e hora separadamente).
export function juntarDiaEHora(dia: Date, hora: Date): Date {
    return new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), hora.getHours(), hora.getMinutes());
}

// Próxima hora cheia (agora 14:37 -> 15:00): valor inicial do formulário.
export function proximaHoraCheia(): Date {
    const data = new Date();
    data.setHours(data.getHours() + 1, 0, 0, 0);
    return data;
}
