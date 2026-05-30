import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { formatarData } from "../utils/formatarData";

type Categoria = {
  nome: string;
};

type ImagemMobile = {
  uri: string; // Agora armazena o formato data:image/jpeg;base64,...
};

type Objeto = {
  id: number;
  nome: string;
  descricao: string;
  enderecoEncontro: string;
  dataEncontro: string;
  imagemCompleta?: ImagemMobile | null; 
  categorias?: Categoria[];
  status: "DISPONIVEL" | "DEVOLVIDO" | "DESCARTADO";
};

type Props = {
  obj: Objeto;
  onDelete: (id: number) => void;
  onClick: () => void;
};

export default function ObjetoCard({ obj, onDelete, onClick }: Props) {
  
  // Log simples e limpo no corpo da função para sabermos se o Base64 chegou
  if (obj.imagemCompleta?.uri) {
    console.log(`📸 [CARD - ${obj.nome}] String Base64 recebida! Tamanho dos caracteres:`, obj.imagemCompleta.uri.length);
  } else {
    console.log(`⚠️ [CARD - ${obj.nome}] Renderizando sem imagem.`);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISPONIVEL": return "#2ecc71";
      case "DEVOLVIDO": return "#3498db";
      default: return "#e74c3c";
    }
  };

  return (
    <TouchableOpacity style={styles.cardObjeto} onPress={onClick} activeOpacity={0.8}>
      
      {/* IMAGEM DO OBJETO EM BASE64 */}
      <View style={styles.cardImageContainer}>
        {obj.imagemCompleta?.uri ? (
          <Image 
            // O motor nativo consome o Base64 da memória de forma instantânea
            source={{ uri: obj.imagemCompleta.uri }} 
            style={styles.cardImage} 
            onLoad={() => console.log(`✅ [CARD - ${obj.nome}] Renderizado com sucesso via Base64!`)}
            onError={(e) => console.log(`❌ [CARD - ${obj.nome}] Erro ao ler a string Base64:`, e.nativeEvent.error)}
          />
        ) : (
          <View style={styles.imagemPlaceholder}>
            <Text style={styles.placeholderText}>Sem imagem</Text>
          </View>
        )}
      </View>

      {/* TEXTOS / INFORMAÇÕES */}
      <View style={styles.cardText}>
        <Text style={styles.title} numberOfLines={1}>{obj.nome}</Text>
        <Text style={styles.description} numberOfLines={2}>{obj.descricao}</Text>

        <Text style={styles.infoText}>
          <Text style={styles.bold}>Endereço:</Text> {obj.enderecoEncontro}
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.bold}>Data:</Text> {formatarData(obj.dataEncontro)}
        </Text>

        <Text style={styles.infoText} numberOfLines={1}>
          <Text style={styles.bold}>Categorias:</Text>{" "}
          {obj.categorias && obj.categorias.length > 0
            ? obj.categorias.map((cat) => cat.nome).join(", ")
            : "Sem categoria"}
        </Text>

        <Text style={styles.infoText}>
          <Text style={styles.bold}>Status:</Text>{" "}
          <Text style={[styles.statusText, { color: getStatusColor(obj.status) }]}>
            {obj.status}
          </Text>
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => onDelete(obj.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={22} color="#e74c3c" />
      </TouchableOpacity>

    </TouchableOpacity>
  );
}

/* Os estilos permanecem idênticos aos que você já tem */
const styles = StyleSheet.create({
  cardObjeto: {
    flexDirection: "row", 
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
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
  imagemPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },
  placeholderText: {
    fontSize: 11,
    color: "#a0a0a0",
    textAlign: "center",
  },
  cardText: {
    flex: 1, 
    marginLeft: 14,
    marginRight: 8,
    gap: 3, 
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: "#7f8c8d",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
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
  deleteButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});