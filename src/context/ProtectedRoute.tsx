import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserRole from '../components/Services/UserRole';
import Loader from '../components/Services/Loader';

interface ProtectedRouteProps {
  requiredRole: UserRole[];
}

const rolesMapping: Record<UserRole, number> = {
  admin: 1,
  user: 2,
  auditor: 3,
};

function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { id_rol, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!id_rol) {
    return <Navigate to="/login" />;
  }

  if (!Object.values(rolesMapping).includes(id_rol)) {
    return <Navigate to="/" />;
  }

  if (!requiredRole.some(role => rolesMapping[role] === id_rol)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
