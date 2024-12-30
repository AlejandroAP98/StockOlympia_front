import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL, USUARIOS, SALAS, ROLES } from '../Services/API.ts';
import fetchComponent from '../Services/fetchComponent.ts';
import Swal from 'sweetalert2';
import { EditButton, DeleteButton, AddButton, SaveButton, CancelButton, Input } from '../Buttons/ButtonsCrud.js';
import Loader from '../Services/Loader';



import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@tremor/react';

interface User {
  id: number;
  nombre: string;
  email: string;
  contrasena: string;
  id_rol: number | null;
  usuario: string;
  id_sala: number | null;
}

interface Sala {
  id: number;
  nombre: string;
}

interface Rol{
  id: number;
  rol: string;
}


export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const { token } = useAuth();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const [newUser, setNewUser] = useState<Partial<User>>({
    nombre: '',
    email: '',
    contrasena: '',
    id_rol: null,
    usuario: '',
    id_sala: null,
  });


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchComponent({ url: API_BASE_URL + USUARIOS, token });
        setUsers(data);
      } catch {
        setError("Error al cargar los usuarios. Por favor, intenta nuevamente.",);
      } finally {
        setLoading(false);
      }
    };

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

    const fetchRoles = async () => {
      try {
        setLoading(true);
        const data = await fetchComponent({ url: API_BASE_URL + ROLES, token });
        setRoles(data);
      } catch {
        setError("Error al cargar los roles. Por favor, intenta nuevamente.",);
      } finally {
        setLoading(false);
      }
    };  
    
    fetchUsers();
    fetchSalas();
    fetchRoles();
  }, [token]);


  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditedUser(user);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name === 'id_sala') {
      setEditedUser((prev) => ({ ...prev, id_sala: parseInt(value) }));
      return;
    }
    if (name === 'id_rol') {
      setEditedUser((prev) => ({ ...prev, id_rol: parseInt(value) }));
      return;
    }
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  
  };


  const handleSave = async () => {
    try {
      await fetch(`${API_BASE_URL}${USUARIOS}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingId ? { ...user, ...editedUser } : user
        )
      );
      setEditingId(null);
      Swal.fire("Los cambios se han guardado", "Intenta nuevamente", "success");
    } catch {
      Swal.fire("Error al guardar los cambios", "Intenta nuevamente", "error");
    }  
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedUser({});
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de que deseas eliminar este usuario?',
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
        await fetch(`${API_BASE_URL}${USUARIOS}/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user.id !== id));
      } catch {
        Swal.fire("Error al eliminar el usuario", "Intenta nuevamente", "error");
      }
    }
  };

  const handleSalaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setEditedUser((prev) => ({ ...prev, id_sala: parseInt(value) }));
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${USUARIOS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const createdUser = await response.json();
        setUsers((prev) => [...prev, createdUser]);
        setIsAdding(false); 
        setNewUser({ nombre: '', email: '', contrasena: '', id_rol: null, usuario: '', id_sala: null});
      } else {
        Swal.fire("Error al agregar el usuario", "Intenta nuevamente", "error");
      }
    } catch  {
      Swal.fire("Error al agregar el usuario", "Intenta nuevamente", "error");
    }
  };

  const handleRolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target as HTMLSelectElement;
    setEditedUser((prev) => ({ ...prev, id_rol: parseInt(value) }));
  };

  if (loading) return <Loader />; 
  if (error) return <div className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center w-full">{error}</div>;

  return (
    <Card className=" bg-backgroundColor-table dark:bg-backgroundColor-dark dark:text-textColor-dark max-w-[95vw] h-auto">  
      <div className="flex w-full px-10 ">
        <h3 className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center w-full ">Lista de Usuarios</h3>
        <AddButton onClick={() => setIsAdding(true)} />
      </div>
      {isAdding && (
        <div className="mt-5 p-4 border rounded-xl bg-backgroundColor-light dark:bg-backgroundColor-dark dark:text-textColor-dark absolute w-[95%] z-1+20 left-5 top-0">
          <h4 className="text-lg font-semibold">Agrega un nuevo usuario</h4>
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 mt-2 w-full ">
            <Input
              value={newUser.nombre}
              onChange={handleNewUserChange}
              placeholder="Nombre"
              type="text"
              nombre='nombre'
            />
            <Input
              value={newUser.email}
              onChange={handleNewUserChange}
              placeholder="Email"
              type="email"
              nombre='email'
            />
            <Input
              value={newUser.contrasena}
              onChange={handleNewUserChange}
              placeholder="Contraseña"
              type="password"
              nombre='contrasena'
            />
            <select
              name="id_rol"
              value={newUser.id_rol || ''}
              onChange={handleNewUserChange}
              className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg " >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.rol}
                  </option>
                ))}
              </select>
            <Input
              value={newUser.usuario || ''}
              onChange={handleNewUserChange}
              placeholder="Nombre de usuario"
              type="text"
              nombre='usuario'
            />
            <select
              name="id_sala"
              value={newUser.id_sala || ''}
              onChange={handleNewUserChange}
              className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg " >
              <option value="">Selecciona una sala</option>
              {salas.map((sala) => (
                <option key={sala.id} value={sala.id}>{sala.nombre}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-8 mt-2">
            <SaveButton onClick={handleAddUser} />
            <CancelButton onClick={() => setIsAdding(false)} />
          </div>
        </div>
      )}
      <Table className="bg-backgroundColor-table dark:bg-backgroundColor-dark max-h-[86vh] overflow-x-scroll">
        <TableHead>
          <TableRow className="text-textColor-light dark:text-textColor-dark">
            <TableHeaderCell className='text-lg font-bold'>Nombre</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Email</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Nombre de usuario</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Rol</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Sala</TableHeaderCell>
            <TableHeaderCell className='text-lg font-bold'>Acciones</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody className="dark:text-textColor-dark text-black text-lg text-ellipsis overflow-hidden text-pretty font-[400] justify-center items-center">
          {users.map((user) => (
            <TableRow key={user.id} className='dark:hover:bg-backgroundColor-dark dark:hover:text-textColor-dark hover:bg-accent-light/5 hover:text-textColor-light dark:bg-tremor-content-strong/10'>
              <TableCell className='text-pretty'>
                {editingId === user.id ? (
                  <Input
                    value={editedUser.nombre}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    type="text"
                    nombre='nombre'
                  />
                ) : (
                  user.nombre
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Input
                    value={editedUser.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    type="email"
                    nombre='email'
                  />

                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Input
                    value={editedUser.usuario}
                    onChange={handleInputChange}
                    placeholder="Nombre de usuario"
                    type="text"
                    nombre='usuario'
                  />

                ) : (
                  user.usuario
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <select
                    name='id_rol'
                    value={editedUser.id_rol || ''}
                    onChange={handleRolChange}
                    className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg w-fit"
                  >
                    {roles.map((rol) => (
                      <option key={rol.id} value={rol.id}>
                        {rol.rol}
                      </option>
                    ))}
                  </select>
                  ): (
                  user.id_rol ? roles.find( (rol) => rol.id === user.id_rol)?.rol : 'no rol'
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <select
                    name="id_sala"
                    value={editedUser.id_sala || ''}
                    onChange={handleSalaChange}
                    className="dark:text-textColor-dark dark:bg-tremor-content-strong text-black overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg w-fit"
                  >
                    {salas.map((sala) => (
                      <option key={sala.id} value={sala.id}>
                        {sala.nombre}
                      </option>
                    ))}
                  </select> 
                ) : (
                  user.id_sala ? salas.find( (sala) => sala.id === user.id_sala)?.nombre : 'no sala'
                )}
              </TableCell>
              <TableCell className='gap-4 flex items-center h-full w-fit'>
                {editingId === user.id ? (
                  <>
                    <SaveButton onClick={handleSave} />
                    <CancelButton onClick={handleCancel} />
                  </>
                ) : (
                  <>
                    <EditButton onClick={() => handleEdit(user)} />
                    <DeleteButton onClick={() => handleDelete(user.id)} />
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

export default UserTable;
