import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api"; // Certifique-se de usar a mesma URL base centralizada

// Função auxiliar assíncrona para pegar os cabeçalhos com o Token no Mobile
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// LISTAR CATEGORIAS
export const listarCategorias = async () => {
  try {
    // 1. Aguarda a geração dos headers com o token assíncrono
    const config = await getAuthHeader();

    // 2. Faz a requisição HTTP
    const res = await axios.get(`${API_URL}/categorias`, config);

    // 3. Mantém o mapeamento para { value, label } que o seu App já espera
    return res.data.map((cat: any) => ({
      value: cat.id,
      label: cat.nome,
    }));
  } catch (error) {
    console.error("Erro ao listar categorias no service:", error);
    throw error; // Repassa o erro para o catch do seu Hook tratar se necessário
  }
};