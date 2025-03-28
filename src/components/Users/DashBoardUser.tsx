import { useState} from 'react';
import LateralNav from '../Nav/LateralNav.js';
import ProductosSalaTable from '../Tablas/ProductosUsuarioTable.js';
import background from '../../assets/background-login.jpg';
import ProductosTable from '../Tablas/ProductosTable.tsx';
import Movimientos from '../Tablas/Movimientos.tsx';
import { ChangePassword } from '../Auth/ChangePassword.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

export function DashboardUser() {
    const [activeView, setActiveView] = useState<string>("productosUser");  
  const renderContent = () => {
    switch (activeView) {      
      case "productosUser":
        return <ProductosSalaTable />;
      case "ingresos":
        return <ProductosTable />;
      case "movimientos":
        return <Movimientos />;
      case "cambiarContrasena":
        return <ChangePassword />;
      default:
        return <h1 className='text-center text-2xl font-bold'>Selecciona una opción del menú</h1>;
    }
  };

  return (
    <main className="flex w-full">
      <h1 className="text-[9px] dark:text-gray-300 text-gray-600 absolute flex mt-0 z-20 ml-16 font-light"> Bienvenido, {useAuth().username}</h1>
      <div className="w-full h-screen bg-no-repeat absolute opacity-5 " style={{
        backgroundImage: `url(${background})`,
      }}>
      </div>
      <LateralNav setActiveView={setActiveView} />
      <section className="flex-1 w-full ml-16 h-screen z-10  ">
        {renderContent()}
      </section>
    </main>
  );
}

export default DashboardUser;
