import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from "react-native";
import { formatarData } from "../utils/formatarData"; 

type Categoria = {
  nome: string;
};

type ImagemMobile = {
  uri: string; 
};

type Objeto = {
  id: number;
  nome: string;
  descricao: string;
  enderecoEncontro: string;
  dataEncontro: string;
  nomePosto?: string;
  caminhosImagens?: ImagemMobile[]; 
  categorias?: Categoria[];
  status: "DISPONIVEL" | "DEVOLVIDO" | "DESCARTADO";
};

type Props = {
  obj: Objeto;
};

export default function ObjetoDetalhe({ obj }: Props) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISPONIVEL": return "#2ecc71";
      case "DEVOLVIDO": return "#3498db";
      default: return "#e74c3c";
    }
  };

  return (
    <View style={styles.container}>
      {/* TÍTULO */}
      <Text style={styles.title}>{obj.nome}</Text>

      {/* CARROSSEL DE IMAGENS NATIVO */}
      <View style={styles.imageSectionContainer}>
        {obj.caminhosImagens && obj.caminhosImagens.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled={obj.caminhosImagens.length > 1} 
            contentContainerStyle={styles.imageScroll}
          >
            {obj.caminhosImagens.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img.uri }}
                style={[
                  styles.objetoImagem,
                  obj.caminhosImagens!.length === 1 && { width: Dimensions.get("window").width * 0.82 }
                ]}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}
      </View>

      {/* CORPO DE INFORMAÇÕES */}
      <View style={styles.infoSection}>
        <Text style={styles.infoParagraph}>
          <Text style={styles.bold}>Descrição:</Text> {obj.descricao}
        </Text>

        <Text style={styles.infoParagraph}>
          <Text style={styles.bold}>Endereço:</Text> {obj.enderecoEncontro}
        </Text>

        {obj.nomePosto && (
          <Text style={styles.infoParagraph}>
            <Text style={styles.bold}>Posto:</Text> {obj.nomePosto}
          </Text>
        )}

        <Text style={styles.infoParagraph}>
          <Text style={styles.bold}>Data:</Text> {formatarData(obj.dataEncontro)}
        </Text>

        <Text style={styles.infoParagraph}>
          <Text style={styles.bold}>Status:</Text>{" "}
          <Text style={[styles.statusText, { color: getStatusColor(obj.status) }]}>
            {obj.status}
          </Text>
        </Text>

        <Text style={styles.infoParagraph}>
          <Text style={styles.bold}>Categorias:</Text>{" "}
          {obj.categorias && obj.categorias.length > 0
            ? obj.categorias.map((c) => c.nome).join(", ")
            : "Sem categoria"}
        </Text>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
    textAlign: "center",
  },
  imageSectionContainer: {
    height: 200,
    backgroundColor: "#f5f6fa",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  imageScroll: {
    alignItems: "center",
  },
  objetoImagem: {
    width: width * 0.78, 
    height: 200,
    resizeMode: "contain", 
    marginRight: 10,
    borderRadius: 8,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaeaea",
  },
  placeholderText: {
    color: "#7f8c8d",
    fontSize: 14,
    fontWeight: "500",
  },
  infoSection: {
    gap: 12, 
  },
  infoParagraph: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
    color: "#1e2a38",
  },
  statusText: {
    fontWeight: "bold",
  },
});