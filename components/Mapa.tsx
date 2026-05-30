import { View, TextInput, TouchableOpacity, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle, UrlTile, PROVIDER_GOOGLE } from "react-native-maps";
import { useMapa } from "../hooks/useMapa";
import { Posto } from "../services/HomeService";
import ObjetoDetalhe from "./ObjetoDetalhe";

type Props = {
  refreshKey: number;
  postos: Posto[];
};

export default function Mapa({ refreshKey, postos }: Props) {
  // Desestruturando as novas propriedades vindas do useMapa
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

  return (
    <View style={styles.container}>
      <MapView
        key={refreshKey}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
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
              pinColor={obj.status === "PERDIDO" ? "red" : "cyan"}
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
            description="📍 Posto de Retirada Oficial"
            pinColor="green"
          />
        ))}
      </MapView>

      {/* MODAL DE DETALHES */}
      <Modal
        visible={!!objetoSelecionado || carregandoDetalhes}
        animationType="slide"
        transparent
        onRequestClose={() => setObjetoSelecionado(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* Feedback visual enquanto a requisição do hook acontece */}
            {carregandoDetalhes ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1e2a38" />
                <Text style={styles.loadingText}>Carregando informações...</Text>
              </View>
            ) : (
              objetoSelecionado && (
                <ObjetoDetalhe
                  obj={{
                    id: objetoSelecionado.id,
                    nome: objetoSelecionado.nome,
                    descricao: objetoSelecionado.descricao,
                    enderecoEncontro: objetoSelecionado.enderecoEncontro || "Consultar localização",
                    dataEncontro: objetoSelecionado.dataEncontro || new Date().toISOString(),
                    status: objetoSelecionado.status === "PERDIDO" ? "DESCARTADO" : "DISPONIVEL",
                    categorias: objetoSelecionado.categorias || [],
                    caminhosImagens: objetoSelecionado.caminhosImagens,
                  }}
                />
              )
            )}

            <TouchableOpacity
              style={styles.btnFechar}
              onPress={() => setObjetoSelecionado(null)}
            >
              <Text style={styles.btnText}>Fechar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* INPUT DE BUSCA */}
      <View style={styles.searchContainer}>
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar objeto..."
          style={styles.input}
        />
        <View style={styles.searchButtonsRow}>
          <TouchableOpacity onPress={() => buscarObjetos()} style={[styles.btn, { flex: 2 }]}>
            <Text style={styles.btnText}>Buscar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={limparBusca} style={[styles.btn, styles.btnClear, { flex: 1 }]}>
            <Text style={styles.btnText}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTROLE DE CAMADAS (LAYERSCONTROL) */}
      <View style={styles.layerControl}>
        <TouchableOpacity
          onPress={() => setMostrarPostos((v) => !v)}
          style={[styles.filterBtn, mostrarPostos && styles.activePosto]}
        >
          <Text style={styles.filterText}>📍 Postos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMostrarPerdidos((v) => !v)}
          style={[styles.filterBtn, mostrarPerdidos && styles.activePerdido]}
        >
          <Text style={styles.filterText}>❌ Perdidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMostrarAchados((v) => !v)}
          style={[styles.filterBtn, mostrarAchados && styles.activeAchado]}
        >
          <Text style={styles.filterText}>✔️ Achados</Text>
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
  searchContainer: {
    position: "absolute",
    top: 50,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    backgroundColor: "#f0f2f5",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
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
  activePosto: { backgroundColor: "#d1c4e9" },
  activePerdido: { backgroundColor: "#ffcdd2" },
  activeAchado: { backgroundColor: "#bbdefb" },
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
  btnFechar: {
    backgroundColor: "#1e2a38",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
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
  }
});