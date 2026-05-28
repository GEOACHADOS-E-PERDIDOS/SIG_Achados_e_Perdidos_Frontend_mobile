import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";

const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

const getHeaders = async () => {

  const token = await getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export interface Categoria {
  id: number;
  nome: string;
}

export interface Posto {
  id: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  latitude: number;
  longitude: number;
}

class HomeService {

  async checarAdmin(): Promise<boolean> {

    try {

      const headers = await getHeaders();

      const response = await axios.get(
        `${API_URL}/auth/admin/check`,
        headers
      );

      return response.data;

    } catch (error) {

      console.log(
        "Erro ao verificar admin:",
        error
      );

      return false;
    }
  }

  async buscarCategorias(): Promise<Categoria[]> {

    try {

      const headers = await getHeaders();

      const response = await axios.get(
        `${API_URL}/categorias`,
        headers
      );

      return response.data;

    } catch (error) {

      console.log(
        "Erro ao buscar categorias:",
        error
      );

      throw error;
    }
  }

  async buscarPostos(): Promise<Posto[]> {

    try {

      const headers = await getHeaders();

      const response = await axios.get(
        `${API_URL}/postos`,
        headers
      );

      return response.data;

    } catch (error) {

      console.log(
        "Erro ao buscar postos:",
        error
      );

      throw error;
    }
  }
}

export default new HomeService();