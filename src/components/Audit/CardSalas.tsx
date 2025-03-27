import Casino from '../../assets/casino.png';

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
                <div className="relative overflow-hidden h-auto w-auto sm:min-w-44 sm:min-h-44 sm:w-44 sm:h-44 max-w-44 max-h-44 rounded-md p-2 m-2  flex flex-col z-10 justify-between  border  border-backgroundColor-tableUserDark dark:border-textColor-dark bg-backgroundColor-light hover:bg-backgroundColor-tableUser/50 dark:bg-slate-200 dark:hover:bg-slate-300 ">
                    <img src={Casino} alt="casino" className="w-14 h-14 absolute bottom-0 -left-0 -z-10 opacity-10" />
                    <h1 className="text-black sm:text-2xl font-bold text-center  uppercase  w-full overflow-y-auto h-full text-ellipsis ">{sala.nombre}</h1>
                    <div>
                        <h3 className="text-textColor-light sm:text-sm text-center uppercase text-[11px] ">{sala.direccion}</h3>
                        <h3 className="text-textColor-light sm:text-xs text-center uppercase text-[11px]">{sala.numero_maquinas} Máquinas</h3>
                        <h3 className="text-textColor-light sm:text-xs font-semibold text-center uppercase text-[11px]">{sala.municipio}</h3>
                    </div>
                </div>
            </button>
        </>
    );
}