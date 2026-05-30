import React from "react";
// 1. Adicionado o StyleSheet na importação do react-native
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import Mapa from "../../components/Mapa";
import { useHomeDados } from "../../hooks/useHomeDados";

export default function HomePage() {
  const { isAdmin, refreshKey, loading, postos } = useHomeDados();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e2a38" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Mapa refreshKey={refreshKey} postos={postos} />
      </View>

      {isAdmin && (
        <TouchableOpacity style={styles.floatingAdminButton}>
          <Text style={styles.buttonText}>+ Posto</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  floatingAdminButton: {
    position: "absolute",
    top: 50, 
    right: 20,
    backgroundColor: "#1e2a38",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25, 
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
});