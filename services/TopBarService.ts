import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:8080/auth";

const getHeaders = async () => {

  const token =
    await AsyncStorage.getItem(
      "token"
    );

  return {
    headers: {
      Authorization:
        `Bearer ${token}`
    }
  };
};

class TopBarService {

  async checarAdmin():
    Promise<boolean> {

    try {

      const headers =
        await getHeaders();

      const response =
        await axios.get(
          `${API_URL}/admin/check`,
          headers
        );

      return response.data;

    } catch (error) {

      console.error(
        "Erro ao verificar admin:",
        error
      );

      return false;
    }
  }

  async logout() {

    await AsyncStorage.removeItem(
      "token"
    );

    await AsyncStorage.removeItem(
      "userId"
    );

    await AsyncStorage.removeItem(
      "userNome"
    );

    await AsyncStorage.removeItem(
      "userEmail"
    );

    await AsyncStorage.removeItem(
      "isAdmin"
    );

    await AsyncStorage.removeItem(
      "isTemp"
    );
  }
}

export default new TopBarService();