export interface Usuario {
  id?: number;
  name: string;
  email: string;
  senha: string;
  dataCadastro?: string;
  isAdmin?: boolean;
}