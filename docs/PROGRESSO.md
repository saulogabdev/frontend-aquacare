# Progresso do frontend AquaCare

Registro das aulas do desenvolvimento do app mobile do AquaCare (TCC, IFPR Cascavel).
Este arquivo é atualizado ao final de cada aula. Para continuar em outro chat com o Claude,
envie este arquivo e diga: "continue como meu professor a partir daqui".

## Como trabalhamos

- O Claude atua como **professor**: explica o conceito, passa a tarefa com dicas e um exemplo
  de *outro* app, e depois **revisa** o código (lendo os arquivos e rodando lint e typecheck).
  Ele não escreve o código das tarefas, a não ser quando o Saulo autoriza explicitamente.
- As explicações usam analogias com Java e Spring, que é a área de domínio do Saulo.
- Ao fim de cada etapa que funciona: `npx expo lint`, `npx tsc --noEmit` e um commit.
- Os comandos são sempre rodados da **raiz do projeto** (a pasta com o `package.json`).

## Referências

- Artigo do TCC: requisitos (Quadro 2), casos de uso, DER e diagrama de classes.
- Protótipo: https://claude.ai/artifact/KUnH9vUF7hrLiEN2FN6g32
  - 5 abas: Dashboard, Parâmetros, Espécies, Lembretes, Perfil.
  - Aba ativa `#0891b2`, inativa `#9ca3af`. Gradientes ciano (`#06b6d4`) → azul (`#2563eb`).
  - Existe um **"aquário ativo"**, escolhido no Dashboard, que as abas Parâmetros e Lembretes usam.
  - Os formulários e detalhes abrem como *bottom sheet* (painel que sobe de baixo).
  - O protótipo é uma página web (HTML com Tailwind), então serve de referência visual e não pode ser copiado.
- Stack: Expo SDK 57, React Native 0.86, Expo Router, TypeScript.

## Estrutura atual

```
src/
├── app/
│   ├── _layout.tsx            Stack raiz (headerShown: false para o grupo (tabs))
│   └── (tabs)/
│       ├── _layout.tsx        Tabs com 5 abas e as cores do protótipo
│       ├── index.tsx          Dashboard (ScrollView): formulário + lista de aquários + aquário selecionado
│       ├── parametros.tsx     aquário ativo + RegistroForm + contador de registros (ScrollView)
│       ├── especies.tsx       placeholder
│       ├── lembretes.tsx      placeholder
│       └── perfil.tsx         placeholder
├── components/
│   ├── AquarioCard.tsx        card de um aquário (prop aquario, ativo, onPress)
│   ├── AquarioForm.tsx        formulário de novo aquário (prop onSalvar)
│   └── RegistroForm.tsx       formulário de medições (exporta o tipo MedicoesRegistro)
├── contexts/
│   ├── AquarioContext.tsx     AquarioProvider + useAquarioContext (lista e aquário ativo)
│   └── RegistroContext.tsx    RegistroProvider + useRegistroContext (lista de registros)
└── types/                     tipos do domínio (Aquario, NovoAquario, Animal, Planta...)
```

---

## Aula 1: Navegação com abas ✅

**Conceitos**
- No Expo Router, cada arquivo em `src/app/` é uma tela, e o caminho do arquivo vira a rota (como um `@GetMapping`).
- `index.tsx` é a tela padrão de uma pasta e responde pela rota `/`. É a primeira tela do app.
- `_layout.tsx` não é uma tela: define como as telas da pasta se organizam (`Stack` ou `Tabs`) e o que elas têm em comum.
- Uma pasta com parênteses, como `(tabs)`, é um **grupo**: organiza os arquivos, mas não entra na URL.
- **Tabs**: telas lado a lado que mantêm o estado. **Stack**: telas empilhadas com botão de voltar.
- Layouts se aninham. O Stack raiz enxerga o grupo `(tabs)` como uma tela só.
- O Expo Router substitui o antigo `App.tsx`: o `"main": "expo-router/entry"` do `package.json` faz o "scan" da pasta `app/`, como o component scan do Spring Boot.

**O que foi feito**
- 5 telas de aba e o `(tabs)/_layout.tsx`, com títulos e cores do protótipo.
- O cabeçalho duplicado foi resolvido com `<Stack.Screen name="(tabs)" options={{ headerShown: false }} />`.

**Commit:** `feat: adiciona navegação por abas`

## Aula 2: Componentes, props e estilos ✅

**Conceitos**
- **Componente**: uma função que retorna JSX e é reutilizável. Fica fora de `src/app/` (em `src/components/`).
- **Props**: os parâmetros de um componente, como um construtor. São tipadas com `type ...Props`.
- `StyleSheet`: propriedades em camelCase, números sem unidade.
- Flexbox: o padrão é empilhar na vertical, e `flexDirection: "row"` coloca lado a lado.
  `alignItems: "stretch"` é o padrão e estica os filhos; `"center"` encolhe cada filho ao tamanho do conteúdo.
