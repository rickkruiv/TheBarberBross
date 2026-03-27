import { Link } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';

export default function Menu() {
  return (
    <View style={[styles.container]}>
      <Text>Menu Screen!</Text>
      <Link href={"/home"}>Go to Home screen</Link>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
  },
});