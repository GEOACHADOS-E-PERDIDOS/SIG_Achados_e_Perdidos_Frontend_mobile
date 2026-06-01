import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import Mapa from "../../components/Mapa";
import { useHomeDados } from "../../hooks/useHomeDados";
import { router } from "expo-router";

export default function HomePage() {
  const {  refreshKey, loading, postos } = useHomeDados();
  const navigation = useNavigation<any>();

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

      <View style={styles.floatingContainer}>

        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => router.push("/cadastroobjetoachado")}
        >
          <Text style={styles.buttonText}>
            + Achado
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.floatingButtonLost}
          onPress={() => router.push("/cadastroobjetoperdido")}
        >
          <Text style={styles.buttonText}>+ Perdido</Text>
        </TouchableOpacity>

      </View>

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
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },

  floatingContainer: {
  position: "absolute",
  top: 200,
  right: 20,
  gap: 10,
  zIndex: 10,
},

floatingButton: {
  backgroundColor: "#1e2a38",
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

floatingButtonLost: {
  backgroundColor: "#e74c3c",
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},

});