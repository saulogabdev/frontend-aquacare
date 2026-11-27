export type TipoAgua = 'DOCE' | 'MARINHO';
export type NivelPlantas = 'BAIXA' | 'MEDIA' | 'ALTA';
export type TipoEquipamento = 'FILTRO' | 'TERMOSTATO' | 'ILUMINACAO';

export type Aquario = {
  id: number;
  nome: string;
  litragem: number;
  tipoAgua: TipoAgua;
  nivelPlantas: NivelPlantas;
  dataMontagem: string;
  isCiclado: boolean;
  injecaoCO2: boolean;
  // calculados pelo backend
  emCiclagem: boolean;
  diasMontagem: number;
};

export type NovoAquario = {
  nome: string;
  litragem: number;
  tipoAgua: TipoAgua;
  nivelPlantas: NivelPlantas;
  isCiclado: boolean;
  injecaoCO2: boolean;
};

export type Equipamento = {
  idEquipamento: number;
  idAquario: number;
  tipo: TipoEquipamento;
  nome: string;
  modelo: string | null;
  marca: string | null;
  potenciaWatts: number | null;
  vazaoLH: number | null;
  lumens: number | null;
  // regras do artigo: filtro 3-5x o volume/h; termostato >= 1 w/l; luz 30-60 lm/l
  dimensionadoCorretamente: boolean;
};

// intersecao das faixas das especies; nomes iguais aos do json
export type ParametrosIdeais = {
  phMin: number;
  phMax: number;
  tempMin: number;
  tempMax: number;
};

export type NovoEquipamento = Omit<Equipamento, 'idEquipamento' | 'dimensionadoCorretamente'>;
