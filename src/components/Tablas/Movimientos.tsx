
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, MOVIMIENTOS} from '../Services/API.ts';
import fetchComponent from '../Services/fetchComponent.ts';
import Loader from '../Services/Loader';


import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';

interface Movimiento {
  id: number;
  id_sala: number;
  cantidad: number;
  tipo_movimiento: string;
  fecha_movimiento: string;
  nombre_producto: string;
}

const Movimientos = () => {
  const { token, sala } = useAuth();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coloresTipoMovimiento = {
    1: 'bg-green-500',
    2: 'bg-red-500',
  };

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        setLoading(true);
        const data = await fetchComponent({ url: API_BASE_URL + MOVIMIENTOS, token });
        setMovimientos(data);
      } catch {
        setError("Error al cargar los movimientos. Por favor, intenta nuevamente.",);
      } finally {
        setLoading(false);
      }
    };

    fetchMovimientos();
  }, [token]);


  if (loading) return <Loader />;
  if (error) return <div className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center h-screen w-full">{error}</div>;
  return (
    <Card className="  dark:text-textColor-dark h-full ">
      <div className="flex w-full px-10 ">
        <h3 className="text-textColor-light dark:text-textColor-dark text-xl font-bold text-center w-full uppercase">Movimientos</h3>
      </div>
      <Table className="overflow-x-scroll rounded-xl max-h-[85vh] ">
        <TableHead>
          <TableRow className="text-textColor-light dark:text-textColor-dark">
            <TableHeaderCell className='text-sm font-bold'>Fecha y Hora</TableHeaderCell>
            <TableHeaderCell className='text-sm font-bold'>Tipo</TableHeaderCell>
            <TableHeaderCell className='text-sm font-bold'>Producto</TableHeaderCell>
            <TableHeaderCell className='text-sm font-bold'>Cantidad</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="dark:text-textColor-dark text-black text-sm text-ellipsis overflow-hidden text-pretty font-[400] justify-center items-center">
          {movimientos.filter((movimiento) => movimiento.id_sala === sala).map((movimiento) => (
            <TableRow key={movimiento.id} >
              <TableCell className='text-pretty'>
                {movimiento.fecha_movimiento}
              </TableCell>
              <TableCell> 
                {movimiento.tipo_movimiento === 'entrada' ? (
                  <span className={`${coloresTipoMovimiento[1]} text-white rounded-full px-2 py-1 text-sm`}>
                    Entrada
                  </span>
                ) : (
                  <span className={`${coloresTipoMovimiento[2]} text-white rounded-full px-2 py-1 text-sm`}>
                    Salida
                  </span>
                )}
              </TableCell>
              <TableCell>
                {movimiento.nombre_producto}
              </TableCell>
              <TableCell>
                {movimiento.cantidad}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default Movimientos;