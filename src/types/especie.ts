export type Agressividade = 'PACIFICO' | 'SEMI_AGRESSIVO' | 'AGRESSIVO';
export type Porte = 'PEQUENO' | 'MEDIO' | 'GRANDE';
export type RegiaoNado = 'SUPERFICIE' | 'MEIO' | 'FUNDO';
export type HabitoAlimentar = 'ONIVORO' | 'CARNIVORO' | 'HERBIVORO';
export type Nivel = 'BAIXA' | 'MEDIA' | 'ALTA';
export type Dificuldade = 'FACIL' | 'MEDIA' | 'DIFICIL';
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
  porte: Porte;
  regiaoNado: RegiaoNado;
  habitoAlimentar: HabitoAlimentar;
  sensibilidadeAmonia: Nivel;
  sensibilidadeNitrito: Nivel;
  sensibilidadeNitrato: Nivel;
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

export type AnimalAquario = {
  id: number;
  idAquario: number;
  animal: Animal;
  quantidade: number;
  dataAdicao: string;
};

export type PlantaAquario = {
  id: number;
  idAquario: number;
  planta: Planta;
  quantidade: number;
  dataPlantio: string;
};
