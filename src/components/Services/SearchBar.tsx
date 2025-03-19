import { useState } from 'react';
import { API_BASE_URL, PRODUCTOS, ULTIMO_CODIGO } from './API'
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { ObtenerCodigoButton } from '../Buttons/ButtonsCrud';
interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  tabla: string;
  color?: string;
}


const SearchBar = ({ onSearch, tabla, color }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  
  const handleFetchLastScannedCode = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${PRODUCTOS}${ULTIMO_CODIGO}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchTerm(data.codigo.toString());
      }
    } catch (error) {
      Swal.fire("Error al obtener el último código escaneado", "Intenta nuevamente", "error");
    }
  };

  return (
    <div className='flex gap-2 my-0 h-auto top-5 absolute z-10 '>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Ingrese nombre..."
        className='bg-backgroundColor-light rounded-md dark:bg-backgroundColor-dark dark:text-textColor-dark text-textColor-light text-sm overflow-hidden font-[100] border-b-1 focus:border-amber-500 focus:ring-amber-500 w-full dark:!border-white'
      />
      <button
        onClick={handleSearch}
        className={`border border-${color} rounded-md px-2 text-sm hover:bg-${color} hover:text-white bg-white dark:bg-backgroundColor-dark flex justify-center items-center`}
        style={{
          borderColor: color,
          color: color,
        }}
      > 
        Buscar  
      </button>
      {tabla === 'productos' && <ObtenerCodigoButton onClick={handleFetchLastScannedCode} />}
    </div>
  );
};

export default SearchBar;
