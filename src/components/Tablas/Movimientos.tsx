import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, MOVIMIENTOS, SALAS } from '../Services/API.ts';
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
  nombre_usuario: string;
  tipo_movimiento: string;
  fecha_movimiento: string;
  nombre_producto: string;
}

interface Sala {
  id: number;
  nombre: string;
}

const Movimientos = () => {
  const { token, sala, id_rol } = useAuth();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [salaSeleccionada, setSalaSeleccionada] = useState<string>('all');

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
        setError('Error al cargar los movimientos. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    const fetchSalas = async () => {
      try {
        setLoading(true);
        const data = await fetchComponent({ url: API_BASE_URL + SALAS, token });
        setSalas(data);
      } catch {
        setError('Error al cargar las salas. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    console.log(movimientos);
    console.log(salas);
    fetchSalas();
    fetchMovimientos();
  }, [token]);

  const filtrarPorFecha = (movimiento: Movimiento) => {
    if (!fechaInicio && !fechaFin) return true;
  
    const [fecha] = movimiento.fecha_movimiento.split(', ');
    const [dia, mes, año] = fecha.split('/').map(Number);
    const fechaMovimiento = new Date(año, mes - 1, dia);
  
    // Ajustamos las horas para inicio y fin
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    if (inicio) inicio.setHours(23, 59, 59, 999); // Inicio del día
  
    const fin = fechaFin ? new Date(fechaFin) : null;
    if (fin) fin.setHours(47, 59, 59, 999); // Fin del día  
    if (inicio && fechaMovimiento < inicio) return false;
    if (fin && fechaMovimiento > fin) return false;
    return true;
  };

  const filtrarPorSala = (movimiento: Movimiento) => {
    if (salaSeleccionada === 'all') return true;
    if (salaSeleccionada === String(movimiento.id_sala)) return Number(salaSeleccionada) === movimiento.id_sala;
  };
  
   
  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center h-screen w-full">
        {error}
      </div>
    );
  return (
    <Card className="dark:text-textColor-dark h-full">
      <div className="flex flex-col w-full ">
        <h3 className="text-textColor-light dark:text-textColor-dark text-xl font-bold text-center w-full uppercase">
          Movimientos
        </h3>
        <div className="flex gap-4 justify-center items-center">
          <label className="block text-sm font-semibold dark:text-textColor-dark">
            Fecha Inicio
          </label>
          <input
            type="date"
            className="border p-2 focus:border-amber-500 focus:ring-amber-500 rounded-lg dark:bg-gray-800 dark:text-textColor-dark"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <label className="block text-sm font-semibold dark:text-textColor-dark">
            Fecha Fin
          </label>
          <input
            type="date"
            className="border p-2 focus:border-amber-500 focus:ring-amber-500 rounded-lg dark:bg-gray-800 dark:text-textColor-dark"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          {id_rol !== 2  && (
            <label className="block text-sm font-semibold dark:text-textColor-dark">
              Sala
            </label>
          )}
          {id_rol !== 2 && (
            <select
              name="sala"
              onChange={(e) => setSalaSeleccionada(e.target.value)}
              className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg w-fit"
            >
              <option value="all">Todas las salas</option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <Table className="overflow-x-scroll rounded-xl max-h-[85vh]">
        <TableHead>
          <TableRow className="text-textColor-light dark:text-textColor-dark">
            <TableHeaderCell className="text-sm font-bold">Sala</TableHeaderCell>
            <TableHeaderCell className="text-sm font-bold">Usuario</TableHeaderCell>
            <TableHeaderCell className="text-sm font-bold">Fecha y Hora</TableHeaderCell>
            <TableHeaderCell className="text-sm font-bold">Tipo</TableHeaderCell>
            <TableHeaderCell className="text-sm font-bold">Producto</TableHeaderCell>
            <TableHeaderCell className="text-sm font-bold">Cantidad</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="dark:text-textColor-dark text-black text-sm font-[400] justify-center items-center">
          {movimientos
            .filter((movimiento) => (id_rol === 2  ? movimiento.id_sala === sala : true))
            .filter(filtrarPorFecha)
            .filter(filtrarPorSala)
            .map((movimiento) => (
              <TableRow key={movimiento.id}>
                <TableCell>
                  {salas.find((sala) => sala.id === movimiento.id_sala)?.nombre}
                </TableCell>
                <TableCell className="text-pretty">{(movimiento.nombre_usuario)}</TableCell>
                <TableCell className="text-pretty">{(movimiento.fecha_movimiento)}</TableCell>
                <TableCell>
                  {movimiento.tipo_movimiento === 'entrada' ? (
                    <span
                      className={`${coloresTipoMovimiento[1]} text-white rounded-full px-2 py-1 text-sm`}
                    >
                      Entrada
                    </span>
                  ) : (
                    <span
                      className={`${coloresTipoMovimiento[2]} text-white rounded-full px-2 py-1 text-sm`}
                    >
                      Salida
                    </span>
                  )}
                </TableCell>
                <TableCell>{movimiento.nombre_producto}</TableCell>
                <TableCell>{movimiento.cantidad}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default Movimientos;
