import { Card, EstadoVazio, Tela, TituloTela } from "@/components/ui";

// Lembretes ficaram como trabalho futuro (a API já tem as rotas /lembrete/...).
export default function Lembretes() {
    return (
        <Tela>
            <TituloTela titulo="Lembretes" subtitulo="Trocas de água, testes e manutenção" />
            <Card>
                <EstadoVazio
                    icone="notifications-outline"
                    titulo="Em breve"
                    texto="Os lembretes de manutenção com notificação no celular estão previstos para a próxima versão."
                />
            </Card>
        </Tela>
    );
}
