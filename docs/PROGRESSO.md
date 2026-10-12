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
│       ├── index.tsx          Dashboard: formulário + lista de aquários + aquário selecionado
│       ├── parametros.tsx     placeholder
│       ├── especies.tsx       placeholder
│       ├── lembretes.tsx      placeholder
│       └── perfil.tsx         placeholder
├── components/
│   ├── AquarioCard.tsx        card de um aquário (prop aquario, ativo, onPress)
│   └── AquarioForm.tsx        formulário de novo aquário (prop onSalvar)
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

---

## Pendências opcionais

- Mensagem de erro no `AquarioForm` (estado `erro` + `&&`, em vermelho `#dc2626`).
- Ícones nas abas (`npx expo install @expo/vector-icons`, opção `tabBarIcon`).
- `aquariosIniciais`: um campo por linha, e dados realistas (o aquário de corais não deveria ter plantas).

## Pergunta em aberto

- **O backend em Spring Boot já tem os endpoints de aquário funcionando?** Isso define a ordem das próximas aulas.
  - Em 12/10/2026: ainda sem resposta do parceiro do backend. Seguimos sem API (dados em memória).

## Próximos passos

- **Aquário ativo compartilhado entre as abas** (Context): a aba Parâmetros precisa saber qual aquário está ativo.
- **Integração com a API**: criar `src/services/aquarioService.ts` (como a camada de service do Spring),
  com `fetch`, `async/await` e estados de carregando e erro. O formulário e os cards não mudam.
- *Bottom sheet* para o formulário, como no protótipo.
- Depois, na ordem do roteiro original:
  1. Login e cadastro com JWT, e rotas protegidas (redirecionar para `/login` no `_layout.tsx`).
  2. Enciclopédia de espécies: busca, filtros e tela de detalhe.
  3. Registro de parâmetros e exibição do diagnóstico e dos alertas que vêm do backend (o diferencial do TCC).
  4. Gráficos da variação de cada parâmetro ao longo dos dias.
  5. Lembretes com notificações push (`expo-notifications`; o token vai para `Dispositivo_Notificacao`).
