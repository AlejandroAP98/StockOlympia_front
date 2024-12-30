import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, SALAS_PRODUCTOS } from '../Services/API.ts';

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
    if (precio) {
      const precioSinDecimales = Math.floor(precio);
      return precioSinDecimales.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else {
      return 'No disponible';
    }
  };
  
  if(month === null || year === null){
    return (
      <span className="mt-2 text-gray-500">Error: Faltan parámetros</span>
    );
  }

  return (
    <div className="dark:text-textColor-dark bg-backgroundColor-table dark:bg-backgroundColor-dark absolute top-0 right-5  rounded-xl flex flex-col justify-center items-center px-4 py-2">
      <h1 className="text-sm font-semibold text-textColor-light dark:text-textColor-dark ">
        Ingresos Mes {meses[month - 1]} {year}
      </h1>
      {isLoading ? (
        <span className="mt-2 text-gray-500">Cargando...</span>
      ) : error ? (
        <span className="mt-2 text-red-500">{error}</span>
      ) : (
        <span>
          <span className="text-xl font-semibold text-black dark:text-textColor-dark">
            $ {formatearPrecio(valorTotal)}
          </span>
        </span>
      )}
    </div>
  );
};

export default ValorTotalEntradasCard;
