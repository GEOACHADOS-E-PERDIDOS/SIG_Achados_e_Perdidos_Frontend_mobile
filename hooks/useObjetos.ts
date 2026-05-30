import { useState, useEffect } from "react";
import {
    listarObjetos,
    buscarObjetos,
    deletarObjeto,
    buscarImagens
} from "../services/ObjetoPageService";
import { listarCategorias } from "../services/CategoriaService";
import { CategoriaOption } from "../types/Categoria";

export function useObjetos() {
    const [objetos, setObjetos] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
    const [loading, setLoading] = useState(true);

    const [buscarTermo, setBuscarTermo] = useState("");
    const [buscaData, setBuscaData] = useState("");
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaOption | null>(null);
    const [statusSelecionado, setStatusSelecionado] = useState("");

    const [objetoSelecionado, setObjetoSelecionado] = useState<any | null>(null);

    const statusOptions = [
        { value: "PERDIDO", label: "Perdido" },
        { value: "DISPONIVEL", label: "Disponível" },
        { value: "DEVOLVIDO", label: "Devolvido" },
        { value: "DESCARTADO", label: "Descartado" },
    ];

    const montarObjetoComImagens = async (obj: any) => {
        console.log(`📦 [HOOK] Objeto Bruto do Banco (ID: ${obj.id}):`, {
            nome: obj.nome,
            caminhosImagens: obj.caminhosImagens
        });

        const caminhos: string[] = obj.caminhosImagens ?? [];
        const imagens = caminhos.length > 0 ? await buscarImagens(caminhos) : [];

        console.log(`🖼️ [HOOK] Resultado após buscarImagens para ID ${obj.id}:`, imagens);

        return {
            ...obj,
            caminhosImagens: imagens,
        };
    };

    const carregarObjetos = async () => {
        try {
            setLoading(true);
            const data = await listarObjetos();
            const objs = await Promise.all(data.map((obj: any) => montarObjetoComImagens(obj)));
            setObjetos(objs);
        } catch (err) {
            console.error("Erro ao carregar objetos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = async () => {
        try {
            setLoading(true);
            const data = await buscarObjetos(
                buscarTermo,
                buscaData,
                categoriaSelecionada?.value,
                statusSelecionado
            );
            const objs = await Promise.all(data.map((obj: any) => montarObjetoComImagens(obj)));
            setObjetos(objs);
        } catch (err) {
            console.error("Erro ao buscar objetos:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLimpar = async () => {
        setBuscarTermo("");
        setBuscaData("");
        setCategoriaSelecionada(null);
        setStatusSelecionado("");
        await carregarObjetos();
    };

    const handleDelete = async (id: number) => {
        try {
            await deletarObjeto(id);
            setObjetos((prev) => prev.filter((obj) => obj.id !== id));
        } catch (err) {
            console.error("Erro ao deletar objeto:", err);
        }
    };

    useEffect(() => {
        carregarObjetos();
        listarCategorias()
            .then(setCategorias)
            .catch((err: any) => console.error("Erro ao carregar categorias:", err));
    }, []);

    return {
        objetos,
        categorias,
        loading,
        buscarTermo,
        setBuscarTermo,
        buscaData,
        setBuscaData,
        categoriaSelecionada,
        setCategoriaSelecionada,
        statusSelecionado,
        setStatusSelecionado,
        objetoSelecionado,
        setObjetoSelecionado,
        statusOptions,
        handleBuscar,
        handleLimpar,
        handleDelete,
    };
}