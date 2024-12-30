
interface Sala {
    id: number;
    nombre: string;
    direccion: string;
    numero_maquinas: number | null;
    municipio: string;
}

interface InputProps {
    onClick: <T extends HTMLElement>(event: React.MouseEvent<T, MouseEvent>) => void;
    sala: Sala;
}

export default function CardSalas({ sala, onClick }: InputProps) {
    return (
        <>
            <button onClick={onClick} >
                <div className="h-auto w-auto rounded-xl m-2 px-6 py-4 flex flex-col justify-center items-center border  border-backgroundColor-tableUserDark dark:border-textColor-dark bg-backgroundColor-light hover:bg-backgroundColor-tableUser/50 dark:bg-slate-200 dark:hover:bg-slate-300">
                    <h1 className="text-black text-2xl font-bold text-center w-full uppercase pb-4">{sala.nombre}</h1>
                    <h3 className="text-textColor-light text-sm text-center w-full uppercase">{sala.direccion}</h3>
                    <h3 className="text-textColor-light text-sm text-center w-full uppercase">{sala.numero_maquinas} maquinas</h3>
                    <h3 className="text-textColor-light text-sm font-semibold text-center w-full uppercase">{sala.municipio}</h3>
                </div>
            </button>
        </>
    );
}