- O `style` aceita um array para **combinar** estilos: `[base, extra]`.
- Ternário no `style` (escolher entre dois estilos). O ternário vai no JSX, nunca dentro do `StyleSheet.create`,
  porque ali as props não existem.
- `export default` (importado sem chaves) × export nomeado (importado com chaves, como `import { Aquario } from "@/types"`).
- `@/` é um atalho para `src/`. O `src/types/index.ts` reexporta todos os tipos.
- Lista tipada `Aquario[]` (como `List<Aquario>`), `.map()` (como `stream().map()`) e a prop `key` com o ID.
- Quando um componente representa uma entidade do domínio, passe a entidade inteira (`aquario={aquario}`).

**O que foi feito**
- `AquarioCard` com nome, litragem e etiqueta colorida de tipo de água; a prop usa o tipo `TipoAgua`.
- O Dashboard renderiza a lista de aquários com `.map()`.

**Commits:** `feat: adiciona os cards de aquário` · `refactor: ajusta estilos e tipagem do card de aquário`

## Aula 3: Estado com `useState` ✅

**Conceitos**
- Uma variável comum não redesenha a tela. O `useState` guarda um valor entre os redesenhos, e o `set...` muda o valor e redesenha.
- O `useState` vai **dentro** da função do componente, no topo. Fora dela, ocorre o erro "Rendered fewer hooks than expected".
- **Re-render** não é recarregar a página: a função do componente roda de novo e o estado é mantido.
  A tela é uma função do estado, então não existe código para "desmarcar" o card anterior.
- `Pressable` e `onPress`. Uma arrow function `() => ...` funciona como uma lambda do Java.
- O estado mora no componente "pai", e o filho avisa o pai chamando uma função recebida por props (um callback, como `() => void`).
- Renderização condicional com `&&` (mostrar ou não), em comparação com o ternário (escolher entre dois).
- `.find()` com `?.` (optional chaining, parecido com o `Optional.map()` do Java).

**O que foi feito**
- Tocar num card seleciona o aquário ativo, que ganha borda ciano, fundo `#ecfeff` e um ✓.
- O Dashboard mostra o nome do aquário selecionado.

**Commits:** `feat: seleciona e destaca aquário ativo` (+ ajustes de estilo)

## Aula 4: Formulário de novo aquário ✅

**Conceitos**
- A lista vira estado: `useState<Aquario[]>(aquariosIniciais)` (um generic).
- `TextInput` **controlado** (`value` + `onChangeText`). O campo sempre entrega `string`, então use `Number()` para converter.
- **Imutabilidade**: nunca use `push` no estado; crie uma lista nova com o spread `[...lista, novo]`. O React compara as referências.
- Função passada sem parênteses: `onPress={salvar}`, e não `salvar()`.
- Validação com *guard clause* e `return`. O `!(litros > 0)` também bloqueia o `NaN`.
- `.map()` com chaves `=> { ... return ... }` quando é preciso criar variáveis antes do JSX.
- Extrair um componente é uma **refatoração**: o formulário coleta e valida; o Dashboard decide o que fazer com os dados.
  O form entrega um `NovoAquario` (sem ID) via `onSalvar: (aquario: NovoAquario) => void`, como um `Consumer` do Java.
- Spread em objeto: `{ ...novoAquario, idAquario: Date.now() }`.
- Um componente não decide o espaçamento em volta dele (sem `flex: 1` nem `padding` externos).
- Ler a saída do lint: `linha:coluna  tipo  mensagem`.

**O que foi feito**
- Formulário com nome, litragem, seletor Doce/Marinho e validação (o seletor e a validação foram escritos pelo Claude, com autorização).
- O formulário foi extraído para `AquarioForm`, e o Dashboard ficou só com a lista e a seleção.
- Por enquanto os dados ficam **em memória** e se perdem ao recarregar o app.

**Commits:** `feat: adiciona formulário de novo aquário com validação` · `refactor: extrai formulário de aquário para componente`

## Aula 5: Context, aquário ativo compartilhado entre abas ✅

**Conceitos**
- Props só passam de pai para filho. Abas são irmãs, então não há props entre elas.
- **Context**: o estado mora acima de todas as telas que o usam. É parecido com um `@Service` singleton
  injetado com `@Autowired`.
- As 4 peças: o tipo (a "interface" do service), `createContext<Tipo | null>(null)`, o **Provider**
  (um componente com o `useState`, que recebe o `children`) e um hook próprio com `useContext` + `throw` quando for `null`.
