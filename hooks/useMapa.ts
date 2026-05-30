import { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";
import { Posto } from "../services/HomeService";

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
  };
}