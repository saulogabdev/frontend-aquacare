# Progresso do frontend AquaCare

Registro das aulas do desenvolvimento do app mobile do AquaCare (TCC, IFPR Cascavel).
Este arquivo é atualizado ao final de cada aula. Para continuar em outro chat com o Claude,
envie este arquivo e diga: "continue como meu professor a partir daqui".

## Como trabalhamos

**Modo atual (desde 13/11/2026, prazo de ~2 semanas):** o Claude **implementa** as partes repetitivas e toda
a estilização, em passos pequenos, com uma explicação curta de cada mudança (para o Saulo conseguir
defender o código na banca). O Saulo **revisa** cada entrega e, se der tempo, faz ele mesmo o diferencial
do TCC (registro → alertas, diagnóstico). Commits só quando o Saulo pedir. Plano em "Plano final" (fim do arquivo).

**Modo anterior (Aulas 1 a 7):**
- O Claude atua como **professor**: explica o conceito, passa a tarefa com dicas e um exemplo
  de *outro* app, e depois **revisa** o código (lendo os arquivos e rodando lint e typecheck).
  Ele não escreve o código das tarefas, a não ser quando o Saulo autoriza explicitamente.
- As explicações usam analogias com Java e Spring, que é a área de domínio do Saulo.
- Ao passar uma tarefa, o Claude marca o que é **novo** e o que é **repetitivo** (algo já feito e aprendido
  numa aula anterior). O Saulo decide se faz a parte repetitiva ou se passa para o Claude.
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

### Parte 2: camada de service ✅

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

- `aquarioService.ts` com `listarMeusAquarios(token)` (`GET /aquarios/meus`) e
  `cadastrarAquario(token, novoAquario)` (`POST /aquarios/cadastrar`). Revisado em 24/10/2026, `tsc` e lint ok.
- **Commits:** `feat: adiciona service de aquários` · `feat: adiciona cadastro de aquário ao service`

- Teste de ponta a ponta (24/10/2026) ✅: o botão provisório da aba Perfil faz `login` → `cadastrarAquario`
  → `listarMeusAquarios` → `console.log`, e os dados aparecem no MySQL Workbench. (Ainda sem commit.)
- MySQL Workbench: host `127.0.0.1`, porta **3308** (não 3306), usuário `aquacare`, banco `aquacare`,
  senha = `MYSQL_PASSWORD` do `.env` do backend. Use para olhar os dados; para mudar, use a API.
- Lição: o banco é **por computador** (cada PC tem o seu container). Neste PC o usuário de teste é
  `saulo@teste.com` / `saulo123`, criado pelo Swagger (`POST /usuarios/cadastrar`).
  Para achar um erro de login: teste a mesma requisição no Swagger primeiro.

**Parte 2 concluída.**

### Parte 3: tela de login + `AuthContext` ✅

**Conceitos**
- `Stack.Protected guard={...}`: as telas dentro dele só existem quando o `guard` é `true`.
  É uma regra declarada num lugar só, como o `authorizeHttpRequests` do Spring Security.
- ⚠️ Quando o `guard` vai de `true` para `false`, o Expo Router tira o usuário da tela. Mas de `false` para
  `true` ele **não** leva o usuário até a tela nova. Solução: proteger o login com o `guard` **invertido**
  (`token === null`). Assim existe sempre exatamente uma tela disponível, e a troca é automática nos dois sentidos.
- Isso protege só a navegação. Quem protege os dados é o backend, com o token.
- Um hook só funciona **abaixo** do seu Provider: o `_layout.tsx` raiz foi dividido em `RootLayout`
  (coloca os Providers) e `NavegacaoRaiz` (usa o `useAuthContext` e monta o Stack).
- O `AuthProvider` fica por fora dos outros, porque eles vão precisar do token para chamar a API.
- Guardar o mínimo no Context (o `token`) e **derivar** o resto (`token !== null` = está logado),
  sem um segundo estado para manter sincronizado.
