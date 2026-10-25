import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';

export async function salvarToken(token: string): Promise<void> {
    if (Platform.OS === "web") {
        localStorage.setItem("token", token);
    } else {
        await SecureStore.setItemAsync("token", token);
    }
}

export async function obterToken(): Promise<string | null> {
    if (Platform.OS === "web") {
        return localStorage.getItem("token");
    } else {
        return await SecureStore.getItemAsync("token");
    }
}

export async function removerToken(): Promise<void> {
    if (Platform.OS === "web") {
        localStorage.removeItem("token");
    } else {
        await SecureStore.deleteItemAsync("token");
    }
}