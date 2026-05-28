import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { alterarSenha } from "../../services/AlterarSenhaService";
import BackButton from "../../components/BackButton";

export default function AlterarSenhaPage() {

  const router = useRouter();
  const [
    senhaNova,
    setSenhaNova
  ] = useState("");
  const [
    senhaConfirmacao,
    setSenhaConfirmacao
  ] = useState("");

  const handleSubmit = async () => {

    if (senhaNova !== senhaConfirmacao) {
      Alert.alert(
        "Atenção",
        "As senhas não coincidem"
      );
      return;
    }

    try {
      const mensagem =
        await alterarSenha(
          senhaNova
        );

      Alert.alert(
        "Sucesso",
        mensagem
      );

      setSenhaNova("");
      setSenhaConfirmacao("");

      await AsyncStorage.setItem(
        "isTemp",
        "false"
      );
      router.replace("/");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error?.response?.data ||
        error?.message ||
        "Erro ao alterar senha"
      );
    }
  };

  return (

    <View style={styles.container}>

      <View style={styles.backButtonContainer}>
        <BackButton />
      </View>

      <Image
        source={require("../../assets/images/LOGO_geoachados.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        Alterar Senha Temporária
      </Text>

      <TextInput
        placeholder="Nova Senha"
        value={senhaNova}
        onChangeText={setSenhaNova}
        style={styles.input}
        secureTextEntry
      />

      <TextInput
        placeholder="Confirmar Nova Senha"
        value={senhaConfirmacao}
        onChangeText={setSenhaConfirmacao}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>
          Alterar Senha
        </Text>
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
    top: 50,
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