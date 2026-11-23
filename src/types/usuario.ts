export type Role = 'USER' | 'ADMIN';

// Resposta de GET /usuarios/me (UsuarioResponse do backend).
export type Usuario = {
  id: string;
  email: string;
  nome: string;
  dataCadastro: string; // data ISO, ex: "2026-09-24T14:30:00"
  role: Role;
};
