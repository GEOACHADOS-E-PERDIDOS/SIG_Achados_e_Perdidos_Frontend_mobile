import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");
  console.log("🔑 [SERVICE - getAuthHeader] Token lido do AsyncStorage:", token ? "EXISTE" : "NULO/VAZIO");
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const listarObjetos = async () => {
  const config = await getAuthHeader();
  console.log("🌐 [SERVICE - listarObjetos] Fazendo GET para:", `${API_URL}/objetos`);
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
  console.log("🌐 [SERVICE - buscarObjetos] Buscando com parâmetros:", { termo, data, categoriaId, status });
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
        // Fazemos o GET seguro pelo Axios com o Token
        const res = await axios.get(`${API_URL}/uploads/${caminho}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "arraybuffer", 
        });

        // 1. Converter os bytes recebidos para uma string binária pura
        const bytes = new Uint8Array(res.data);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        // 2. Converter a string binária para Base64 usando btoa (nativo do JS/React Native)
        // Isso evita depender da classe global 'Buffer' do Node, que costuma dar erro no Expo
        const base64Image = btoa(binary);
        
        // Descobre a extensão do arquivo para montar o MIME type correto
        const extensao = caminho.split(".").pop() || "jpeg";
        const mimeType = extensao === "png" ? "image/png" : "image/jpeg";

        // 🔥 CORRIGIDO: Agora aponta exatamente para a variável correta 'base64Image'
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