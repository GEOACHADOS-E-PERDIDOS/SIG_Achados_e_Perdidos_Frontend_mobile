import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const listarObjetos = async () => {
  const config = await getAuthHeader();
  const res = await axios.get(`${API_URL}/objetos`, config);
  return res.data;
};

export const buscarObjetos = async (
  termo?: string,
  data?: string,
  categoriaId?: number,
  status?: string
) => {
  const config = await getAuthHeader();
  const res = await axios.get(`${API_URL}/objetos/buscar`, {
    ...config,
    params: { termo, data, categoria: categoriaId, status },
  });
  return res.data;
};

export const deletarObjeto = async (id: number) => {
  const config = await getAuthHeader();
  await axios.delete(`${API_URL}/objetos/${id}`, config);
};

export const buscarImagens = async (caminhos?: string[]) => {
  if (!caminhos || caminhos.length === 0) return [];

  try {
    const token = await AsyncStorage.getItem("token");

    const imagens = await Promise.all(
      caminhos.map(async (caminho) => {
        const res = await axios.get(`${API_URL}/uploads/${caminho}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "arraybuffer", 
        });

        const bytes = new Uint8Array(res.data);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        const base64Image = btoa(binary);
        
        const extensao = caminho.split(".").pop() || "jpeg";
        const mimeType = extensao === "png" ? "image/png" : "image/jpeg";

        return {
          uri: `data:${mimeType};base64,${base64Image}`,
        };
      })
    );

    return imagens; 
  } catch (err) {
    console.error("❌ [SERVICE] Erro ao buscar imagens via Axios:", err);
    return [];
  }
};

export const buscarObjetoPorId = async (id: number) => {
  const config = await getAuthHeader();

  const res = await axios.get(
    `${API_URL}/objetos/${id}`,
    config
  );
  console.log("OBJETO ")
  console.log(res.data)
  return res.data;
};

export const criarObjetoAchado = async (formData: FormData) => {
  const config = await getAuthHeader();

  const url = `${API_URL}/objetos/achados`;

  console.log("🔥 [SERVICE] URL FINAL:", url);
  console.log("🔥 [SERVICE] API_URL:", API_URL);

  return axios.post(url, formData, {
    ...config,
    headers: {
      ...config.headers,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const criarObjetoPerdido = async (formData: FormData) => {
  const config = await getAuthHeader();

  return axios.post(
    `${API_URL}/objetos/perdidos`,
    formData,
    {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};