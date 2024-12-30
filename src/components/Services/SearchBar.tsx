import { useState } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  color?: string;
}


const SearchBar = ({ onSearch, color }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className='flex gap-2 my-2 h-8 top-5 absolute z-10'>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Buscar productos..."
        className='bg-backgroundColor-light dark:bg-backgroundColor-dark dark:text-textColor-dark text-textColor-light text-sm overflow-hidden font-[100] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-sm w-full dark:!border-white'
      />
      <button
        onClick={handleSearch}
        className={`border border-${color} rounded-sm px-2 text-sm hover:bg-${color} hover:text-white bg-white dark:bg-backgroundColor-dark`}
        style={{
          borderColor: color,
          color: color,
        }}
      > 
        Buscar  
      </button>
    </div>
  );
};

export default SearchBar;
