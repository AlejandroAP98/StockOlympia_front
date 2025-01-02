import LogoLoader from '../../assets/logo_loader.webp';

const Loader = () => {
    return (
        <div className="flex justify-center flex-col items-center h-screen relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-4 border-l-2 border-r-2 border-amber-500"></div>
            <div className="absolute -top-6 left-0 right-0 bottom-0 flex items-center justify-center">
                <img src={LogoLoader} alt="Logo loader" className="w-auto h-10" />
            </div>
            <h1 className="text-center text-xl font-bold text-amber-500">Cargando...</h1>
        </div>
    );
};

export default Loader;
