import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/olympia.jpg';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Inicia el fade-out después de 2.5 segundos
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 2500);

        // Redirige después de 3 segundos
        setTimeout(() => {
            navigate('/login');
        }, 3000);

        return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
    }, [navigate]);

    return (
        <div className='w-full h-screen bg-no-repeat' style={{ background: 'black' }}>
            <div className='flex h-screen justify-around items-center flex-col'>
                <img 
                    src={logo} 
                    alt="Logo olympia casinos" 
                    className={`h-auto w-1/2 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
                    style={{
                        maskImage: 'radial-gradient(circle, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%)',
                        WebkitMaskImage: 'radial-gradient(circle, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%)',
                    }}
                />
                <p className={`text-white text-sm transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
                    Redirigiendo a la página de login...
                </p>
            </div>
        </div>
    );
};

export default Home;