- `useState<string | null>(null)`: o tipo precisa ser declarado, senão o TypeScript acha que é sempre `null`.
- O `entrar` é `async` (`Promise<void>`) e **não** tem `try/catch`: o erro sobe para a tela, que mostra a mensagem.
- Na tela: estados `carregando` (botão com `disabled` e o texto "Entrando...") e `erro`, com `try/catch/finally`
  (o `finally` roda sempre) e `if (e instanceof Error)`.
- Mensagem condicional com `erro !== "" && <Text>`: a comparação explícita evita o erro
  "Text strings must be rendered within a `<Text>` component" quando o texto é vazio.
- `TextInput`: `secureTextEntry` (senha), `autoCapitalize="none"` e `keyboardType="email-address"`.

**O que foi feito**
- `src/contexts/AuthContext.tsx` (`token`, `entrar`, `sair`, `useAuthContext`).
- `src/app/login.tsx` fora das abas, com carregando e erro (a mensagem de erro foi escrita pelo Claude, com autorização).
- `_layout.tsx` com os dois `Stack.Protected`. A aba Perfil tem o botão "Sair", e o botão provisório saiu.

**Limitações conhecidas (resolvidas na Parte 4)**
- O token fica só em memória: ao recarregar o app, volta para o login. (Resolvido na 4A.)
- Os aquários do Dashboard ainda são os de memória (`aquariosIniciais`), e não os da API. (Parte 4B.)

**Configuração por computador**
- O `.env.local` é ignorado pelo Git (`.env*.local`): **cada computador precisa criar o seu**, com
  `EXPO_PUBLIC_API_URL=http://<IP do PC que roda o backend>:8080`. Sem ele, o `api.ts` lança erro ao abrir o app.
  Depois de mudar o `.env.local`, reinicie o `npx expo start`.

**Rodar o backend no Windows (PC de casa, 24/10/2026)**
- Erro `JAVA_HOME environment variable is not defined correctly`: o `mvnw` precisa da variável `JAVA_HOME`
  apontando para a pasta do JDK (`C:\Program Files\Java\jdk-24`). O `java -version` funcionar não basta.
  Criar com: `[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-24", "User")`.
- Variáveis de ambiente só valem para programas abertos **depois** da mudança: feche o VS Code inteiro.
- **WSL ≠ Windows**: o WSL é um Linux à parte, com variáveis e programas próprios. O `JAVA_HOME` do Windows
  não existe dentro dele. Rode o backend no PowerShell **sem** WSL, com `.\mvnw spring-boot:run`.
- IP para o celular: no Windows, use o `ipconfig` (adaptador Wi-Fi, "Endereço IPv4"). O `hostname -I`
  do WSL mostra o IP da máquina virtual, que o celular não alcança. Se der `Network request failed`,
  verifique o Firewall do Windows (porta 8080) e teste antes na versão web.
- Este PC tem o JDK 24; o backend pede o 21. Se aparecer erro de compilação (ex.: Lombok), instalar o JDK 21.

### Parte 4A: guardar o token no aparelho ✅

**Conceitos**
- `expo-secure-store` (Keychain no iPhone, armazenamento criptografado no Android): `setItemAsync`,
  `getItemAsync` (devolve `string | null`) e `deleteItemAsync`. Instale com `npx expo install`, que também
  adiciona o config plugin no `app.json` (o `app.json`, o `package.json` e o `package-lock.json` vão no commit).
- ⚠️ O SecureStore **não funciona na web**. Lá usamos o `localStorage` (síncrono e sem criptografia, só para testes).
- `Platform.OS === "web"` escolhe a implementação. O `tokenStorage.ts` esconde isso do resto do app
  (como um `TokenRepository` com duas implementações). Uma função `async` sem `await` também devolve `Promise`.
- Chave em constante (`CHAVE_TOKEN = "aquacare.token"`): um erro de digitação não cria outra chave sem aviso.
- `useEffect(() => {...}, [])`: roda **uma vez**, depois que o componente aparece (como o `@PostConstruct`).
  Ele não aceita uma função `async` direto: crie a função `async` dentro e chame em seguida.
  Fica no `AuthProvider`: o código que carrega um dado fica junto do estado que o guarda.
