import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { InputLogin } from '../Buttons/ButtonsCrud';
import backgound from '../../assets/background-login.jpg';
import logo from '../../assets/olympia.jpg';



const Login: React.FC = () => {
    const { login } = useAuth();
    const [usuario, setUsuario] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(usuario, password);
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
        }
        
    };

    return (
        <div className='w-full h-screen bg-no-repeat ' style={{
            // imagen de assets/background.jpg
            backgroundImage: `url(${backgound})`,
        }}>
            <div className='flex flex-col justify-center items-center h-screen'>
                <form onSubmit={handleSubmit} className='flex flex-col justify-center bg-white/95 dark:bg-backgroundColor-dark dark:text-gray-50 rounded-xl border border-black dark:border-gray-800 '>
                    <div className="relative">
                        <img src={logo} alt="Logo olympia casinos" className="h-48 self-center w-auto rounded-t-lg" />
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none dark:from-black "></div>
                    </div>
                    <div className=' p-6 flex flex-col gap-4'>
                        <div >
                            <label className='text-sm font-semibold'>Usuario</label>
                            <InputLogin 
                                placeholder="Nombre de usuario o email"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)} 
                                required
                                autocomplete='username'
                            />
                        </div>
                        <div>
                            <label className='text-sm font-semibold'>Contraseña</label>
                            <InputLogin 
                                placeholder="Ingrese su contraseña"
                                type='password'
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required
                                autocomplete='current-password'
                            />
                        </div>
                        <button type="submit" className='bg-primary-light/90 dark:bg-accent-dark text-black dark:text-black/90 py-2 px-4 rounded-lg hover:bg-primary/75 border border-black dark:hover:bg-accent-dark/90  '>
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
    );
};

export default Login;
