import { View, Text, StyleSheet } from "react-native";

export default function MapViewComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🗺️ Mapa não disponível na versão web</Text>
      <Text style={styles.subtext}>
        Por favor, utilize o aplicativo móvel para visualizar o mapa e os locais próximos.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    minHeight: 400,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
  },
  text: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 8,
  },
  subtext: {
    color: "#cccccc",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 16,
  },
});