- Estado `carregando` (começa `true`): enquanto o token não foi lido, o layout retorna `null`, evitando a "piscada" do login.
- O `setCarregando(false)` vai no **`finally`**, senão uma falha na leitura deixa o app em branco para sempre.
- No `entrar`: **primeiro** o que pode falhar (`salvarToken`), **depois** o que muda a tela (`setToken`).
- Validade do JWT: a API é stateless, então o `exp` é a única forma de um token deixar de valer. O "Sair"
  apaga só a cópia do celular. O app precisa tratar token vencido (403 → `sair()`), assunto da Parte 4B.

**O que foi feito**
- `src/services/tokenStorage.ts` (`salvarToken`, `obterToken`, `removerToken`).
- `AuthContext` com `carregando` e `useEffect`; o `_layout.tsx` retorna `null` enquanto carrega.

**Commit:** `feat: persiste o token com SecureStore no celular e localStorage na web` (+ o ajuste do `finally`)

### Parte 4B-1: listar os aquários da API ✅ (ainda sem commit)

**Conceitos**
- Um Context usando outro: o `AquarioProvider` chama o `useAuthContext()` para pegar o token. Funciona porque
  o `AuthProvider` está por fora (como um `@Service` injetando outro).
- `useEffect(..., [token])`: roda ao aparecer **e** sempre que o token muda (entrar, sair, trocar de usuário).
  Ao sair, limpe tudo da sessão (lista, seleção e erro) para o próximo usuário não ver dados do anterior.
- Os estados de um dado da rede: carregando, erro, vazio e com dados. A tela mostra cada um.
  `listaVazia = !carregando && erro === "" && aquarios.length === 0` evita "você não tem aquários" enquanto carrega ou com erro.
- ⚠️ O `setAlgo(valor)` **não muda a variável na hora**: ele agenda um re-render. Na execução atual, o estado
  ainda tem o valor antigo (uma "foto"). Use a variável local que já tem o valor novo (`listaAquarios`).
  O aviso `react-hooks/exhaustive-deps` do lint costuma apontar esse tipo de bug.
- Ao carregar a lista de um novo login, selecionar o primeiro aquário (a seleção anterior era de outra sessão).
- `ActivityIndicator`: o indicador de carregamento nativo.

**O que foi feito**
- `AquarioContext`: sem `aquariosIniciais`; `carregando`, `erro`, `idSelecionado: number | null` e `useEffect([token])`.
- Dashboard com os avisos de carregando, erro e lista vazia (escritos pelo Claude, com autorização).
- O `adicionarAquario` ainda adiciona só na memória (Parte 4B-2).

**Commit:** `feat: carrega os aquários da API com carregando, erro e lista vazia`

### Parte 4B-2: cadastrar o aquário pela API ✅ (falta testar e commitar)

**Conceitos**
- O `POST /aquarios/cadastrar` devolve 201 **sem corpo** (sem o `id`), então depois de cadastrar o app
  **recarrega a lista** com o `GET` (a fonte da verdade). O `Date.now()` saiu do Context.
- O `onSalvar` virou `(novo) => Promise<void>`: o formulário usa `await` e **só limpa os campos no sucesso**.
- O `adicionarAquario` do Context **não tem `try/catch`**: o erro sobe para o formulário (igual ao `entrar`).
  Se o Context capturar o erro, o formulário acha que deu certo e apaga o que o usuário digitou.
- Depois de um `throw`, a função já parou: um `return` logo depois é código inalcançável (aviso `no-unreachable`).
- Selecionar o recém-criado: o maior `id` da lista (`reduce` com `Math.max`).

**O que foi feito**
- Saulo: o `adicionarAquario` assíncrono com cadastrar → recarregar → selecionar, e o tipo `Promise<void>` no form.
- Claude (com autorização): os estados `salvando` e `erro` no `AquarioForm` (com a mensagem de validação,
  fechando a pendência da Aula 4) e a remoção do `try/catch` e do `return` inalcançável do Context.

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
7. Validade do JWT (hoje 24 h): para um app de uso esporádico, avaliar 7 a 30 dias. **Não** remover a validade:
   como a API é stateless, o `exp` é a única forma de um token "morrer" (o "Sair" do app só apaga a cópia
   do celular; o token continua válido no servidor até vencer). Justificar o valor escolhido no artigo.
