import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {AuthProvider} from './context/AuthContext.tsx';
import Login from './components/Auth/Login.tsx';
import DashboardAdmin from './components/Admin/DashboardAdmin.js';
import ProtectedRoute from './context/ProtectedRoute.tsx';
import ProductosTable from './components/Tablas/ProductosTable.tsx';
import DashboardUser from './components/Users/DashBoardUser.tsx';
import DashboardAudit from './components/Audit/DashboardAudit.tsx';
import ProductosSalasAuditor from './components/Tablas/ProductosSalasAuditTable.tsx';
import Home from './components/Auth/Home.tsx';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/admin' element={<ProtectedRoute requiredRole={['admin']}   />}>	
                        <Route index element={<DashboardAdmin />} />
                    </Route>
                    <Route path='/productos' element={<ProtectedRoute requiredRole={['user']} />}> 
                        <Route index element={<ProductosTable />} />
                    </Route>
                    <Route path='/salas/:id_sala' element={<ProtectedRoute requiredRole={['user']} />}>
                        <Route index element={<DashboardUser />} />
                    </Route>
                    <Route path='/audit' element={<ProtectedRoute requiredRole={['auditor', 'admin']} />}>
                        <Route index element={<DashboardAudit />} />
                    </Route>
                    <Route path='/audit/salas/:id_sala' element={<ProtectedRoute requiredRole={['auditor', 'admin']} />}>
                        <Route index element={<ProductosSalasAuditor/>} />
                    </Route>
                    <Route path='/admin/salas/:id_sala' element={<ProtectedRoute requiredRole={['admin']} />}>
                        <Route index element={<ProductosSalasAuditor/>} />
                    </Route>
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
