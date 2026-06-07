import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useCadastroObjeto } from "../hooks/useCadastroObjeto";
import MapaSelecao from "../components/MapaSelecao";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
export default function CadastroObjetoPerdido() {
  const navigation = useNavigation();
  const {
    nome,
    setNome,
    descricao,
    setDescricao,
    enderecoEncontro,
    setEnderecoEncontro,
    dataEncontro,
    setDataEncontro,
    categorias,
    categoriaSelecionada,
    setCategoriaSelecionada,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    imagens,
    setImagens,
    loading,
    salvar,
  } = useCadastroObjeto("PERDIDO");

  const [showDatePicker, setShowDatePicker] = useState(false);

  const selecionarImagens = async (setImagens: any) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permissão para acessar galeria negada");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagens(result.assets);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}>
      <Text style={styles.titulo}>Cadastrar Objeto Perdido</Text>

      {/* NOME */}
      <TextInput
        style={styles.input}
        placeholder="Nome *"
        value={nome}
        onChangeText={setNome}
      />

      {/* DESCRIÇÃO */}
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descrição *"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      {/* ENDEREÇO */}
      <TextInput
        style={styles.input}
        placeholder="Região ou Ponto de Referência do local *"
        value={enderecoEncontro}
        onChangeText={setEnderecoEncontro}
      />

      {/* DATA */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {dataEncontro instanceof Date
            ? dataEncontro.toLocaleDateString("pt-BR")
            : "Selecione uma data"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dataEncontro instanceof Date ? dataEncontro : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDataEncontro(selectedDate);
          }}
        />
      )}

      {/* CATEGORIAS */}
      <Text style={styles.label}>Categorias *</Text>
      <View style={styles.box}>
        {categorias.map((cat: any, index: number) => {
          const uniqueKey = cat.id || cat.value || `cat-${index}`;
          const selected = categoriaSelecionada.some(
            (c: any) => (c.id || c.value) === (cat.id || cat.value)
          );

          return (
            <TouchableOpacity
              key={String(uniqueKey)}
              style={[styles.tag, selected && styles.tagSelected]}
              onPress={() => {
                if (selected) {
                  setCategoriaSelecionada(
                    categoriaSelecionada.filter(
                      (c: any) => (c.id || c.value) !== (cat.id || cat.value)
                    )
                  );
                } else {
                  setCategoriaSelecionada([...categoriaSelecionada, cat]);
                }
              }}
            >
              <Text style={selected ? { color: "#fff" } : {}}>
                {cat.label || cat.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* MAPA */}
      <Text style={styles.label}>Marque no mapa para indicar o a região da perda</Text>
      <View style={{ height: 250, marginBottom: 10 }}>
        <MapaSelecao
          latitude={latitude}
          longitude={longitude}
          onSelect={(lat: number, lng: number) => {
            setLatitude(lat);
            setLongitude(lng);
          }}
        />
      </View>

      {/* IMAGENS */}
      <TouchableOpacity
        style={styles.botaoSecundario}
        onPress={() => selecionarImagens(setImagens)}
      >
        <Text style={styles.botaoTexto}>Selecionar Imagens</Text>
      </TouchableOpacity>

      {/* PREVIEW IMAGENS */}
      {imagens?.length > 0 && (
        <View style={styles.previewContainer}>
          {imagens.map((img: any, i: number) => (
            <Text key={img.uri || i} style={{ fontSize: 12, marginBottom: 4 }}>
              {img?.fileName || img?.name || `Imagem ${i + 1}`}
            </Text>
          ))}
        </View>
      )}

      {/* BOTÃO SALVAR */}
      <TouchableOpacity
        style={[
          styles.botao,
          { backgroundColor: "#e74c3c", opacity: loading ? 0.7 : 1 },
        ]}
        onPress={async () => {
          console.log(" Disparando salvamento de objeto...");
          if (!loading) {
            const sucesso = await salvar();
            if (sucesso) {
              navigation.goBack();
            }
          }
        }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Cadastrar Objeto</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botaoFechar}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.botaoTexto}>Fechar</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f6fa"
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6
  },
  box: {
    flexDirection: "row",
    flexWrap: "wrap", gap: 8,
    marginBottom: 10
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#e0e0e0"
  },
  tagSelected: {
    backgroundColor: "#e74c3c"
  },
  botao: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold"
  },
  botaoSecundario: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10
  },
  previewContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginTop: 10
  },
  botaoFechar: {
    backgroundColor: "#7f8c8d",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});