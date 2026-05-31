import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

const POSTOS_URL = `${API_URL}/postos`;

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const listarPostosService = async () => {
  const config = await getAuthHeader();

  const res = await axios.get(
    POSTOS_URL,
    config
  );

  return res.data;
};

export const buscarPostosService = async (
  termo?: string
) => {
  const config = await getAuthHeader();

  const res = await axios.get(
    POSTOS_URL,
    {
      ...config,
      params: {
        termo,
      },
    }
  );

  return res.data;
};

export const deletarPostoService = async (
  id: number
) => {
  const config = await getAuthHeader();

  await axios.delete(
    `${POSTOS_URL}/${id}`,
    config
  );
};

export const atualizarPostoService = async (
  id: number,
  data: any
) => {
  const config = await getAuthHeader();

  const res = await axios.put(
    `${POSTOS_URL}/${id}`,
    data,
    config
  );

  return res.data;
};

export const buscarPostoPorId = async (
  id: number
) => {
  const config = await getAuthHeader();

  const res = await axios.get(
    `${POSTOS_URL}/${id}`,
    config
  );

  return res.data;
};

