import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import RecuperarSenhaPageService from "../../services/RecuperarSenhaService";
import BackButton from "../../components/BackButton"; 

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    try {
      const mensagem = await RecuperarSenhaPageService.recuperarSenha(email);

      Alert.alert("Sucesso", mensagem);

      setEmail("");

      router.replace("/login");

    } catch (error: any) {

      const msg =
        error?.response?.data ||
        "Erro ao recuperar senha";

      Alert.alert("Erro", msg);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.backButtonContainer}>
        <BackButton />
      </SafeAreaView>

      <Image
        source={require("../../assets/images/LOGO_geoachados.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Recuperar Senha</Text>

      <TextInput
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar senha temporária</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  backButtonContainer: {
    position: "absolute",
    top: 20, 
    left: 16,
    zIndex: 10, 
  },
  logo: {
    width: 280,
    height: 180,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 26, 
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#1e2a38",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});