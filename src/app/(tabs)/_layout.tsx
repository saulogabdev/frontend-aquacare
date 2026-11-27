import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Cabecalho from "@/components/Cabecalho";
import { cores } from "@/theme";
import { useSincronizarLembretesAoAbrir } from "@/hooks/useLembretes";

type NomeIcone = keyof typeof Ionicons.glyphMap;

function icone(cheio: NomeIcone, contorno: NomeIcone) {
    function IconeAba({ size, focused }: { size: number; focused: boolean }) {
        return <Ionicons name={focused ? cheio : contorno} size={size} color={focused ? cores.primaria : cores.textoFraco} />;
    }
    return IconeAba;
}

export default function TabLayout() {
    // reagenda as notificacoes dos lembretes ao entrar
    useSincronizarLembretesAoAbrir();

    return (
        <Tabs
            screenOptions={{
                header: () => <Cabecalho />,
                tabBarActiveTintColor: cores.primaria,
                tabBarInactiveTintColor: cores.textoFraco,
                tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
                tabBarStyle: { borderTopColor: cores.bordaClara },
            }}
        >
            <Tabs.Screen name="index" options={{ title: "Dashboard", tabBarIcon: icone("grid", "grid-outline") }} />
            <Tabs.Screen name="parametros" options={{ title: "Parâmetros", tabBarIcon: icone("water", "water-outline") }} />
            <Tabs.Screen name="especies" options={{ title: "Espécies", tabBarIcon: icone("fish", "fish-outline") }} />
            <Tabs.Screen name="lembretes" options={{ title: "Lembretes", tabBarIcon: icone("notifications", "notifications-outline") }} />
            <Tabs.Screen name="perfil" options={{ title: "Perfil", tabBarIcon: icone("person", "person-outline") }} />
        </Tabs>
    );
}
