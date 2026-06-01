import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Dimensions,
    Linking,
    Modal,
    Platform,
    Alert,
    ActivityIndicator
} from "react-native";

import { buscarImagens } from "../services/ObjetoService";
import ObjetoPostoCard from "./ObjetoPostoCard";
import ObjetoDetalhe from "./ObjetoDetalhe";

import {
    buscarObjetosPosto,
    buscarObjetoDetalhado,
    buscarQuantidadeObjetosPosto,
} from "../services/PostoDetalheService";

const { width } = Dimensions.get("window");

type PostoDeRetirada = {
    id: number;
    nome: string;
    endereco: string;
    telefone: string;
    email: string;
    imagens?: string[];
    latitude: number;
    longitude: number;
};

type Props = {
    posto: PostoDeRetirada;
    onClose: () => void;
};

export default function PostoDetalhe({ posto, onClose }: Props) {
    const [aba, setAba] = useState<"info" | "objetos">("info");
    const [objetos, setObjetos] = useState<any[]>([]);
    const [quantidadeObjetos, setQuantidadeObjetos] = useState(0);
    const [objetosCarregados, setObjetosCarregados] = useState(false);
    const [objetoSelecionado, setObjetoSelecionado] = useState<any | null>(null);
    const [imagensCarregadas, setImagensCarregadas] = useState<{ uri: string }[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loadingObjetos, setLoadingObjetos] = useState(false);

    const handleScroll = (event: any) => {
        const slideWidth = width - 40; // padding da tela
        const index = Math.round(
            event.nativeEvent.contentOffset.x / slideWidth
        );

        setActiveIndex(index);
    };
    const abrirRota = () => {
        const latitude = Number(posto.latitude);
        const longitude = Number(posto.longitude);

        const url = Platform.select({
            ios: `maps:0,0?q=${latitude},${longitude}`,
            android: `geo:0,0?q=${latitude},${longitude}`
        }) || `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert("Erro", "Não foi possível abrir o aplicativo de mapas.");
                }
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        async function carregarQuantidade() {
            try {
                const qtd = await buscarQuantidadeObjetosPosto(posto.id);
                setQuantidadeObjetos(qtd);
            } catch (err) { console.error(err); }
        }
        carregarQuantidade();
    }, [posto.id]);
    useEffect(() => {
        async function carregarObjetos() {
            if (aba !== "objetos" || objetosCarregados) return;
            try {
                setLoadingObjetos(true); // 🔥 Inicia o carregamento

                const objs = await buscarObjetosPosto(posto.id);
                console.log("=== OBJETOS VINDOS DO SERVICE ===");
                console.log(JSON.stringify(objs, null, 2));

                const objsComImagem = await Promise.all(
                    objs.map(async (obj: any) => {
                        console.log("=== OBJETO PROCESSADO ===");
                        console.log(obj.nome);
                        console.log("caminhosImagens:", obj.caminhosImagens);

                        const caminhos = obj.caminhosImagens ?? [];
                        let imagemBase64 = null;

                        if (caminhos.length > 0) {
                            const listaNomesArquivos = caminhos.map((c: any) =>
                                typeof c === 'string' ? c : (c.caminho || c.nome || c.uri)
                            ).filter((nome: string) => nome && !nome.startsWith("data:"));

                            if (listaNomesArquivos.length > 0) {
                                const imagensBaixadas = await buscarImagens(listaNomesArquivos);
                                imagemBase64 = imagensBaixadas[0]?.uri ?? null;
                            } else if (caminhos[0]?.uri) {
                                imagemBase64 = caminhos[0].uri;
                            }
                        }

                        return {
                            ...obj,
                            imagemUrl: imagemBase64,
                        };
                    })
                );

                setObjetos(objsComImagem);
                setObjetosCarregados(true);
            } catch (err) {
                console.error("❌ Erro ao processar imagens dos objetos do posto:", err);
            } finally {
                setLoadingObjetos(false); // 🔥 Finaliza o carregamento, independente de sucesso ou erro
            }
        }
        carregarObjetos();
    }, [aba, posto.id, objetosCarregados]);

    useEffect(() => {
        async function carregarImagens() {
            if (!posto.imagens || posto.imagens.length === 0) return;
            try {
                const imgs = await buscarImagens(posto.imagens);
                setImagensCarregadas(imgs);
            } catch (err) { console.error(err); }
        }
        carregarImagens();
    }, [posto.imagens]);


    return (
        <View style={styles.container}>
            {/* CABEÇALHO COM ABAS */}
            <View style={styles.abasContainer}>
                <TouchableOpacity
                    style={[styles.abaBotao, aba === "info" && styles.abaAtiva]}
                    onPress={() => setAba("info")}
                >
                    <Text style={[styles.abaTexto, aba === "info" && styles.abaTextoAtivo]}>Informações</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.abaBotao, aba === "objetos" && styles.abaAtiva]}
                    onPress={() => setAba("objetos")}
                >
                    <Text style={[styles.abaTexto, aba === "objetos" && styles.abaTextoAtivo]}>
                        Objetos ({quantidadeObjetos})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* CONTEÚDO PRINCIPAL */}
            <ScrollView style={styles.conteudoScroll}>
                {aba === "info" && (
                    <View style={styles.infoAba}>
                        <Text style={styles.titulo}>{posto.nome}</Text>

                        <View style={styles.carouselContainer}>
                            {imagensCarregadas.length > 0 ? (
                                imagensCarregadas.length === 1 ? (
                                    <View style={styles.imagemUnicaContainer}>
                                        <Image
                                            source={imagensCarregadas[0]}
                                            style={styles.imagemUnica}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ) : (
                                    <View style={styles.carouselWrapper}>
                                        <ScrollView
                                            horizontal
                                            pagingEnabled
                                            showsHorizontalScrollIndicator={false}
                                            onScroll={handleScroll}
                                            scrollEventThrottle={16}
                                        >
                                            {imagensCarregadas.map((img, index) => (
                                                <Image
                                                    key={index}
                                                    source={img}
                                                    style={styles.carouselImage}
                                                    resizeMode="contain"
                                                />
                                            ))}
                                        </ScrollView>

                                        <View style={styles.indicatorsContainer}>
                                            {imagensCarregadas.map((_, i) => (
                                                <View
                                                    key={i}
                                                    style={[
                                                        styles.indicator,
                                                        activeIndex === i
                                                            ? styles.indicatorActive
                                                            : styles.indicatorInactive
                                                    ]}
                                                />
                                            ))}
                                        </View>
                                    </View>
                                )
                            ) : (
                                <View style={styles.placeholderContainer}>
                                    <Text style={styles.placeholderText}>
                                        Sem imagem disponível
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={styles.infoParagraph}>
                                <Text style={styles.bold}>Endereço:</Text>{" "}
                                {posto.endereco}
                            </Text>

                            <Text style={styles.infoParagraph}>
                                <Text style={styles.bold}>Telefone:</Text>{" "}
                                {posto.telefone}
                            </Text>

                            <Text style={styles.infoParagraph}>
                                <Text style={styles.bold}>E-mail:</Text>{" "}
                                {posto.email}
                            </Text>
                        </View>
                    </View>
                )}

                {aba === "objetos" && (
                    <View style={styles.listaVertical}>
                        {loadingObjetos ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#007AFF" />
                                <Text style={styles.loadingText}>Carregando objetos e imagens...</Text>
                            </View>
                        ) : objectsListEmpty() ? (
                            <Text style={styles.listaVazia}>Nenhum objeto encontrado.</Text>
                        ) : (
                            objetos.map((obj) => (
                                <ObjetoPostoCard
                                    key={obj.id}
                                    obj={obj}
                                    onClick={async (id: number) => {
                                        const detalhe = await buscarObjetoDetalhado(id);
                                        setObjetoSelecionado(detalhe);
                                    }}
                                />
                            ))
                        )}
                    </View>
                )}
            </ScrollView>

            {/* FOOTER DE AÇÕES */}
            <View style={styles.footerAcoes}>
                <TouchableOpacity style={styles.btnFechar} onPress={onClose}>
                    <Text style={styles.btnFecharTexto}>Fechar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnRota} onPress={abrirRota}>
                    <Text style={styles.btnRotaTexto}>Como Chegar</Text>
                </TouchableOpacity>
            </View>

            {/* MODAL DO OBJETO */}
            <Modal
                visible={objetoSelecionado !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setObjetoSelecionado(null)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setObjetoSelecionado(null)}
                >
                    <TouchableOpacity
                        style={styles.modalConteudo}
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderTitulo}>Detalhes do Objeto</Text>
                            <TouchableOpacity
                                style={styles.modalBtnFechar}
                                onPress={() => setObjetoSelecionado(null)}
                            >
                                <Text style={styles.modalBtnFecharTexto}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ObjetoDetalhe obj={objetoSelecionado} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );

    function objectsListEmpty() {
        return objetos.length === 0;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    abasContainer: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    abaBotao: {
        flex: 1,
        paddingVertical: 15,
        alignItems: "center",
    },
    abaAtiva: {
        borderBottomWidth: 3,
        borderBottomColor: "#007AFF",
    },
    abaTexto: {
        fontSize: 16,
        color: "#666",
        fontWeight: "500",
    },
    abaTextoAtivo: {
        color: "#007AFF",
        fontWeight: "bold",
    },
    conteudoScroll: {
        flex: 1,
    },
    infoAba: {
        padding: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 16,
        textAlign: "center",
        textTransform: "capitalize",
    },
    carouselContainer: {
        height: 200,
        backgroundColor: "#f5f6fa",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 20,
        position: "relative",
    },
    carouselWrapper: {
        flex: 1,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    carouselImage: {
        width: width - 40,
        height: 200,
        resizeMode: "contain",
    },
    indicatorsContainer: {
        position: "absolute",
        bottom: 10,
        flexDirection: "row",
    },
    indicator: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
    },

    indicatorActive: {
        backgroundColor: "#000",
        width: 12,
    },

    indicatorInactive: {
        backgroundColor: "#999",
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        color: "#999",
    },
    infoLista: {
        marginTop: 10,
    },
    infoItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
        paddingBottom: 8,
    },
    infoLabel: {
        fontSize: 12,
        color: "#999",
        textTransform: "uppercase",
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: "#333",
    },
    listaVertical: {
        padding: 20,
    },
    listaVazia: {
        textAlign: "center",
        color: "#999",
        marginTop: 20,
    },
    footerAcoes: {
        flexDirection: "row",
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
        backgroundColor: "#FFF",
    },
    btnFechar: {
        flex: 1,
        paddingVertical: 12,
        marginRight: 10,
        backgroundColor: "#F0F0F0",
        borderRadius: 8,
        alignItems: "center",
    },
    btnFecharTexto: {
        color: "#333",
        fontWeight: "600",
    },
    btnRota: {
        flex: 2,
        paddingVertical: 12,
        backgroundColor: "#007AFF",
        borderRadius: 8,
        alignItems: "center",
    },
    btnRotaTexto: {
        color: "#FFF",
        fontWeight: "600",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalConteudo: {
        width: width * 0.9,
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 20,
        maxHeight: "80%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F0",
        paddingBottom: 10,
        marginBottom: 15,
    },
    modalHeaderTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    modalBtnFechar: {
        padding: 5,
    },
    modalBtnFecharTexto: {
        fontSize: 20,
        color: "#999",
        fontWeight: "bold",
    },
    infoSection: {
        gap: 12,
    },

    infoParagraph: {
        fontSize: 15,
        color: "#333",
        lineHeight: 22,
    },

    bold: {
        fontWeight: "700",
        color: "#1e2a38",
    },
    imagemUnicaContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    imagemUnica: {
        width: "100%",
        height: "100%",
    },
    // Adicione estes estilos no final do seu objeto do StyleSheet
loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
},
loadingText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginTop: 8,
},
});