import { useState } from 'react';
import background from '../../assets/background-login.jpg';
import LateralNav from '../Nav/LateralNav.js';
import UsuariosTable from '../Tablas/UserTable.tsx';
import SalasTable from '../Tablas/SalaTable.tsx';
import ProductosTable from '../Tablas/ProductosTable.js';
import MarcasTable from '../Tablas/MarcasTable.tsx';
import CategoriasTable from '../Tablas/CategoriasTable.tsx';
import Reportes from '../Reports/Reportes.tsx';
import SalasAudit from '../Audit/SalasAudit.tsx';
import Stock from '../Tablas/ProductosAuditTable.tsx';
import { ChangePassword } from '../Auth/ChangePassword.tsx';
import Movimientos from '../Tablas/Movimientos.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

export function DashboardAdmin() {
  const [activeView, setActiveView] = useState<string>("productos");
  const {username} = useAuth();
  
  const renderContent = () => {
    switch (activeView) {
      case "usuarios":
        return <UsuariosTable />;
      case "salas":
        return <SalasTable />;
      case "productos":
        return <ProductosTable  />;
      case "marcas":
        return <MarcasTable />;
      case "categorias":
        return <CategoriasTable />;
      case "reportes":
        return <Reportes />;
      case "salasAuditor":
        return <SalasAudit />;
      case "productosAuditor":
        return <Stock />;
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
      <h1 className="text-[9px] dark:text-gray-300 text-gray-600 absolute flex mt-0 z-20 ml-16 font-light"> Bienvenido, {username}</h1>
      <div className="w-full h-screen bg-no-repeat absolute opacity-5 " style={{
        backgroundImage: `url(${background})`,
      }}>
      </div>
      <LateralNav setActiveView={setActiveView} />
      <section className="flex-1 w-full ml-16 h-screen z-10">
          {renderContent()}
      </section>
    </main>
  );
}

export default DashboardAdmin;
