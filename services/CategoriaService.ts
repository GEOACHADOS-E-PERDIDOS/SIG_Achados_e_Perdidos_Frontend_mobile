import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api"; 

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const listarCategorias = async () => {
  try {
    const config = await getAuthHeader();

    const res = await axios.get(`${API_URL}/categorias`, config);

    return res.data.map((cat: any) => ({
      value: cat.id,
      label: cat.nome,
    }));
  } catch (error) {
    console.error("Erro ao listar categorias no service:", error);
    throw error; 
  }
};