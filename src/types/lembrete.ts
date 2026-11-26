export type Lembrete = {
  idLembrete: number;
  idAquario: number;
  titulo: string;
  dataHoraLembrete: string;
  concluido: boolean;
  notificado: boolean;
};

export type NovoLembrete = Omit<Lembrete, 'idLembrete'>;
