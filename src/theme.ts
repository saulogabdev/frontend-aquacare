export const cores = {
    primaria: "#0891b2",
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

export const gradientes = {
    fundo: ["#ecfeff", "#dbeafe"] as const,
    marca: ["#06b6d4", "#2563eb"] as const,
    acaoSecundaria: ["#3b82f6", "#4f46e5"] as const,
};

export const raio = {
    pequeno: 12,
    medio: 16,
    pilula: 999,
};

// no android a sombra vem do elevation
export const sombra = {
    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
};
