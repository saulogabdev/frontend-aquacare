export type Lembrete = {
  idLembrete: number;
  idAquario: number;
  titulo: string;
  dataHoraLembrete: string;
  isConcluido: boolean;
};

export type NovoLembrete = Omit<Lembrete, 'idLembrete'>;
