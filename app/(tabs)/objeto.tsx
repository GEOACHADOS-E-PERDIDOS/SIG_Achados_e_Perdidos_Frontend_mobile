import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { useObjetos } from "../../hooks/useObjetos";
import ObjetoCard from "../../components/ObjetoCard";
import ObjetoDetalhe from "../../components/ObjetoDetalhe";

export default function ObjetosScreen() {
  const {
    objetos,
    categorias,
    loading,
    buscarTermo,
    setBuscarTermo,
    categoriaSelecionada,
    setCategoriaSelecionada,
    statusSelecionado,
    setStatusSelecionado,
    objetoSelecionado,
    setObjetoSelecionado,
    statusOptions,
    handleBuscar,
    handleLimpar,
    handleDelete,
  } = useObjetos();

  return (
    <View style={styles.container}>

      {/* SEÇÃO DE FILTROS */}
      <View style={styles.filtroContainer}>

        {/* Input de Busca de Texto */}
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por termo..."
          placeholderTextColor="#999"
          value={buscarTermo}
          onChangeText={setBuscarTermo}
          onSubmitEditing={handleBuscar}
        />

        {/* Pílulas de Status */}
        <View style={styles.labelFiltroContainer}>
          <Text style={styles.labelFiltro}>Status:</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollPills}>
          {statusOptions.map((opt: any) => {
            const isActive = statusSelecionado === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setStatusSelecionado(isActive ? "" : opt.value)}
                style={[styles.pill, isActive && styles.pillActiveStatus]}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Pílulas de Categorias */}
        <View style={styles.labelFiltroContainer}>
          <Text style={styles.labelFiltro}>Categorias:</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollPills}>
          {categorias.map((cat: any) => {
            const isActive = categoriaSelecionada?.value === cat.value;
            return (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setCategoriaSelecionada(isActive ? null : cat)}
                style={[styles.pill, isActive && styles.pillActiveCategoria]}
              >
                <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Botões de Ação */}
        <View style={styles.botoesRow}>
          <TouchableOpacity style={[styles.botaoFiltro, styles.btnBuscar]} onPress={handleBuscar}>
            <Text style={styles.txtBotao}>Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botaoFiltro, styles.btnLimpar]} onPress={handleLimpar}>
            <Text style={styles.txtBotao}>Limpar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RECONHECIMENTO DE LOADING / LISTAGEM */}
      {loading ? (
        <ActivityIndicator size="large" color="#1e2a38" style={{ flex: 1 }} />
      ) : (
        < FlatList
          data={objetos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listaObjetos}
          renderItem={({ item }) => (
            <ObjetoCard
              obj={{
                ...item,
                // Repassamos o objeto de imagem inteiro gerado pelo service
                imagemCompleta: item.caminhosImagens?.[0] ?? null,
              }}
              onDelete={handleDelete}
              onClick={() => setObjetoSelecionado(item)}
            />
          )}
          ListEmptyComponent={
            <Text style={styles.txtVazio}>Nenhum objeto encontrado.</Text>
          }
        />
      )}

      {/* MODAL NATIVO DE DETALHES */}
      <Modal
        visible={!!objetoSelecionado}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setObjetoSelecionado(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <ScrollView style={{ marginBottom: 10 }}>
              {objetoSelecionado && (
                <ObjetoDetalhe obj={objetoSelecionado} />
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.btnFecharModal}
              onPress={() => setObjetoSelecionado(null)}
            >
              <Text style={styles.txtBotao}>Fechar Detalhes</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

/* ===================================================== */
/* ESTILOS (CSS ESTILIZADO) */
/* ===================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  filtroContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    gap: 8,
  },
  inputBusca: {
    backgroundColor: "#f1f2f6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 15,
    color: "#333",
    marginBottom: 4,
  },
  labelFiltroContainer: {
    marginTop: 4,
  },
  labelFiltro: {
    fontSize: 12,
    fontWeight: "700",
    color: "#7f8c8d",
    textTransform: "uppercase",
  },
  scrollPills: {
    paddingVertical: 4,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f2f5",
    borderWidth: 1,
    borderColor: "#e4e6eb",
  },
  pillActiveStatus: {
    backgroundColor: "#3498db",
    borderColor: "#2980b9",
  },
  pillActiveCategoria: {
    backgroundColor: "#9b59b6",
    borderColor: "#8e44ad",
  },
  pillText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
  },
  pillTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  botoesRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  botaoFiltro: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnBuscar: {
    backgroundColor: "#1e2a38",
  },
  btnLimpar: {
    backgroundColor: "#7f8c8d",
  },
  txtBotao: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },
  listaObjetos: {
    padding: 16,
  },
  txtVazio: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    width: "92%",
    maxHeight: "85%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  btnFecharModal: {
    backgroundColor: "#1e2a38",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
});