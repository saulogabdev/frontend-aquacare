export type Role = 'USER' | 'ADMIN';

export type Usuario = {
  idUsuario: string;
  email: string;
  nome: string;
  dataCadastro: string; // data ISO, ex: "2026-09-24T14:30:00"
  role: Role;
};