8. **Análise sem espécies:** o `AnaliseParametroService` só gera alertas dentro do `for` dos animais associados.
   Aquário sem espécie → sempre `[]` → o app mostra "Tudo certo!" para qualquer valor (diagnóstico enganoso).
   Sugestão: devolver um alerta "Cadastre as espécies do aquário para receber a análise". (Plano B: o app
   consulta `GET /animal-aquario/aquario/{id}` e avisa.)
9. **SAD precisa recomendar a ação, não só detectar.** Adicionar `recomendacao` (String) ao `Alerta`, um texto por
   regra do `AnaliseParametroService`. Separar pH/temperatura em "acima" e "abaixo" (hoje é um `if` só com `||`)
   para a recomendação certa. Ex.: amônia tóxica → "Troca parcial de 30–50%, suspender alimentação por 24 h,
   remover matéria orgânica". No app: `recomendacao?: string` (opcional) no tipo `Alerta` e exibir no cartão.
   No artigo: fecha o ciclo do SAD (dados → modelo → informação → apoio à decisão).
12. **Campo `parametro` no `Alerta` (18/11):** o protótipo pinta cada valor do registro (pH, temp, NH3...) de
    verde/amarelo/vermelho. Para isso o app precisa saber a QUAL parâmetro o alerta se refere (hoje só há o
    texto). Pedir enum `parametro` (PH, TEMPERATURA, AMONIA, NITRITO, CALCIO, MAGNESIO...). **Juntar com os
    itens 9 e 11 numa mudança só:** `Alerta { parametro, mensagem, severidade, recomendacao }`, salvo por
    registro e devolvido no `GET /registro/aquario/{id}`. Sem isso, o app mostra os valores em cor neutra.
11. **Alertas no histórico (17/11):** o `GET /registro/aquario/{id}` não traz os alertas de cada registro (eles
    não são salvos). Recomendado: persistir os alertas (tabela `alerta` com FK do registro), pois guarda o que o
    sistema disse NAQUELE momento. Alternativa rápida: recalcular com `analisar()` ao listar (usa as espécies
    de hoje). Obs.: o "último resultado" já é recuperável pelo `GET /aquarios/{id}/diagnostico`, que reanalisa
    o último registro → o app usa isso no item 3 (Dashboard **e** Parâmetros).
10. **Decisão (16/11): regras extras viram TRABALHOS FUTUROS** (escopo de TCC técnico). Exemplos: KH baixo, CO2
    calculado por pH+KH (CO2 ≈ 3·KH·10^(7−pH)), oscilação de pH com KH baixo usando o histórico. Motivo: muitas
    condições e limites que exigem referência. Prioridade agora é só o item 9 (recomendação). Opcional se sobrar
    tempo: regra "KH baixo" de um registro só + campo KH no `RegistroForm` (hoje KH/GH/CO2/salinidade/cálcio/
    magnésio vão sempre `null`). **(A FAZER: Saulo vai pedir)** Ler o artigo e separar o que ele promete em
    "fazer agora" × "trabalhos futuros" (vira a seção do texto).
    - **CO2 estimado (conferido 16/11 no artigo, versão de 24/09):** a seção 2.2.10 diz que KH + pH permitem
      estimar o CO2 [Pádua 2010], mas SEM fórmula e FORA das regras de negócio da arquitetura. Se for
      implementar: CO2 (mg/L) ≈ 3 × KH (dKH) × 10^(7 − pH) → "Equação 4" no artigo; só quando houver KH;
      precisa confirmar a fórmula na fonte e citar uma faixa de referência de CO2. Candidata nº 1 se fizerem
      UMA regra extra.

## Próximos passos

