import { API_URL } from "../config/api";
import type { Usuario } from "../types/Usuario";


export async function createUser(user: Usuario): Promise<string> {
  const response = await fetch(`${API_URL}/auth/registrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: user.name,
      email: user.email,
      senhaHash: user.senha,
      isAdmin: user.isAdmin ?? false,
    }),
  });

  if (!response.ok) {
    const erro = await response.text();
    throw new Error(erro || "Erro ao cadastrar usuário");
  }

  return response.text();
}