- *Type narrowing*: depois do `if (contexto === null) throw ...`, o TypeScript sabe que o valor não é nulo.
- O Provider expõe **ações** (`adicionarAquario`, `selecionarAquario`) e não os `set...`.
- O Provider fica no layout **raiz** para envolver também as telas fora das abas (ex.: o futuro `aquario/[id]`).
  Regra: o ponto mais baixo da árvore que ainda envolve todas as telas que usam os dados.
- Desestruturação: `const { aquarios, idSelecionado } = useAquarioContext();`.
- Teclado no iOS: não fecha sozinho, e o teclado numérico não tem tecla "OK". Use `Keyboard.dismiss()`.
- `ScrollView`: o `style` é a janela, e o `contentContainerStyle` é o conteúdo (o `gap` e o `padding` vão nele).
  As props `keyboardDismissMode="on-drag"` e `keyboardShouldPersistTaps="handled"` tratam o teclado.
- Testar no celular de verdade (Expo Go no iPhone) revela problemas que a web não mostra.

**O que foi feito**
- `src/contexts/AquarioContext.tsx` com `AquarioProvider` e `useAquarioContext`. A lista inicial e o estado saíram do Dashboard.
- `AquarioProvider` no `src/app/_layout.tsx`.
- A aba Parâmetros mostra "Monitorando: [nome]" do aquário escolhido no Dashboard.
- O teclado fecha ao salvar (só se os dados forem válidos), e o Dashboard rola.

**Commits:** `feat: compartilha aquário ativo entre abas com Context` · `fix: fecha o teclado ao salvar e permite rolar o Dashboard`

## Aula 6: Registro de parâmetros (Parte A) ✅

**Conceitos**
- Campos opcionais `number | null`: vazio vira `null` ("não medi"), nunca `0` ("medi e deu zero").
  Em Java, é a diferença entre `int` e `Integer`. Converter `null` em `0` gera um diagnóstico falso.
- Vírgula decimal: `"7,2"` vira `NaN`, então troque por ponto com `.replace(",", ".")` antes do `Number()`.
  O `keyboardType="decimal-pad"` mostra a vírgula no teclado.
- Função auxiliar fora do componente (`paraNumero(texto): number | null`), como um método `static` utilitário.
- Um Context por assunto (`RegistroContext` separado do `AquarioContext`), como services separados no Spring.
- O formulário entrega só o que sabe (as medições). A **tela** completa com o `idAquario` (do aquário ativo)
  e a `dataHora`. Se o formulário lesse o Context, ele teria uma dependência escondida e não seria reutilizável.
- `Omit` com várias chaves: `Omit<NovoRegistroParametro, "idAquario" | "dataHora">`, exportado como `MedicoesRegistro`.
  Um arquivo pode ter o `export default` (o componente) e exports nomeados (o tipo).
- `??` (se for `null`, use outro valor). Depois de um `if (x === null) return`, o `?? 0` é desnecessário (type narrowing).

**O que foi feito**
- `RegistroContext` (lista em memória) e `RegistroProvider` no layout raiz, dentro do `AquarioProvider`.
- `RegistroForm` com pH, temperatura e amônia (obrigatórios), nitrito e nitrato (opcionais), com unidades nos placeholders.
- A aba Parâmetros salva o registro do aquário ativo e mostra quantos registros existem.
- O Claude fez, com autorização: mover o `idAquario` e a `dataHora` para a tela, tirar os `?? 0`,
  o `Keyboard.dismiss()`, as unidades e a limpeza de imports.

**Commit:** `feat: adiciona registro de parâmetros do aquário ativo`

**Parte B (não feita):** histórico dos registros. Com a API, ele virá de `GET /registro/aquario/{id}`.

---

## API do backend (recebida em 13/10/2026)

Referência: https://claude.ai/artifact/Nu6g1J7YPZsNgsksaZMp7o (gerada do OpenAPI do backend).
Cópia da especificação: [`docs/api-spec.json`](api-spec.json).
Base URL: `http://localhost:8080` (roda na máquina do Brayan). Swagger UI em `/swagger-ui.html`.

**Autenticação:** só 4 rotas são públicas: `POST /usuarios/login` (`{email, senha}`, devolve uma string, provavelmente o token),
`/usuarios/cadastrar` (`{email, senha, nome}`), `/usuarios/recuperar-senha` (`{email}`) e `/usuarios/redefinir-senha` (`{token, novaSenha}`).
**Todas as outras exigem** `Authorization: Bearer <token>`. Criar, editar e excluir em `/animal` e `/planta` exige ADMIN.
Consequência: **o login precisa vir antes** de listar aquários pela API.

**Rotas principais**

