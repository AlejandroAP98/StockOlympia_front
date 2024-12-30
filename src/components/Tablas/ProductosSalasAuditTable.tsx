
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { API_BASE_URL,  CATEGORIAS, MARCAS, SALAS_PRODUCTOS, SALAS} from '../Services/API.ts';
import Loader from '../Services/Loader.tsx';
import fetchComponent from '../Services/fetchComponent.ts';
import colores from '../../lib/ColoresBadge.ts';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/olympia.jpg';
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

  interface Sala {
    id: number | null;
    nombre: string | null;
    direccion: string;
    numero_maquinas: number | null;
    municipio: string;
  }


  const ProductosAudit = () => { 
      
      const { token, logout, id_rol} = useAuth();
      const [productos, setProductos] = useState<Producto[]>([]);
      const [sala, setSala] = useState<Sala | null>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [marcas, setMarcas] = useState<Marca[]>([]);
      const [categorias, setCategorias] = useState<Categoria[]>([]);
      const { id_sala } = useParams();
      const navigate = useNavigate();
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
            const data = await fetchComponent({ url: API_BASE_URL + SALAS_PRODUCTOS + '/' + id_sala, token });
            setProductos(data);
          } catch {
            setError("Error al cargar los productos. Por favor, intenta nuevamente.",);
          } finally {
            setLoading(false);
          }
        };

        const fetchSala = async () => {
          try {
            setLoading(true);
            const data = await fetchComponent({ url: API_BASE_URL + SALAS + '/' + id_sala, token });
            setSala(data);
          } catch {
            setError("Error al cargar la sala. Por favor, intenta nuevamente.",);
          } finally {
            setLoading(false);
          }
        };  

      fetchProductos();
      fetchMarcas();
      fetchCategorias();
      fetchSala();

    }, [token, id_sala]);

    const handleSearch = async (term: string) => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}${SALAS_PRODUCTOS}/${id_sala}/search?term=${term}`, {  
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

    const formatarPrecio = (precio: number | null) => {
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
          <span className='text-red-500 font-semibold text-xl text-center h-screen w-full'>
              {cantidad}
          </span>
         )
      }else if (cantidad < 10){
        return (
          <span className='text-yellow-500 font-semibold text-xl text-center h-screen w-full'>
              {cantidad}
          </span>
         )
      }else{
        return (
          <span className='text-green-500 font-semibold text-xl text-center h-screen w-full'>
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

    const regresarSala = () => {
      if(id_rol === 1) {
        navigate(`/admin`);
      }else{
        navigate(`/audit`);
      }
    };

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
      if (sortColumn === 'cantidad') {
        
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
        <div className="flex w-full pl-16 ">
          <aside className="flex flex-col z-20 left-0  h-screen hover:w-40 w-16 transition-width duration-300 group absolute dark:bg-backgroundColor-dark/90 bg-primary/70 hover:bg-primary hover:dark:bg-primary-dark dark:text-textColor-dark text-textColor-light dark:border-r-[1px] border-r-[1px] border-accent-light/10 ">
            <div className="flex flex-col items-center  h-full pt-8 ">
              <img src={logo} alt="Logo olympia casinos" className="w-auto absolute top-0 left-0" />
              <div className="relative mt-4 w-full h-full py-12">
                <button 
                  onClick={regresarSala}
                  className="flex items-center justify-between group-hover:justify-start w-full px-4 py-2 text-base dark:hover:bg-accent-dark hover:bg-accent-light/50 hover:dark:text-textColor-light"
                >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                  </svg>
                  <span className="ml-2 hidden group-hover:inline font-semibold">Regresar</span>
                </button>
              <div/>
              </div>
              <div className="relative mt-4 w-full bottom-0 ">
                <button 
                  onClick={logout}
                  className="flex items-center justify-between group-hover:justify-start w-full px-4 py-2 text-base dark:hover:bg-accent-dark hover:bg-accent-light/50 hover:dark:text-textColor-light"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="size-6"
                  >
                    <path d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 hidden group-hover:inline font-semibold">Salir</span>
                </button>
                </div>
            </div>
          </aside>
          <Card className="  dark:text-textColor-dark h-full  ">
              <div className="flex w-full p-4 ">
                  <h3 className="text-textColor-light dark:text-textColor-dark text-2xl font-bold text-center w-full uppercase">Productos {sala?.nombre}</h3>
              </div>
              <Table className="overflow-x-scroll max-h-[80vh] "> 
                  <TableHead className='bg-backgroundColor-table dark:!border-white border !border-black dark:bg-backgroundColor-dark dark:text-textColor-dark '>
                    <SearchBar onSearch={handleSearch} color='amber-300' />
                    <ValorTotalEntradasCard  sala={sala?.id ?? 0} year={new Date().getFullYear()} month={new Date().getMonth() + 1} />
                    <TableRow className="text-textColor-light dark:text-textColor-dark ">
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
                      <TableHeaderCell className='text-sm font-bold'>Precio und.</TableHeaderCell>
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
                          <TableRow key={producto.  id} className='text-sm'>
                              <TableCell className='text-pretty'>
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
                              <TableCell>
                                  {"$" + formatarPrecio(producto.precio)}
                              </TableCell>
                              <TableCell>
                                  {AlertStock(producto.cantidad)}
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </Card>
      </div>
    );
  };
  
  
  export default ProductosAudit;