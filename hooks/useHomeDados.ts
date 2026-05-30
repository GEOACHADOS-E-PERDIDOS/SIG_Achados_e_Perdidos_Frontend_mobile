import { useState, useEffect } from "react";
import HomeService, { Categoria, Posto } from "../services/HomeService";

export function useHomeDados() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [postos, setPostos] = useState<Posto[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [admin, categoriasData, postosData] = await Promise.all([
        HomeService.checarAdmin(),
        HomeService.buscarCategorias(),
        HomeService.buscarPostos(),
      ]);

      setIsAdmin(admin);
      setCategorias(categoriasData);
      setPostos(postosData);
    } catch (error) {
      console.error("Erro ao carregar dados da Home:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const atualizarMapa = () => setRefreshKey((prev) => prev + 1);

  return {
    isAdmin,
    categorias,
    postos,
    refreshKey,
    loading,
    atualizarMapa,
  };
}