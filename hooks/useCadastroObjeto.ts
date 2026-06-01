import { useState, useEffect } from "react";
import {
  criarObjetoAchado,
  criarObjetoPerdido
} from "../services/ObjetoService";
import { listarCategorias } from "../services/CategoriaService";
import { listarPostosService } from "../services/PostoService";
import { Alert } from "react-native";

type Categoria = {
  id: number;
  nome: string;
};

type Posto = {
  id: number;
  nome: string;
};

export function useCadastroObjeto(tipo: "ACHADO" | "PERDIDO") {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria[]>([]);

  const [postos, setPostos] = useState<Posto[]>([]);
  const [postoId, setPostoId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [enderecoEncontro, setEnderecoEncontro] = useState("");
  const [dataEncontro, setDataEncontro] = useState<Date | null>(null);
  const [imagens, setImagens] = useState<any[]>([]);

  const carregarCategorias = async () => {
    try {
      const data = await listarCategorias();

      const formatadas = data.map((c: any) => ({
        id: c.value,
        nome: c.label,
        value: c.value,
        label: c.label
      }));

      setCategorias(formatadas);
    } catch (err) {
      console.error("Erro ao carregar categorias", err);
    }
  };

  const carregarPostos = async () => {
    try {
      const data = await listarPostosService();
      setPostos(data);
    } catch (err) {
      console.error("Erro ao carregar postos", err);
    }
  };

  // =========================
  // FILTRO 
  // =========================
  const postosFiltrados =
    categoriaSelecionada.some((c) =>
      (c?.nome ?? "").toLowerCase().includes("eletr")
    )
      ? postos.filter((p) =>
        (p?.nome ?? "").toLowerCase().includes("delegacia")
      )
      : postos;


  const salvar = async () => {
    try {
      if (!nome?.trim()) {
        Alert.alert("Erro", "Informe o nome do objeto.");
        return;
      }

      if (!descricao?.trim()) {
        Alert.alert("Erro", "Informe a descrição.");
        return;
      }

      if (!dataEncontro) {
        Alert.alert("Erro", "Selecione a data do encontro.");
        return;
      }

      if (!postoId) {
        Alert.alert("Erro", "Selecione um posto de retirada.");
        return;
      }

      if (categoriaSelecionada.length === 0) {
        Alert.alert("Erro", "Selecione ao menos uma categoria.");
        return;
      }
      setLoading(true);
      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("descricao", descricao);

      formData.append(tipo === "ACHADO" ? "enderecoEncontro" : "enderecoPerdido", enderecoEncontro);

      if (dataEncontro) {
        const dataFormatada = dataEncontro.toISOString().split("T")[0];
        formData.append(tipo === "ACHADO" ? "dataEncontro" : "dataPerdido", dataFormatada);
      }

      if (latitude) formData.append(tipo === "ACHADO" ? "latitudeAchado" : "latitude", String(latitude));
      if (longitude) formData.append(tipo === "ACHADO" ? "longitudeAchado" : "longitude", String(longitude));

      categoriaSelecionada.forEach((c: any) => {
        const catId = c.id || c.value;
        if (catId) formData.append("categorias", String(catId));
      });

      if (tipo === "ACHADO" && postoId) {
        formData.append("postoRetiradaId", String(postoId));
      }

      if (imagens && imagens.length > 0) {
        imagens.forEach((img: any) => {
          const uri = img.uri;
          const name = img.fileName || uri.split("/").pop() || "image.jpg";
          const type = img.mimeType || "image/jpeg";

          formData.append("imagens", {
            uri,
            name,
            type,
          } as any);
        });
      }

      if (tipo === "ACHADO") {
        await criarObjetoAchado(formData);
      } else {
        await criarObjetoPerdido(formData);
      }

      Alert.alert("Sucesso", "Objeto cadastrado com sucesso!");
      return true
    } catch (err: any) {
      console.error("Erro ao salvar objeto", err.response?.data || err.message);
      Alert.alert("Erro", "O servidor recusou o cadastro. Verifique os campos.");
      return false
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
    carregarPostos();
  }, []);

  return {
    nome,
    setNome,
    descricao,
    setDescricao,

    categorias,
    categoriaSelecionada,
    setCategoriaSelecionada,

    postos,
    postosFiltrados,
    postoId,
    setPostoId,

    loading,
    salvar,
    enderecoEncontro,
    setEnderecoEncontro,

    dataEncontro,
    setDataEncontro,

    latitude,
    setLatitude,
    longitude,
    setLongitude,

    imagens,
    setImagens,
  };
}