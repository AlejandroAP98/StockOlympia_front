// src/components/Buttons/ButtonsCrud.d.ts


interface ButtonProps {
  onClick?: () => void;
}

interface InputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  type?: string;
  nombre?: string;
  required?: boolean;
  autocomplete?: string;
}


const EditButton = ({ onClick }: ButtonProps) => {
  return (
    <div className="group relative flex justify-center text-center">
      <button onClick={onClick} className="hover:text-accent dark:hover:text-accent-dark text-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
            <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
        </svg>
        <span className="absolute bottom-8 -left-2 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Editar</span>
    </button>

    </div>
    
  );
};

const DeleteButton = ({ onClick }:ButtonProps) => {
  return (
    <div className="group relative flex justify-center">
      <button onClick={onClick} className="hover:text-red-600 dark:hover:text-red-400 ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
          </svg>
          <span className="absolute bottom-8 -left-2 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Eliminar</span>
      </button>
    </div>
  );
};

const AddButton = ({ onClick }: ButtonProps) => {
  return (
    <div className="group relative flex justify-center">
      <button onClick={onClick} className="hover:text-accent dark:hover:text-accent-dark">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
          <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
        </svg>
        <span className="absolute bottom-8 -left-2 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Agregar</span>
      </button>
    </div>
  );
};

const CancelButton = ({ onClick }: ButtonProps) => {
  return (
    <div className="group relative flex justify-center">
      <button onClick={onClick} className="hover:text-red-600 dark:hover:text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
          <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
        <span className="absolute bottom-8 -left-2 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Cancelar</span>
      </button>
    </div>
  );
};

const SaveButton = ({ onClick }: ButtonProps) => {
  return (
    <div className="group relative flex justify-center">
      <button onClick={onClick} className="hover:text-green-600 dark:hover:text-green-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
          <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
        </svg>
        <span className="absolute bottom-8 -left-2 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Guardar</span>
      </button>
    </div>
  );
};

const Input = ({ onChange, value, placeholder, type, nombre }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className=" dark:text-textColor-dark dark:bg-tremor-content-strong text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
      value={value}
      onChange={onChange}
      name={nombre}
    />
  );
};

const InputFila = ({ onChange, value, placeholder, type, nombre }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className=" dark:text-textColor-dark dark:bg-tremor-content-strong text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg w-fit"
      value={value}
      onChange={onChange}
      name={nombre}
      
    />
  );
};

const InputLogin = ({ onChange, value, placeholder, type, nombre, required, autocomplete }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className=" dark:text-textColor-dark dark:bg-tremor-content-strong text-black text-balance text-ellipsis overflow-hidden font-[200] border-b-1 focus:border-amber-500 focus:ring-amber-500 rounded-lg w-full bg-backgroundColor-light"
      value={value}
      onChange={onChange}
      name={nombre}
      required={required}
      autoComplete={autocomplete}
    />
  );
};

const IngresarButton = ({ onClick }: ButtonProps) => {
  return (
    <div className="group relative flex justify-center ">
      <button onClick={onClick} className="hover:text-green-600 dark:hover:text-green-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span className="absolute bottom-8 -left-2 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Ingresar producto</span>
      </button>
    </div>
  );
};

const SalidaButton = ({ onClick }: ButtonProps) => {
  return (
    <div className="group relative flex justify-center ">
      <button onClick={onClick} className="hover:text-red-600 dark:hover:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <span className="absolute bottom-8 -left-2 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">Salida de producto</span>
      </button>
    </div>
  );
};

const ObtenerCodigoButton = ({ onClick }: ButtonProps) => {
  return (
    <div className="group relative flex justify-center">
      <button 
        onClick={onClick} 
        className="border dark:border-white dark:text-white border-black text-black px-4 py-2 rounded-md w-fit hover:bg-black hover:text-white transition-all duration-100 dark:hover:bg-white dark:hover:text-black"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
        </svg>
      </button>
    </div>
  );
};



export { EditButton, DeleteButton, AddButton , CancelButton, SaveButton, Input, InputFila, InputLogin, IngresarButton, SalidaButton, ObtenerCodigoButton};