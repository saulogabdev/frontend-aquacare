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
};

export type NovoAquario = {
  nome: string;
  litragem: number;
  tipoAgua: TipoAgua;
  nivelPlanta: NivelPlantas;
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
};

export type NovoEquipamento = Omit<Equipamento, 'idEquipamento'>;
