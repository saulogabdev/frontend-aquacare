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

export type NovoRegistroParametro = Omit<RegistroParametro, 'idParametro'>;
