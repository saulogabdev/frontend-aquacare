const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('A variável de ambiente EXPO_PUBLIC_API_URL não está definida.');
}

export const API_URL = apiUrl;

export const MENSAGEM_SESSAO_EXPIRADA = 'Sua sessão expirou. Entre novamente.';

export const MENSAGEM_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Verifique sua internet e tente de novo.';

// Use no lugar do fetch em todos os services. Quando nem dá para falar com o servidor (sem internet,
// backend desligado, IP errado), o fetch lança um erro técnico em inglês ("Failed to fetch" na web,
// "Network request failed" no celular). Aqui ele vira uma mensagem clara para o usuário.
// Respostas de erro do servidor (400, 403, 500...) NÃO passam por aqui: continuam com o erroDaResposta.
export async function apiFetch(url: string, opcoes?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, opcoes);
  } catch {
    throw new Error(MENSAGEM_SEM_CONEXAO);
  }
}

// Erro de uma chamada à API, guardando o status HTTP (como uma exceção própria em Java).
export class ErroApi extends Error {
  status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
  }
}

// Monta o ErroApi a partir de uma resposta que não deu certo (usa o texto do backend, se houver).
export async function erroDaResposta(response: Response, mensagemPadrao: string): Promise<ErroApi> {
  const texto = await response.text();
  return new ErroApi(texto || `${mensagemPadrao} (${response.status})`, response.status);
}

// O backend responde 403 (às vezes 401) quando o token está vencido ou inválido.
export function ehSessaoExpirada(erro: unknown): boolean {
  return erro instanceof ErroApi && (erro.status === 401 || erro.status === 403);
}
