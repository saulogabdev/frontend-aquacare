// notificacoes locais: o servidor e a fonte da verdade; cancela tudo e reagenda os futuros
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { AndroidImportance } from "expo-notifications";
import { Lembrete } from "@/types";
import { deLocalDateTime } from "@/utils/dataHora";

const CANAL_ANDROID = "lembretes";
// o ios aceita no maximo 64 agendamentos
const LIMITE_AGENDAMENTOS = 60;
// nao funciona na web
const suportado = Platform.OS !== "web";

// sem isso a notificacao nao aparece com o app aberto
export function configurarNotificacoes() {
    if (!suportado) return;
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}

// android 13+: sem o canal o pedido de permissao nem aparece
async function prepararCanal() {
    if (Platform.OS !== "android") return;
    await Notifications.setNotificationChannelAsync(CANAL_ANDROID, {
        name: "Lembretes",
        importance: AndroidImportance.HIGH,
    });
}

export async function notificacoesPermitidas(): Promise<boolean> {
    if (!suportado) return false;
    const permissao = await Notifications.getPermissionsAsync();
    return permissao.granted;
}

export async function pedirPermissaoNotificacoes(): Promise<boolean> {
    if (!suportado) return false;
    await prepararCanal();
    if (await notificacoesPermitidas()) return true;
    const resposta = await Notifications.requestPermissionsAsync();
    return resposta.granted;
}

async function reagendar(lembretes: Lembrete[], nomeDoAquario: (idAquario: number) => string) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!(await notificacoesPermitidas())) return;
    await prepararCanal();

    const agora = Date.now();
    const futuros = lembretes
        .filter((lembrete) => !lembrete.concluido)
        .map((lembrete) => ({ lembrete, data: deLocalDateTime(lembrete.dataHoraLembrete) }))
        .filter(({ data }) => data.getTime() > agora)
        .sort((a, b) => a.data.getTime() - b.data.getTime())
        .slice(0, LIMITE_AGENDAMENTOS);

    for (const { lembrete, data } of futuros) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: lembrete.titulo,
                body: `Lembrete do aquário ${nomeDoAquario(lembrete.idAquario)}`,
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: data,
                channelId: CANAL_ANDROID,
            },
        });
    }
}

// fila: uma sincronizacao espera a outra, para nao duplicar avisos
let fila: Promise<void> = Promise.resolve();

export function sincronizarNotificacoes(
    lembretes: Lembrete[],
    nomeDoAquario: (idAquario: number) => string,
): Promise<void> {
    if (!suportado) return Promise.resolve();
    fila = fila
        .then(() => reagendar(lembretes, nomeDoAquario))
        .catch(() => {
        });
    return fila;
}

export function cancelarNotificacoes(): Promise<void> {
    if (!suportado) return Promise.resolve();
    fila = fila.then(() => Notifications.cancelAllScheduledNotificationsAsync()).catch(() => {});
    return fila;
}
