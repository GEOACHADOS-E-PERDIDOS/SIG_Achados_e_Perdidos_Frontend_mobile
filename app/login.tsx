import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async () => {
    setErro("");

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, senha }
      );
      const token = response.data.token;
      const user = response.data.usuario;
      const isTemp = response.data.isTemp;

      await AsyncStorage.setItem("token", token);

      await AsyncStorage.setItem(
        "userNome",
        user
      );

      await AsyncStorage.setItem(
        "isTemp",
        String(isTemp)
      );

      if (isTemp) {
        Alert.alert(
          "Aviso",
          "Você está usando senha temporária"
        );

        router.replace("/alterar-senha");
        return;
      }

      router.replace("/(tabs)");

    } catch (err: any) {

      const msg =
        err?.response?.data?.erro ||
        "Erro ao conectar com o servidor";

      console.log(err)
      setErro(msg);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/LOGO_geoachados.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Login</Text>

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
         placeholderTextColor="#999"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={() => {
    console.log("[LOGIN] Botão Entrar clicado");
    handleLogin();
  }}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => router.push("/cadastro-usuario")}>
          <Text style={styles.link}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/recuperar-senha")}>
          <Text style={styles.link}>Esqueci a senha</Text>
        </TouchableOpacity>
      </View>
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
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
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
  linkContainer: {
    marginTop: 25,
    gap: 15,
  },
  link: {
    textAlign: "center",
    color: "#007bff",
    fontSize: 15,
  },
});