import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';

const CHAVE_TOKEN = "aquacare.token";

export async function salvarToken(token: string): Promise<void> {
    if (Platform.OS === "web") {
        localStorage.setItem(CHAVE_TOKEN, token);
    } else {
        await SecureStore.setItemAsync(CHAVE_TOKEN, token);
    }
}

export async function obterToken(): Promise<string | null> {
    if (Platform.OS === "web") {
        return localStorage.getItem(CHAVE_TOKEN);
    } else {
        return await SecureStore.getItemAsync(CHAVE_TOKEN);
    }
}

export async function removerToken(): Promise<void> {
    if (Platform.OS === "web") {
        localStorage.removeItem(CHAVE_TOKEN);
    } else {
        await SecureStore.deleteItemAsync(CHAVE_TOKEN);
    }
}