import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8080" 
  : "https://api-fullstack-ryb6.onrender.com";

const Login = ({ onLogin }: { onLogin: (email: string, password: string) => void }) => {  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados para el formulario de registro
  const [registerData, setRegisterData] = useState({
    nombreCompleto: '',
    apellido: '',
    direccion: '',
    email: '',
    password: '',
    telefono: '',
    comoNosConocio: '',
    observaciones: ''
  });

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(email, password);
        navigate('/form'); // Redirige al formulario después de iniciar sesión
      } else {
        setError(data.message || 'Correo o contraseña incorrectos');
      }
    } catch {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      setError('Debes aceptar los términos de uso para crear una cuenta');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Error al crear la cuenta');
        return;
      }
      
      await response.json();
      setSuccess('Cuenta creada exitosamente');
      setTimeout(() => {
        setIsCreatingAccount(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  const handleBackToLogin = () => {
    setIsCreatingAccount(false);
    setError('');
    setSuccess('');
  };

  const handleRegisterChange = (field: string, value: string) => {
    setRegisterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCreatingAccount(true);
  };
  if (isCreatingAccount) {
    return (
      <div className="login-container">
        <div className="login-card register-card">          <h1 className="login-title">Únete a AparClic!</h1>
          <p className="login-subtitle">Crea tu cuenta en nuestro sistema de estacionamiento</p>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleCreateAccountSubmit} className="login-form">
            <div className="form-row">
              <input 
                type="text" 
                placeholder="Nombre completo" 
                required 
                className="form-input"
                value={registerData.nombreCompleto}
                onChange={(e) => handleRegisterChange('nombreCompleto', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="Apellido" 
                required 
                className="form-input"
                value={registerData.apellido}
                onChange={(e) => handleRegisterChange('apellido', e.target.value)}
              />
            </div>
            
            <div className="form-row single">
              <input 
                type="text" 
                placeholder="Dirección completa" 
                className="form-input"
                value={registerData.direccion}
                onChange={(e) => handleRegisterChange('direccion', e.target.value)}
              />
            </div>
              <div className="form-row">
              <input 
                type="email" 
                placeholder="Correo electrónico" 
                required 
                className="form-input"
                value={registerData.email}
                onChange={(e) => handleRegisterChange('email', e.target.value)}
              />
              <div className="password-input-container">
                <input 
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="Contraseña" 
                  required 
                  className="form-input"
                  value={registerData.password}
                  onChange={(e) => handleRegisterChange('password', e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  aria-label={showRegisterPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showRegisterPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="form-row">
              <input 
                type="text" 
                placeholder="Teléfono" 
                required 
                className="form-input"
                value={registerData.telefono}
                onChange={(e) => handleRegisterChange('telefono', e.target.value)}
              />
              <select 
                required 
                className="form-input"
                value={registerData.comoNosConocio}
                onChange={(e) => handleRegisterChange('comoNosConocio', e.target.value)}
              >
                <option value="">¿Cómo nos conoció?</option>
                <option value="internet">Internet</option>
                <option value="amigo">Amigo/Referido</option>
                <option value="publicidad">Publicidad</option>
                <option value="redes_sociales">Redes Sociales</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            
            <div className="form-row single">
              <textarea 
                placeholder="Observaciones (opcional)" 
                className="form-input"
                value={registerData.observaciones}
                onChange={(e) => handleRegisterChange('observaciones', e.target.value)}
                rows={3}
              ></textarea>
            </div>
            
            <div className="form-row single">
              <div className="form-checkbox">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required 
                />
                <label htmlFor="terms">Acepto los términos de uso y políticas de privacidad</label>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : 'Crear mi cuenta'}
            </button>
            
            <button 
              type="button"
              onClick={handleBackToLogin} 
              className="login-button back-button"
              disabled={loading}
            >
              Volver al inicio de sesión
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="login-container">
      <div className="login-card">        <h1 className="login-title">Bienvenido a AparClic!</h1>
        <p className="login-subtitle">Inicia sesión para continuar</p>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
            <div className="form-group">
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? '' : 'Ingresar'}
          </button>
        </form>
        
        <p className="login-footer">
          ¿No tienes cuenta? <a href="#" className="register-link" onClick={handleRegisterClick}>Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
