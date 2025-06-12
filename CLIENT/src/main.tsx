import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Complements/Home';
import Login from './Complements/Login';
import FormWrapper from './Complements/FormWrapper';

const handleLogin = (email: string, password: string) => {
  console.log(`User logged in: ${email}`);
  // Aquí puedes agregar lógica adicional como guardar el estado de autenticación
  // El password se puede usar para validaciones adicionales si es necesario
  if (password) {
    localStorage.setItem('userEmail', email);
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/form" element={<FormWrapper />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
