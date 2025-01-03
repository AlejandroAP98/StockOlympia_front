import { useState, useEffect } from "react";
import {API_BASE_URL, REPORTE, MOVIMIENTOS, PRODUCTOS, SALAS, CATEGORIAS, MARCAS} from "../Services/API.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import { utils, writeFile } from "xlsx";
import ProductosMovidos from '../Tablas/Reportes/ProductosMovidos.tsx'
import ProductosSinSalidas from '../Tablas/Reportes/ProductosSinSalidas.tsx'
import MovimientoProducto from '../Tablas/Reportes/MovimientoProducto.tsx'
import MovimientoEntradas from '../Tablas/Reportes/MovmientoEntradas.tsx'
import Charts from './Charts.tsx';
import Loader from "../Services/Loader.tsx";

interface Sala {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}
interface Marca {
  id: number;
  nombre: string;

}
interface ReporteProductosMovidos {
  nombre_producto: string ;
  total_movimientos: number | null;
  total_entradas: number | null ;
  total_salidas: number | null;
}

interface ReporteProductosSinSalidas {
  nombre_producto: string ;
  total_entradas: number | null;
  total_salidas: number | null;
}

interface ReporteMovimientoProducto {
  nombre_producto: string ;
  nombre_marca: string | null;
  nombre_categoria_producto: string | null;
  tipo_movimiento: string | null;
  cantidad: number | null;
  fecha_movimiento: string | null;
  nombre_sala: string | null,
}

interface ReporteMovimientoEntradas{
  nombre_producto: string ;
  nombre_marca: string | null;
  nombre_categoria_producto: string | null;
  cantidad: number | null;
  precio: number | null;
  valor_total: number | null;
  fecha_movimiento: string | null;
  nombre_sala: string | null,
}

interface RowData {
  [key: string]: string | number ; // Acepta claves de tipo string y valores de tipo string o number
}

interface ReporteProductos {
  sala: string;
  fecha: string;
  valor: number;
}


