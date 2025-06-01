import React, { useState } from 'react';
import './Login.css';

const API_BASE_URL = "http://localhost:4002";

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(); // Update authentication state
      } else {
        setError(data.message || 'Correo o contraseña incorrectos');
      }
    } catch {
      setError('Error de conexión. Intenta nuevamente.');
    }
  };

  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      alert('Debes aceptar los términos de uso para crear una cuenta');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Cuenta creada exitosamente');
        setIsCreatingAccount(false);
        // Autenticar al usuario después de crear la cuenta
        onLogin();
      } else {
        alert(data.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      alert('Error de conexión. Intenta nuevamente.');
    }
  };

  const handleCreateAccount = () => {
    setIsCreatingAccount(true);
  };

  const handleBackToLogin = () => {
    setIsCreatingAccount(false);
  };

  const handleRegisterChange = (field: string, value: string) => {
    setRegisterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isCreatingAccount) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h2>Crear Cuenta</h2>
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
            <div className="form-row">
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
              <input 
                type="password" 
                placeholder="Contraseña" 
                required 
                className="form-input"
                value={registerData.password}
                onChange={(e) => handleRegisterChange('password', e.target.value)}
              />
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
                <option value="amigo">Amigo</option>
                <option value="publicidad">Publicidad</option>
              </select>
            </div>
            <div className="form-row">
              <textarea 
                placeholder="Observaciones" 
                className="form-input"
                value={registerData.observaciones}
                onChange={(e) => handleRegisterChange('observaciones', e.target.value)}
              ></textarea>
            </div>
            <div className="form-row">
              <div className="form-checkbox">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required 
                />
                <label htmlFor="terms">Acepto los términos de uso</label>
              </div>
            </div>
            <button type="submit" className="login-button">Crear mi cuenta</button>
          </form>
          <button onClick={handleBackToLogin} className="login-button">Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Bienvenido</h1>
        <p className="login-subtitle">Inicia sesión para continuar</p>
        {error && <p className="error-message">{error}</p>}
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
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Ingresar</button>
        </form>
        <p className="login-footer">
          ¿No tienes cuenta? <a href="#" className="register-link">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
