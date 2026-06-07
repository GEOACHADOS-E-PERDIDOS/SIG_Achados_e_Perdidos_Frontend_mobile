import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";




import {
  Alert,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { usePerfil } from "../../hooks/usePerfil";

import ObjetoCardPerfilMobile from "../../components/ObjetoCardPerfilMobile";

import ObjetoDetalhe from "../../components/ObjetoDetalhe";

export default function PerfilScreen() {
  const {
    usuario,
    objetos,
    loading,
    postos,
    form,
    setForm,
    objetoSelecionado,
    setObjetoSelecionado,
    editandoPerfil,
    setEditandoPerfil,
    objetoEditando,
    setObjetoEditando,
    salvarPerfil,
    salvarObjeto,
    atualizarStatus,
    deletarObjeto,
  } = usePerfil();


  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.removeItem("token");

    router.replace("/login");
  };

  const [modalStatusVisible, setModalStatusVisible] =
    useState(false);

  const [objetoStatusSelecionado, setObjetoStatusSelecionado] =
    useState<any>(null);

  const abrirModalStatus = (
    id: number,
    status: string
  ) => {
    setObjetoStatusSelecionado({
      id,
      status,
    });

    setModalStatusVisible(true);
  };

  const confirmarStatus = async (
    novoStatus: string
  ) => {
    if (!objetoStatusSelecionado) {
      return;
    }

    try {
      await atualizarStatus(
        objetoStatusSelecionado.id,
        novoStatus
      );

      Alert.alert(
        "Sucesso",
        "Status atualizado."
      );

      setModalStatusVisible(false);

    } catch (err) {
      Alert.alert(
        "Erro",
        "Não foi possível atualizar."
      );
    }
  };

  const postosFiltrados =
    objetoEditando?.categorias?.some(
      (c: any) =>
        c.nome
          ?.toLowerCase()
          .includes("eletr")
    )
      ? postos.filter((posto: any) =>
        posto.nome
          .toLowerCase()
          .includes("delegacia")
      )
      : postos;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#1e2a38"
        />
      </View>
    );
  }
  console.log("POSTOS FILTRADOS", postosFiltrados);

  return (

    <View style={styles.container}>
      {/* PERFIL */}

      {/* PERFIL */}

      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.titulo}>
            Meu Perfil
          </Text>

          <View style={styles.botoesPerfil}>
            <TouchableOpacity
              style={styles.botaoEditar}
              onPress={() => setEditandoPerfil(true)}
            >
              <Text style={styles.botaoTexto}>
                Editar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoSair}
              onPress={logout}
            >
              <Text style={styles.botaoTexto}>
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.info}>
          Nome: {usuario?.name}
        </Text>

        <Text style={styles.info}>
          Email: {usuario?.email}
        </Text>
      </View>

      {/* OBJETOS */}

      <Text style={styles.tituloObjetos}>
        Meus Objetos
      </Text>

      <FlatList
        data={objetos}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <ObjetoCardPerfilMobile
            obj={item}
            onDelete={deletarObjeto}
            onEditObjeto={setObjetoEditando}
            onEditStatus={abrirModalStatus}
            onClick={() =>
              setObjetoSelecionado(item)
            }
            podeAlterarStatus={usuario?.isPosto === true}
          />
        )}
      />

      {/* MODAL PERFIL */}

      <Modal
        visible={editandoPerfil}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setEditandoPerfil(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>
              Editar Perfil
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={form.name}
              onChangeText={(text) =>
                setForm({
                  ...form,
                  name: text,
                })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={(text) =>
                setForm({
                  ...form,
                  email: text,
                })
              }
            />

            <TouchableOpacity
              style={styles.btnSalvar}
              onPress={salvarPerfil}
            >
              <Text
                style={styles.botaoTexto}
              >
                Salvar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() =>
                setEditandoPerfil(false)
              }
            >
              <Text
                style={styles.botaoTexto}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL OBJETO */}

      <Modal
        visible={!!objetoEditando}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setObjetoEditando(null)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <ScrollView>
              <Text
                style={styles.modalTitulo}
              >
                Editar Objeto
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  marginTop: 10,
                  marginBottom: 5,
                }}
              >
                Nome
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={
                  objetoEditando?.nome
                }
                onChangeText={(text) =>
                  setObjetoEditando({
                    ...objetoEditando,
                    nome: text,
                  })
                }
              />

              <Text
                style={{
                  fontWeight: "bold",
                  marginTop: 10,
                  marginBottom: 5,
                }}
              >
                Descrição
              </Text>

              <TextInput
                style={[
                  styles.input,
                  { height: 120 },
                ]}
                multiline
                placeholder="Descrição"
                value={
                  objetoEditando?.descricao
                }
                onChangeText={(text) =>
                  setObjetoEditando({
                    ...objetoEditando,
                    descricao: text,
                  })
                }
              />

              {
                objetoEditando?.postoId !== null &&
                objetoEditando?.postoId !== undefined && (
                  <>
                    <Text
                      style={{
                        fontWeight: "bold",
                        marginTop: 10,
                        marginBottom: 5,
                      }}
                    >
                      Posto de Retirada
                    </Text>

                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 8,
                        marginBottom: 15,
                      }}
                    >
                      <Picker
                        selectedValue={
                          objetoEditando.postoId
                        }
                        onValueChange={(value) => {
                          console.log("POSTO SELECIONADO:", value);
                          if (!objetoEditando) return;

                          setObjetoEditando((prev: any) => ({
                            ...prev,
                            postoId: Number(value),
                          }));
                        }}
                      >
                        {postosFiltrados.map(
                          (posto: any) => (
                            <Picker.Item
                              key={posto.id}
                              label={posto.nome}
                              value={posto.id}
                            />
                          )
                        )}
                      </Picker>
                    </View>
                  </>
                )
              }

              <TouchableOpacity
                style={styles.btnSalvar}
                onPress={salvarObjeto}
              >
                <Text
                  style={styles.botaoTexto}
                >
                  Salvar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() =>
                  setObjetoEditando(null)
                }
              >
                <Text
                  style={styles.botaoTexto}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!objetoSelecionado}
        animationType="slide"
        transparent={true}
        onRequestClose={() =>
          setObjetoSelecionado(null)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              style={{ marginBottom: 10 }}
            >
              {objetoSelecionado && (
                <ObjetoDetalhe
                  obj={{
                    id: objetoSelecionado.id,
                    nome: objetoSelecionado.nome,
                    descricao:
                      objetoSelecionado.descricao,

                    enderecoEncontro:
                      objetoSelecionado.enderecoEncontro ||
                      "Consultar localização",

                    dataEncontro:
                      objetoSelecionado.dataEncontro,

                    status:
                      objetoSelecionado.status,

                    categorias:
                      objetoSelecionado.categorias ||
                      [],

                    caminhosImagens:
                      objetoSelecionado.caminhosImagens ||
                      [],

                    nomePosto:
                      objetoSelecionado.nomePosto,
                  }}
                />
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.btnFecharModal}
              onPress={() =>
                setObjetoSelecionado(null)
              }
            >
              <Text style={styles.txtBotao}>
                Fechar Detalhes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/*Modal Status*/}

      <Modal
        visible={modalStatusVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setModalStatusVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.statusModal}>

            <Text style={styles.modalTitle}>
              Alterar Status
            </Text>

            <TouchableOpacity
              style={styles.statusOption}
              onPress={() =>
                confirmarStatus("DISPONIVEL")
              }
            >
              <Text>Disponível</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusOption}
              onPress={() =>
                confirmarStatus("DEVOLVIDO")
              }
            >
              <Text>Devolvido</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statusOption}
              onPress={() =>
                confirmarStatus("PERDIDO")
              }
            >
              <Text>Perdido</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                setModalStatusVisible(false)
              }
            >
              <Text
                style={{
                  color: "#fff",
                }}
              >
                Fechar
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  info: {
    fontSize: 15,
    marginTop: 4,
    color: "#333",
  },

  tituloObjetos: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },

  objetoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  objNome: {
    fontSize: 16,
    fontWeight: "bold",
  },

  objDescricao: {
    marginTop: 6,
    color: "#666",
  },

  objStatus: {
    marginTop: 8,
    fontWeight: "600",
  },

  botaoEditar: {
    backgroundColor: "#1e2a38",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  botaoObjeto: {
    marginTop: 12,
    backgroundColor: "#1e2a38",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  btnSalvar: {
    backgroundColor: "#1e2a38",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },

  btnCancelar: {
    backgroundColor: "#7f8c8d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },

  vazio: {
    textAlign: "center",
    marginTop: 30,
    color: "#666",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    backgroundColor: "#fff",
    width: "90%",
    maxHeight: "85%",
    borderRadius: 12,
    padding: 20,
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    width: "92%",
    maxHeight: "85%",
    borderRadius: 16,
    padding: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },

  btnFecharModal: {
    backgroundColor: "#1e2a38",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  txtBotao: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
  },

  statusModal: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  statusOption: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  cancelButton: {
    marginTop: 15,
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botoesPerfil: {
    gap: 8,
    alignItems: "flex-end",
  },

  botaoSair: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
});