**Aula 7, integração com a API:**
1. ✅ Alinhar os tipos de aquário com a API.
2. ✅ Camada de service.
3. ✅ Login: tela fora das abas, token no `AuthContext`, `Stack.Protected` no `_layout.tsx`.
4. ✅ Parte 4A: token guardado no aparelho.
   ⏭️ Parte 4B: ligar o `AquarioContext` na API, em três etapas:
   - 4B-1: listar (`GET /aquarios/meus`) quando o token muda, com carregando, erro e lista vazia;
   - 4B-2: cadastrar (`POST /aquarios/cadastrar`) e recarregar a lista; o formulário espera e mostra erros;
   - 4B-3: token vencido (403) → `sair()`, com um erro próprio (`ErroApi` com `status`).
   Os services continuam recebendo o token por parâmetro, e quem passa é o Context.
5. Arrumar a pasta do backend: trocar o ZIP de `~/Downloads` por um `git clone` (para receber `git pull`).

## Plano final (13/11/2026 → ~27/11/2026)

Prioridade = o que mais pesa na apresentação (o SAD do artigo: registrar → analisar → alertar).
Dono: **C** = Claude implementa e explica; **S** = Saulo faz (ou revisa, se o tempo apertar).

**Semana 1: o núcleo do TCC funcionando de ponta a ponta**

| # | Item | Dono | Rotas da API |
| --- | --- | --- | --- |
| 1 | ✅ 4B-3: token vencido (401/403) → `sair()`, com `ErroApi` (erro com `status`) nos services | C | — |
| 2 | ✅ Registro de parâmetros pela API + mostrar os **alertas** devolvidos | S (diferencial) | `POST /registro/cadastrar` |
| 3 | ✅ **Diagnóstico** do aquário ativo no Dashboard (estado SAUDÁVEL / ATENÇÃO / CRÍTICO + alertas) | S (diferencial) | `GET /aquarios/{id}/diagnostico` |
| 4 | Histórico de registros na aba Parâmetros | C | `GET /registro/aquario/{id}` |
| 5 | Visual do protótipo: cabeçalho (logo + avatar + sair), ícones das abas, banner do aquário ativo, cards | C | — |
| 6 | Tela de cadastro de usuário (link no login) | C | `POST /usuarios/cadastrar` |

**Item 1 feito (13/11/2026), como funciona:**
- `api.ts`: a classe `ErroApi` (um `Error` com `status`, como uma exceção própria em Java), a função
  `erroDaResposta(response, mensagemPadrao)` usada por todos os services, e `ehSessaoExpirada(erro)` (401 ou 403).
- `AuthContext`: o `sair(aviso?)` guarda uma mensagem que a tela de login mostra em amarelo. O `sair` usa
  `useCallback`, para ser sempre a mesma função e poder entrar nas dependências de um `useEffect` sem
  disparar o efeito a cada re-render. Corrigido também o `setCarregando(false)`, que voltou para o `finally`.
- `AquarioContext`: ao listar ou cadastrar, se a sessão expirou, chama `sair("Sua sessão expirou...")`.
  No cadastro, o erro continua subindo para o formulário (`throw error` depois do `sair`).
- Perfil: `onPress={() => sair()}`. Sem a arrow function, o `onPress` passaria o evento do toque como
  o primeiro argumento do `sair`, que agora é o texto do aviso.
- Para testar: na web, F12 → Application → Local Storage → edite o `aquacare.token` (estrague um caractere)
  e recarregue. Deve voltar ao login com o aviso amarelo. Apagar a chave inteira NÃO mostra o aviso
  (sem token o app nem chama a API: é "não logado", e não "sessão expirada").
- Testado em 16/11/2026 ✅. Commit: `feat: volta ao login quando a sessao expira`.
- `apiFetch` (em `api.ts`): todos os services usam no lugar do `fetch`. Sem conexão, o `fetch` lança um erro
  técnico em inglês ("Failed to fetch" na web, "Network request failed" no celular); o `apiFetch` troca por
  "Não foi possível conectar ao servidor...". **Todo service novo deve usar o `apiFetch`.**

**Item 2 (16/11/2026): ✅ pronto e testado (17/11).** Saulo fez com aula; Claude fez a exibição dos alertas e o form.
- Tipos (`types/registro.ts`): `Severidade = 'ATENCAO' | 'CRITICO'`, `Alerta { mensagem, severidade }`.
  `NovoRegistroParametro` agora tira `idParametro` **e** `dataHora` (a data é definida pelo servidor).
