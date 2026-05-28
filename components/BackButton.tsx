import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity 
      onPress={() => router.back()} 
      style={styles.button}
      activeOpacity={0.7} 
    >
      <Ionicons
        name="arrow-back"
        size={28}
        color="#1e2a38" 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8, 
  },
});