import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

export default function MapViewComponent() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão de localização negada');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  const defaultLatitude = -23.5505;
  const defaultLongitude = -46.6333;

  const currentRegion = {
    latitude: location ? location.coords.latitude : defaultLatitude,
    longitude: location ? location.coords.longitude : defaultLongitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currentRegion}
        region={location ? currentRegion : undefined}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{ latitude: defaultLatitude, longitude: defaultLongitude }}
          title="Sr. Calixto"
          description="Av. Gastão Vidigal, 1934"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 8 },
  map: { width: "100%", height: "100%" },
});
