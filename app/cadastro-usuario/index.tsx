import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { createUser } from "../../services/CadastroUsuarioService";
import type { Usuario } from "../../types/Usuario";
import BackButton from "../../components/BackButton"; 
export default function CadastroUsuarioPage() {
  const router = useRouter();

  const [user, setUser] = useState<Usuario>({
    name: "",
    email: "",
    senha: "",
  });

  const handleSubmit = async () => {
    try {
      await createUser(user);

      Alert.alert(
        "Sucesso",
        "Usuário cadastrado com sucesso!"
      );

      setUser({
        name: "",
        email: "",
        senha: "",
      });

      router.replace("/login");

    } catch (error) {

      Alert.alert(
        "Erro",
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Container do botão de voltar alinhado de forma absoluta */}
      <SafeAreaView style={styles.backButtonContainer}>
        <BackButton />
      </SafeAreaView>

      <Image
        source={require("../../assets/images/LOGO_geoachados.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Cadastro de Usuário</Text>

      <TextInput
        placeholder="Nome"
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        value={user.senha}
        onChangeText={(text) => setUser({ ...user, senha: text })}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Cadastrar</Text>
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