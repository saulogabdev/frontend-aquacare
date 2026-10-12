import { Aquario, NovoAquario } from "@/types";
import { createContext, useState, ReactNode, useContext } from "react";

type AquarioContextType = {
    aquarios: Aquario[];
    idSelecionado: number;
    adicionarAquario: (novoAquario: NovoAquario) => void;
    selecionarAquario: (idAquario: number) => void;
}

const AquarioContext = createContext<AquarioContextType | null>(null);

const aquariosIniciais: Aquario[] = [
  { idAquario: 1, nome: "Aquário Amazônico", litragem: 100, tipoAgua: "DOCE", nivelPlanta: "MEDIO", dataMontagem: "2023-01-01", isCiclado: true, injecaoCO2: false },
  { idAquario: 2, nome: "Aquário de Corais", litragem: 60, tipoAgua: "MARINHO", nivelPlanta: "BAIXO", dataMontagem: "2023-01-01", isCiclado: false, injecaoCO2: false },
  { idAquario: 3, nome: "Aquário de Plantas", litragem: 80, tipoAgua: "DOCE", nivelPlanta: "ALTO", dataMontagem: "2023-01-01", isCiclado: true, injecaoCO2: true },
];

export function AquarioProvider({ children }: { children: ReactNode }) {
    const [aquarios, setAquarios] = useState<Aquario[]>(aquariosIniciais);
    const [idSelecionado, setIdSelecionado] = useState(1);

    function adicionarAquario(novoAquario: NovoAquario) {
        const aquario: Aquario = { ...novoAquario, idAquario: Date.now() };
        setAquarios([...aquarios, aquario]);
    }

    function selecionarAquario(idAquario: number) {
        setIdSelecionado(idAquario);
    }

    const value: AquarioContextType = {
        aquarios,
        idSelecionado,
        adicionarAquario,
        selecionarAquario
    };

    return (
        <AquarioContext.Provider value={value}>
            {children}
        </AquarioContext.Provider>
    );
}

export function useAquarioContext() {
    const contexto = useContext(AquarioContext);
    if (contexto === null) {
        throw new Error("useAquarioContext deve ser usado dentro de um AquarioProvider");
    }
    return contexto;
}