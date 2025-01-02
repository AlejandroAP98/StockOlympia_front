// src/components/ReporteCard.tsx
import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

interface ReporteMovimientoEntradas{
  nombre_producto: string ;
  cantidad: number | null;
  precio: number | null;
  valor_total: number | null;
  fecha_movimiento: string | null;
  nombre_sala: string | null,
}

interface ReporteCardProps {
  reporteMovimientoEntradas: ReporteMovimientoEntradas[];
}

const formatearPrecio = (precio: number | null) => {
  if (precio) {
    const precioSinDecimales = Math.floor(precio);
    return precioSinDecimales.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } else {
    return 'No disponible';
  }
};


const ReporteCard = ({ reporteMovimientoEntradas }: ReporteCardProps) => {
  return (
    <Card className="dark:text-textColor-dark h-full">
      <Table className="overflow-x-scroll max-h-[70vh]">
        <TableHead className='bg-backgroundColor-table dark:!border-white border !border-black dark:bg-backgroundColor-dark dark:text-textColor-dark'>
          <TableRow className="text-textColor-light dark:text-textColor-dark">
            <TableHeaderCell>Producto</TableHeaderCell>
            <TableHeaderCell>Total Entradas</TableHeaderCell>
            <TableHeaderCell>Precio Unidad</TableHeaderCell>
            <TableHeaderCell>Valor Total</TableHeaderCell>
            <TableHeaderCell>Fecha Movimiento</TableHeaderCell>
            <TableHeaderCell>Nombre Sala</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="dark:text-textColor-dark text-black text-sm text-ellipsis overflow-hidden text-pretty font-[400] justify-center items-center border !border-black dark:!border-white">
          {reporteMovimientoEntradas.map((r) => (
            <TableRow key={r.nombre_producto}>
              <TableCell>{r.nombre_producto}</TableCell>
              <TableCell>{r.cantidad}</TableCell>
              <TableCell>$ {formatearPrecio(r.precio)}</TableCell>
              <TableCell>$ {formatearPrecio(r.valor_total)}</TableCell>
              <TableCell>{r.fecha_movimiento}</TableCell>
              <TableCell>{r.nombre_sala}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ReporteCard;
