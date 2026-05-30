import { useState } from "react";
import { View, StyleSheet, Modal, Text, Pressable } from "react-native";

type Props = {
  onSelectLocation?: (coords: { latitude: number; longitude: number }) => void;
};

export default function ClickMapa({ onSelectLocation }: Props) {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;

    setCoords({ latitude, longitude });

    if (onSelectLocation) {
      onSelectLocation({ latitude, longitude });
    }
  };

  return (
    <>
      {/* overlay invisível só pra lógica (opcional) */}
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1 }} />
      </View>

      {/* exemplo de modal simples */}
      <Modal visible={!!coords} transparent animationType="fade">
        <View style={styles.modal}>
          <View style={styles.box}>
            <Text>Coordenadas selecionadas:</Text>

            <Text>
              {coords?.latitude}, {coords?.longitude}
            </Text>

            <Pressable onPress={() => setCoords(null)}>
              <Text style={styles.btn}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  btn: {
    marginTop: 10,
    color: "blue",
  },
});