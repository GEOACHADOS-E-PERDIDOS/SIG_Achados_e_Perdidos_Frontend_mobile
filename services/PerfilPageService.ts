import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =========================
// PERFIL
// =========================

export const buscarMeuPerfil = async () => {
  const config = await getAuthHeader();

  const res = await axios.get(
    `${API_URL}/usuario/me`,
    config
  );

  return res.data;
};

export const atualizarMeuPerfil = async (
  data: any
) => {
  const config = await getAuthHeader();

  const res = await axios.put(
    `${API_URL}/usuario/me`,
    data,
    config
  );

  return res.data;
};

// =========================
// MEUS OBJETOS
// =========================

export const buscarMeusObjetos = async () => {
  const config = await getAuthHeader();

  const res = await axios.get(
    `${API_URL}/objetos/me`,
    config
  );

  return res.data;
};

// =========================
// ALTERAR STATUS
// =========================

export const atualizarStatusObjeto = async (
  id: number,
  status: string
) => {
  const config = await getAuthHeader();

  const res = await axios.put(
    `${API_URL}/objetos/${id}/status`,
    { status },
    config
  );

  return res.data;
};

// =========================
// EXCLUIR OBJETO
// =========================

export const excluirObjeto = async (
  id: number
) => {
  const config = await getAuthHeader();

  const res = await axios.delete(
    `${API_URL}/objetos/${id}`,
    config
  );

  return res.data;
};

// =========================
// EDITAR OBJETO
// =========================

export const atualizarObjeto = async (
  id: number,
  data: any
) => {
  const config = await getAuthHeader();

  const isAchado =
    data.postoRetiradaId !== undefined;

  const rota = isAchado
    ? `${API_URL}/objetos/achados/${id}`
    : `${API_URL}/objetos/perdidos/${id}`;

  const res = await axios.put(
    rota,
    data,
    config
  );

  return res.data;
};