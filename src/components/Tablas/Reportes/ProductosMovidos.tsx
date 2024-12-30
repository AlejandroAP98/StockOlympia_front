// src/components/ReporteCard.tsx
import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';

interface ReporteProductosMovidos {
  nombre_producto: string ;
  total_movimientos: number | null;
  total_entradas: number | null ;
  total_salidas: number | null;
}

interface ReporteCardProps {
  reporteProductosMovidos: ReporteProductosMovidos[];
}

const ReporteCard =  ({ reporteProductosMovidos }: ReporteCardProps) => {
  return (
    <Card className="dark:text-textColor-dark h-full">
      <Table className="overflow-x-scroll max-h-[70vh]">
        <TableHead className='bg-backgroundColor-table dark:!border-white border !border-black dark:bg-backgroundColor-dark dark:text-textColor-dark'>
          <TableRow className="text-textColor-light dark:text-textColor-dark">
            <TableHeaderCell>Producto</TableHeaderCell>
            <TableHeaderCell>Total Movimientos</TableHeaderCell>
            <TableHeaderCell>Total Entradas</TableHeaderCell>
            <TableHeaderCell>Total Salidas</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="dark:text-textColor-dark text-black text-sm text-ellipsis overflow-hidden text-pretty font-[400] justify-center items-center border !border-black dark:!border-white">
          {reporteProductosMovidos.map((r) => (
            <TableRow key={r.nombre_producto}>
              <TableCell>{r.nombre_producto}</TableCell>
              <TableCell>{r.total_movimientos}</TableCell>
              <TableCell>{r.total_entradas}</TableCell>
              <TableCell>{r.total_salidas}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ReporteCard;