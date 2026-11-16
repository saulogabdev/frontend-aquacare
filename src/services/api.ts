const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('A variável de ambiente EXPO_PUBLIC_API_URL não está definida.');
}

export const API_URL = apiUrl;

export const MENSAGEM_SESSAO_EXPIRADA = 'Sua sessão expirou. Entre novamente.';

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
