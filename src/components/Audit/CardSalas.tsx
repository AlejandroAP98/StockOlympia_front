
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
                <div className="h-28 w-28 rounded-xl sm:m-2 sm:px-6 sm:py-4 flex flex-col justify-center items-center border  border-backgroundColor-tableUserDark dark:border-textColor-dark bg-backgroundColor-light hover:bg-backgroundColor-tableUser/50 dark:bg-slate-200 dark:hover:bg-slate-300 sm:w-full sm:h-auto sm:gap-1">
                    <h1 className="text-black sm:text-2xl font-bold text-center w-full uppercase sm:pb-4 text-sm">{sala.nombre}</h1>
                    <h3 className="text-textColor-light sm:text-sm text-center w-full uppercase text-[11px] ">{sala.direccion}</h3>
                    <h3 className="text-textColor-light sm:text-sm text-center w-full uppercase text-[11px]">{sala.numero_maquinas} Máquinas</h3>
                    <h3 className="text-textColor-light sm:text-sm font-semibold text-center w-full uppercase text-[11px]">{sala.municipio}</h3>
                </div>
            </button>
        </>
    );
}