import { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import MapView, {
  Marker,
} from "react-native-maps";

import HomeService, {
  Posto
} from "../../services/HomeService";

export default function HomePage() {

  const [postos, setPostos] = useState<Posto[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {

    carregarDados();

  }, []);

  const carregarDados = async () => {

    try {

      const admin =
        await HomeService.checarAdmin();

      const postosData =
        await HomeService.buscarPostos();

      setIsAdmin(admin);
      setPostos(postosData);

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <View style={styles.container}>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -15.7939,
          longitude: -47.8828,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >

        {postos.map((posto: any) => (

          <Marker
            key={posto.id}
            coordinate={{
              latitude: posto.latitude,
              longitude: posto.longitude,
            }}
            title={posto.nome}
            description={posto.endereco}
          />

        ))}

      </MapView>

      <View style={styles.buttonsContainer}>

        {isAdmin && (

          <TouchableOpacity
            style={styles.button}
          >

            <Text style={styles.buttonText}>
              Cadastrar Posto
            </Text>

          </TouchableOpacity>

        )}

        <TouchableOpacity
          style={styles.button}
        >

          <Text style={styles.buttonText}>
            Objeto Perdido
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
        >

          <Text style={styles.buttonText}>
            Objeto Achado
          </Text>

        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  buttonsContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
    gap: 10,
  },

  button: {
    backgroundColor: "#1e2a38",
    padding: 14,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});