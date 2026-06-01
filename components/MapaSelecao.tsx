import React from "react";
import { View } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";

type Props = {
  latitude: number | null;
  longitude: number | null;
  onSelect: (lat: number, lng: number) => void;
};

export default function MapaSelecao({
  latitude,
  longitude,
  onSelect,
}: Props) {
  const handlePress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onSelect(latitude, longitude);
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: latitude || -15.7939,
          longitude: longitude || -47.8828,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handlePress}
      >
        {latitude && longitude && (
          <Marker coordinate={{ latitude, longitude }} />
        )}
      </MapView>
    </View>
  );
}