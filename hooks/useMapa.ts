import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";
import { buscarObjetoPorId, buscarImagens } from "../services/ObjetoService";
// Importando o service de busca de postos
import { buscarPostoPorId } from "../services/PostoService";

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

  const abrirDetalhe = async (id: number) => {
    setCarregandoDetalhes(true);
    try {
      const objeto = await buscarObjetoPorId(id);

      const caminhos: string[] = objeto.caminhosImagens ?? [];
      const imagens = caminhos.length > 0 ? await buscarImagens(caminhos) : [];

      let nomePostoVinculado = "";

      if (objeto.postoId) {
        try {
          const posto = await buscarPostoPorId(objeto.postoId);
          nomePostoVinculado = posto.nome;
        } catch (postoErr) {
          console.log("Erro ao buscar posto por ID:", postoErr);
          nomePostoVinculado = "Posto não encontrado";
        }
      }

      const objetoCompletoComImagens = {
        ...objeto,
        caminhosImagens: imagens,
        nomePosto: nomePostoVinculado,
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
    if (obj.status === "DEVOLVIDO") return false;
    if (obj.status === "DESCARTADO") return false;

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