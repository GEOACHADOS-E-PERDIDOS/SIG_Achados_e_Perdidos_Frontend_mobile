import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import { formatarData } from "../utils/formatarData";
import { Categoria } from "../services/HomeService";

type ImagemMobile = {
  uri: string;
};

type Objeto = {
  id: number;
  nome: string;
  descricao: string;
  status: string;

  enderecoEncontro?: string;
  dataEncontro?: string;

  categorias?: Categoria[];

  imagemCompleta?: ImagemMobile | null;
};

type Props = {
  obj: Objeto;
  onClick: () => void;
  onEditObjeto: (obj: Objeto) => void;
  onEditStatus: (
    id: number,
    statusAtual: string
  ) => void;
  onDelete: (
    id: number
  ) => void;
  podeAlterarStatus: boolean;
};

export default function ObjetoCardPerfilMobile({
  obj,
  onEditObjeto,
  onEditStatus,
  onDelete,
  onClick,
  podeAlterarStatus,
}: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISPONIVEL": return "#2ecc71";
      case "DEVOLVIDO": return "#3498db";
      case "PERDIDO": return "#e74c3c";
      default: return "#333";
    }
  };

  return (
    
    <TouchableOpacity
      style={styles.cardObjeto}
      activeOpacity={0.85}
      onPress={onClick}
    >
      {/* IMAGEM */}
      <View style={styles.cardImageContainer}>
        {obj.imagemCompleta?.uri && (
          <Image
            source={{ uri: obj.imagemCompleta.uri }}
            style={styles.cardImage}
            onLoad={() =>
              console.log(
                `[${obj.nome}] imagem carregada`
              )
            }
            onError={(e) =>
              console.log(
                `[${obj.nome}] erro imagem:`,
                e.nativeEvent.error
              )
            }
          />
        )}
      </View>

      {/* DADOS DO OBJETO */}
      <View style={styles.cardText}>
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {obj.nome}
        </Text>

        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {obj.descricao}
        </Text>

        <Text
          style={styles.infoText}
          numberOfLines={1}
        >
          <Text style={styles.bold}>
            {obj.status === "PERDIDO"
              ? "Região Perdido:"
              : "Local Encontro:"}
          </Text>{" "}
          {obj.enderecoEncontro ||
            "Não informado"}
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.bold}>
            Data:
          </Text>{" "}
          {obj.dataEncontro
            ? formatarData(
              obj.dataEncontro
            )
            : "Não informada"}
        </Text>

        <Text
          style={styles.infoText}
          numberOfLines={1}
        >
          <Text style={styles.bold}>
            Categorias:
          </Text>{" "}
          {obj.categorias &&
            obj.categorias.length > 0
            ? obj.categorias
              .map(
                (cat: Categoria) =>
                  cat.nome
              )
              .join(", ")
            : "Sem categoria"}
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.bold}>
            Status:
          </Text>{" "}
          <Text
            style={[
              styles.statusText,
              {
                color:
                  getStatusColor(
                    obj.status
                  ),
              },
            ]}
          >
            {obj.status}
          </Text>
        </Text>
      </View>

      {/* AÇÕES */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.editButton,
          ]}
          onPress={() =>
            onEditObjeto(obj)
          }
        >
          <Text style={styles.actionText}>
            Editar
          </Text>
        </TouchableOpacity>

        {(podeAlterarStatus || obj.status === "PERDIDO") && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.statusButton,
            ]}
            onPress={() =>
              onEditStatus(
                obj.id,
                obj.status
              )
            }
          >
            <Text style={styles.actionText}>
              Status
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.deleteButton,
          ]}
          onPress={() =>
            onDelete(obj.id)
          }
        >
          <Text style={styles.actionText}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardObjeto: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f6fa",
  },

  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  cardText: {
    flex: 1,
    marginHorizontal: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2c3e50",
  },

  description: {
    fontSize: 12,
    color: "#7f8c8d",
    marginTop: 4,
  },

  infoText: {
    fontSize: 12,
    marginTop: 4,
    color: "#333",
  },

  bold: {
    fontWeight: "600",
    color: "#555",
  },

  statusText: {
    fontWeight: "bold",
    fontSize: 12,
  },

  actionsContainer: {
    justifyContent: "center",
    gap: 5,
  },

  actionButton: {
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: "center",
    minWidth: 60,
  },

  editButton: {
    backgroundColor: "#3498db",
  },

  statusButton: {
    backgroundColor: "#f39c12",
  },

  deleteButton: {
    backgroundColor: "#e74c3c",
  },

  actionText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});