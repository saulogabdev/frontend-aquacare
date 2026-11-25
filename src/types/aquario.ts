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
  // Calculado pelo backend (DimensionamentoService) com as regras do artigo:
  // filtro 3–5× o volume por hora; termostato ≥ 1 W/L; iluminação 30–60 lm/L.
  dimensionadoCorretamente: boolean;
};

// Resposta de GET /aquarios/{id}/parametros-ideais: a interseção das faixas de todas as espécies do aquário
// (o maior dos mínimos e o menor dos máximos). Os nomes precisam ser IGUAIS aos do JSON da API.
// Se as faixas não se cruzam, o backend devolve mínimo > máximo (o app detecta e avisa).
export type ParametrosIdeais = {
  phMin: number;
  phMax: number;
  tempMin: number;
  tempMax: number;
};

// Corpo de POST /equipamento/cadastrar e PUT /equipamento/{id} (o dimensionamento é calculado pelo servidor).
export type NovoEquipamento = Omit<Equipamento, 'idEquipamento' | 'dimensionadoCorretamente'>;
