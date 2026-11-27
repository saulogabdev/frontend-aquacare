const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('A variável de ambiente EXPO_PUBLIC_API_URL não está definida.');
}

export const API_URL = apiUrl;

export const MENSAGEM_SESSAO_EXPIRADA = 'Sua sessão expirou. Entre novamente.';

export const MENSAGEM_SEM_CONEXAO = 'Não foi possível conectar ao servidor. Verifique sua internet e tente de novo.';

// troca o erro tecnico do fetch (sem conexao) por uma mensagem em portugues
export async function apiFetch(url: string, opcoes?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, opcoes);
  } catch {
    throw new Error(MENSAGEM_SEM_CONEXAO);
  }
}

export class ErroApi extends Error {
  status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = 'ErroApi';
    this.status = status;
  }
}

export async function erroDaResposta(response: Response, mensagemPadrao: string): Promise<ErroApi> {
  const texto = await response.text();
  return new ErroApi(texto || `${mensagemPadrao} (${response.status})`, response.status);
}

// 401/403 = token vencido ou invalido
export function ehSessaoExpirada(erro: unknown): boolean {
  return erro instanceof ErroApi && (erro.status === 401 || erro.status === 403);
}
