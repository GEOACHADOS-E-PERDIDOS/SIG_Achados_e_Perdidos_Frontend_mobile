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

  // =========================
  // CARREGAR CATEGORIAS
  // =========================
const carregarCategorias = async () => {
  try {
    const data = await listarCategorias();
    
    console.log("--- [DEBUG] O QUE VEM DO JAVA:", data[0]); 

    const formatadas = data.map((c: any) => ({
      // Mapeamos o que vem do Java para o que o nosso App espera
      id: c.value,      // O 'value' do Java é o ID (1, 2, 3...)
      nome: c.label,    // O 'label' do Java é o nome (Eletrônicos, etc)
      value: c.value,
      label: c.label
    }));

    setCategorias(formatadas);
  } catch (err) {
    console.error("Erro ao carregar categorias", err);
  }
};

  // =========================
  // CARREGAR POSTOS
  // =========================
  const carregarPostos = async () => {
    try {
      const data = await listarPostosService();
      setPostos(data);
    } catch (err) {
      console.error("Erro ao carregar postos", err);
    }
  };

  // =========================
  // FILTRO (eletrônicos → delegacia)
  // =========================
  const postosFiltrados =
  categoriaSelecionada.some((c) =>
    (c?.nome ?? "").toLowerCase().includes("eletr")
  )
    ? postos.filter((p) =>
        (p?.nome ?? "").toLowerCase().includes("delegacia")
      )
    : postos;

  // =========================
  // SALVAR
  // =========================

// No SALVAR, corrija o append das categorias e campos de endereço:
const salvar = async () => {
  try {
    setLoading(true);
    const formData = new FormData();

    formData.append("nome", nome);
    formData.append("descricao", descricao);
    
    // Verifique no seu Backend se o campo é 'enderecoAchado' ou 'enderecoEncontro'
    // Geralmente se usa o mesmo nome do DTO do Java
    formData.append(tipo === "ACHADO" ? "enderecoEncontro" : "enderecoPerdido", enderecoEncontro);

    if (dataEncontro) {
      const dataFormatada = dataEncontro.toISOString().split("T")[0];
      formData.append(tipo === "ACHADO" ? "dataEncontro" : "dataPerdido", dataFormatada);
    }

    if (latitude) formData.append(tipo === "ACHADO" ? "latitudeAchado" : "latitude", String(latitude));
    if (longitude) formData.append(tipo === "ACHADO" ? "longitudeAchado" : "longitude", String(longitude));

    // CORREÇÃO DAS CATEGORIAS
    categoriaSelecionada.forEach((c: any) => {
      // Usa 'id' ou 'value' dependendo de como você salvou no estado
      const catId = c.id || c.value; 
      if (catId) formData.append("categorias", String(catId));
    });

    if (tipo === "ACHADO" && postoId) {
      formData.append("postoRetiradaId", String(postoId));
    }

    // IMAGENS (Tratamento para Android)
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
  } catch (err: any) {
    console.error("Erro ao salvar objeto", err.response?.data || err.message);
    Alert.alert("Erro", "O servidor recusou o cadastro. Verifique os campos.");
  } finally {
    setLoading(false);
  }
};

  // =========================
  // INIT
  // =========================
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

    // ✅ ADICIONADOS (corrigido)
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