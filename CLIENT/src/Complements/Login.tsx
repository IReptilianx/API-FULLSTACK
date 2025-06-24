import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8080" 
  : "https://api-fullstack-ryb6.onrender.com";

const Login = ({ onLogin }: { onLogin: (email: string, password: string, role: string, userName?: string) => void }) => {  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados para validación de campos
  const [fieldErrors, setFieldErrors] = useState({
    nombreCompleto: '',
    apellido: '',
    telefono: '',
    password: ''
  });
  
  // Estados para el formulario de registro
  const [registerData, setRegisterData] = useState({
    nombreCompleto: '',
    apellido: '',
    direccion: '',
    email: '',
    password: '',
    telefono: '',
    observaciones: '',
    rol: 'empleado' // Valor por defecto: empleado
  });

  // Función para validar nombre (solo letras, espacios y máximo 50 caracteres)
  const validateName = (name: string): string => {
    if (!name) return '';
    
    if (name.length > 50) {
      return 'El nombre no debe exceder los 50 caracteres';
    }
    
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    if (!nameRegex.test(name)) {
      return 'El nombre solo debe contener letras y espacios';
    }
    
    return '';
  };

  // Función para validar teléfono (exactamente 10 dígitos)
  const validatePhone = (phone: string): string => {
    if (!phone) return '';
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return 'El teléfono debe tener exactamente 10 dígitos numéricos';
    }
    
    return '';
  };

  // Función para validar contraseña (mínimo 8 caracteres, al menos una mayúscula y un número)
  const validatePassword = (password: string): string => {
    if (!password) return '';
    
    if (password.length < 8) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) {
      return 'La contraseña debe tener al menos una letra mayúscula';
    }
    
    const hasNumber = /[0-9]/.test(password);
    if (!hasNumber) {
      return 'La contraseña debe tener al menos un número';
    }
    
    return '';
  };

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Intentando iniciar sesión con:', { email });
    
    try {
      const requestData = { email, password };
      console.log('Datos de solicitud:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
        credentials: 'include' // Incluye cookies en la solicitud
      });
      
      console.log('Código de estado HTTP:', response.status);
      console.log('Headers de respuesta:', Object.fromEntries([...response.headers.entries()]));
      
      // Mostrar el texto crudo de la respuesta para diagnóstico
      const responseText = await response.text();
      console.log('Respuesta en texto:', responseText);
      
      let data;
      try {
        // Intentar parsear como JSON
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Error al parsear la respuesta JSON:', e);
        setError('Error en el formato de la respuesta del servidor');
        return;
      }
      
      if (data.success) {
        console.log('Inicio de sesión exitoso', data);
        const userRole = data.user?.role || 'empleado';
        const userId = data.user?.id;
        
        // Guardar el ID del usuario en localStorage
        if (userId) {
          localStorage.setItem('userId', userId.toString());
        }
        
        // Obtener el nombre completo del usuario
        const userName = data.user?.nombreCompleto || data.user?.name || email.split('@')[0];
        localStorage.setItem('userName', userName);
        
        onLogin(email, password, userRole, userName);
        
        // Redirigir según el rol del usuario
        if (userRole === 'administrador') {
          navigate('/admin-dashboard'); // Redirige al dashboard de administrador (debe coincidir con la ruta en App.tsx)
        } else {
          navigate('/form'); // Redirige al formulario para empleados
        }
      } else {
        console.error('Error de inicio de sesión:', data);
        setError(data.message || 'Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error de conexión completo:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    const nombreCompletoError = validateName(registerData.nombreCompleto);
    const apellidoError = validateName(registerData.apellido);
    const telefonoError = validatePhone(registerData.telefono);
    const passwordError = validatePassword(registerData.password);
    
    // Actualizar todos los errores de una vez
    setFieldErrors({
      nombreCompleto: nombreCompletoError,
      apellido: apellidoError,
      telefono: telefonoError,
      password: passwordError
    });
    
    // Si hay algún error, no enviar el formulario
    if (nombreCompletoError || apellidoError || telefonoError || passwordError) {
      setError('Por favor, corrija los errores en el formulario antes de enviar.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    console.log('Intentando crear cuenta con:', { 
      email: registerData.email, 
      role: registerData.rol // Log the role explicitly
    });

    try {
      const requestData = registerData;
      console.log('Datos de registro completo:', requestData);
      
      const response = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
        credentials: 'include' // Incluye cookies en la solicitud
      });
      
      console.log('Código de estado HTTP (registro):', response.status);
      console.log('Headers de respuesta (registro):', Object.fromEntries([...response.headers.entries()]));
      
      // Mostrar el texto crudo de la respuesta para diagnóstico
      const responseText = await response.text();
      console.log('Respuesta en texto (registro):', responseText);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          console.error('Error al parsear respuesta de error:', e);
          setError('Error en el formato de la respuesta del servidor');
          return;
        }
        console.error('Error de registro:', errorData);
        
        // Manejar errores de validación del servidor
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const serverErrors = errorData.errors;
          
          // Crear un objeto para almacenar los errores de campo
          const newFieldErrors = {
            nombreCompleto: '',
            apellido: '',
            telefono: '',
            password: ''
          };
          
          // Traducir los errores del servidor a nuestros campos
          serverErrors.forEach((err: { field: string; message: string }) => {
            if (err.field in newFieldErrors) {
              // @ts-expect-error - Sabemos que las claves son correctas
              newFieldErrors[err.field] = err.message;
            } else {
              // Si el error es para un campo que no tenemos mapeado, mostrarlo como error general
              setError(prevError => prevError ? `${prevError}. ${err.message}` : err.message);
            }
          });
          
          // Actualizar los errores de campo
          setFieldErrors(newFieldErrors);
          
          // Si no hay un error general aún, mostrar uno
          if (!errorData.message) {
            setError('Por favor, corrija los errores del formulario');
          } else {
            setError(errorData.message);
          }
        } else {
          // Para otros tipos de errores, simplemente mostrar el mensaje
          setError(errorData.message || 'Error al crear la cuenta');
        }
        return;
      }
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Error al parsear respuesta de éxito:', e);
        setError('Error en el formato de la respuesta del servidor');
        return;
      }
      
      console.log('Registro exitoso:', data);
      setSuccess(`Empleado registrado exitosamente como ${registerData.rol}`);
      setTimeout(() => {
        setIsCreatingAccount(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error de conexión completo (registro):', error);
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
    let errorMessage = '';
    
    // Validar el campo según su tipo
    if (field === 'nombreCompleto' || field === 'apellido') {
      errorMessage = validateName(value);
    } else if (field === 'telefono') {
      errorMessage = validatePhone(value);
    } else if (field === 'password') {
      errorMessage = validatePassword(value);
    }
    
    // Actualizar errores de campo
    setFieldErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
    
    // Actualizar el valor del campo
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
        <div className="login-card register-card">          <h1 className="login-title">Registro de Empleado</h1>
          <p className="login-subtitle">Crea una cuenta para un nuevo empleado en el sistema</p>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleCreateAccountSubmit} className="login-form">
            <div className="form-row">
              <div style={{ width: '100%', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Nombre completo" 
                  required 
                  className={`form-input ${fieldErrors.nombreCompleto ? 'error' : ''}`}
                  value={registerData.nombreCompleto}
                  onChange={(e) => handleRegisterChange('nombreCompleto', e.target.value)}
                  maxLength={50}
                />
                {fieldErrors.nombreCompleto && (
                  <div className="field-error">{fieldErrors.nombreCompleto}</div>
                )}
              </div>
              <div style={{ width: '100%', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Apellido" 
                  required 
                  className={`form-input ${fieldErrors.apellido ? 'error' : ''}`}
                  value={registerData.apellido}
                  onChange={(e) => handleRegisterChange('apellido', e.target.value)}
                  maxLength={50}
                />
                {fieldErrors.apellido && (
                  <div className="field-error">{fieldErrors.apellido}</div>
                )}
              </div>
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
                  className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                  value={registerData.password}
                  onChange={(e) => handleRegisterChange('password', e.target.value)}
                />
                {fieldErrors.password && (
                  <div className="field-error">{fieldErrors.password}</div>
                )}
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
              <div style={{ width: '100%', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Teléfono" 
                  required 
                  className={`form-input ${fieldErrors.telefono ? 'error' : ''}`}
                  value={registerData.telefono}
                  onChange={(e) => handleRegisterChange('telefono', e.target.value)}
                  maxLength={10}
                />
                {fieldErrors.telefono && (
                  <div className="field-error">{fieldErrors.telefono}</div>
                )}
              </div>
            </div>
            
            <div className="form-row single">
              <div className="form-group" style={{ width: '100%' }}>
                <label htmlFor="rol" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Seleccione el rol del empleado:</label>
                <select 
                  id="rol"
                  required 
                  className="form-input"
                  value={registerData.rol}
                  onChange={(e) => handleRegisterChange('rol', e.target.value)}
                >
                  <option value="empleado">Empleado</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? '' : 'Registrar Empleado'}
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
          ¿Necesitas registrar un empleado? <a href="#" className="register-link" onClick={handleRegisterClick}>Crear cuenta de empleado</a>
        </p>
      </div>
    </div>
  );
};

export default Login;