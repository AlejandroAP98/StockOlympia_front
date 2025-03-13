import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, MARCAS } from '../Services/API.ts';
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

interface Marca {
  id: number;
  nombre: string;
  descripcion: string;
}


export function MarcasTable() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedMarca, setEditedMarca] = useState<Partial<Marca>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newMarca, setNewMarca] = useState<Partial<Marca>>({
    nombre: '',
    descripcion: '',
  });
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    fetchMarcas();
  }, [token]);

  const handleEdit = (marca: Marca) => {
    setEditingId(marca.id);
    setEditedMarca(marca);
    setIsAdding(false);
    setNewMarca({
      nombre: '',
      descripcion: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setEditedMarca((prev) => ({ ...prev, [name]: name === 'descripcion' ? value.replace(/\n/g, '<br>') : value }));
  };

  const handleSave = async () => {
    try {
        await fetch(`${API_BASE_URL}${MARCAS}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedMarca),
        });
        setMarcas((prevMarcas) =>
          prevMarcas.map((marca) =>
            marca.id === editingId ? { ...marca, ...editedMarca } : marca
          )
        );
        setEditingId(null);
        Swal.fire("Los cambios se han guardado", "Intenta nuevamente", "success");
        setIsAdding(false);
        setNewMarca({ nombre: '', descripcion: '' });
      } catch {
        Swal.fire("Error al guardar los cambios", "Intenta nuevamente", "error");
      } 
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedMarca({});
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de que deseas eliminar esta marca?',
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
        await fetch(`${API_BASE_URL}${MARCAS}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMarcas(marcas.filter((marca) => marca.id !== id));
      } catch {
        Swal.fire("Error al eliminar la marca", "Intenta nuevamente", "error");
      }
    }
  };

  const handleAddMarca = async () => {
    try {
      const response = await Post(API_BASE_URL, MARCAS, token, newMarca);
      if (response) {
        setMarcas((prev) => [...prev, response]);
        setIsAdding(false);
        setNewMarca({ nombre: '', descripcion: '' });
        Swal.fire("La marca se ha agregado", "Exitosamente", "success");
      } else {
        Swal.fire("Error al agregar la marca", "Intenta nuevamente", "error");
      }
    } catch  {
      Swal.fire("Error al agregar la marca", "Intenta nuevamente", "error");
    }
  };

  const handleSearch = async (term: string) => {
    try{
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${MARCAS}/search?term=${term}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMarcas(data);
      } else {
        setError("No se pudieron obtener las marcas.");
      }
    } catch {
      setError("Error al buscar marcas.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />; 
  if (error) return <div className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center w-full">{error}</div>;

  return (
    <Card className=" bg-backgroundColor-table dark:bg-backgroundColor-dark dark:text-textColor-dark max-w-[95vw] h-auto">                    
      <div className="flex w-full px-10 ">
        <h3 className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center w-full">Lista de Marcas</h3>
        <AddButton onClick={() => setIsAdding(true)} />
      </div>
      {isAdding && (
        <div className="mt-5 p-4 border rounded-xl bg-backgroundColor-light dark:bg-backgroundColor-dark dark:text-textColor-dark absolute w-[95%] z-20 left-5 top-0">
          <h4 className="text-lg font-semibold">Agrega una nueva marca</h4>
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 mt-2 w-full ">
            <Input
              value={newMarca.nombre}
              onChange={(e) => setNewMarca({ ...newMarca, nombre: e.target.value })}
              placeholder="Nombre"
              type="text"
              nombre='nombre'
            />
            <Input
              value={newMarca.descripcion}
              onChange={(e) => setNewMarca({ ...newMarca, descripcion: e.target.value })}
              placeholder="Descripción"
              type="text"
              nombre='descripcion'
            />
            </div>
            <div className="flex justify-end gap-8 mt-2">
                <SaveButton onClick={handleAddMarca} />
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
          {marcas.map((marca) => (
            <TableRow key={marca.id} className='text-sm dark:hover:bg-backgroundColor-dark dark:hover:text-textColor-dark hover:bg-accent-light/5 hover:text-textColor-light dark:bg-tremor-content-strong/10'>
              <TableCell className='text-pretty'>
                {editingId === marca.id ? (
                  <InputFila
                    value={editedMarca.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    type="text"
                    nombre='nombre'
                  />
                ) : (
                  marca.nombre
                )}
              </TableCell>
              <TableCell>
                {editingId === marca.id ? (
                  <InputFila
                    value={editedMarca.descripcion}
                    onChange={handleInputChange}
                    placeholder="Descripción"
                    type="text"
                    nombre='descripcion'
                  />
                ) : (
                  marca.descripcion
                )}
              </TableCell>
              <TableCell className='gap-4 flex items-center h-full w-fit'>
                {editingId === marca.id ? (
                  <>
                    <SaveButton onClick={handleSave} />
                    <CancelButton onClick={handleCancel} />
                  </>
                ) : (
                  <>
                    <EditButton onClick={() => handleEdit(marca)} />
                    <DeleteButton onClick={() => handleDelete(marca.id)} />
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

export default MarcasTable;