const Reportes = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const [tipo_reporte, setTipoReporte] = useState("movimiento-producto");
  const [salas, setSalas] = useState<Sala[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [salaId, setSalaId] = useState<number>();
  const [productoId, setProductoId] = useState<number>();
  const [categoriaId, setCategoriaId] = useState<number>();
  const [marcaId, setMarcaId] = useState<number>();
  const [dataExport, setDataExport] = useState<unknown[]>([]);
  const [reporteProductosMovidos, setReporteProductosMovidos] = useState<ReporteProductosMovidos[]>([]);
  const [reporteSinSalidas, setReporteSinSalidas] = useState<ReporteProductosSinSalidas[]>([]);
  const [reporteMovimiento, setReporteMovimiento] = useState<ReporteMovimientoProducto[]>([]);
  const [reporteMovimientoEntradas, setReporteMovimientoEntradas] = useState<ReporteMovimientoEntradas[]>([]);
  const [reporteProductos, setReporteProductos] = useState<ReporteProductos[]>([]);
  
  useEffect(() => {
    const fetchSala = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${SALAS}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Error al obtener las salas.");
        }
  
        const data = await response.json();
        setSalas(data); 
      } catch {
        setError("Error al obtener las salas.");
      }
    };
  
    const fetchProducto = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${PRODUCTOS}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Error al obtener los productos.");
        }
  
        const data = await response.json();
        setProductos(data); 
      } catch {
        setError("Error al obtener los productos.");
      }
    };
    const fetchCategoria = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${CATEGORIAS}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al obtener las categorias.");
        }
  
        const data = await response.json();
        setCategorias(data); 
      } catch {
        setError("Error al obtener las categorias.");
      }
    };
    const fetchMarca = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${MARCAS}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error al obtener las marcas.");
        }
  
        const data = await response.json();
        setMarcas(data); 
      } catch {
        setError("Error al obtener las marcas.");
      }
    }; 
    
    fetchCategoria();
    fetchMarca();
    fetchSala();
    fetchProducto();
  }, [token]);

  useEffect(() => {
    setReporteProductosMovidos([]);
    setReporteSinSalidas([]);
    setReporteMovimiento([]);
    setReporteMovimientoEntradas([]);
    setReporteProductos([]);
  }, [tipo_reporte, productoId, salaId, categoriaId, marcaId]);
  
  const obtenerReporte = async (tipo_reporte: string) => {
    if (!startDate || !endDate) {
      setError("Debes seleccionar una fecha de inicio y una fecha de fin.");
      return;
    }
    
    setLoading(true);
    setError("");
  
    try {
      let url = `${API_BASE_URL}${MOVIMIENTOS}${REPORTE}/${tipo_reporte}?startDate=${startDate}&endDate=${endDate}`;
      if (salaId) {
        url = `${url}&id_sala=${salaId}`;
      }
      if (productoId) {
        url = `${url}&id_producto=${productoId}`;
      }

      if (categoriaId) {
        url = `${url}&id_categoria=${categoriaId}`;
      }

      if (marcaId) {
        url = `${url}&id_marca=${marcaId}`;
      }


      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener el reporte.");
      }
  
      const data = await response.json();
      if(tipo_reporte === 'movimiento-producto'){
        setReporteProductosMovidos(data);
      }else if(tipo_reporte === 'productos-sin-salidas'){
        setReporteSinSalidas(data);
      }else if(tipo_reporte === 'historial-producto'){
        setReporteMovimiento(data);
      }else if(tipo_reporte === 'valor-entradas'){
        setReporteMovimientoEntradas(data);
      }else if(tipo_reporte === 'grafico-entradas-salas'){

        setReporteProductos(data);
      }
      setDataExport(data);
    } catch {
      setError("Error al obtener el reporte.");
    } finally {
      setLoading(false);
    }
  };
  

  const exportToExcel = (data: RowData[], filename: string) => {
    let nombreSala = "Todas las salas";
    if (salaId) {
      salas.map((sala) => {
        if (sala.id === salaId) {
          nombreSala = `${sala.nombre}`;
        }
      });
    }

    // Aseguramos que los valores numéricos sean tratados como números, no como texto
    const formattedData = data.map((row) => {
      const newRow = { ...row }; // Ahora TypeScript sabe que 'row' es un objeto con claves de tipo string y valores de tipo string o number
      // Recorremos cada propiedad de la fila para asegurarnos de convertir los valores a números
      Object.keys(newRow).forEach((key) => {
        if (typeof newRow[key] === 'string' && !key.toLowerCase().includes("fecha")) {
          const numericValue = parseFloat(newRow[key]);
          if (!isNaN(numericValue)) {
            newRow[key] = numericValue; 
          }
        }
        // Asegurarse de que las columnas de precio también sean tratadas como números
        if (key.toLowerCase().includes("precio") && typeof newRow[key] === 'string') {
          const numericPrice = parseFloat(newRow[key].replace(',', '.')); // Reemplazamos coma si es necesario
          if (!isNaN(numericPrice)) {
            newRow[key] = numericPrice; // Convertir el precio a número
          }
        }
      });
      return newRow;
    });

    const worksheet = utils.json_to_sheet([]);

    if (tipo_reporte === "movimiento-producto") {
      utils.sheet_add_aoa(worksheet, [["Producto", "Total Movimientos", "Total Entradas", "Total Salidas"]]);
    } else if (tipo_reporte === "productos-sin-salidas") {
      utils.sheet_add_aoa(worksheet, [["Producto", "Total Entradas", "Total Salidas"]]);
    } else if (tipo_reporte === "historial-producto") {
      utils.sheet_add_aoa(worksheet, [["Producto", "Categoría", "Marca" ,"Tipo Movimiento", "Cantidad", "Fecha Movimiento", "Sala"]]);
    } else if (tipo_reporte === "valor-entradas") {
      utils.sheet_add_aoa(worksheet, [["Producto", "Categoría", "Marca", "Movimiento", "Cantidad", "Precio Unidad", "Valor Total", "Fecha Movimiento", "Nombre Sala"]]);
    } else {
      const worksheet = utils.json_to_sheet(formattedData); // Usamos los datos formateados
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "Reporte");
      // Escribir archivo
      writeFile(workbook, `${filename}.xlsx`);
      return;
    }

    utils.sheet_add_json(worksheet, formattedData, { origin: "A2", skipHeader: true });
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, nombreSala);
    writeFile(workbook, `${filename}.xlsx`);
};



  const tipos_reporte = [
    {
      nombre: "Movimientos Producto",
      valor: "movimiento-producto",
    },
    {
      nombre: "Productos Sin Salidas",
      valor: "productos-sin-salidas",
    },
    {
      nombre:'Historial Movimientos Productos',
      valor:'historial-producto'
    },
    {
      nombre:'Valor Entradas',
      valor:'valor-entradas'
    },
    {
      nombre: "Gráfica Entradas",
      valor: "grafico-entradas-salas"
    }
    
  ];

  return (
    <div className="flex w-full flex-col h-screen gap-2 ">
      <div className="flex gap-2 rounded-lg items-end justify-center w-full flex-wrap bg-backgroundColor-table dark:bg-backgroundColor-dark dark:text-textColor-dark">
        <label className="text-textColor-light dark:text-textColor-dark font-semibold text-sm flex flex-col text-center ">
          Fecha Inicio *
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="dark:text-textColor-dark dark:bg-slate-700 text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg mx-2 text-sm "
          />
        </label >
        <label className="text-textColor-light dark:text-textColor-dark font-semibold text-sm flex flex-col text-center ">
          Fecha Fin *
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="dark:text-textColor-dark dark:bg-slate-700 text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg mx-2 text-sm  "
          />
        </label>
        <label className="text-textColor-light dark:text-textColor-dark font-semibold text-sm flex flex-col text-center ">
          Tipo de Reporte *
          <select
            name="tipo_reporte"
            value={tipo_reporte}
            onChange={(e) => setTipoReporte(e.target.value)}
            className="dark:text-textColor-dark dark:bg-slate-700 text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg mx-2 text-sm "
          >
            {tipos_reporte.map((tipo) => (
              <option key={tipo.valor} value={tipo.valor}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </label>
        {tipo_reporte === 'historial-producto' || tipo_reporte === 'valor-entradas' || tipo_reporte === 'grafico-entradas-salas' ? (
          <label className="text-textColor-light dark:text-textColor-dark font-semibold text-sm flex flex-col text-center ">
            Sala
            <select
              name="sala"
              onChange={(e) => setSalaId(Number(e.target.value)) }
              className="dark:text-textColor-dark dark:bg-slate-700 text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg mx-2 text-sm "
            >
              <option value="">Todas las salas</option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>
                  {sala.nombre}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {tipo_reporte !=='grafico-entradas-salas' ? (
          <label className="text-textColor-light dark:text-textColor-dark font-semibold text-sm flex flex-col text-center ">
            Producto
            <select
              name="producto"
              onChange={(e) => setProductoId(Number(e.target.value))}
              className="dark:text-textColor-dark dark:bg-slate-700 text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg mx-2 text-sm max-w-[200px]"
            >
              <option value="">Todos los productos</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.nombre}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {tipo_reporte === 'historial-producto' || tipo_reporte === 'valor-entradas' ? (
          <label className="text-textColor-light dark:text-textColor-dark font-semibold text-sm flex flex-col text-center">
            <span>Categoría</span>
            <select
               className="dark:text-textColor-dark dark:bg-slate-700 text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg mx-2 text-sm max-w-[200px]"
              value={categoriaId}
              onChange={(e) => setCategoriaId(Number(e.target.value))}
            >
              <option value="">Todas las categorias</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {tipo_reporte === 'historial-producto' || tipo_reporte === 'valor-entradas' ? (
          <label className="text-textColor-light dark:text-textColor-dark font-semibold text-sm flex flex-col text-center">
            <span>Marca</span>
            <select
               className="dark:text-textColor-dark dark:bg-slate-700 text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg mx-2 text-sm max-w-[200px]"
              value={marcaId}
              onChange={(e) => setMarcaId(Number(e.target.value))}
            >
              <option value="">Todas las marcas</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </label>
        ) : <div className="w-full"></div>}
        <div className="flex gap-2">
          <button onClick={() => obtenerReporte(tipo_reporte)} className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black  focus:border-amber-500 focus:ring-amber-500 rounded-lg border border-amber-400 px-2 py-2 hover:bg-amber-300  hover:text-white dark:hover:bg-amber-400 dark:hover:text-white text-sm"
            disabled={!startDate || !endDate}
            >
            Generar Reporte
          </button>
          <button
            onClick={() => exportToExcel(dataExport as RowData[], tipo_reporte)}
            className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black  focus:border-green-500 focus:ring-amber-500 rounded-lg border border-green-400 px-2 py-2 hover:bg-green-400  hover:text-white  dark:hover:text-white text-sm bg-green-500 dark:hover:bg-green-400 "
            disabled={!startDate || !endDate || tipo_reporte === 'grafico-entradas-salas' || loading}
            >
            <svg
                fill="#fff"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 50 50"
              >
              <path
                d="M28.8125 .03125L.8125 5.34375C.339844 5.433594 0 5.863281 0 6.34375L0 43.65625C0 44.136719 .339844 44.566406 .8125 44.65625L28.8125 49.96875C28.875 49.980469 28.9375 50 29 50C29.230469 50 29.445313 49.929688 29.625 49.78125C29.855469 49.589844 30 49.296875 30 49L30 1C30 .703125 29.855469 .410156 29.625 .21875C29.394531 .0273438 29.105469 -.0234375 28.8125 .03125ZM32 6L32 13L34 13L34 15L32 15L32 20L34 20L34 22L32 22L32 27L34 27L34 29L32 29L32 35L34 35L34 37L32 37L32 44L47 44C48.101563 44 49 43.101563 49 42L49 8C49 6.898438 48.101563 6 47 6ZM36 13L44 13L44 15L36 15ZM6.6875 15.6875L11.8125 15.6875L14.5 21.28125C14.710938 21.722656 14.898438 22.265625 15.0625 22.875L15.09375 22.875C15.199219 22.511719 15.402344 21.941406 15.6875 21.21875L18.65625 15.6875L23.34375 15.6875L17.75 24.9375L23.5 34.375L18.53125 34.375L15.28125 28.28125C15.160156 28.054688 15.035156 27.636719 14.90625 27.03125L14.875 27.03125C14.8125 27.316406 14.664063 27.761719 14.4375 28.34375L11.1875 34.375L6.1875 34.375L12.15625 25.03125ZM36 20L44 20L44 22L36 22ZM36 27L44 27L44 29L36 29ZM36 35L44 35L44 37L36 37Z"
                ></path>
              </svg>
          </button>
        </div>
        
      </div>
      {loading && <Loader />}
      {error && <p style={{ color: "red" }}>{error}</p>}
      { tipo_reporte === 'movimiento-producto' && reporteProductosMovidos.length > 0 ? (
          <ProductosMovidos reporteProductosMovidos={reporteProductosMovidos}/>
        ): tipo_reporte === 'productos-sin-salidas' && reporteSinSalidas.length > 0 ?(
          <ProductosSinSalidas reporteProductosSinSalidas={reporteSinSalidas}/>
        ) : tipo_reporte === 'historial-producto' && reporteMovimiento.length > 0 ?
          <MovimientoProducto reporteMovimientoProducto ={reporteMovimiento}/>
        : tipo_reporte === 'valor-entradas' && reporteMovimientoEntradas.length > 0 ?
          <MovimientoEntradas reporteMovimientoEntradas ={reporteMovimientoEntradas}/>
        : tipo_reporte === 'grafico-entradas-salas' && reporteProductos.length > 0 ?
          <Charts reporteProductos={reporteProductos}/>
        :(
          !loading && 
          <p className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center w-full flex justify-center items-center gap-2">
            No hay datos para mostrar 🎰
          </p>
      )
      }
    </div>
  );
};

export default Reportes;
