// localdatetime nao tem fuso: nunca usar toisostring, que converte para utc

function doisDigitos(numero: number): string {
    return String(numero).padStart(2, "0");
}

export function paraLocalDateTime(data: Date): string {
    const dia = `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
    const hora = `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:00`;
    return `${dia}T${hora}`;
}

export function deLocalDateTime(texto: string): Date {
    const [dia, hora = "00:00:00"] = texto.split("T");
    const [ano, mes, diaDoMes] = dia.split("-").map(Number);
    const [horas, minutos] = hora.split(":").map(Number);
    return new Date(ano, mes - 1, diaDoMes, horas, minutos); // mes comeca em 0
}

const diasDaSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function descreverDataHora(data: Date): string {
    const semana = diasDaSemana[data.getDay()];
    return `${semana}, ${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)} às ${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

export function juntarDiaEHora(dia: Date, hora: Date): Date {
    return new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), hora.getHours(), hora.getMinutes());
}

export function proximaHoraCheia(): Date {
    const data = new Date();
    data.setHours(data.getHours() + 1, 0, 0, 0);
    return data;
}
