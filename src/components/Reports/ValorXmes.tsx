import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, SALAS_PRODUCTOS } from '../Services/API.ts';
import Money_bag from '../../assets/money-bag.png';

interface InputProps {
  sala: number  | null;
  year: number | null;
  month: number | null;
}

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const ValorTotalEntradasCard = ( { sala, year, month }: InputProps) => {
  const { token } = useAuth();
  const [valorTotal, setValorTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchValorTotal = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_BASE_URL}${SALAS_PRODUCTOS}/${sala}/valor-x-mes?id_sala=${sala}&year=${year}&month=${month}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        setValorTotal(data.valor_total);
      } catch {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (year && month) {
      fetchValorTotal();
    }
  }, [year, month, error,token, sala]);

  const formatearPrecio = (precio: number | null) => {
    if (precio !== null) {
      const precioSinDecimales = Math.floor(precio);
      return precioSinDecimales.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else {
      return 'Datos insuficientes';
    }
  };
  
  if(month === null || year === null){
    return (
      <span className="mt-2 text-gray-500">Error: Faltan parámetros</span>
    );
  }

  return (
    <div className="overflow-hidden dark:text-textColor-dark bg-amber-100/30 dark:bg-gray-400/20 absolute top-2 right-10  rounded-md flex flex-col justify-center px-4 py-2 border-[0.1px] border-black dark:border-white">
      <h1 className="text-sm font-medium text-textColor-light dark:text-textColor-dark z-10 ">
        Total ingresos en {meses[month - 1]} {year}
      </h1>
      {isLoading ? (
        <span className="mt-2 text-gray-500">Cargando...</span>
      ) : error ? (
        <span className="mt-2 text-red-500">{error}</span>
      ) : (
        <span className='flex justify-between items-center gap-2 relative'>
          <img src={Money_bag} alt="money-bag" className='w-[64px] h-[64px] absolute -z-1 -top-4 -left-4 opacity-80' />
          <span className="text-[22px] font-light text-black dark:text-textColor-dark text-end w-full">
            {formatearPrecio(valorTotal)}
          </span>
        </span>
      )}
    </div>
  );
};

export default ValorTotalEntradasCard;
