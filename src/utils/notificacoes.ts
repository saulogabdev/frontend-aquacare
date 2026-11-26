// Notificações LOCAIS: o próprio celular guarda "no dia X às Y, mostre este aviso" e mostra
// mesmo com o app fechado e sem internet. Não depende do servidor nem de development build.
//
// Estratégia (ideia do Saulo): o servidor é a fonte da verdade. Sempre que a lista de lembretes
// é carregada, o app CANCELA tudo o que estava agendado neste celular e AGENDA de novo os lembretes
// futuros e não concluídos. Assim qualquer celular fica igual ao servidor, sem precisar guardar
// o id de cada agendamento nem saber "quem criou" o lembrete.
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { AndroidImportance } from "expo-notifications";
import { Lembrete } from "@/types";
import { deLocalDateTime } from "@/utils/dataHora";

const CANAL_ANDROID = "lembretes";
// O iOS guarda no máximo 64 notificações agendadas por app; ficamos com folga.
const LIMITE_AGENDAMENTOS = 60;
// A biblioteca só funciona no iOS e no Android (na web, todas as funções abaixo não fazem nada).
const suportado = Platform.OS !== "web";

// Chamado uma vez ao abrir o app: diz o que fazer se o aviso chegar com o app ABERTO
// (sem isto, com o app na tela, a notificação não aparece).
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

// Android 8+ exige um "canal" (aparece nas configurações do celular como "Lembretes").
// No Android 13+, sem o canal, o pedido de permissão nem aparece.
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

// Mostra a janelinha "AquaCare deseja enviar notificações". Se o usuário já negou antes,
// o sistema não mostra de novo (aí só pelas configurações do celular).
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

// "Fila": se duas sincronizações forem pedidas ao mesmo tempo (ex.: ao abrir o app e ao abrir a aba),
// a segunda espera a primeira terminar. Sem isso, os "cancela tudo" e "agenda" se misturariam
// e poderiam sobrar avisos duplicados. (Parecido com um método synchronized no Java.)
let fila: Promise<void> = Promise.resolve();

export function sincronizarNotificacoes(
    lembretes: Lembrete[],
    nomeDoAquario: (idAquario: number) => string,
): Promise<void> {
    if (!suportado) return Promise.resolve();
    fila = fila
        .then(() => reagendar(lembretes, nomeDoAquario))
        .catch(() => {
            // Falha ao agendar não deve quebrar a tela: o lembrete continua salvo no servidor.
        });
    return fila;
}

// Ao sair da conta: este celular não deve avisar lembretes de quem saiu.
export function cancelarNotificacoes(): Promise<void> {
    if (!suportado) return Promise.resolve();
    fila = fila.then(() => Notifications.cancelAllScheduledNotificationsAsync()).catch(() => {});
    return fila;
}
