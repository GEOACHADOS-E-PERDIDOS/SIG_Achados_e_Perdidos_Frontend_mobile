import axios from "axios";
import { API_URL } from "../config/api";

class RecuperarSenhaService {
  async recuperarSenha(email: string) {
    try {
      const response = await axios.post(
        `${API_URL}/auth/recuperar-senha`,
        null,
        {
          params: { email },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao recuperar senha no service:", error);
      throw error;
    }
  }
}

export default new RecuperarSenhaService();