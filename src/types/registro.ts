export type Severidade = 'ATENCAO' | 'CRITICO';

// enum parametro do backend; usado para colorir o valor no historico
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
  | 'ILUMINACAO'
  | 'CO2';

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
  alertas: Alerta[];
};

export type Alerta = {
  parametro: ParametroAlerta;
  mensagem: string;
  severidade: Severidade;
  // pode vir null
  recomendacao: string | null;
};

// sem id, data e alertas (o servidor define)
export type NovoRegistroParametro = Omit<RegistroParametro, 'idParametro' | 'dataHora' | 'alertas'>;

export type EstadoAquario = 'SAUDAVEL' | 'ATENCAO' | 'CRITICO';

export type Diagnostico = {
  estado: EstadoAquario;
  alertas: Alerta[];
};
