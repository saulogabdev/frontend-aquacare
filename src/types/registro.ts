export type Severidade = 'ATENCAO' | 'CRITICO';

// A qual parâmetro (ou verificação) o alerta se refere — enum Parametro do backend (25/11).
// Usado para pintar o valor certo no histórico (ex.: alerta de PH → o pH do registro fica vermelho).
export type ParametroAlerta =
  | 'PH'
  | 'TEMPERATURA'
  | 'AMONIA'
  | 'NITRITO'
  | 'CALCIO'
  | 'MAGNESIO'
  | 'GRUPO'
  | 'COMPATIBILIDADE'
  | 'CICLAGEM'
  | 'ILUMINACAO' // plantas × iluminação do aquário (diagnóstico, desde 26/11)
  | 'CO2';       // plantas × injeção de CO₂ (diagnóstico, desde 26/11)

export type RegistroParametro = {
  idParametro: number;
  idAquario: number;
  dataHora: string;
  ph: number;
  temperatura: number;
  amonia: number;
  nitrito: number | null;
  nitrato: number | null;
  gh: number | null;
  kh: number | null;
  co2: number | null;
  salinidade: number | null;
  calcio: number | null;
  magnesio: number | null;
  // Alertas que o sistema deu NAQUELE registro (o backend salva desde 25/11).
  alertas: Alerta[];
};

export type Alerta = {
  parametro: ParametroAlerta;
  mensagem: string;
  severidade: Severidade;
  // O que o usuário deve fazer (o "apoio à decisão" do SAD). Pode vir null em alertas sem ação sugerida.
  recomendacao: string | null;
};

// O que o app envia: sem id, sem data (o servidor define) e sem alertas (o servidor calcula).
export type NovoRegistroParametro = Omit<RegistroParametro, 'idParametro' | 'dataHora' | 'alertas'>;

// Estado geral do aquário, calculado pelo backend a partir dos alertas:
// nenhum alerta = SAUDAVEL; algum CRITICO = CRITICO; só ATENCAO = ATENCAO.
export type EstadoAquario = 'SAUDAVEL' | 'ATENCAO' | 'CRITICO';

// Resposta de GET /aquarios/{id}/diagnostico (reanalisa o último registro + cardume mínimo).
export type Diagnostico = {
  estado: EstadoAquario;
  alertas: Alerta[];
};
