import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";

export const alterarSenha = async (
  novaSenha: string
) => {

  const token = await AsyncStorage.getItem(
    "token"
  );

  if (!token) {
    throw new Error(
      "Usuário não autenticado"
    );
  }

  const response = await axios.post(
    `${API_URL}/auth/trocar-senha`,
    {
      novaSenha,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};