# Progresso do frontend AquaCare

Registro das aulas do desenvolvimento do app mobile do AquaCare (TCC, IFPR Cascavel).
Este arquivo é atualizado ao final de cada aula. Para continuar em outro chat com o Claude,
envie este arquivo e diga: "continue como meu professor a partir daqui".

## Como trabalhamos

- O Claude atua como **professor**: explica o conceito, passa a tarefa com dicas e um exemplo
  de *outro* app, e depois **revisa** o código (lendo os arquivos e rodando lint e typecheck).
  Ele não escreve o código das tarefas, a não ser quando o Saulo autoriza explicitamente.
- As explicações usam analogias com Java e Spring, que é a área de domínio do Saulo.
- **Todo passo vem com um exemplo de código** de outro app (livraria, cinema...), mostrando exatamente
  aquele pedaço. Nunca pedir para o Saulo escrever algo que não foi mostrado num exemplo parecido,
  nem pular a explicação de um arquivo (ex.: o `api.ts`).
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
├── services/
│   ├── api.ts                 API_URL lida do .env.local (lança erro se não existir)
│   ├── usuarioService.ts      login(email, senha): Promise<string> (o token)
│   └── aquarioService.ts      listar aquários (em andamento)
└── types/                     tipos do domínio (Aquario, NovoAquario, Animal, Planta...)
```

Fora do `src/`: o `.env.local` na raiz (ignorado pelo Git) guarda `EXPO_PUBLIC_API_URL=http://<IP do PC>:8080`.
Cada PC precisa criar o seu.

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

## Aula 7: Integração com a API (em andamento)

### Parte 0: subir o backend e testar o login ✅

**Conceitos**
- `.env` do backend: o `application.properties` usa `${JWT_SECRET}`, `${DATASOURCE_PASSWORD}` etc., e a
  dependência `spring-dotenv` lê esses valores de um `.env` (ignorado pelo Git, então cada um cria o seu).
- O banco é um **MySQL dentro do Docker**, e não o MySQL do PC. O `docker-compose.yml` cria o usuário
  `aquacare` com a senha `MYSQL_PASSWORD` **na primeira vez** que o container sobe. A porta 3308 evita
  conflito com um MySQL local na 3306. Se mudar a senha depois: `docker compose down -v` (apaga os dados).
- `JWT_SECRET`: quem inventa é você (32+ caracteres, porque o HS256 exige 256 bits). É o "carimbo" que
  assina o token. Token gerado num servidor não vale em outro com segredo diferente.
- **JWT**: `cabeçalho.conteúdo.assinatura`. O conteúdo (`sub` = e-mail, `iat`, `exp`) é só Base64 e dá
  para ler em jwt.io. A assinatura impede alterar o conteúdo. Vale 24 horas.
- API **stateless**: o servidor não guarda sessão. Toda requisição leva `Authorization: Bearer <token>`,
  e o `JwtAuthFilter` descobre o usuário pelo e-mail do token.
- O terminal do backend imprimindo SQL sem parar **não é travamento**: é o `@Scheduled` do
  `LembreteSchedulerService` somado ao `show-sql=true`.

**Como subir o backend** (na pasta do backend; hoje o Saulo usa `~/Downloads/aquacare-backend-main`, um ZIP)
```bash
# .env com MYSQL_ROOT_PASSWORD, MYSQL_PASSWORD, DATASOURCE_PASSWORD (= MYSQL_PASSWORD),
# JWT_SECRET (32+ caracteres), MAIL_USERNAME e MAIL_PASSWORD (podem ficar vazios)
docker compose up -d          # MySQL na porta 3308
./mvnw spring-boot:run        # pronto quando aparecer "Started AquacareApplication"
```
Swagger: http://localhost:8080/swagger-ui.html. Usuário de teste: `saulo@teste.com` / `123456`.

**O que foi visto na prática**
- O login devolve **200** com o token em `text/plain` (então o app usa `response.text()`).
- `/aquarios/meus` com o token devolve **200** e JSON. Sem o token, devolve **403 sem corpo**.

### Parte 1: alinhar os tipos de aquário com a API ✅

**Conceitos**
- O tipo é o contrato. Se o nome estiver errado, o valor vem `undefined` sem erro nenhum.
- **Request ≠ Response**, como os records `DadosRequest` e `AquarioResponse` do backend. O `NovoAquario`
  deixou de ser `Omit<Aquario, ...>` e virou um tipo próprio.
- O spread copia os campos com o nome que já têm: não "converte" `nivelPlanta` em `nivelPlantas`.
  Para isso, monte o objeto campo a campo (como o `AquarioResponse.from()`).
- `LocalDateTime` do Java chega no JSON como `string`.
- Usar os erros do `tsc` como lista de tarefas.

**O que foi feito**
- `Aquario`: `id`, `nivelPlantas` (`BAIXA|MEDIA|ALTA`), `dataMontagem`. `NovoAquario`: `nivelPlanta`, sem `id` e sem `dataMontagem`.
- `TipoEquipamento` sem `OUTRO`. O registro continua com `idAquario` (é a chave estrangeira).
- O `adicionarAquario` do Context faz o papel do servidor (temporário, até a API entrar).

**Commit:** `refactor: alinha tipos de aquário com a API`

### Parte 2: camada de service (em andamento)

**Conceitos**
- Service no app = `@Service` que chama outra API. As telas não sabem que existe HTTP. Um arquivo que
  exporta funções já é um service (como uma classe só com métodos `static`).
- `fetch` ≈ `RestTemplate`. `Promise<T>` ≈ `CompletableFuture<T>`. O `await` espera sem travar a tela e
  só funciona dentro de uma função `async`, que sempre devolve uma `Promise`.
