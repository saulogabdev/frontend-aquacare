import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import BannerAquario from "@/components/BannerAquario";
import EquipamentosCard from "@/components/EquipamentosCard";
import { CabecalhoCard, Card, EstadoVazio, MensagemErro, Tela, TituloTela } from "@/components/ui";
import { cores, gradientes, raio, sombra } from "@/theme";

import AquarioCard from "@/components/AquarioCard";
import AquarioForm from "@/components/AquarioForm";
import { useAquarioContext,  } from "@/contexts/AquarioContext";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Aquario, Diagnostico, NovoAquario } from "@/types";
import { buscarDiagnostico } from "@/services/aquarioService";
import { ehSessaoExpirada, MENSAGEM_SESSAO_EXPIRADA } from "@/services/api";
import DiagnosticoCard from "@/components/DiagnosticoCard";
import ModalExcluirAquario from "@/components/ModalExcluirAquario";
import ModalEditarAquario from "@/components/ModalEditarAquario";
import { usePeixesDoAquario } from "@/hooks/usePeixesDoAquario";

export default function Index() {
    // SDK 58: o recomendado é pegar o router pelo hook, e não importar o objeto "router" direto.
    const router = useRouter();
  const { aquarios, idSelecionado, adicionarAquario, selecionarAquario, erro, carregando, editarAquario, removerAquario } = useAquarioContext();
  const aquarioSelecionado = aquarios.find((a) => a.id === idSelecionado);
  const listaVazia = !carregando && erro === "" && aquarios.length === 0;
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
  const [carregandoDiagnostico, setCarregandoDiagnostico] = useState<boolean>(false);
  const [erroDiagnostico, setErroDiagnostico] = useState("");
  const { token, sair } = useAuthContext();
  const { peixes, remover } = usePeixesDoAquario();
  const [erroRemover, setErroRemover] = useState("");
  // O formulário de novo aquário só aparece ao tocar em "+ Novo" (como no protótipo).
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  // Aquário que o usuário pediu para excluir (abre o modal de confirmação); null = modal fechado.
  const [aquarioParaExcluir, setAquarioParaExcluir] = useState<Aquario | null>(null);
  // Mesmo truque para a edição: o aquário guardado aqui abre o painel "Editar aquário".
  const [aquarioParaEditar, setAquarioParaEditar] = useState<Aquario | null>(null);
  // Soma das quantidades de todas as espécies (valor calculado).
  const totalPeixes = peixes.reduce((soma, peixe) => soma + peixe.quantidade, 0);

  // Cria o aquário e fecha o formulário. Se der erro, o formulário continua aberto mostrando a mensagem.
  // Remove a espécie do aquário (mesmo "remover" da aba Espécies, vindo do hook). O erro aparece no card.
  async function removerPeixe(idAssociacao: number) {
    setErroRemover("");
    try {
      await remover(idAssociacao);
    } catch (error) {
      if (error instanceof Error) {
        setErroRemover(error.message);
      }
    }
  }

  // Só roda depois da confirmação no modal. Se der erro, ele sobe e o modal mostra (e continua aberto).
  async function excluirAquario(aquario: Aquario) {
    await removerAquario(aquario.id);
    setAquarioParaExcluir(null);
  }

  // Se o PUT falhar, o erro sobe, o formulário mostra a mensagem e o painel continua aberto.
  async function salvarEdicao(aquario: Aquario, dados: NovoAquario) {
    await editarAquario(aquario.id, dados);
    setAquarioParaEditar(null);
  }

  async function criarAquario(novo: NovoAquario) {
    await adicionarAquario(novo);
    setMostrarFormulario(false);
  }

  useFocusEffect(
    useCallback(() => {
      async function carregarDiagnostico() {
        if (token === null) return;
        setCarregandoDiagnostico(true);
        setErroDiagnostico("");
        try {
          const novoDiagnostico = await buscarDiagnostico(token, idSelecionado);
          setDiagnostico(novoDiagnostico);
        } catch (error) {
          if (ehSessaoExpirada(error)) {
            await sair(MENSAGEM_SESSAO_EXPIRADA);
            return;
          }
          if (error instanceof Error) {
            setErroDiagnostico(error.message);
          }
        } finally {
          setCarregandoDiagnostico(false);
        }
      }
      carregarDiagnostico();
    }, [token, sair, idSelecionado])
  );

  async function encerrarCiclagem() {
    if (!aquarioSelecionado) return;
    await editarAquario(aquarioSelecionado.id, {
        nome: aquarioSelecionado.nome,
        litragem: aquarioSelecionado.litragem,
        tipoAgua: aquarioSelecionado.tipoAgua,
        nivelPlantas: aquarioSelecionado.nivelPlantas,
        injecaoCO2: aquarioSelecionado.injecaoCO2,
        isCiclado: true,                                  
    });
}

  return (
    <Tela>
      <TituloTela titulo="Dashboard" subtitulo="Visão geral do seu aquário" />

      {/* Meus aquários */}
      <Card>
        <CabecalhoCard
          titulo="Meus Aquários"
          acao={mostrarFormulario ? "Fechar" : "Novo"}
          onAcao={() => setMostrarFormulario(!mostrarFormulario)}
        />
        {mostrarFormulario && <AquarioForm onSalvar={criarAquario} />}

        {carregando && <ActivityIndicator color={cores.primaria} />}
        <MensagemErro texto={erro} />
        {listaVazia && !mostrarFormulario && (
          <EstadoVazio icone="fish-outline" titulo="Nenhum aquário criado" texto="Toque em + Novo para criar o primeiro." />
        )}
        {aquarios.map((aquario) => (
          <AquarioCard
            key={aquario.id}
            aquario={aquario}
            onPress={() => selecionarAquario(aquario.id)}
            ativo={aquario.id === idSelecionado}
            onEditar={() => setAquarioParaEditar(aquario)}
            onExcluir={() => setAquarioParaExcluir(aquario)}
          />
        ))}
      </Card>

      {aquarioSelecionado && (
        <>
          <BannerAquario aquario={aquarioSelecionado} onEncerrarCiclagem={encerrarCiclagem} />

          {/* Diagnóstico (SAD): estado geral + alertas */}
          {carregandoDiagnostico && !diagnostico && <ActivityIndicator color={cores.primaria} />}
          <MensagemErro texto={erroDiagnostico} />
          {diagnostico ? (
            <DiagnosticoCard diagnostico={diagnostico} />
          ) : (
            !carregandoDiagnostico && erroDiagnostico === "" && (
              <Card>
                <EstadoVazio icone="analytics-outline" titulo="Sem diagnóstico ainda" texto="Registre os parâmetros da água para receber a análise." />
              </Card>
            )
          )}

          {/* Espécies do aquário */}
          <Card>
            <CabecalhoCard titulo="Espécies do Aquário" acao="Adicionar" onAcao={() => router.push("/especies")} />
            {peixes.length === 0 ? (
              <EstadoVazio icone="fish-outline" titulo="Nenhuma espécie adicionada" texto="Sem espécies, o diagnóstico não consegue avaliar a água." />
            ) : (
              peixes.map((peixe) => (
                <View key={peixe.id} style={styles.linhaPeixe}>
                  <View style={styles.iconePeixe}>
                    <Ionicons name="fish" size={22} color={cores.primaria} />
                  </View>
                  <View style={styles.textosPeixe}>
                    <Text style={styles.nomePeixe}>{peixe.animal?.nomePopular ?? `Espécie #${peixe.idAnimal}`}</Text>
                    {peixe.animal && <Text style={styles.cientifico}>{peixe.animal.nomeCientifico}</Text>}
                    <Text style={styles.quantidade}>Quantidade: {peixe.quantidade}</Text>
                  </View>
                  <Pressable onPress={() => removerPeixe(peixe.id)} style={styles.botaoRemover} accessibilityLabel="Remover espécie">
                    <Ionicons name="trash-outline" size={18} color={cores.perigo} />
                  </Pressable>
                </View>
              ))
            )}
            <MensagemErro texto={erroRemover} />
          </Card>

          {/* Equipamentos + dimensionamento (regra do artigo, calculada pelo backend) */}
          <EquipamentosCard aquario={aquarioSelecionado} />

          {/* Números */}
          <View style={styles.grade}>
            <View style={styles.estatistica}>
              <View>
                <Text style={styles.rotuloEstatistica}>Total de peixes</Text>
                <Text style={styles.valorEstatistica}>{totalPeixes}</Text>
              </View>
              <View style={[styles.iconeEstatistica, { backgroundColor: "#cffafe" }]}>
                <Ionicons name="fish" size={22} color={cores.primaria} />
              </View>
            </View>
            <View style={styles.estatistica}>
              <View>
                <Text style={styles.rotuloEstatistica}>Espécies</Text>
                <Text style={styles.valorEstatistica}>{peixes.length}</Text>
              </View>
              <View style={[styles.iconeEstatistica, { backgroundColor: "#dbeafe" }]}>
                <Ionicons name="trending-up" size={22} color={cores.azul} />
              </View>
            </View>
          </View>

          {/* Atalhos */}
          <View style={styles.grade}>
            <Pressable style={styles.atalhoArea} onPress={() => router.push("/parametros")}>
              <LinearGradient colors={gradientes.marca} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.atalho}>
                <Ionicons name="water" size={26} color={cores.branco} />
                <Text style={styles.textoAtalho}>Registrar Parâmetros</Text>
              </LinearGradient>
            </Pressable>
            <Pressable style={styles.atalhoArea} onPress={() => router.push("/especies")}>
              <LinearGradient colors={gradientes.acaoSecundaria} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.atalho}>
                <Ionicons name="fish" size={26} color={cores.branco} />
                <Text style={styles.textoAtalho}>Ver Catálogo de Espécies</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </>
      )}

      <ModalExcluirAquario
        aquario={aquarioParaExcluir}
        onConfirmar={excluirAquario}
        onCancelar={() => setAquarioParaExcluir(null)}
      />
      <ModalEditarAquario
        aquario={aquarioParaEditar}
        onSalvar={salvarEdicao}
        onFechar={() => setAquarioParaEditar(null)}
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  linhaPeixe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    borderRadius: raio.medio,
    borderWidth: 1,
    borderColor: cores.bordaClara,
  },
  iconePeixe: {
    width: 48,
    height: 48,
    borderRadius: raio.pequeno,
    backgroundColor: cores.primariaClara,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoRemover: {
    width: 36,
    height: 36,
    borderRadius: raio.pilula,
    alignItems: "center",
    justifyContent: "center",
  },
  textosPeixe: {
    flex: 1,
  },
  nomePeixe: {
    fontWeight: "bold",
    color: cores.texto,
  },
  cientifico: {
    fontSize: 13,
    fontStyle: "italic",
    color: cores.textoFraco,
  },
  quantidade: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  grade: {
    flexDirection: "row",
    gap: 12,
  },
  estatistica: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: cores.branco,
    borderRadius: raio.medio,
    padding: 16,
    ...sombra,
  },
  rotuloEstatistica: {
    fontSize: 13,
    color: cores.textoSecundario,
  },
  valorEstatistica: {
    fontSize: 28,
    fontWeight: "800",
    color: cores.texto,
  },
  iconeEstatistica: {
    width: 44,
    height: 44,
    borderRadius: raio.pequeno,
    alignItems: "center",
    justifyContent: "center",
  },
  atalhoArea: {
    flex: 1,
  },
  atalho: {
    borderRadius: raio.medio,
    padding: 16,
    gap: 20,
    minHeight: 110,
  },
  textoAtalho: {
    color: cores.branco,
    fontWeight: "bold",
    fontSize: 15,
  },
});
