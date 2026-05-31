import { useEffect, useState } from "react";
import { Alert } from "react-native";

import {
  buscarMeuPerfil,
  atualizarMeuPerfil,
  buscarMeusObjetos,
  atualizarStatusObjeto,
  excluirObjeto,
  atualizarObjeto,
} from "../services/PerfilPageService";

import { buscarImagens } from "../services/ObjetoService";
import { listarPostosService } from "../services/PostoService";

export function usePerfil() {
  const [usuario, setUsuario] = useState<any>(null);
  const [objetos, setObjetos] = useState<any[]>([]);
  const [postos, setPostos] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [editandoPerfil, setEditandoPerfil] =
    useState(false);

  const [objetoEditando, setObjetoEditando] =
    useState<any | null>(null);

  const [objetoSelecionado, setObjetoSelecionado] =
    useState<any | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // =========================
  // PERFIL
  // =========================

  const carregarUsuario = async () => {
    try {
      const data = await buscarMeuPerfil();

      setUsuario(data);

      setForm({
        name: data.name || "",
        email: data.email || "",
      });
    } catch (err) {
      console.error(err);

      Alert.alert(
        "Erro",
        "Não foi possível carregar o perfil."
      );
    }
  };

  // =========================
  // POSTOS
  // =========================

  const carregarPostos = async () => {
    try {
      const data = await listarPostosService();

      setPostos(data);
    } catch (err) {
      console.error(
        "Erro ao carregar postos:",
        err
      );
    }
  };

  // =========================
  // IMAGENS
  // =========================

  const montarObjetoComImagens = async (
    obj: any
  ) => {
    try {
      const caminhos =
        obj.caminhosImagens ??
        obj.imagens ??
        [];

      const imagens: { uri: string }[] =
        caminhos.length > 0
            ? await buscarImagens(caminhos)
            : [];

        return {
        ...obj,
        caminhosImagens: imagens,
        imagemCompleta: imagens[0] ?? null,
        };
    } catch (err) {
      console.error(
        "Erro ao carregar imagem:",
        err
      );

      return {
        ...obj,
        imagemCompleta: null,
      };
    }
  };

  // =========================
  // OBJETOS
  // =========================

  const carregarObjetos = async () => {
    try {
      const data =
        await buscarMeusObjetos();

      const objetosTratados =
        await Promise.all(
          data.map((obj: any) =>
            montarObjetoComImagens(obj)
          )
        );

      setObjetos(objetosTratados);
    } catch (err) {
      console.error(
        "Erro ao carregar objetos:",
        err
      );
    }
  };

  // =========================
  // PERFIL
  // =========================

  const salvarPerfil = async () => {
    try {
      await atualizarMeuPerfil(form);

      Alert.alert(
        "Sucesso",
        "Perfil atualizado."
      );

      setEditandoPerfil(false);

      await carregarUsuario();
    } catch (err) {
      Alert.alert(
        "Erro",
        "Não foi possível atualizar o perfil."
      );
    }
  };

  // =========================
  // STATUS
  // =========================

    const atualizarStatus = async (
        id: number,
        novoStatus: string
        ) => {
        try {
            await atualizarStatusObjeto(
            id,
            novoStatus
            );

            await carregarObjetos();
        } catch (err) {
            throw err;
        }
        };
  // =========================
  // DELETE
  // =========================

  const deletarObjeto = async (
    id: number
  ) => {
    try {
      await excluirObjeto(id);

      Alert.alert(
        "Sucesso",
        "Objeto excluído."
      );

      await carregarObjetos();
    } catch (err) {
      Alert.alert(
        "Erro",
        "Não foi possível excluir."
      );
    }
  };

  // =========================
  // SALVAR OBJETO
  // =========================

  const salvarObjeto = async () => {
    if (!objetoEditando) return;

    try {
      const isAchado =
        objetoEditando.postoId !==
          null &&
        objetoEditando.postoId !==
          undefined;

      const payload = isAchado
        ? {
            nome:
              objetoEditando.nome,

            descricao:
              objetoEditando.descricao,

            enderecoEncontro:
              objetoEditando.enderecoEncontro ||
              "",

            dataEncontro:
              objetoEditando.dataEncontro ||
              new Date()
                .toISOString()
                .split("T")[0],

            postoRetiradaId:
              objetoEditando.postoId,

            latitudeAchado:
              objetoEditando.latitudeEncontro,

            longitudeAchado:
              objetoEditando.longitudeEncontro,

            categorias:
              objetoEditando.categorias?.map(
                (c: any) => c.id
              ) || [],
          }
        : {
            nome:
              objetoEditando.nome,

            descricao:
              objetoEditando.descricao,

            enderecoPerdido:
              objetoEditando.enderecoEncontro ||
              "",

            dataPerdido:
              objetoEditando.dataEncontro ||
              "",

            latitude:
              objetoEditando.latitudeEncontro,

            longitude:
              objetoEditando.longitudeEncontro,

            categorias:
              objetoEditando.categorias?.map(
                (c: any) => c.id
              ) || [],
          };

      await atualizarObjeto(
        objetoEditando.id,
        payload
      );

      Alert.alert(
        "Sucesso",
        "Objeto atualizado."
      );

      setObjetoEditando(null);

      await carregarObjetos();
    } catch (err) {
      console.error(err);

      Alert.alert(
        "Erro",
        "Não foi possível atualizar o objeto."
      );
    }
  };

  // =========================
  // INIT
  // =========================

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        await Promise.all([
          carregarUsuario(),
          carregarObjetos(),
          carregarPostos(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return {
    usuario,
    objetos,
    postos,
    loading,

    form,
    setForm,

    objetoSelecionado,
    setObjetoSelecionado,

    editandoPerfil,
    setEditandoPerfil,

    objetoEditando,
    setObjetoEditando,

    salvarPerfil,
    atualizarStatus,
    deletarObjeto,
    salvarObjeto,

    carregarObjetos,
  };
}