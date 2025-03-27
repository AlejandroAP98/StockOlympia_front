import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

//
// Autor: Alejandro Álvarez Patiño
// https://github.com/AlejandroAP98
// Fecha: 2025-27-03
// Descripción: Archivo principal de la aplicación de inventario de productos.
// Proyecto: StockOlympia

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
