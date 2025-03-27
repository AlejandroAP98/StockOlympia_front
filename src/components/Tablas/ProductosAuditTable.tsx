import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { API_BASE_URL,  CATEGORIAS, MARCAS, PRODUCTOS} from '../Services/API.ts';
import Loader from '../Services/Loader.tsx';
import fetchComponent from '../Services/fetchComponent.ts';
import colores from '../../lib/ColoresBadge.ts';
import SearchBar from '../Services/SearchBar.tsx';

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

const ProductosAudit = () => {
    
    const { token} = useAuth();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
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
          const data = await fetchComponent({ url: API_BASE_URL + PRODUCTOS, token });
          setProductos(data);
        } catch {
          setError("Error al cargar los productos. Por favor, intenta nuevamente.",);
        } finally {
          setLoading(false);
        }
      };

    fetchProductos();
    fetchMarcas();
    fetchCategorias();

  }, [token]);

  const handleSearch = async (term: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${PRODUCTOS}/search?term=${term}`, {
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
  
  const formatearPrecio = (precio: number | null) => {
    if (precio !== null) {
      const precioSinDecimales = Math.floor(precio);
      return precioSinDecimales.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 });
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
  

    if (sortColumn === 'cantidad') {
      const aPrice = parseFloat(aValue as unknown as string);
      const bPrice = parseFloat(bValue as unknown as string);
  

      if (!isNaN(aPrice) && !isNaN(bPrice)) {
        return sortOrder === 'asc' ? aPrice - bPrice : bPrice - aPrice;
      }
    }
  

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
    <>
      <Card className="  dark:text-textColor-dark h-full ">
        <div className="flex w-full p-4 ">
            <h3 className="text-amber-300 dark:text-textColor-dark text-2xl font-bold text-center w-full uppercase ">Productos Totales</h3>
        </div>
        <Table className="overflow-x-scroll max-h-[85vh] "> 
            <TableHead>
                <SearchBar onSearch={handleSearch} tabla='auditoria' color='amber-300' />
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
                </TableRow>
            </TableHead>
            <TableBody className="dark:text-textColor-dark text-black text-lg text-ellipsis overflow-hidden text-pretty font-[400] justify-center items-center border !border-black dark:!border-white ">
                {sortedProductos.map((producto) => ( 
                    <TableRow key={producto.id} className='dark:hover:bg-backgroundColor-tableUserDark/5 dark:hover:text-textColor-dark hover:bg-accent-light/5 hover:text-textColor-light dark:bg-tremor-content-strong/10 '>
                        <TableCell className='text-pretty text-sm'>
                            {producto.nombre}
                        </TableCell>
                        <TableCell className='text-xs'>
                            {producto.id_categoria ? (
                                <span className={`${coloresCategorias[producto.id_categoria]} text-white rounded-full px-2 py-1 text-sm`}>
                                    {categorias.find((categoria) => categoria.id === producto.id_categoria)?.nombre}
                                </span>
                            ) : (
                                <span className="bg-gray-400 text-white rounded px-2 py-1 text-sm">Sin categoría</span>
                            )}
                        </TableCell>
                        <TableCell className='text-sm'>
                            {producto.id_marca ? (
                                <span className="border border-gray-400 rounded px-2 py-1 text-sm">
                                    {marcas.find((marca) => marca.id === producto.id_marca)?.nombre}
                                </span>
                            ) : (
                                <span className="bg-gray-400 text-white rounded px-2 py-1 text-sm">Sin marca</span>
                            )}
                        </TableCell>
                        <TableCell className='text-sm'>
                            {formatearPrecio(producto.precio)}
                        </TableCell>
                        <TableCell className='text-lg'>
                            {AlertStock(producto.cantidad)}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </Card>
    </>
  );
};


export default ProductosAudit;