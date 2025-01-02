import { useState } from 'react';
import LateralNav from '../Nav/LateralNav.js';
import ProductosAuditor from '../Tablas/ProductosAuditTable.tsx';
import SalasAuditor from './SalasAudit.tsx';
import Background from '../../assets/background-login.jpg';
import Reportes from '../Reports/Reportes.tsx';
import { ChangePassword } from '../Auth/ChangePassword.tsx';
import Movimientos from '../Tablas/Movimientos.tsx';

export function AuditInicio() {

  const [activeView, setActiveView] = useState<string>("salasAuditor");

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
        return <h1>Selecciona una opción del menú</h1>;
    }
  };

  return (
    <main className="flex w-full">
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