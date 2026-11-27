export type Role = 'USER' | 'ADMIN';

export type Usuario = {
  id: string;
  email: string;
  nome: string;
  dataCadastro: string;
  role: Role;
};
