import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";

const getToken = async () => {

  return await AsyncStorage.getItem(
    "token"
  );
};

const getHeaders = async () => {

  const token =
    await getToken();

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
};

/* ===================================== */
/* BUSCAR OBJETO COMPLETO */
/* ===================================== */

export const buscarObjetoCompleto =
  async (id: number) => {

    const headers =
      await getHeaders();

    const response =
      await axios.get(
        `${API_URL}/objetos/${id}`,
        headers
      );

    const objeto =
      response.data;

    if (objeto.postoId) {

      try {

        const posto =
          await buscarPostoCompleto(
            objeto.postoId
          );

        return {
          ...objeto,
          nomePosto:
            posto.nome,
        };

      } catch (error) {

        console.log(
          "Erro ao buscar posto:",
          error
        );
      }
    }

    return objeto;
  };

/* ===================================== */
/* BUSCAR POSTO COMPLETO */
/* ===================================== */

export const buscarPostoCompleto =
  async (id: number) => {

    const headers =
      await getHeaders();

    const response =
      await axios.get(
        `${API_URL}/postos/${id}`,
        headers
      );

    return response.data;
  };

/* ===================================== */
/* BUSCAR URL DA IMAGEM */
/* ===================================== */

export const buscarImagem =
  async (
    caminho: string
  ) => {

    try {

      return `${API_URL}/uploads/${caminho}`;

    } catch (error) {

      console.log(
        "Erro ao buscar imagem:",
        error
      );

      return null;
    }
  };

/* ===================================== */
/* BUSCAR TODAS AS IMAGENS */
/* ===================================== */

export const buscarImagens =
  async (
    caminhos: string[]
  ) => {

    if (
      !caminhos ||
      caminhos.length === 0
    ) {
      return [];
    }

    return caminhos.map(
      (caminho) =>
        `${API_URL}/uploads/${caminho}`
    );
  };