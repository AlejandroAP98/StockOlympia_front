import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, PRODUCTOS, CATEGORIAS, MARCAS, MOVIMIENTOS } from '../Services/API.ts';
import fetchComponent from '../Services/fetchComponent.ts';
import Swal from 'sweetalert2';
import { EditButton, DeleteButton, AddButton, SaveButton, CancelButton, Input, InputFila, IngresarButton } from '../Buttons/ButtonsCrud.js';
import Loader from '../Services/Loader';
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
interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
  id_categoria: number | null;
  id_marca: number | null;
  precio: number | null;
}
interface Categoria {
  id: number;
  nombre: string;
}
interface Marca {
  id: number;
  nombre: string;
}
interface Movimiento {
  id_producto: number | null;
  id_sala: number | null;
  cantidad: number | 1;
  tipo_movimiento: string | null;
}


const ProductosTable = () => {
    
    const { token, id_rol, sala } = useAuth();
    const [productos, setProductos] = useState<Producto[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [movimiento, setMovimiento] = useState<Movimiento[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedProducto, setEditedProducto] = useState<Partial<Producto>>({});
    const [isAdding, setIsAdding] = useState(false);
    const [newProducto, setNewProducto] = useState<Partial<Producto>>({ nombre: "", cantidad: 0, id_categoria: null, id_marca: null, precio: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


    useEffect(() => {
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
    

    const handleEdit = (producto: Producto) => {
      setEditingId(producto.id);
      setEditedProducto(producto);
      setIsAdding(false);
      setNewProducto({
        nombre: "",
        cantidad: 0,
        id_categoria: null,
        id_marca: null,
        precio: null,
      });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setEditedProducto((prev) => ({ ...prev, [name]: value }));
    };
    

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${PRODUCTOS}/${editingId}`, {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedProducto)
      });
      if (response.ok) {
        setProductos((prevProductos) =>
          prevProductos.map((producto) =>
            producto.id === editingId ? { ...producto, ...editedProducto } : producto
          )
        );
        setIsAdding(false);
        setNewProducto({ nombre: "", cantidad: 0, id_categoria: null, id_marca: null, precio: null });
        setEditingId(null);
        Swal.fire("Los cambios se han guardado", "Exitosamente", "success");
      } else {
        Swal.fire("Error al guardar los cambios", "Intenta nuevamente", "error");
      }
    } catch  {
      Swal.fire("Error al guardar los cambios", "Intenta nuevamente", "error");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProducto({});
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de que deseas eliminar este producto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d4af37',
      cancelButtonColor: '#1d1d1d',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}${PRODUCTOS}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setProductos(productos.filter((producto) => producto.id !== id));
          Swal.fire("Producto eliminado", "Exitosamente", "success");
        }
      } catch {
        Swal.fire("Error al eliminar el producto", "Intenta nuevamente", "error");
      }
    }
  };



  const handleNewProductoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProducto((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProducto = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${PRODUCTOS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProducto),
      });
      if (response.ok) {
        const createdProducto = await response.json();
        setProductos((prev) => [...prev, createdProducto]);
        setIsAdding(false);
        setNewProducto({ nombre: "", cantidad: 0, id_categoria: null, id_marca: null, precio: null });
        Swal.fire("Producto agregado", "Exitosamente", "success");
      } else {
        Swal.fire("Error al agregar el producto", "Intenta nuevamente", "error");
      }
    } catch  {
      Swal.fire("Error al agregar el producto", "Intenta nuevamente", "error");
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



  const handleIngresar = async (producto: Producto) => {

    const { value: cantidad } = await Swal.fire({
      title: 'Cantidad de ingreso',
      input: 'number',
      inputLabel: `${producto.nombre}`,
      inputPlaceholder: 'Cantidad de ingreso de producto',
      inputAttributes: {
        min: '1',
      },
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    });
  
    if (cantidad) {
      try {
        const movimiento: Movimiento = {
          id_producto: producto.id,
          id_sala: sala,
          cantidad: parseInt(cantidad, 10),
          tipo_movimiento: 'entrada',
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
          Swal.fire("Movimiento registrado", "La cantidad se ha ingresado correctamente", "success");
        } else {
          Swal.fire("Error al registrar el movimiento", "Intenta nuevamente", "error");
        }
      } catch {
        Swal.fire("Error al registrar el movimiento", "Intenta nuevamente", "error");
      }
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
    <Card className=" bg-backgroundColor-table dark:bg-backgroundColor-dark dark:text-textColor-dark h-full ">                    
      <div className="flex w-full p-4">
        {id_rol === 1 &&
          <>
            <h3 className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center w-full">Lista de Productos</h3>
            <AddButton onClick={() => setIsAdding(true)} />
          </>
        }
        {id_rol === 2 &&
          <>
            <h3 className="text-green-400 dark:text-textColor-dark font-semibold text-xl text-center uppercase w-full">Ingreso de Productos Existentes</h3> 
          </>
        }
      </div>
      {isAdding && (
        <div className="mt-5 p-4 border rounded-xl bg-backgroundColor-light dark:bg-backgroundColor-dark dark:text-textColor-dark absolute w-[95%] z-20 left-5 top-0">                    
          <h4 className="text-lg font-semibold">Agrega un nuevo producto</h4>
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 mt-2 w-full ">
            <Input
              value={newProducto.nombre || ''}
              onChange={(e) => setNewProducto({ ...newProducto, nombre: e.target.value })}
              placeholder="Nombre"
              type="text"
            />
            <Input
              value={newProducto.precio?.toString()}
              onChange={(e) => setNewProducto({ ...newProducto, precio: parseInt(e.target.value) })}
              placeholder="Precio"
              type="number"
            />
            <select
              name="id_categoria"
              value={newProducto.id_categoria || ''}
              onChange={handleNewProductoChange}
              className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg " >
              <option value="">Selecciona una categoria</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
              ))}
            </select>
            <select
              name="id_marca"
              value={newProducto.id_marca || ''}
              onChange={handleNewProductoChange}
              className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg " >
              <option value="">Selecciona una marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>{marca.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-8 mt-2">
            <SaveButton onClick={handleAddProducto} />
            <CancelButton onClick={() => setIsAdding(false)} />
          </div>
        </div>
      )}
      <Table className="bg-backgroundColor-table dark:bg-backgroundColor-dark  max-h-[85vh] overflow-x-scroll">
        <TableHead>
        <SearchBar onSearch={handleSearch} color='green-400' />
          <TableRow className="text-textColor-light dark:text-textColor-dark border !border-black dark:!border-white ">
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
            <TableHeaderCell
              className={`text-sm font-bold ${sortColumn === 'precio' ? 'text-gray-900' : ''} cursor-pointer flex items-center space-x-1 relative`}
              onClick={() => handleSort('precio')}
            >
              <span>Precio</span>
              {sortColumn === 'precio' && (
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
            <TableHeaderCell className='text-sm font-bold'>{id_rol ===1 ? 'Acciones' : 'Ingresar'}</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="dark:text-textColor-dark text-black text-lg text-ellipsis overflow-hidden text-pretty font-[400] justify-center items-center border !border-black dark:!border-white ">
          {sortedProductos.map((producto) => (
            <TableRow key={producto.id} className='dark:hover:bg-backgroundColor-dark dark:hover:text-textColor-dark hover:bg-accent-light/5 hover:text-textColor-light dark:bg-tremor-content-strong/10'>                      
              <TableCell className='text-pretty text-sm'>                  
                {editingId === producto.id ? (
                  <InputFila
                    value={editedProducto.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    type='text'
                    nombre='nombre'
                  />
                ) : (
                  producto.nombre
                )}
              </TableCell>
              <TableCell>
                {editingId === producto.id ? (                  
                  <select
                    name='id_categoria'
                    value={editedProducto.id_categoria || ''}
                    onChange={handleInputChange}
                    className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg w-fit " >
                    <option value="">Selecciona...</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                    ))}
                  </select>
                ) : (
                  producto.id_categoria ? (
                    <span className={`${coloresCategorias[producto.id_categoria]} text-white rounded-full px-2 py-1 text-sm`}>
                      {categorias.find((categoria) => categoria.id === producto.id_categoria)?.nombre}
                    </span>
                  ) : (
                    <span className="bg-gray-400 text-white rounded px-2 py-1 text-sm">Sin categoría</span>
                  )
                )}
              </TableCell>
              <TableCell>
                {editingId === producto.id ? (                  
                  <select
                    name='id_marca'
                    value={editedProducto.id_marca || ''}
                    onChange={handleInputChange}
                    className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg w-fit " >
                    <option value="">Selecciona...</option>
                    {marcas.map((marca) => (
                      <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                    ))}
                  </select>
                ) : (
                  producto.id_marca ? (
                    <span className="border border-gray-400 rounded px-2 py-1 text-sm">
                      {marcas.find((marca) => marca.id === producto.id_marca)?.nombre}
                    </span>
                  ) : (
                    <span className="bg-gray-400 text-white rounded px-2 py-1 text-sm">Sin marca</span>
                  )
                )}
              </TableCell>
              <TableCell className='text-sm'>
                {editingId === producto.id ? (
                  <InputFila
                    value={editedProducto.precio?.toString()}
                    onChange={handleInputChange}
                    placeholder="Precio"
                    type="number"
                    nombre='precio'
                  />
                ) : (
                  "$" + formatarPrecio(producto.precio)
                )}
              </TableCell>
              <TableCell className='gap-4 flex items-center h-full w-fit '>
                {editingId === producto.id ? (                  
                  <>
                    <SaveButton onClick={handleSave} />
                    <CancelButton onClick={handleCancel} />
                  </>
                ) : (
                  <>
                    {id_rol === 1 ? (
                    <>
                      <EditButton onClick={() => handleEdit(producto)} />
                      <DeleteButton onClick={() => handleDelete(producto.id)} />  
                    </>
                    ) : (
                      <IngresarButton onClick={() => handleIngresar(producto)} />
                    )}
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Card>
    );
};


export default ProductosTable;


 

