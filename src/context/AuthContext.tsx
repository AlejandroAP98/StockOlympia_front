import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LOGIN, API_BASE_URL } from '../components/Services/API';

interface User {
    id: number;
    usuario: string;
    contrasena: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    sala: number | null;
    id_rol: number| null;
    loading: boolean;
    user_id: number | null;
    username: string | null;
    login: (usuario: string, password: string) => Promise<void>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [sala, setSala] = useState<number | null>(null);
    const [id_rol, setRol] = useState<number | null>(null);
    const [user_id, setUserId] = useState<number | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    const login = async (usuario: string, password: string) => {    
    try {
        const response = await axios.post(`${API_BASE_URL}${LOGIN}`, { usuario, contrasena: password });
        const { token, sala, rol, user_id, username } = response.data;
        setToken(token);
        setRol(rol);
        setSala(sala);
        setUserId(user_id);
        setUsername(username);
        localStorage.setItem('user_id', user_id.toString());
        localStorage.setItem('token', token);
        localStorage.setItem('rol', rol.toString());
        localStorage.setItem('username', username);
        if (sala===null){
            localStorage.removeItem('sala');
        }else{
        localStorage.setItem('sala', sala.toString());
        }
               
        if (rol === 1) {
            navigate(`/admin`);
        } else if(rol===2) {
            navigate(`/salas/${sala}`);
        }else if(rol===3) {
            navigate((`/audit`));
        }else {
            navigate((`/login`));
        }
    } catch (error) {
        console.error("Error en la autenticación:", error);
        Swal.fire("Error en la autenticación", "Intenta nuevamente", "error");
    }
};


    const logout = () => {
        setToken(null);
        setUser(null);
        setSala(null);
        setRol(null);
        setUserId(null);
        setUsername(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            const savedRol = localStorage.getItem('rol');
            const savedSala = localStorage.getItem('sala');
            const savedUserId = localStorage.getItem('user_id');
            const savedUsername = localStorage.getItem('username');
            if (savedUsername) setUsername(savedUsername);
            if (savedUserId) setUserId(parseInt(savedUserId));
            if (savedRol) setRol(parseInt(savedRol));
            if (savedSala) setSala(parseInt(savedSala));
        }
        setLoading(false); 
    }, []);
    

    return (
        <AuthContext.Provider value={{ login, logout, token, user, sala, id_rol, loading, user_id, username }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};
