import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";
// 1. Certifique-se de que ambas as funções estão importadas do seu service
import { buscarObjetoPorId, buscarImagens } from "../services/ObjetoService"; 

export type ObjetoMapa = {
  id: number;
  nome: string;
  descricao: string;
  latitudeEncontro: number;
  longitudeEncontro: number;
  status?: string;
};

interface UseMapaProps {
  refreshKey: number;
}

export function useMapa({ refreshKey }: UseMapaProps) {
  const [busca, setBusca] = useState("");
  const [objetos, setObjetos] = useState<ObjetoMapa[]>([]);

  const [objetoSelecionado, setObjetoSelecionado] = useState<any>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  const [mostrarPerdidos, setMostrarPerdidos] = useState(true);
  const [mostrarAchados, setMostrarAchados] = useState(true);
  const [mostrarPostos, setMostrarPostos] = useState(true);

  const buscarObjetos = async (termoOpcional?: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const termoFinal = termoOpcional !== undefined ? termoOpcional : busca;

      const res = await axios.get(`${API_URL}/objetos/buscar`, {
        params: { termo: termoFinal },
        headers: { Authorization: `Bearer ${token}` },
      });
      setObjetos(res.data);
    } catch (err) {
      console.log("Erro ao buscar objetos no hook:", err);
    }
  };

  // 🔥 2. abrirDetalhe atualizado usando o exemplo de montagem de imagens
  const abrirDetalhe = async (id: number) => {
    setCarregandoDetalhes(true);
    try {
      // Busca o objeto estruturado do backend
      const objeto = await buscarObjetoPorId(id);
      
      // Isola a lista de nomes de arquivos de imagem (ex: ["foto1.jpg", "foto2.png"])
      const caminhos: string[] = objeto.caminhosImagens ?? [];
      
      // Converte a lista de nomes de arquivo em strings Base64 { uri: "data:..." }
      const imagens = caminhos.length > 0 ? await buscarImagens(caminhos) : [];

      // Monta o objeto final injetando as imagens convertidas
      const objetoCompletoComImagens = {
        ...objeto,
        caminhosImagens: imagens,
      };

      setObjetoSelecionado(objetoCompletoComImagens);
    } catch (error) {
      console.log("Erro ao buscar detalhes do objeto:", error);
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const limparBusca = () => {
    setBusca(""); 
    buscarObjetos(""); 
  };

  const objetosFiltrados = objetos.filter((obj) => {
    if (obj.status === "PERDIDO" && !mostrarPerdidos) return false;
    if (obj.status === "DISPONIVEL" && !mostrarAchados) return false;
    return true;
  });

  useEffect(() => {
    buscarObjetos();
  }, [refreshKey]);

  return {
    busca,
    setBusca,
    objetosFiltrados,
    mostrarPerdidos,
    setMostrarPerdidos,
    mostrarAchados,
    setMostrarAchados,
    mostrarPostos,
    setMostrarPostos,
    buscarObjetos,
    limparBusca,
    objetoSelecionado,
    setObjetoSelecionado,
    carregandoDetalhes,
    abrirDetalhe,
  };
}