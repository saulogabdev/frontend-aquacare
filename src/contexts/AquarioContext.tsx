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
    { id: 1, nome: "Aquário Amazônico", litragem: 100, tipoAgua: "DOCE", nivelPlantas: "MEDIA", dataMontagem: "2023-01-01", isCiclado: true, injecaoCO2: false },
    { id: 2, nome: "Aquário de Corais", litragem: 60, tipoAgua: "MARINHO", nivelPlantas: "BAIXA", dataMontagem: "2023-01-01", isCiclado: false, injecaoCO2: false },
    { id: 3, nome: "Aquário de Plantas", litragem: 80, tipoAgua: "DOCE", nivelPlantas: "ALTA", dataMontagem: "2023-01-01", isCiclado: true, injecaoCO2: true },
];

export function AquarioProvider({ children }: { children: ReactNode }) {
    const [aquarios, setAquarios] = useState<Aquario[]>(aquariosIniciais);
    const [idSelecionado, setIdSelecionado] = useState(1);

    function adicionarAquario(novoAquario: NovoAquario) {
        const aquario: Aquario = {
            id: Date.now(), nome: novoAquario.nome,
            litragem: novoAquario.litragem,
            tipoAgua: novoAquario.tipoAgua,
            nivelPlantas: novoAquario.nivelPlanta,
            dataMontagem: new Date().toISOString(),
            isCiclado: novoAquario.isCiclado,
            injecaoCO2: novoAquario.injecaoCO2
        };
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