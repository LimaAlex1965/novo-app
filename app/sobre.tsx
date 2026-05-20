import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Sobre() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o app</Text>
      <Text style={styles.text}>
        Este é um aplicativo de lista tarefas simples desenvolvido para a turma de Programação para Dispositivos Móveis
        2026.1.
      </Text>

      <Button
        title="Voltar"
        onPress={() => {
          router.back();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: "#f6f7fb",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 12,
  },
  link: {
    color: "#244c8f",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 12,
  },
});