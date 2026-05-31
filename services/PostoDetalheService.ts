import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

import {
  buscarObjetoCompleto,
  buscarImagens,
} from "./ClickMapaService";

// ==============================
// MONTA HEADERS (Transformada em ASSÍNCRONA)
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
  const imagens =
    obj.caminhosImagens?.length > 0
      ? await buscarImagens(obj.caminhosImagens)
      : [];

  return {
    ...obj,
    caminhosImagens: imagens,
    imagemUrl: imagens?.[0] ?? null,
  };
};

// ==============================
// BUSCAR QUANTIDADE
// ==============================
export const buscarQuantidadeObjetosPosto = async (postoId: number) => {
  const headers = await montarHeaders();

  const res = await axios.get(
    `${API_URL}/objetos/achados/posto/${postoId}/quantidade`,
    { headers }
  );

  return res.data;
};

// ==============================
// BUSCAR OBJETOS
// ==============================
export const buscarObjetosPosto = async (postoId: number) => {
  const headers = await montarHeaders();

  const res = await axios.get(
    `${API_URL}/objetos/achados/buscar/posto/${postoId}`,
    { headers }
  );

  return Promise.all(
    res.data.map((obj: any) => montarObjeto(obj))
  );
};

// ==============================
// BUSCAR OBJETO COMPLETO
// ==============================
export const buscarObjetoDetalhado = async (id: number) => {
  const objeto = await buscarObjetoCompleto(id);
  return montarObjeto(objeto);
};