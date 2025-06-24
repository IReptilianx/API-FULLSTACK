import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Complements/Login";
import Form from "./Complements/Form";
import Home from "./Complements/Home";
import AdminDashboard from "./Complements/AdminDashboard";
import "./index.css";
import { useActivityStore } from "./store";

// Componente para rutas protegidas
interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectTo: string;
}

const ProtectedRoute = ({ children, isAuthenticated, redirectTo }: ProtectedRouteProps) => {
  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} />;
};

// Componente para rutas de administrador
interface AdminRouteProps {
  children: React.ReactNode;
  isAdmin: boolean;
  redirectTo: string;
}

const AdminRoute = ({ children, isAdmin, redirectTo }: AdminRouteProps) => {
  return isAdmin ? <>{children}</> : <Navigate to={redirectTo} />;
};

function AppContent() {
  const { state, dispatch, isLoading } = useActivityStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  // Verificar autenticación al cargar
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedAuth === 'true' && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
  }, []);

  const handleLogin = (email: string, _: string, role: string, userName?: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    
    // Guardar estado de autenticación, rol y nombre de usuario
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    if (userName) {
      localStorage.setItem('userName', userName);
    } else {
      // Si no tenemos el nombre, usar el email como nombre de usuario provisional
      localStorage.setItem('userName', email.split('@')[0]);
    }
    
    // Redirigir según el rol
    if (role === 'administrador') {
      navigate('/admin-dashboard');
    } else {
      navigate('/form');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    
    // Limpiar estado de autenticación
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    
    navigate('/');
  };

  // Determinar si el usuario es administrador
  const isAdmin = userRole === 'administrador';

  return (
    <>
      <Routes>
        {/* La ruta principal siempre muestra el Home */}
        <Route path="/" element={
          isAuthenticated ? 
            <Navigate to={isAdmin ? "/admin-dashboard" : "/form"} /> :
            <Home />
        } />
        
        <Route path="/login" element={
          isAuthenticated ? 
            <Navigate to={isAdmin ? "/admin-dashboard" : "/form"} /> : 
            <Login onLogin={handleLogin} />
        } />
        
        <Route path="/admin" element={
          <AdminRoute isAdmin={isAdmin} redirectTo="/login">
            <div className="admin-container">
              <AdminDashboard />
              <button className="admin-logout-button" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </AdminRoute>
        } />
        
        {/* Ruta alternativa para compatibilidad */}
        <Route path="/admin-dashboard" element={
          <AdminRoute isAdmin={isAdmin} redirectTo="/login">
            <div className="admin-container">
              <AdminDashboard />
              <button className="admin-logout-button" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          </AdminRoute>
        } />
        
        {/* Ruta para mayúsculas: cuando el usuario accede a /AdminDashboard */}
        <Route path="/AdminDashboard" element={<Navigate to="/admin-dashboard" />} />
        
        <Route path="/form" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/login">
            {isLoading ? (
              <div className="loading">Cargando datos...</div>
            ) : (
              <div className="main-content">
                <Form dispatch={dispatch} state={state} />
                <button className="logout-button" onClick={handleLogout}>
                  Salir
                </button>
              </div>
            )}
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
