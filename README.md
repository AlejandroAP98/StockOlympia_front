# 📦 StockOlympia Front

**StockOlympia** es una aplicación frontend desarrollada en **React + TypeScript** para la **gestión de inventarios** en las salas de casino de *Olympia Casinos*.  
Permite controlar existencias, registrar movimientos de productos y gestionar accesos según roles de usuario.

## 🚀 Características
- 📍 **Gestión de inventario** por ubicación (salas).
- 📊 **Registro y consulta** de historial de movimientos.
- 🔐 **Acceso basado en roles**:
  - **Admin**: CRUD completo, gestión de usuarios y configuración del sistema.
  - **User**: Consulta y registro de movimientos para su sala asignada.
  - **Auditor**: Acceso de solo lectura y generación de reportes.

## 🏗 Arquitectura
- **SPA (Single Page Application)** con React.
- Rutas protegidas por roles (`ProtectedRoute`).
- Estado global centralizado para autenticación y permisos.
- Configuración de endpoints mediante variables de entorno.

## 🌐 Variables de entorno
| Variable           | Función                       |
|--------------------|--------------------------------|
| `VITE_PRODUCTOS`   | CRUD de productos             |
| `VITE_MOVIMIENTOS` | Seguimiento de movimientos    |
| `VITE_CATEGORIAS`  | Gestión de categorías         |
| `VITE_MARCAS`      | Gestión de marcas             |
| `VITE_SALAS`       | Gestión de salas              |
| `VITE_USUARIOS`    | Gestión de usuarios           |
| `VITE_REPORTE`     | Reportes y analítica          |

## 🛠 Tecnologías utilizadas
- **React 18** + **TypeScript**
- **React Router DOM** (rutas protegidas)
- **Tremor React** (tablas y tarjetas)
- **Tailwind CSS** (tema personalizado con modo claro/oscuro, colores dorado `#ffd700` y ámbar `#d4af37`)
- **Fetch API** con wrapper propio
- **SweetAlert2** para notificaciones
- **Vite** para desarrollo y build
