// src/utils/formatarData.ts

export function formatarData(dataString: string): string {
  if (!dataString) return "Data inválida";

  try {
    const data = new Date(dataString);
    
    // Tratamento manual básico caso o motor JS do celular ignore o 'pt-BR'
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Meses começam em 0
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return dataString; // Retorna o texto original caso falhe
  }
}