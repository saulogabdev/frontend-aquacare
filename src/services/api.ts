const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('A variável de ambiente EXPO_PUBLIC_API_URL não está definida.');
}

export const API_URL = apiUrl;