- `registroService.ts`: `cadastrarRegistro(token, novo): Promise<Alerta[]>` (como o `cadastrarAquario`, mas lê o
  corpo com `response.json()`, porque a API devolve a lista de alertas).
- `RegistroContext`: saiu a lista em memória. `adicionarRegistro` devolve `Promise<Alerta[]>`; trata sessão
  expirada igual ao `AquarioContext`. Os alertas NÃO ficam no Context: só a tela de Parâmetros usa
  (Context = o que é compartilhado; o resto é `useState` da tela).
- `parametros.tsx`: estado `alertas: Alerta[] | null`. `null` = ainda não registrou (não mostra nada);
  `[]` = tudo certo (cartão verde); com itens = cartões vermelho (CRITICO) / amarelo (ATENCAO).
  Estilos em lista (`[styles.cartao, styles.critico]`): o comum + a cor.
- `RegistroForm`: `onSalvar` virou `Promise<void>`; estados `salvando`/`erro`; `try/catch/finally`; limpa os
  campos só no sucesso; mensagem quando pH/temperatura/amônia estão vazios. Igual ao `AquarioForm`.
- **Descoberta:** a análise do backend é feita POR ESPÉCIE associada (até a amônia tóxica). Sem espécie →
  sempre `[]`. Para testar, foi inserido via SQL o Neon (id 1: pH 5–7, 20–26 °C, sensibilidades ALTA/ALTA/MEDIA)
  e associado aos aquários 1 e 2 (`animal_aquario`). Só o nitrito gera ATENCAO; o resto é CRITICO.
- Testes a fazer: pH 6,5/24/0 → verde · 7,5/24/0 → crítico pH · 6,5/30/0 → crítico temperatura ·
  8,5/30/2 → 3 críticos · 6,5/24/0 + nitrito 1 → atenção · backend desligado → sem conexão, campos ficam ·
  salvar vazio → mensagem.
- ~~`useEffect` que zera os alertas~~ → o lint acusa `react-hooks/set-state-in-effect` (setState dentro de efeito
  = render extra com a tela errada). **PENDENTE (Saulo, provisório):** trocar por
  `resultado: { idAquario, alertas } | null` e calcular `const alertas = resultado?.idAquario === idSelecionado
  ? resultado.alertas : null` (valor calculado, não estado). Regra: o que dá para calcular, não vira estado.

**Item 3 (18/11/2026): ✅ pronto e testado.** Saulo fez com aula (service + carregamento); Claude fez tipos e cartão.
- Tipos (`types/registro.ts`): `EstadoAquario = 'SAUDAVEL' | 'ATENCAO' | 'CRITICO'`, `Diagnostico { estado, alertas }`.
- `aquarioService.buscarDiagnostico(token, idAquario)`: `GET /aquarios/{id}/diagnostico`. **400 → `null`**
  (aquário sem registro não é erro). O `if` do status específico vem ANTES do `!response.ok`.
- `DiagnosticoCard`: tabela `aparencia: Record<EstadoAquario, {rotulo, fundo, texto, borda}>` em vez de ternários
  encadeados (se surgir um estado novo, o TypeScript acusa a falta).
- Dashboard (`index.tsx`): estados LOCAIS (`diagnostico`, `carregandoDiagnostico`, `erroDiagnostico`), não no
  Context (só o Dashboard usa). Chama o service direto (sem Context no meio) e trata a sessão expirada no catch.
- 🆕 **`useFocusEffect(useCallback(...))`** (expo-router): roda toda vez que a ABA ganha foco. As abas não são
  destruídas ao trocar, então o `useEffect` não recarregaria depois de um registro feito em Parâmetros.
  O hook pertence à tela onde é escrito (o Dashboard, que é quem mostra o dado).
- 🐞 Bug corrigido: faltava `idSelecionado` nas dependências do `useCallback` → closure desatualizada (a função
  "lembrava" o aquário antigo; trocar de aquário não recarregava). Regra: TODA variável de fora usada na
  função entra na lista.

