import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, SALAS } from '../Services/API.ts';
import fetchComponent from '../Services/fetchComponent.ts';
import { EditButton, DeleteButton, AddButton } from '../Buttons/ButtonsCrud.tsx';
import { Input, SaveButton, CancelButton } from '../Buttons/ButtonsCrud.tsx';
import Swal from 'sweetalert2';
import { Card, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@tremor/react';
import Loader from '../Services/Loader';


interface Sala {
  id: number;
  nombre: string;
  direccion: string;
  numero_maquinas: number | null;
  municipio: string;
}

export function SalaTable() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedSala, setEditedSala] = useState<Partial<Sala>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newSala, setNewSala] = useState<Partial<Sala>>({
    nombre: '',
    direccion: '',
    numero_maquinas: null,
    municipio: '',
  });
  const { token } = useAuth();

  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchSalas = async () => {
      try {
        setLoading(true);
        const data = await fetchComponent({ url: API_BASE_URL + SALAS, token });
        setSalas(data);
      } catch {
        setError("Error al cargar las salas. Por favor, intenta nuevamente.",);
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
  }, [token]);

  const handleEdit = (sala: Sala) => {
    setEditingId(sala.id);
    setEditedSala(sala);
    setIsAdding(false);
    setNewSala({
      nombre: '',
      direccion: '',
      numero_maquinas: null,
      municipio: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedSala((prev) => ({ ...prev, [name]: name === 'numero_maquinas' ? parseInt(value) : value }));
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_BASE_URL}${SALAS}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedSala),
      });
      setSalas((prevSalas) =>
        prevSalas.map((sala) =>
          sala.id === editingId ? { ...sala, ...editedSala } : sala
        )
      );
      setEditingId(null);
    } catch {
      Swal.fire("Error al guardar los cambios", "Intenta nuevamente", "error");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedSala({});
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de que deseas eliminar esta sala?',
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
        await fetch(`${API_BASE_URL}${SALAS}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSalas(salas.filter((sala) => sala.id !== id));
      } catch {
        Swal.fire("Error al eliminar la sala", "Intenta nuevamente", "error");
      }
    }
  };

  const handleAddSala = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${SALAS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSala),
      });
      if (response.ok) {
        const createdSala = await response.json();
        setSalas((prev) => [...prev, createdSala]);
        setIsAdding(false);
        setNewSala({ nombre: '', direccion: '', numero_maquinas: 0, municipio: '' });
      } else {
        console.error('Error al agregar la sala');
      }
    } catch  {
      Swal.fire("Error al agregar la sala", "Intenta nuevamente", "error");
    }
  };

  if (loading) return <Loader />; 
  if (error) return <div className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center w-full">{error}</div>;

  return (
    <Card className=" bg-backgroundColor-table dark:bg-backgroundColor-dark dark:text-textColor-dark max-w-[95vw] h-auto">                    
      <div className="flex w-full px-10 ">
        <h3 className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center w-full">Lista de Salas</h3>
        <AddButton onClick={() => setIsAdding(true)} />
      </div>
      {isAdding && (
        <div className="mt-5 p-4 border rounded-xl bg-backgroundColor-light dark:bg-backgroundColor-dark dark:text-textColor-dark absolute w-[95%] z-20 left-5 top-0">
          <h4 className="text-lg font-semibold">Agrega una nueva sala</h4>
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 mt-2 w-full ">
            <Input
              value={newSala.nombre}
              onChange={(e) => setNewSala({ ...newSala, nombre: e.target.value })}
              placeholder="Nombre"
              type="text"
            />
            <Input
              value={newSala.direccion}
              onChange={(e) => setNewSala({ ...newSala, direccion: e.target.value })}
              placeholder="Dirección"
              type="text"
            />
            <Input
              value={newSala.numero_maquinas?.toString()}
              onChange={(e) => setNewSala({ ...newSala, numero_maquinas: parseInt(e.target.value) })}
              placeholder="Número de maquinas"
              type="number"
            />
            <Input
              value={newSala.municipio}
              onChange={(e) => setNewSala({ ...newSala, municipio: e.target.value })}
              placeholder="Municipio"
              type="text"
            />
          </div>
          <div className="flex justify-end gap-8 mt-2">
            <SaveButton onClick={handleAddSala} />
            <CancelButton onClick={() => setIsAdding(false)} />
          </div>
        </div>
      )}
      <Table className="bg-backgroundColor-table dark:bg-backgroundColor-dark max-h-[86vh] overflow-x-scroll">
        <TableHead>
          <TableRow className="text-textColor-light dark:text-textColor-dark">
            <TableHeaderCell className='text-lg font-bold'>Nombre</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Dirección</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Número de maquinas</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Municipio</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="dark:text-textColor-dark text-black text-lg text-ellipsis overflow-hidden text-pretty font-[400] justify-center items-center">
          {salas.map((sala) => (
            <TableRow key={sala.id} className='text-sm dark:hover:bg-backgroundColor-dark dark:hover:text-textColor-dark hover:bg-accent-light/5 hover:text-textColor-light dark:bg-tremor-content-strong/10'>
              <TableCell className='text-pretty'>
                {editingId === sala.id ? (
                  <Input
                    value={editedSala.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    type="text"
                    nombre='nombre'
                  />
                ) : (
                  sala.nombre
                )}
              </TableCell>
              <TableCell>
                {editingId === sala.id ? (
                  <Input
                    value={editedSala.direccion}
                    onChange={handleInputChange}
                    placeholder="Dirección"
                    type="text"
                    nombre='direccion'
                  />
                ) : (
                  sala.direccion
                )}
              </TableCell>
              <TableCell>
                {editingId === sala.id ? (
                  <Input
                    value={editedSala.numero_maquinas?.toString()}
                    onChange={handleInputChange}
                    placeholder="Número de maquinas"
                    type="number"
                    nombre='numero_maquinas'
                  />
                ) : (
                  sala.numero_maquinas
                )}
              </TableCell>
              <TableCell>
                {editingId === sala.id ? (
                  <Input
                    value={editedSala.municipio}
                    onChange={handleInputChange}
                    placeholder="Municipio"
                    type="text"
                    nombre='municipio'
                  />
                ) : (
                  sala.municipio
                )}
              </TableCell>
              <TableCell className='gap-4 flex items-center h-full w-fit'>
                {editingId === sala.id ? (
                  <>
                    <SaveButton onClick={handleSave} />
                    <CancelButton onClick={handleCancel} />
                  </>
                ) : (
                  <>
                    <EditButton onClick={() => handleEdit(sala)} />
                    <DeleteButton onClick={() => handleDelete(sala.id)} />
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

export default SalaTable;
