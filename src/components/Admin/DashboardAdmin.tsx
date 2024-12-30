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

export function DashboardAdmin() {
  const [activeView, setActiveView] = useState<string>("productos");
  
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
      default:
        return <h1>Selecciona una opción del menú</h1>;
    }
  };

  return (
    <main className="flex w-full">
      <div className="w-full h-screen bg-no-repeat absolute opacity-5 " style={{
        backgroundImage: `url(${background})`,
      }}>
      </div>
      <LateralNav setActiveView={setActiveView} />
      <section className="flex-1 w-full ml-16 h-screen z-10 ">
          {renderContent()}
      </section>
    </main>
  );
}

export default DashboardAdmin;