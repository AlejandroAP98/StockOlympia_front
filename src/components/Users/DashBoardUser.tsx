import { useState} from 'react';
import LateralNav from '../Nav/LateralNav.js';
import ProductosSalaTable from '../Tablas/ProductosUsuarioTable.js';
import background from '../../assets/background-login.jpg';
import ProductosTable from '../Tablas/ProductosTable.tsx';
import Movimientos from '../Tablas/Movimientos.tsx';
import { ChangePassword } from './ChangePassword.tsx';

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

export default DashboardUser;
