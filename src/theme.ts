// Cores e medidas do protótipo, num lugar só. As telas importam daqui em vez de repetir "#0891b2".
// Se a identidade visual mudar, muda aqui e o app inteiro acompanha.
export const cores = {
    primaria: "#0891b2",        // ciano (botões, aba ativa)
    primariaEscura: "#0e7490",
    primariaClara: "#ecfeff",
    azul: "#2563eb",
    texto: "#111827",
    textoSecundario: "#6b7280",
    textoFraco: "#9ca3af",
    borda: "#e5e7eb",
    bordaClara: "#f3f4f6",
    branco: "#ffffff",
    perigo: "#dc2626",
    perigoClaro: "#fef2f2",
};

// Pares de cores para o LinearGradient (expo-linear-gradient).
export const gradientes = {
    fundo: ["#ecfeff", "#dbeafe"] as const,             // fundo de todas as telas
    marca: ["#06b6d4", "#2563eb"] as const,             // botões, logo, banner do aquário
    acaoSecundaria: ["#3b82f6", "#4f46e5"] as const,    // atalho "Ver espécies"
};

export const raio = {
    pequeno: 12,
    medio: 16,
    pilula: 999,
};

// Sombra leve dos cards. No Android a sombra vem do "elevation"; no iOS e na web, das propriedades shadow*.
export const sombra = {
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
};