- **O `fetch` não lança erro em 4xx/5xx**: confira `response.ok` e lance o `Error` você mesmo.
- Corpo da resposta: `response.text()` para texto (o login), `response.json()` para JSON (as listas).
  O 403 vem sem corpo, então use o `response.status` na mensagem (`texto || "Erro (403)"`).
- Envio: `method`, `headers` (`Content-Type: application/json`, `Authorization: Bearer ${token}`) e
  `body: JSON.stringify(objeto)`. `{ email, senha }` é atalho para `{ email: email, senha: senha }`.
- Variável de ambiente do Expo: prefixo `EXPO_PUBLIC_`, lida com `process.env.EXPO_PUBLIC_API_URL`
  **escrito por extenso** (sem desestruturar). O tipo é `string | undefined`, então valide com `if` + `throw`.
- O token **não é importado**: ele só existe depois do login e muda por usuário. Ele chega como
  **parâmetro** dos services, e quem chama passa o resultado do `login()`.
- O TypeScript não confere URLs: uma rota errada só aparece rodando.

**O que foi feito**
- `.env.local`, `api.ts` e `usuarioService.ts` com o `login` (revisados, `tsc` e lint ok).

**Falta para fechar a Parte 2**
- `aquarioService.ts`: trocar a URL `/aquarios` (não existe) por `/aquarios/meus`; criar o
  `cadastrarAquario(token, novoAquario): Promise<void>` (`POST /aquarios/cadastrar`); opcional: import
  `@/types` e nome `listarMeusAquarios`.
- Testar com um botão provisório na aba Perfil (`login` → token → listar → `console.log`).
- Commit: `feat: adiciona services de usuário e aquário para a API`.

---

## API do backend (recebida em 13/10/2026)

Referência: https://claude.ai/artifact/Nu6g1J7YPZsNgsksaZMp7o (gerada do OpenAPI do backend).
Cópia da especificação: [`docs/api-spec.json`](api-spec.json).
Repositório do backend (Spring Boot 3.5, Java 21, MySQL 8 no Docker): https://github.com/Brayan-Alves/aquacare-backend
— lido em 21/10/2026. Os DTOs reais são `record`s dentro de cada controller.
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

**Corpos confirmados no código do backend**
- `POST /aquarios/cadastrar`: `{ nome, litragem, tipoAgua, nivelPlanta, isCiclado, injecaoCO2 }` → 201 sem corpo.
  A resposta (`AquarioResponse`) usa **`nivelPlantas`**, com "s", além de `id` e `dataMontagem`.
- `POST /usuarios/login` → 200 com o token em **texto puro**. Senha errada → 400 com "E-mail ou senha inválidos.".
- `POST /registro/cadastrar`: `{ idAquario, ph, temperatura, amonia, nitrato?, nitrito?, gh?, kh?, co2?,
  salinidade?, calcio?, magnesio? }` → 201 com a lista de alertas. A `dataHora` é do servidor.

**Diferenças entre `src/types` e a API** (as do aquário e do equipamento já foram corrigidas na Aula 7)

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

## Perguntas respondidas (21/10/2026)

1. ✅ O backend roda no PC do laboratório (Java 21 e Docker já instalados). No iPhone, use o IP do PC na
   rede (`hostname -I`), não `localhost`. Se der `Network request failed`, teste primeiro na versão web.
2. ✅ Os corpos do cadastro e do login foram lidos direto no código (ver "Corpos confirmados" acima).
3. ✅ Decisão: **o app segue a API**. As diferenças de regra vão para o Brayan (lista abaixo).

## Para levar ao Brayan

1. **Segurança:** `/aquarios/{id}`, `/registro/...` e `/aquarios/listar-todos` não conferem se o aquário é do
   usuário logado. Qualquer usuário logado vê, edita e apaga os aquários dos outros.
2. Sem token, ou com token inválido/expirado, a resposta é **403 sem corpo**, e não 401. Token inválido gera
   exceção dentro do `JwtAuthFilter`. (O app vai tratar 401 e 403 como "voltar para o login".)
3. Não existe `GET /usuarios/me`: o app não consegue saber o nome do usuário logado (aba Perfil).
4. Nome diferente entre request (`nivelPlanta`) e response (`nivelPlantas`) do aquário.
5. Regra: aquário sem plantas (o enum não tem "nenhum") e equipamento `OUTRO`.
6. Documentação: `springdoc.use-fqn=true` para resolver a colisão dos `DadosRequest` no Swagger.

## Próximos passos

**Aula 7, integração com a API:**
1. ✅ Alinhar os tipos de aquário com a API.
2. ⏳ Camada de service (ver "Falta para fechar a Parte 2" na Aula 7).
3. Login: tela fora das abas, guardar o token num `AuthContext`, enviar `Authorization: Bearer` e
   redirecionar para `/login` no `_layout.tsx`. Os services continuam recebendo o token por parâmetro.
4. Listar os aquários com `GET /aquarios/meus`, com estados de carregando e erro.
5. Salvar o registro com `POST /registro/cadastrar` e mostrar os alertas devolvidos.
6. Arrumar a pasta do backend: trocar o ZIP de `~/Downloads` por um `git clone` (para receber `git pull`).

Depois:
- Histórico de registros (`GET /registro/aquario/{id}`) e diagnóstico (`GET /aquarios/{id}/diagnostico`), o diferencial do TCC.
- *Bottom sheet* para os formulários, como no protótipo.
- Enciclopédia de espécies: busca, filtros e tela de detalhe.
- Gráficos da variação de cada parâmetro ao longo dos dias.
- Lembretes com notificações push (`expo-notifications`; o token vai para `/dispositivo/cadastrar`).
