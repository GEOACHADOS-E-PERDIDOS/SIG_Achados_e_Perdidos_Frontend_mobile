import React from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from "react-native";

type Props = {
    obj: any;
    onClick: (id: number) => void;
};

export default function ObjetoPostoCard({ obj, onClick }: Props) {



    console.log("=== CARD ===");
    console.log(obj.nome);
    console.log("imagemUrl:", obj.imagemUrl);
    console.log("tipo:", typeof obj.imagemUrl);



    const handlePress = () => {
        console.log("CLICOU NO CARD:", obj.id);
        onClick(obj.id);
    };

    const temImagemValida = obj.imagemUrl && typeof obj.imagemUrl === "string" && obj.imagemUrl.trim() !== "";

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            {/* CONTAINER DA IMAGEM */}
            <View style={styles.imagemContainer}>
                {temImagemValida ? (
                    <Image
                        source={{ uri: obj.imagemUrl }}
                        style={styles.imagem}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderTexto}>Sem imagem</Text>
                    </View>
                )}
            </View>

            {/* CONTEÚDO DO CARD */}
            <View style={styles.conteudoContainer}>
                <Text style={styles.titulo} numberOfLines={1}>
                    {obj.nome}
                </Text>

                <Text style={styles.descricao} numberOfLines={2}>
                    {obj.descricao}
                </Text>

                <View style={styles.categoriaBadge}>
                    <Text style={styles.categoriaTexto}>
                        {obj.categorias?.[0]?.nome ?? "Sem categoria"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    imagemContainer: {
        width: 80,
        height: 80,
        borderRadius: 6,
        overflow: "hidden",
        backgroundColor: "#F0F0F0",
    },
    imagem: {
        width: "100%",
        height: "100%",
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderTexto: {
        fontSize: 11,
        color: "#999",
        textAlign: "center",
    },
    conteudoContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },
    titulo: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    descricao: {
        fontSize: 13,
        color: "#666",
        lineHeight: 18,
        marginBottom: 6,
    },
    categoriaBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#E1F5FE",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    categoriaTexto: {
        fontSize: 11,
        color: "#0288D1",
        fontWeight: "600",
    },
});