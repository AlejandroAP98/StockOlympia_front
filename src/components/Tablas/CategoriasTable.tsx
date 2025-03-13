import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, CATEGORIAS } from '../Services/API.ts';
import fetchComponent from '../Services/fetchComponent.ts';
import Swal from 'sweetalert2';
import { EditButton, DeleteButton, AddButton, SaveButton, CancelButton, Input, InputFila } from '../Buttons/ButtonsCrud.js';
import Loader from '../Services/Loader';
import Post from './Post';
import SearchBar from '../Services/SearchBar';

import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}


export function CategoriasTable() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedCategoria, setEditedCategoria] = useState<Partial<Categoria>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoria, setNewCategoria] = useState<Partial<Categoria>>({
    nombre: '',
    descripcion: '',
  });
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchCategorias();
  }, [token]);

  const handleEdit = (categoria: Categoria) => {
    setEditingId(categoria.id);
    setEditedCategoria(categoria);
    setIsAdding(false);
    setNewCategoria({
      nombre: '',
      descripcion: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setEditedCategoria((prev) => ({ ...prev, [name]: name === 'descripcion' ? value.replace(/\n/g, '<br>') : value }));
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_BASE_URL}${CATEGORIAS}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedCategoria),
      });
      
      setCategorias((prevCategorias) =>
        prevCategorias.map((categoria) =>
          categoria.id === editingId ? { ...categoria, ...editedCategoria } : categoria
        )
      );
      setEditingId(null);
      Swal.fire("Los cambios se han guardado", "Intenta nuevamente", "success");
      setIsAdding(false);
      setNewCategoria({ nombre: '', descripcion: '' });
    } catch {
      Swal.fire("Error al guardar los cambios", "Intenta nuevamente", "error");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedCategoria({});
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de que deseas eliminar esta categoria?',
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
        await fetch(`${API_BASE_URL}${CATEGORIAS}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategorias(categorias.filter((categoria) => categoria.id !== id));
      } catch {
        Swal.fire("Error al eliminar la categoria", "Intenta nuevamente", "error");
      }
    }
  };

  const handleAddCategoria = async () => {
    try {
      const response = await Post(API_BASE_URL, CATEGORIAS, token, newCategoria);
      if (response) {
        setCategorias((prev) => [...prev, response]);
        setIsAdding(false);
        setNewCategoria({ nombre: '', descripcion: '' });
      } else {
        Swal.fire("Error al agregar la categoria", "Intenta nuevamente", "error");
      }
    } catch  {
      Swal.fire("Error al agregar la categoria", "Intenta nuevamente", "error");
    }
  };

  const handleSearch = async (term: string) => {
    try{
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${CATEGORIAS}/search?term=${term}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch {
      setError("Error al buscar categorias.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />; 
  if (error) return <div className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center w-full">{error}</div>;

  return (
    <Card className=" bg-backgroundColor-table dark:bg-backgroundColor-dark dark:text-textColor-dark max-w-[95vw] h-auto">                    
      <div className="flex w-full px-10 ">
        <h3 className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center w-full">Lista de Categorias</h3>
        <AddButton onClick={() => setIsAdding(true)} />
      </div>
      {isAdding && (
        <div className="mt-5 p-4 border rounded-xl bg-backgroundColor-light dark:bg-backgroundColor-dark dark:text-textColor-dark absolute w-[95%] z-20 left-5 top-0">
          <h4 className="text-lg font-semibold">Agrega una nueva categoria</h4>
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 mt-2 w-full ">
            <Input
              value={newCategoria.nombre}
              onChange={(e) => setNewCategoria({ ...newCategoria, nombre: e.target.value })}
              placeholder="Nombre"
              type="text"
              nombre='nombre'
            />
            <Input
              value={newCategoria.descripcion}
              onChange={(e) => setNewCategoria({ ...newCategoria, descripcion: e.target.value })}
              placeholder="Descripción"
              type="text"
              nombre='descripcion'
            />
          </div>
          <div className="flex justify-end gap-8 mt-2">
            <SaveButton onClick={handleAddCategoria} />
            <CancelButton onClick={() => setIsAdding(false)} />
          </div>
        </div>
      )}
      <Table className="bg-backgroundColor-table dark:bg-backgroundColor-dark max-h-[86vh] overflow-x-scroll">        
        <TableHead>
          <SearchBar onSearch={handleSearch} color='blue-400' />
          <TableRow className="text-textColor-light dark:text-textColor-dark">
            <TableHeaderCell className='text-lg font-bold'>Nombre</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Descripción</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="dark:text-textColor-dark text-black text-lg text-ellipsis overflow-hidden text-pretty font-[400] justify-center items-center">
          {categorias.map((categoria) => (
            <TableRow key={categoria.id} className='text-sm dark:hover:bg-backgroundColor-dark dark:hover:text-textColor-dark hover:bg-accent-light/5 hover:text-textColor-light dark:bg-tremor-content-strong/10'>
              <TableCell className='text-pretty'>
                {editingId === categoria.id ? (
                  <InputFila
                    value={editedCategoria.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    type="text"
                    nombre='nombre'
                  />
                ) : (
                  categoria.nombre
                )}
              </TableCell>
              <TableCell>
                {editingId === categoria.id ? (
                  <InputFila
                    value={editedCategoria.descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripción"
                    type="text"
                    nombre='descripcion'
                  />
                ) : (
                  categoria.descripcion
                )}
              </TableCell>
              <TableCell className='gap-4 flex items-center h-full w-fit'>
                {editingId === categoria.id ? (
                  <>
                    <SaveButton onClick={handleSave} />
                    <CancelButton onClick={handleCancel} />
                  </>
                ) : (
                  <>
                    <EditButton onClick={() => handleEdit(categoria)} />
                    <DeleteButton onClick={() => handleDelete(categoria.id)} />
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export default CategoriasTable;