import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";

import {
  buscarObjetoPorId,
  buscarImagens,
} from "./ObjetoService";

// ==============================
// MONTA HEADERS
// ==============================
const montarHeaders = async () => {
  const token = await AsyncStorage.getItem("token");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

// ==============================
// MONTA OBJETO COM IMAGENS
// ==============================
export const montarObjeto = async (obj: any) => {
  const caminhos: string[] =
    obj.caminhosImagens ?? [];

  const imagens =
    caminhos.length > 0
      ? await buscarImagens(caminhos)
      : [];

  return {
    ...obj,
    caminhosImagens: imagens,
    imagemUrl: imagens[0] ?? null,
  };
};

// ==============================
// BUSCAR QUANTIDADE
// ==============================
export const buscarQuantidadeObjetosPosto =
  async (postoId: number) => {

    const headers =
      await montarHeaders();

    const res =
      await axios.get(
        `${API_URL}/objetos/achados/posto/${postoId}/quantidade`,
        { headers }
      );

    return res.data;
  };

// ==============================
// BUSCAR OBJETOS DO POSTO
// ==============================
export const buscarObjetosPosto =
  async (postoId: number) => {

    const headers =
      await montarHeaders();

    const res =
      await axios.get(
        `${API_URL}/objetos/achados/buscar/posto/${postoId}`,
        { headers }
      );

    console.log(
      "========== RESPOSTA BRUTA BACKEND =========="
    );
    console.log(
      JSON.stringify(
        res.data,
        null,
        2
      )
    );

    const objetos =
      await Promise.all(
        res.data.map(
          (obj: any) =>
            montarObjeto(obj)
        )
      );

    console.log(
      "========== APÓS montarObjeto =========="
    );
    console.log(
      JSON.stringify(
        objetos,
        null,
        2
      )
    );

    return objetos;
  };

// ==============================
// BUSCAR OBJETO DETALHADO
// ==============================
export const buscarObjetoDetalhado =
  async (id: number) => {

    const objeto =
      await buscarObjetoPorId(id);

    return await montarObjeto(
      objeto
    );
  };