import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: "#0891b2",
            tabBarInactiveTintColor: "#9ca3af"
        }}>
            <Tabs.Screen name="index" options={{title: "Dashboard"}}/>
            <Tabs.Screen name="parametros" options={{title: "Parâmetros"}}/>
            <Tabs.Screen name="especies" options={{title: "Espécies"}}/>
            <Tabs.Screen name="lembretes" options={{title: "Lembretes"}}/>
            <Tabs.Screen name="perfil" options={{title: "Perfil"}}/>
        </Tabs>
    );
}