| Área | Rotas |
| --- | --- |
| Aquário | `GET /aquarios/meus`, `POST /aquarios/cadastrar`, `GET/PUT/DELETE /aquarios/{id}` |
| Diagnóstico | `GET /aquarios/{id}/diagnostico` → `{estado: SAUDAVEL\|ATENCAO\|CRITICO, alertas: [{mensagem, severidade: ATENCAO\|CRITICO}]}` |
| | `GET /aquarios/{id}/parametros-ideais` → `{phMin, phMax, tempMin, tempMax}` · `GET /aquarios/{id}/especies-recomendadas` |
| Registro | `POST /registro/cadastrar` (**devolve a lista de alertas**), `GET /registro/aquario/{id}`, `GET/PUT/DELETE /registro/{id}` |
| Espécies | `/animal/...` e `/planta/...`: `listar-todos`, `{id}`, `nome-popular/{nome}`, `nome-cientifico/{nome}`, filtros |
| Associações | `/animal-aquario/associar`, `/animal-aquario/aquario/{id}`, idem `/planta-aquario` |
| Outros | `/equipamento`, `/lembrete` (`meus`, `aquario/{id}`), `/dispositivo`, `PUT/DELETE /usuarios/{id}` |

**Diferenças entre `src/types` e a API (ainda não corrigidas no app)**

| Onde | No app | Na API |
| --- | --- | --- |
| Aquário, ID | `idAquario` | `id` |
| Aquário, plantas | `nivelPlanta`: `NENHUM\|BAIXO\|MEDIO\|ALTO` | `nivelPlantas`: `BAIXA\|MEDIA\|ALTA` (sem "nenhum") |
| Animal, região de nado | `SUPERFICIE` | `TOPO` |
| Animal, porte | `porte` | não existe; tem `tamanhoMedio` (número) |
| Animal, campos novos | — | `padraoTerritorial`, `lc50Amonia`, `lc50Nitrito`, `quantidadeMinimaGrupo` |
| Planta, dificuldade | `MEDIA` | `MEDIO` |
| Equipamento, tipo | tem `OUTRO` | não tem `OUTRO` |
| Lembrete | `isConcluido` | `concluido` + `notificado` |
| Animal/planta no aquário | objeto inteiro | só `idAnimal` / `idPlanta` |

Se o app ler um campo com o nome errado, o valor vem `undefined` sem erro nenhum: a tela só aparece vazia.

**Problema na documentação:** em todos os `POST`/`PUT`, o corpo aparece como `DadosRequest`, com os campos do registro.
É uma colisão de nomes no springdoc (várias classes `DadosRequest`). Só o corpo do registro é confiável.
Correção no backend: `springdoc.use-fqn=true` no `application.properties`, ou nomes únicos (`AquarioRequest`...).

---

## Pendências opcionais

- Mensagem de erro no `AquarioForm` (estado `erro` + `&&`, em vermelho `#dc2626`).
- Ícones nas abas (`npx expo install @expo/vector-icons`, opção `tabBarIcon`).
- `aquariosIniciais`: um campo por linha, e dados realistas (o aquário de corais não deveria ter plantas).
- Aba Parâmetros: mensagem "Nenhum aquário ativo..." quando não houver aquário selecionado.

## Perguntas em aberto (responder antes da próxima aula)

1. **O Saulo consegue rodar o backend no próprio computador?** (repositório, Docker, MySQL). O iPhone não acessa
   `localhost` do computador: vai ser preciso usar o IP do computador na rede Wi-Fi.
2. **Perguntar ao Brayan:** quais campos o `POST /aquarios/cadastrar` recebe? O login devolve só o texto do token ou um JSON?
3. **Decisão:** o app segue a API, ou a API muda para seguir o artigo? Recomendação: o app segue a API, e só as
   diferenças de **regra** vão para o Brayan (aquário sem plantas, equipamento `OUTRO`).

## Próximos passos

**Aula 7, integração com a API** (depois das respostas acima):
1. Alinhar os tipos de `src/types` com a API (o TypeScript aponta todos os lugares que precisam mudar).
2. Camada de service: `src/services/` com `fetch` e `async/await` (como o service do Spring). Os componentes não mudam.
3. Login: tela fora das abas, guardar o token, enviar `Authorization: Bearer` e redirecionar para `/login` no `_layout.tsx`.
4. Listar os aquários com `GET /aquarios/meus`, com estados de carregando e erro.
5. Salvar o registro com `POST /registro/cadastrar` e mostrar os alertas devolvidos.

Depois:
- Histórico de registros (`GET /registro/aquario/{id}`) e diagnóstico (`GET /aquarios/{id}/diagnostico`), o diferencial do TCC.
- *Bottom sheet* para os formulários, como no protótipo.
- Enciclopédia de espécies: busca, filtros e tela de detalhe.
- Gráficos da variação de cada parâmetro ao longo dos dias.
- Lembretes com notificações push (`expo-notifications`; o token vai para `/dispositivo/cadastrar`).
