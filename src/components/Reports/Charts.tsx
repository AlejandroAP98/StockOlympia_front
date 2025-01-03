import { AreaChart } from '@tremor/react';

interface ReporteCardProps {
  reporteProductos: ReporteProductos[];
}

interface ReporteProductos {
  sala: string;
  fecha: string;
  valor: number;
}

interface DatosProcesados {
  fecha: string;
  [key: string]: number | string; 
}

const ReporteCard = ({ reporteProductos }: ReporteCardProps) => {
  const datosProcesados = procesarDatos(reporteProductos);
  return (
    <div className="flex flex-col gap-2 justify-center items-center ">
        <AreaChart
            className="h-96 p-4 border font-medium text-xl rounded-lg bg-backgroundColor-light dark:bg-backgroundColor-dark dark:text-textColor-dark "
            data={datosProcesados}
            categories={[...new Set(datosProcesados.flatMap((r) => Object.keys(r).filter(key => key !== 'fecha')))]} 
            index="fecha"
            valueFormatter= {(value) => abreviarNumero(value as number)}
            colors={[ 'violet', 'green', 'yellow', 'orange', 'blue', 'red', 'pink', 'purple']}
            showLegend
            showTooltip
            
            
            />
    </div>
  );
};

const abreviarNumero = (numero: number): string => {
    if (numero >= 1_000_000) {
      return (numero / 1_000_000).toFixed(1) + 'M'; 
    } else if (numero >= 1_000) {
      return (numero / 1_000).toFixed(1) + 'K'; 
    } else {
      return numero.toString(); 
    }
  };
  

const procesarDatos = (datos: ReporteProductos[]): DatosProcesados[] => {
  const agrupados = datos.reduce((acumulador, actual) => {
    const clave = `${actual.fecha}`; // Usamos solo la fecha como clave para agrupar
    const sala = actual.sala;

    // Si no existe la fecha en el acumulador, la inicializamos
    if (!acumulador[clave]) {
      acumulador[clave] = { fecha: actual.fecha }; // Fecha inicializada correctamente
    }

    // Si la sala no existe para esa fecha, la inicializamos
    if (!acumulador[clave][sala]) {
      acumulador[clave][sala] = 0;
    }

    // Dividimos el valor por el punto y sumamos los valores separados
    const valores = actual.valor.toString().split('.'); // Dividir la cadena en valores individuales
    const sumaValor = valores.reduce((total, valor) => total + parseFloat(valor), 0); // Sumar los valores

    // Sumamos el valor procesado para esa sala
    acumulador[clave][sala] = (acumulador[clave][sala] as number) + sumaValor;

    return acumulador;
  }, {} as Record<string, DatosProcesados>); // Definimos el tipo correcto del acumulador

  // Convertimos el objeto en un array
  return Object.values(agrupados);
};

export default ReporteCard;
