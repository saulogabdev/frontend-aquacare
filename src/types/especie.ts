export type Agressividade = 'PACIFICO' | 'SEMI_AGRESSIVO' | 'AGRESSIVO';
export type PadraoTerritorial = 'NAO_TERRITORIAL' | 'TERRITORIAL';
export type RegiaoNado = 'TOPO' | 'MEIO' | 'FUNDO';
export type Nivel = 'BAIXA' | 'MEDIA' | 'ALTA';
export type Dificuldade = 'FACIL' | 'MEDIO' | 'DIFICIL'; // no backend e medio
export type Crescimento = 'LENTO' | 'MEDIO' | 'RAPIDO';

export type Animal = {
  idAnimal: number;
  nomePopular: string;
  nomeCientifico: string;
  descricao: string;
  tempMin: number;
  tempMax: number;
  phMin: number;
  phMax: number;
  ghMin: number | null;
  ghMax: number | null;
  salinidadeMin: number | null;
  salinidadeMax: number | null;
  agressividade: Agressividade;
  padraoTerritorial: PadraoTerritorial;
  tamanhoMedio: number;
  regiaoNado: RegiaoNado;
  habitoAlimentar: string;
  lc50Amonia: number | null;
  lc50Nitrito: number | null;
  sensibilidadeAmonia: Nivel;
  sensibilidadeNitrito: Nivel;
  sensibilidadeNitrato: Nivel;
  quantidadeMinimaGrupo: number | null;
};

export type Planta = {
  idPlanta: number;
  nomePopular: string;
  nomeCientifico: string;
  descricao: string;
  dificuldade: Dificuldade;
  iluminacao: Nivel;
  co2Necessario: boolean;
  crescimento: Crescimento;
  alturaCm: number;
  tempMin: number;
  tempMax: number;
  phMin: number;
  phMax: number;
};

// a api devolve so o id, o app junta com o catalogo
export type AnimalAquario = {
  id: number;
  idAnimal: number;
  idAquario: number;
  quantidade: number;
  dataAdicao: string;
};

export type DadosAnimalAquario = {
  idAnimal: number;
  idAquario: number;
  quantidade: number;
};

// a api devolve so o id, o app junta com o catalogo
export type PlantaAquario = {
  id: number;
  idPlanta: number;
  idAquario: number;
  quantidade: number;
  dataPlantio: string;
};

export type DadosPlantaAquario = {
  idPlanta: number;
  idAquario: number;
  quantidade: number;
};
