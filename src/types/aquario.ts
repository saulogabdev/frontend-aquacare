export type TipoAgua = 'DOCE' | 'MARINHO';
export type NivelPlantas = 'NENHUM' | 'BAIXO' | 'MEDIO' | 'ALTO';
export type TipoEquipamento = 'FILTRO' | 'TERMOSTATO' | 'ILUMINACAO' | 'OUTRO';

export type Aquario = {
  idAquario: number;
  nome: string;
  litragem: number;
  tipoAgua: TipoAgua;
  nivelPlanta: NivelPlantas;
  dataMontagem: string;
  isCiclado: boolean;
  injecaoCO2: boolean;
};

export type NovoAquario = Omit<Aquario, 'idAquario'>;

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
