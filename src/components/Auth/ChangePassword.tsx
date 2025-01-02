import { useState } from 'react';
import { API_BASE_URL, USUARIOS } from '../Services/API.ts';
import Swal from 'sweetalert2';
import { SaveButton, CancelButton, Input } from '../Buttons/ButtonsCrud.js';
import Loader from '../Services/Loader.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

export function ChangePassword() {
  const { token, user_id } = useAuth(); 
  const [contrasena, setContrasena] = useState('');
  const [nueva_contrasena, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (nueva_contrasena !== confirmPassword) {
      Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}${USUARIOS}/${user_id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({  
            id: user_id,  
            contrasena: contrasena,
            nueva_contrasena: nueva_contrasena,
        }),
      });

      if (response.ok) {
        Swal.fire('Éxito', 'Contraseña actualizada correctamente', 'success');
        setNewPassword('');
        setContrasena('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        Swal.fire('Error', data.error || 'Error al actualizar la contraseña', 'error');
      }
    } catch {
      Swal.fire('Error', 'Error al comunicarse con el servidor', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-backgroundColor-light dark:bg-backgroundColor-dark rounded-xl">
      <h3 className="text-xl font-semibold text-textColor-light dark:text-textColor-dark text-center">
        Cambiar Contraseña
      </h3>
      <div className="mt-4 flex flex-col gap-4 items-center justify-center rounded-xl p-4">
        <div className="grid gap-4 mt-4 ">
          <Input 
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Contraseña actual"
            type="password"
          />
          <Input
            value={nueva_contrasena}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña"
            type="password"
          />
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar nueva contraseña"
            type="password"
          />
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <SaveButton onClick={handlePasswordChange} />
          <CancelButton onClick={() => {
            setNewPassword('');
            setConfirmPassword('');
          }} />
        </div>
      </div>
    </div>
  );
}