**Próxima sessão (estimativa: ~1 h com aula, ~30 min se Claude fizer o repetitivo):** *(itens 1–3 abaixo feitos em 18/11)*
1. Corrigir o lint acima (5–10 min).
2. Item 3: `buscarDiagnostico(token, idAquario)` → `GET /aquarios/{id}/diagnostico` (`{ estado, alertas }`);
   carregar quando o aquário muda; cartão do estado **só no Dashboard**.
   **Decisão (18/11), divisão das telas:** Parâmetros = "como está a ÁGUA?" → formulário + seção compacta
   "Alertas do último registro" (resumo colorido + mensagens + link "Ver diagnóstico") + histórico com valores
   coloridos + gráfico. Dashboard = "como está o AQUÁRIO?" → diagnóstico geral (alertas da água + cardume abaixo
   do mínimo + futuras regras). Fonte dos alertas do último registro: hoje = resposta do POST (some ao fechar o
   app); depois dos itens 11/12 do Brayan = registro mais recente do histórico (persistente).
   ✅ Lint corrigido (18/11): `resultado: { idAquario, alertas } | null` + `alertas` calculado.
   Limitação conhecida: registrar em outro aquário sobrescreve o resultado. **Plano B** (só se o Brayan não
   salvar os alertas por registro): `Record<number, Alerta[]>` por aquário. Não fazer antes: vira lixo quando
   os alertas vierem no histórico (aí a seção usa `historico[0].alertas` e o app não guarda nada).
3. ✅ Conferido (18/11): aquário sem registro → **400** com a mensagem (o `GlobalExceptionHandler` converte a
   `IllegalArgumentException`). Tratar como "Faça a primeira medição", não como erro.
   Obs.: diagnóstico de aquário de outro usuário → `AccessDeniedException` → 403 (o app trataria como sessão
   expirada; não acontece no fluxo normal, pois o app só usa os aquários do próprio usuário).

**Semana 2: o restante dos requisitos**

| # | Item | Dono | Rotas da API |
| --- | --- | --- | --- |
| 7 | Enciclopédia: lista de animais e plantas, busca por nome, tela de detalhe (`especie/[id]`) | C | `/animal/...`, `/planta/...` |
| 8 | Associar espécies ao aquário e listar as espécies do aquário | C | `/animal-aquario/...`, `/planta-aquario/...` |
| 9 | Gráficos da variação de cada parâmetro (biblioteca a escolher, compatível com o Expo Go) | C | `GET /registro/aquario/{id}` |
| 10 | Parâmetros ideais e espécies recomendadas | C | `/aquarios/{id}/parametros-ideais`, `/especies-recomendadas` |
| 11 | Editar e excluir aquário | C | `PUT/DELETE /aquarios/{id}` |
| 12 | Lembretes (criar, listar, concluir) com **notificação local** no celular | C | `/lembrete/...` |
| 13 | Equipamentos (cadastro e listagem) — verificar com o Brayan onde fica o dimensionamento | C | `/equipamento/...` |
| 14 | Últimos dias: testes no iPhone, prints para o artigo, ensaio da apresentação | S | — |

**Admin (a definir depois, 13/11/2026):** o admin vai ter **uma tela simples para ver os pedidos dos usuários**.
Ainda falta definir o que é um "pedido" (por exemplo, um pedido de nova espécie?). A API atual **não tem**
rota de pedidos, então isso provavelmente depende de um endpoint novo no backend (conversar com o Brayan).
Para mostrar a tela só para o admin, o app precisa saber a `role` do usuário logado (`GET /usuarios/me`,
ou ler o JWT, se a `role` estiver dentro dele).

**Cortado ou simplificado (justificar no artigo, se for o caso)**
- Cadastro de espécies pelo admin **dentro do app** → feito pelo Swagger.
- Recuperar senha e editar conta → fora do app nesta versão.
- Notificação **push** pelo backend (Firebase) → trocada por notificação **local** (o celular agenda o lembrete).
- *Bottom sheets* → só se sobrar tempo; os formulários ficam na própria tela.

**Depende do backend (levar ao Brayan)**: ver a lista "Para levar ao Brayan". O `GET /usuarios/me` faria falta
na aba Perfil (sem ele, o app não sabe o nome do usuário logado).
