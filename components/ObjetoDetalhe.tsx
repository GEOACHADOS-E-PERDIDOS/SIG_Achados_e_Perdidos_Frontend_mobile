import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  NativeSyntheticEvent, 
  NativeScrollEvent 
} from "react-native";
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

const { width } = Dimensions.get("window");
const SLIDE_WIDTH = (width * 0.78) + 10;

export default function ObjetoDetalhe({ obj }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISPONIVEL": return "#2ecc71";
      case "DEVOLVIDO": return "#3498db";
      default: return "#e74c3c";
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SLIDE_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* TÍTULO */}
      <Text style={styles.title}>{obj.nome}</Text>

      {/* CARROSSEL DE IMAGENS NATIVO */}
      <View style={styles.imageSectionContainer}>
        {obj.caminhosImagens && obj.caminhosImagens.length > 0 ? (

          obj.caminhosImagens.length === 1 ? (
            
            /* Ajustado: View em volta da imagem única para garantir a centralização */
            <View style={styles.imagemUnicaContainer}>
              <Image
                source={{ uri: obj.caminhosImagens[0].uri }}
                style={styles.imagemUnica}
              />
            </View>

          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                contentContainerStyle={styles.imageScroll}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {obj.caminhosImagens.map((img, index) => (
                  /* Ajustado: Envolvemos cada imagem do carrossel em uma View centralizada */
                  <View key={index} style={styles.objetoImagemContainer}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.objetoImagem}
                    />
                  </View>
                ))}
              </ScrollView>

              {/* Renderização dos pontinhos indicadores */}
              <View style={styles.paginationContainer}>
                {obj.caminhosImagens.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      activeIndex === index ? styles.dotActive : styles.dotInactive
                    ]}
                  />
                ))}
              </View>
            </>
          )

        ) : (

          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              Sem imagem
            </Text>
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
    textTransform: "capitalize"
  },
  imageSectionContainer: {
    height: 200,
    backgroundColor: "#f5f6fa",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative", 
  },
  imageScroll: {
    alignItems: "center",
  },
  /* NOVO: Container para centralizar perfeitamente a imagem única alta */
  imagemUnicaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagemUnica: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  /* NOVO: Container para centralizar cada imagem alta dentro do ScrollView */
  objetoImagemContainer: {
    width: width * 0.78,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  objetoImagem: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
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
  paginationContainer: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  paginationDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotActive: {
    backgroundColor: "#1e2a38", 
    width: 12, 
  },
  dotInactive: {
    backgroundColor: "rgba(30, 42, 56, 0.35)", 
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