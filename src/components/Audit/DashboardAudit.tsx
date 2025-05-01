import { useState } from 'react';
import LateralNav from '../Nav/LateralNav.js';
import ProductosAuditor from '../Tablas/ProductosAuditTable.tsx';
import SalasAuditor from './SalasAudit.tsx';
import Background from '../../assets/background-login.jpg';
import Reportes from '../Reports/Reportes.tsx';
import { ChangePassword } from '../Auth/ChangePassword.tsx';
import Movimientos from '../Tablas/Movimientos.tsx';
import { useAuth } from '../../context/AuthContext.tsx';

export function AuditInicio() {
  const [activeView, setActiveView] = useState<string>("salasAuditor");
  const { username } = useAuth();

  const renderContent = () => {
    switch (activeView) {
      case "salasAuditor":
        return <SalasAuditor />;
      case "productosAuditor":
        return <ProductosAuditor />;
      case "reportes":
        return <Reportes />;
      case "cambiarContrasena":
        return <ChangePassword />;
      case "movimientos":
        return <Movimientos />;
      default:
        return <h1 className='text-center text-2xl font-bold'>Selecciona una opción del menú</h1>;
    }
  };

  return (
    <main className="flex w-full">
      <h1 className="text-[9px] dark:text-gray-300 text-gray-600 absolute flex mt-0 z-20 ml-16 font-light"> Bienvenido, {username}</h1>
      <div className="w-full h-screen bg-no-repeat absolute opacity-5 " style={{
        backgroundImage: `url(${Background})`,
      }}>
      </div>
        <LateralNav setActiveView={setActiveView} />
      <section className="flex-1 w-full ml-16 h-screen z-10 ">
        {renderContent()}
      </section>
    </main>
  );
}

export default AuditInicio;