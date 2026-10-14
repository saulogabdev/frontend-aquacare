import { RegistroParametro, NovoRegistroParametro } from "@/types"
import { createContext, ReactNode, useContext, useState } from "react";

type RegistroContextType = {
    registros: RegistroParametro[];
    adicionarRegistro: (novoRegistro: NovoRegistroParametro) => void;
}

const RegistroContext = createContext<RegistroContextType | null>(null);

export function RegistroProvider({ children }: { children: ReactNode }) {
    const [registros, setRegistros] = useState<RegistroParametro[]>([]);

    function adicionarRegistro(novoRegistro: NovoRegistroParametro) {
        const registro: RegistroParametro = { ...novoRegistro, idParametro: Date.now() };
        setRegistros([...registros, registro]);
    }

    const value: RegistroContextType = {
        registros,
        adicionarRegistro
    };

    return (
        <RegistroContext.Provider value={value}>
            {children}
        </RegistroContext.Provider>
    );
}

export function useRegistroContext() {
    const contexto = useContext(RegistroContext);
    if (!contexto) {
        throw new Error("useRegistroContext deve ser usado dentro de um RegistroProvider");
    }
    return contexto;
}