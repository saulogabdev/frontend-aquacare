export type Severidade = 'ATENCAO' | 'CRITICO';

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
};

export type Alerta = {
  mensagem: string;
  severidade: Severidade;
};

export type NovoRegistroParametro = Omit<RegistroParametro, 'idParametro' | 'dataHora'>;

// Estado geral do aquário, calculado pelo backend a partir dos alertas:
// nenhum alerta = SAUDAVEL; algum CRITICO = CRITICO; só ATENCAO = ATENCAO.
export type EstadoAquario = 'SAUDAVEL' | 'ATENCAO' | 'CRITICO';

// Resposta de GET /aquarios/{id}/diagnostico (reanalisa o último registro + cardume mínimo).
export type Diagnostico = {
  estado: EstadoAquario;
  alertas: Alerta[];
};
