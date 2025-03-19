// src/components/ReporteCard.tsx
import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

interface ReporteMovimientoProducto {
  nombre_producto: string ;
  nombre_marca: string | null;
  nombre_categoria_producto: string | null;
  tipo_movimiento: string | null;
  cantidad: number | null;
  fecha_movimiento: string | null;
  nombre_sala: string | null,
  nombre_usuario: string | null,
}

interface ReporteCardProps {
  reporteMovimientoProducto: ReporteMovimientoProducto[];
}

const ReporteCard = ({ reporteMovimientoProducto }: ReporteCardProps) => {
  return (
    <Card className="dark:text-textColor-dark h-full">
          <Table className="overflow-x-scroll max-h-[70vh]">
            <TableHead className="bg-backgroundColor-table dark:!border-white border !border-black dark:bg-backgroundColor-dark dark:text-textColor-dark">
              <TableRow className="text-textColor-light dark:text-textColor-dark">
                <TableHeaderCell>Producto</TableHeaderCell>
                <TableHeaderCell>Marca</TableHeaderCell>
                <TableHeaderCell>Categoría</TableHeaderCell>
                <TableHeaderCell>Tipo Movimiento</TableHeaderCell>
                <TableHeaderCell>Cantidad</TableHeaderCell>
                <TableHeaderCell>Fecha Movimiento</TableHeaderCell>
                <TableHeaderCell>Sala</TableHeaderCell>
                <TableHeaderCell>Usuario</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody className="dark:text-textColor-dark text-black text-sm text-ellipsis overflow-hidden text-pretty font-[400] justify-center items-center border !border-black dark:!border-white">
              {reporteMovimientoProducto.map((movimiento) => (
                <TableRow key={movimiento.nombre_producto}>
                  <TableCell>{movimiento.nombre_producto}</TableCell>
                  <TableCell>{movimiento.nombre_marca}</TableCell>
                  <TableCell>{movimiento.nombre_categoria_producto}</TableCell>
                  <TableCell>{movimiento.tipo_movimiento}</TableCell>
                  <TableCell>{movimiento.cantidad}</TableCell>
                  <TableCell>{movimiento.fecha_movimiento}</TableCell>
                  <TableCell>{movimiento.nombre_sala}</TableCell>
                  <TableCell>{movimiento.nombre_usuario}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
  );
};

export default ReporteCard;
