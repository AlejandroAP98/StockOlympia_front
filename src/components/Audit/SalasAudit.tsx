import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { API_BASE_URL, SALAS } from '../Services/API.ts';
import Loader from '../Services/Loader.tsx';
import fetchComponent from '../Services/fetchComponent.ts';
import CardSalas from './CardSalas.tsx';
import { useNavigate } from 'react-router-dom';



interface Sala {
  id: number;
  nombre: string;
  direccion: string;
  numero_maquinas: number | null;
  municipio: string;
}

const DashboardAudit = () => {
    
    const { token, id_rol } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [salas, setSalas] = useState<Sala[]>([]);
    const navigate = useNavigate();

    
  

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

    const handleClick = (sala: Sala) => {
        if (id_rol === 1) {
            navigate(`/admin/salas/${sala.id}`);
        }else{
            navigate(`/audit/salas/${sala.id}`);
        } 
      };

    if (loading) return <Loader />;
    if (error) return <div className="text-textColor-light dark:text-textColor-dark font-semibold text-xl text-center h-screen w-full">{error}</div>;
    return (
      <>
        <h1 className="text-amber-300 dark:text-textColor-dark text-2xl font-bold text-center w-full uppercase ">Salas</h1>
        <div className="flex flex-col justify-center items-center">
            <h2 className="text-textColor-light dark:text-textColor-dark text-xl font-bold text-center w-full p-4">Seleccione una sala para ver el stock de productos actuales 🎰</h2>
            <div className="flex flex-wrap gap-8 justify-center items-center">
            {salas.map((sala) => (            
                <CardSalas key={sala.id} sala={sala} onClick={() => handleClick(sala)} />
            ))}
            </div>
        </div>
    </>
  );
};


export default DashboardAudit;