// Tipos alinhados com o AnimalResponse do backend (GET /animal/listar-todos).
export type Agressividade = 'PACIFICO' | 'SEMI_AGRESSIVO' | 'AGRESSIVO';
export type PadraoTerritorial = 'NAO_TERRITORIAL' | 'TERRITORIAL';
export type RegiaoNado = 'TOPO' | 'MEIO' | 'FUNDO';
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

// Resposta de GET /animal-aquario/aquario/{id}: a API devolve só o idAnimal (não o objeto),
// então o app junta com a lista de animais para saber o nome.
export type AnimalAquario = {
  id: number;
  idAnimal: number;
  idAquario: number;
  quantidade: number;
  dataAdicao: string;
};

// Corpo de POST /animal-aquario/associar e PUT /animal-aquario/{id}.
export type DadosAnimalAquario = {
  idAnimal: number;
  idAquario: number;
  quantidade: number;
};

export type PlantaAquario = {
  id: number;
  idAquario: number;
  planta: Planta;
  quantidade: number;
  dataPlantio: string;
};
