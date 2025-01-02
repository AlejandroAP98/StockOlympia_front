import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, SALAS_PRODUCTOS,  CATEGORIAS, MARCAS, MOVIMIENTOS, SALAS} from '../Services/API.ts';
import { SalidaButton } from '../Buttons/ButtonsCrud.tsx';
import fetchComponent from '../Services/fetchComponent.ts';
import Loader from '../Services/Loader';
import Swal from 'sweetalert2';
import colores from '../../lib/ColoresBadge.ts';
import SearchBar from '../Services/SearchBar.tsx';
import ValorTotalEntradasCard from '../Reports/ValorXmes.tsx';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
}   from '@tremor/react';

interface Categoria {
  id: number;
  nombre: string;
}
interface Marca {
  id: number;
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string | null;
  cantidad: number;
  id_categoria: number | null;
  id_marca: number | null;
  precio: number | null;
  id_sala: number | null;
}

interface Movimiento {
  id_producto: number | null;
  id_sala: number | null;
  cantidad: number | 1;
  tipo_movimiento: string | null;
}

interface Sala {
  id: number;
  nombre: string;
}

const ProductosSalaTable = () => {
    
    const { token, sala } = useAuth();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [salas, setSalas] = useState<Sala | null>(null);

    const [, setMovimiento] = useState<Movimiento[]>([]);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  

  useEffect(() => {

    const fetchMarcas = async () => {
      try {
        setLoading(true);
        const data = await fetchComponent({ url: API_BASE_URL + MARCAS, token });
        setMarcas(data);
      } catch {
        setError("Error al cargar las marcas. Por favor, intenta nuevamente.",);
      } finally {
        setLoading(false);
      }
    };
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        const data = await fetchComponent({ url: API_BASE_URL + CATEGORIAS, token });
        setCategorias(data);
      } catch {
        setError("Error al cargar las categorias. Por favor, intenta nuevamente.",);
      } finally {
        setLoading(false);
      }
    };

    const fetchProductos = async () => {
      try {
        setLoading(true);
        const data = await fetchComponent({ url: API_BASE_URL + SALAS_PRODUCTOS + '/' + sala, token });
        setProductos(data); 
      } catch {
        setError("Error al cargar las salas. Por favor, intenta nuevamente.",);
      } finally {
        setLoading(false);
      }
    };

    const fetchSala = async () => {
      try {
        setLoading(true);
        const data = await fetchComponent({ url: API_BASE_URL + SALAS + '/' + sala, token });
        setSalas(data);
      } catch {
        setError("Error al cargar la sala. Por favor, intenta nuevamente.",);
      } finally {
        setLoading(false);
      }
    };

    fetchSala();
    fetchProductos();
    fetchMarcas();
    fetchCategorias();

  }, [token, sala]);

  const handleSearch = async (term: string) => {
        try {
          setLoading(true);
          const response = await fetch(`${API_BASE_URL}${SALAS_PRODUCTOS}/${sala}/search?term=${term}`, {  
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setProductos(data);
          } else {
            setError("No se pudieron obtener los productos.");
          }
        } catch {
          setError("Error al buscar productos.");
        } finally {
          setLoading(false);
        }
      };
  
  const handleSalida = async (producto: Producto) => {
    const { value: cantidad } = await Swal.fire({
      title: 'Cantidad de salida',
      input: 'number',
      inputLabel: `${producto.nombre}`,
      inputPlaceholder: 'Cantidad de salida de producto',
      inputAttributes: {
        min: '1',
      },
      showCancelButton: true,
      confirmButtonColor: '#d4af37',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    });
    
  
    if (cantidad) {
      try {
        const movimiento: Movimiento = {
          id_producto: producto.id,
          id_sala: sala,
          cantidad: parseInt(cantidad, 10),
          tipo_movimiento: 'salida',
        };
  
        const response = await fetch(`${API_BASE_URL}${MOVIMIENTOS}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(movimiento),
        });
  
        if (response.ok) {
          const createdMovimiento = await response.json();
          setMovimiento((prev) => [...prev, createdMovimiento]);
          setProductos((prevProductos) => 
            prevProductos.map((p) => 
              p.id === producto.id ? { ...p, cantidad: p.cantidad - parseInt(cantidad, 10) } : p
            )
          );
          Swal.fire(
            "Movimiento registrado",
            "La cantidad se ha ingresado correctamente",
            "success"
          );
        } else {
          Swal.fire(
            "Error al registrar el movimiento",
            "Intenta nuevamente",
            "error"
          );
        }
      } catch {
        Swal.fire("Error al registrar el movimiento", "Intenta nuevamente", "error");
      }
    }
  };
  
  const formatearPrecio = (precio: number | null) => {
    if (precio) {
      const precioSinDecimales = Math.floor(precio);
      return precioSinDecimales.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    } else {
      return 'No disponible';
    }
  };

  const AlertStock = (cantidad : number) => {
    if (cantidad < 5){
       return (
        <span className='text-red-500 font-semibold text-lg text-center h-screen w-full'>
            {cantidad}
        </span>
       )
    }else if (cantidad < 10){
      return (
        <span className='text-yellow-500 font-semibold text-lg text-center h-screen w-full'>
            {cantidad}
        </span>
       )
    }else{
      return (
        <span className='text-green-500 font-semibold text-lg text-center h-screen w-full'>
            {cantidad}
        </span>
       )
    }
  };
  
  const asignarColores = (items: { id: number; nombre: string }[]) => {
    const mapeo: { [id: number]: string } = {};
    items.forEach((item, index) => {
      mapeo[item.id] = colores[index % colores.length];
    });
    return mapeo;
  };

  const coloresCategorias = asignarColores(categorias);

  const handleSort = (column: string) => {
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };
  
  const sortedProductos = [...productos].sort((a, b) => {
    if (!sortColumn) return 0;
  
    const aValue = a[sortColumn as keyof Producto];
    const bValue = b[sortColumn as keyof Producto];
  
    // Asegúrate de convertir el valor a número si es el caso del precio
    if (sortColumn === 'precio') {
      const aPrice = parseFloat(aValue as unknown as string);
      const bPrice = parseFloat(bValue as unknown as string);
  
      // Compara los precios si ambos son números válidos
      if (!isNaN(aPrice) && !isNaN(bPrice)) {
        return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
      }
    }
  
    // Comparación normal para otros tipos de datos
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
  
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
  
    return 0;
  });

  if (loading) return <Loader />;
  if (error) return <div className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center h-screen w-full">{error}</div>;
  return (
    <Card className="  dark:text-textColor-dark h-full bg-white/70 ">
      <div className="flex w-full p-4 ">
        <h3 className="text-amber-400 dark:text-textColor-dark text-xl font-semibold text-center w-full uppercase">Productos {salas?.nombre}🎰</h3>
      </div>
      <Table className="overflow-x-scroll max-h-[85vh] ">
        <TableHead >
          <SearchBar onSearch={handleSearch} color='amber-300' />
          <ValorTotalEntradasCard sala={sala} year={new Date().getFullYear()} month={new Date().getMonth() + 1} />
          <TableRow className="text-textColor-light dark:text-textColor-dark border !border-black dark:!border-white">
            <TableHeaderCell
              className={`text-sm font-bold ${sortColumn === 'nombre' ? 'text-gray-900' : ''} cursor-pointer flex items-center space-x-1 relative`}
              onClick={() => handleSort('nombre')}
            >
              <span>Nombre</span>
              {sortColumn === 'nombre' && (
                sortOrder === 'asc' ? 
                  <div className='flex items-center h-0 absolute right-0 '>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                  : 
                  <div className='flex items-center h-0 absolute right-0'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>
                  </div>
              )}              
            </TableHeaderCell>
            <TableHeaderCell className='text-sm font-bold'>Categoria</TableHeaderCell>
            <TableHeaderCell className='text-sm font-bold'>Marca</TableHeaderCell>
            <TableHeaderCell className='text-sm font-bold'>Precio Und.</TableHeaderCell>
            <TableHeaderCell 
              className={`text-sm font-bold ${sortColumn === 'cantidad' ? 'text-gray-900' : ''} cursor-pointer flex items-center space-x-1 relative`}
              onClick={() => handleSort('cantidad')}
            >
              <span>Stock</span>
              {sortColumn === 'cantidad' && (
                sortOrder === 'asc' ? 
                  <div className='flex items-center h-0 absolute right-0 '>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                  : 
                  <div className='flex items-center h-0 absolute right-0'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>
                  </div>
              )}
            </TableHeaderCell>
            <TableHeaderCell className='text-sm font-bold'>Salida</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="dark:text-textColor-dark text-black text-lg text-ellipsis overflow-hidden text-pretty font-[400] justify-center items-center border !border-black dark:!border-white ">
            {sortedProductos.map((producto) => (
              <TableRow key={producto.id} className='dark:hover:bg-backgroundColor-tableUserDark/5 dark:hover:text-textColor-dark hover:bg-accent-light/5 hover:text-textColor-light dark:bg-tremor-content-strong/10 '>
                <TableCell className='text-pretty text-sm'>
                  {producto.nombre}
                </TableCell>
                <TableCell>
                  {producto.id_categoria ? (
                    <span className={`${coloresCategorias[producto.id_categoria]} text-white rounded-full px-2 py-1 text-sm`}>
                      {categorias.find((categoria) => categoria.id === producto.id_categoria)?.nombre}
                    </span>
                  ) : (
                    <span className="bg-gray-400 text-white rounded px-2 py-1 text-sm">Sin categoría</span>
                  )}
                </TableCell>
                <TableCell>
                  {producto.id_marca ? (
                    <span className="border border-gray-400 rounded px-2 py-1 text-sm">
                      {marcas.find((marca) => marca.id === producto.id_marca)?.nombre}
                    </span>
                  ) : (
                    <span className="bg-gray-400 text-white rounded px-2 py-1 text-sm">Sin marca</span>
                  )}
                </TableCell>
                <TableCell className='text-sm'>
                  {"$ " + formatearPrecio(producto.precio)}
                </TableCell>
                <TableCell>
                    {AlertStock(producto.cantidad)}
                </TableCell >
                <TableCell className='gap-4 flex items-center h-full w-fit '>
                  <SalidaButton onClick={() => handleSalida(producto)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    );
};


export default ProductosSalaTable;  