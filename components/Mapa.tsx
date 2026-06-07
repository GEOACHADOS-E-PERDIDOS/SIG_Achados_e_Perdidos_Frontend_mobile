import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, ActivityIndicator, ScrollView } from "react-native";
import MapView, { Marker, Circle, UrlTile, PROVIDER_GOOGLE } from "react-native-maps";
import { useMapa } from "../hooks/useMapa";
import { Posto } from "../services/HomeService";
import ObjetoDetalhe from "./ObjetoDetalhe";
import PostoDetalhe from "./PostoDetalhe";
import { Keyboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  refreshKey: number;
  postos: Posto[];
};

export default function Mapa({ refreshKey, postos }: Props) {
  const {
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
    objetoSelecionado,
    setObjetoSelecionado,
    carregandoDetalhes,
    abrirDetalhe,
  } = useMapa({ refreshKey });

  const [tipoMapa, setTipoMapa] = useState<"hybrid" | "standard">("hybrid");
  const [pesquisaExpandida, setPesquisaExpandida] = useState(false);
  const [postoSelecionado, setPostoSelecionado] = useState<any | null>(null);

  const alternarTipoMapa = () => {
    setTipoMapa((atual) => (atual === "hybrid" ? "standard" : "hybrid"));
  };

  const handleLimparBusca = () => {
    limparBusca();
    setPesquisaExpandida(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        key={refreshKey}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        toolbarEnabled={false}
        mapType={tipoMapa}
        initialRegion={{
          latitude: -15.7939,
          longitude: -47.8828,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* GEOSERVER WMS / TMS TILES */}
        {mostrarPostos && (
          <UrlTile
            urlTemplate="http://localhost:8080/geoserver/gwc/service/tms/1.0.0/Geoachados:view_posto_retirada_map@EPSG:900913@png/{z}/{x}/{y}.png"
            tileSize={256}
          />
        )}
        {mostrarPerdidos && (
          <UrlTile
            urlTemplate="http://localhost:8080/geoserver/gwc/service/tms/1.0.0/Geoachados:view_objeto_perdido_map@EPSG:900913@png/{z}/{x}/{y}.png"
            tileSize={256}
          />
        )}
        {mostrarAchados && (
          <UrlTile
            urlTemplate="http://localhost:8080/geoserver/gwc/service/tms/1.0.0/Geoachados:view_objeto_achado_map@EPSG:900913@png/{z}/{x}/{y}.png"
            tileSize={256}
          />
        )}

        {/* MARCADORES DA BUSCA LOCAL */}
        {objetosFiltrados.map((obj) => (
          <View key={`group-${obj.id}`}>
            <Circle
              center={{ latitude: obj.latitudeEncontro, longitude: obj.longitudeEncontro }}
              radius={120}
              strokeWidth={2}
              strokeColor="#ffcc00"
              fillColor="rgba(255,204,0,0.2)"
            />
            <Marker
              coordinate={{
                latitude: obj.latitudeEncontro,
                longitude: obj.longitudeEncontro
              }}
              pinColor={obj.status === "PERDIDO" ? "red" : "dodgerblue"}
              onPress={() => abrirDetalhe(obj.id)}
            />
          </View>
        ))}

        {/* MARCADORES DE POSTOS */}
        {mostrarPostos && postos.map((posto) => (
          <Marker
            key={`posto-${posto.id}`}
            coordinate={{ latitude: posto.latitude, longitude: posto.longitude }}
            title={posto.nome}
            description="📍 Clique para ver detalhes e objetos"
            pinColor="green"
            onPress={() => setPostoSelecionado(posto)}
          />
        ))}
      </MapView>

      {/* CONTAINER DE BUSCA EXPANSÍVEL */}
      <View style={[styles.searchContainer, !pesquisaExpandida && styles.searchContainerFechado]}>
        {!pesquisaExpandida ? (
          <TouchableOpacity
            style={styles.btnLupaArredondada}
            onPress={() => setPesquisaExpandida(true)}
          >
            <Ionicons name="search" size={22} color="#1e2a38" />
          </TouchableOpacity>
        ) : (
          <View style={styles.containerExpandido}>
            <View style={styles.inputRow}>
              <TextInput
                value={busca}
                onChangeText={setBusca}
                placeholder="Buscar objeto..."
                style={styles.input}
                autoFocus
              />
              <TouchableOpacity
                style={styles.btnFecharPesquisa}
                onPress={() => setPesquisaExpandida(false)}
              >
                <Ionicons name="close" size={24} color="#7f8c8d" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchButtonsRow}>
              <TouchableOpacity
                onPress={() => {
                  buscarObjetos();
                  Keyboard.dismiss();
                  setPesquisaExpandida(false);
                }}
                style={[styles.btn, { flex: 2 }]}
              >
                <Text style={styles.btnText}>Buscar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLimparBusca} style={[styles.btn, styles.btnClear, { flex: 1 }]}>
                <Text style={styles.btnText}>Limpar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.btnToggleMap} onPress={alternarTipoMapa}>
        <Ionicons
          name={tipoMapa === "hybrid" ? "map-outline" : "earth-outline"}
          size={20}
          color="#1e2a38"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.btnToggleMapText}>
          {tipoMapa === "hybrid" ? "Mapa Padrão" : "Mapa Satélite"}
        </Text>
      </TouchableOpacity>

      {/* MODAL DO OBJETO SELECIONADO (Vindo do clique no Mapa) */}
      <Modal
        visible={!!objetoSelecionado || carregandoDetalhes}
        animationType="slide"
        transparent
        onRequestClose={() => setObjetoSelecionado(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {carregandoDetalhes ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e2a38" />
                <Text style={styles.loadingText}>Carregando informações...</Text>
              </View>
            ) : (
              objetoSelecionado && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <ObjetoDetalhe
                    obj={{
                      id: objetoSelecionado.id,
                      nome: objetoSelecionado.nome,
                      descricao: objetoSelecionado.descricao,
                      enderecoEncontro: objetoSelecionado.enderecoEncontro || "Consultar localização",
                      dataEncontro: objetoSelecionado.dataEncontro || new Date().toISOString(),
                      status: objetoSelecionado.status,
                      categorias: objetoSelecionado.categorias || [],
                      caminhosImagens: objetoSelecionado.caminhosImagens, // Já processado em Base64 pelo hook
                      nomePosto: objetoSelecionado.nomePosto,
                    }}
                  />
                  {/* O botão fica dentro do escopo do conteúdo para evitar sumir em telas menores */}
                  <TouchableOpacity style={styles.btnFechar} onPress={() => setObjetoSelecionado(null)}>
                    <Text style={styles.btnText}>Fechar Detalhes</Text>
                  </TouchableOpacity>
                </ScrollView>
              )
            )}
          </View>
        </View>
      </Modal>

      {/* 4. MODAL NOVO ADICIONADO PARA OS DETALHES DO POSTO */}
      <Modal
        visible={postoSelecionado !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setPostoSelecionado(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.postoModalContent]}>
            {postoSelecionado && (
              <PostoDetalhe
                posto={{
                  id: postoSelecionado.id,
                  nome: postoSelecionado.nome,
                  endereco: postoSelecionado.endereco || "Não informado",
                  telefone: postoSelecionado.telefone || "Não informado",
                  email: postoSelecionado.email || "Não informado",
                  imagens: postoSelecionado.imagens || [],
                  latitude: postoSelecionado.latitude,
                  longitude: postoSelecionado.longitude
                }}
                onClose={() => setPostoSelecionado(null)}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* CONTROLE DE CAMADAS (LAYERSCONTROL) */}
      <View style={styles.layerControl}>
        <TouchableOpacity
          onPress={() => setMostrarPostos((v) => !v)}
          style={[styles.filterBtn, mostrarPostos && styles.activePosto]}
        >
          <View style={styles.filterContent}>
            <Ionicons
              name="business-outline"
              size={16}
              color={mostrarPostos ? "#fff" : "#555"}
            />

            <Text
              style={[
                styles.filterText,
                mostrarPostos && styles.filterTextActive,
              ]}
            >
              Postos
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMostrarPerdidos((v) => !v)}
          style={[styles.filterBtn, mostrarPerdidos && styles.activePerdido]}
        >
          <View style={styles.filterContent}>
            <Ionicons
              name="close-circle-outline"
              size={16}
              color={mostrarPerdidos ? "#fff" : "#555"}
            />

            <Text
              style={[
                styles.filterText,
                mostrarPerdidos && styles.filterTextActive,
              ]}
            >
              Perdidos
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMostrarAchados((v) => !v)}
          style={[styles.filterBtn, mostrarAchados && styles.activeAchado]}
        >
          <View style={styles.filterContent}>
            <Ionicons
              name="checkmark-circle-outline"
              size={16}
              color={mostrarAchados ? "#fff" : "#555"}
            />

            <Text
              style={[
                styles.filterText,
                mostrarAchados && styles.filterTextActive,
              ]}
            >
              Achados
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  btnToggleMap: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnToggleMapText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e2a38",
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainerFechado: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: "flex-end",
    marginRight: "5%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  btnLupaArredondada: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  containerExpandido: {
    padding: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  btnFecharPesquisa: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonsRow: {
    flexDirection: "row",
    gap: 8,
  },
  btn: {
    backgroundColor: "#1e2a38",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnClear: {
    backgroundColor: "#7f8c8d",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  layerControl: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 30,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  activePosto: { backgroundColor: "#2ecc71" },
  activePerdido: { backgroundColor: "#e74c3c" },
  activeAchado: { backgroundColor: "#3498db" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "92%",
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  postoModalContent: {
    height: "75%",
    padding: 0,
    overflow: "hidden"
  },
  btnFechar: {
    backgroundColor: "#1e2a38",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 16,
  },
  loadingContainer: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  filterContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

});