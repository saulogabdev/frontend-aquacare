import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { RegistroParametro } from "@/types";
import { Card } from "@/components/ui";
import { cores, raio } from "@/theme";

// Os parâmetros que o gráfico sabe mostrar (os mesmos do RegistroCard, com as mesmas cores).
type ChaveParametro = "ph" | "temperatura" | "amonia" | "nitrito" | "nitrato";

const opcoes: { chave: ChaveParametro; rotulo: string; cor: string; unidade: string }[] = [
    { chave: "ph", rotulo: "pH", cor: "#0891b2", unidade: "" },
    { chave: "temperatura", rotulo: "Temp", cor: "#ea580c", unidade: "°C" },
    { chave: "amonia", rotulo: "Amônia", cor: "#dc2626", unidade: "ppm" },
    { chave: "nitrito", rotulo: "NO₂", cor: "#db2777", unidade: "ppm" },
    { chave: "nitrato", rotulo: "NO₃", cor: "#7c3aed", unidade: "ppm" },
];

// Medidas do desenho (em pixels). As margens deixam espaço para os números do eixo.
const ALTURA = 170;
const MARGEM = { esquerda: 36, direita: 12, topo: 12, baixo: 26 };

// "2026-11-18T14:32" -> "18/11"
function diaMes(dataHora: string): string {
    const [ano, mes, dia] = dataHora.split("T")[0].split("-");
    return ano ? `${dia}/${mes}` : dataHora;
}

type GraficoParametrosProps = {
    // Os registros do aquário, em QUALQUER ordem (o gráfico ordena do mais antigo para o mais novo).
    registros: RegistroParametro[];
};

export default function GraficoParametros({ registros }: GraficoParametrosProps) {
    const [chave, setChave] = useState<ChaveParametro>("ph");
    // A largura real do card só é conhecida depois que ele aparece na tela (onLayout, lá embaixo).
    const [largura, setLargura] = useState(0);
    const opcao = opcoes.find((o) => o.chave === chave) ?? opcoes[0];

    // ======================================================================
    // TODO (Saulo) — Passo 2: transformar os registros em pontos do gráfico.
    // Resultado: lista do mais ANTIGO para o mais NOVO, só com os registros que
    // têm valor para o parâmetro escolhido (nitrito/nitrato podem ser null).
    // ======================================================================
    const pontos: { dataHora: string; valor: number }[] = registros
        .filter((r) => r[chave] !== null)
        .map((r) => ({ dataHora: r.dataHora, valor: r[chave] as number }))
        .sort((a, b) => a.dataHora.localeCompare(b.dataHora));

    // ======================================================================
    // TODO (Saulo) — Passo 3: a escala (transformar valor/posição em pixels).
    // ======================================================================
    const valores = pontos.map((p) => p.valor);
    const menor = Math.min(...valores);
    const maior = Math.max(...valores);
    const folga = (maior - menor) * 0.2 || 0.5;
    const minimo = menor - folga;
    const maximo = maior + folga;

    // índice do ponto (0, 1, 2...) -> posição horizontal em pixels
    function x(indice: number): number {
        const areaUtil = largura - MARGEM.esquerda - MARGEM.direita;
        const espacoEntrePontos = areaUtil / (pontos.length - 1);
        return MARGEM.esquerda + indice * espacoEntrePontos;
    }

    // valor medido (ex.: pH 7.2) -> posição vertical em pixels
    function y(valor: number): number {
        const areaUtil = ALTURA - MARGEM.topo - MARGEM.baixo;
        const proporcao = (valor - minimo) / (maximo - minimo);
        return MARGEM.topo + (1 - proporcao) * areaUtil;
    }

    // ======================================================================
    // TODO (Saulo) — Passo 4: o caminho da linha, no formato do SVG:
    // "M x0 y0 L x1 y1 L x2 y2 ..."  (M = move a caneta, L = desenha uma linha até)
    // ======================================================================
    const caminho = pontos
    .map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.valor)}`)
    .join(" ");

    // Três linhas de grade: mínimo, meio e máximo do eixo Y.
    const grade = [minimo, (minimo + maximo) / 2, maximo];
    const formatar = (v: number) => (chave === "ph" ? v.toFixed(1) : Number.isInteger(v) ? String(v) : v.toFixed(1));

    return (
        <Card>
            <View style={styles.cabecalho}>
                <Text style={styles.titulo}>Evolução dos Parâmetros</Text>
                <Text style={styles.contador}>{registros.length} registros</Text>
            </View>

            {/* Botões para escolher o parâmetro */}
            <View style={styles.opcoes}>
                {opcoes.map((o) => {
                    const ativo = o.chave === chave;
                    return (
                        <Pressable
                            key={o.chave}
                            onPress={() => setChave(o.chave)}
                            style={[styles.pilula, { backgroundColor: ativo ? o.cor : cores.bordaClara }]}
                        >
                            <Text style={[styles.textoPilula, { color: ativo ? cores.branco : cores.textoSecundario }]}>
                                {o.rotulo}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {pontos.length < 2 ? (
                <Text style={styles.aviso}>
                    Faça pelo menos 2 registros com {opcao.rotulo} para ver a evolução.
                </Text>
            ) : (
                <View onLayout={(e) => setLargura(e.nativeEvent.layout.width)}>
                    {largura > 0 && (
                        <Svg width={largura} height={ALTURA}>
                            {/* Grade horizontal + números do eixo Y */}
                            {grade.map((v, i) => (
                                <Line
                                    key={`linha-${i}`}
                                    x1={MARGEM.esquerda}
                                    x2={largura - MARGEM.direita}
                                    y1={y(v)}
                                    y2={y(v)}
                                    stroke={cores.borda}
                                    strokeDasharray="4 4"
                                />
                            ))}
                            {grade.map((v, i) => (
                                <SvgText key={`rotulo-${i}`} x={MARGEM.esquerda - 6} y={y(v) + 4} fontSize={10} fill={cores.textoFraco} textAnchor="end">
                                    {formatar(v)}
                                </SvgText>
                            ))}

                            {/* A linha */}
                            <Path d={caminho} stroke={opcao.cor} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />

                            {/* Uma bolinha em cada registro */}
                            {pontos.map((p, i) => (
                                <Circle key={i} cx={x(i)} cy={y(p.valor)} r={4} fill={cores.branco} stroke={opcao.cor} strokeWidth={2} />
                            ))}

                            {/* Datas do primeiro e do último registro */}
                            <SvgText x={x(0)} y={ALTURA - 6} fontSize={10} fill={cores.textoFraco} textAnchor="start">
                                {diaMes(pontos[0].dataHora)}
                            </SvgText>
                            <SvgText x={x(pontos.length - 1)} y={ALTURA - 6} fontSize={10} fill={cores.textoFraco} textAnchor="end">
                                {diaMes(pontos[pontos.length - 1].dataHora)}
                            </SvgText>
                        </Svg>
                    )}
                    <Text style={[styles.ultimo, { color: opcao.cor }]}>
                        Último: {formatar(pontos[pontos.length - 1].valor)} {opcao.unidade}
                    </Text>
                </View>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    cabecalho: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: cores.texto,
    },
    contador: {
        fontSize: 12,
        color: cores.textoFraco,
    },
    opcoes: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    pilula: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: raio.pilula,
    },
    textoPilula: {
        fontSize: 12,
        fontWeight: "600",
    },
    aviso: {
        color: cores.textoSecundario,
        textAlign: "center",
        paddingVertical: 24,
    },
    ultimo: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 2,
    },
});
