import React, { useState } from 'react';
import './Home.css';
import Login from './Login';

const Home: React.FC = () => {
    const [modalContent, setModalContent] = useState<null | string>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const closeModal = () => setModalContent(null);

    const handleLogin = (email: string) => {
        console.log(`Logged in with ${email}`);
        setIsLoggedIn(true);
    };

    if (showLogin && !isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="home-container">
            <nav className="home-nav">
                <ul>
                    <li><a href="#">Inicio</a></li>
                    <li>
                        <a href="#" onClick={() => setModalContent("contacto")}>Contacto</a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setModalContent("ubicacion")}>Ubicación</a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setModalContent("precios")}>Precios</a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setModalContent("acerca")}>Acerca de Nosotros</a>
                    </li>
                </ul>
            </nav>

            {modalContent && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {modalContent === "contacto" && (
                            <>
                                <h2>📲Contacto</h2>
                                <p><strong>Encargado:</strong> Oscar Garduño Reyes</p>
                                <p><strong>Correo:</strong> garduñoreyes@gmail.com</p>
                                <p><strong>Teléfono:</strong> 7121416913</p>
                            </>
                        )}
                        {modalContent === "ubicacion" && (
                            <>
                                <h2>📍Ubicación</h2>
                                <p>Avenida de los Estacionamientos #123</p>
                                <p>Colonia Centro, Ciudad Ficticia</p>
                                <p>C.P. 12345</p>
                            </>
                        )}
                        {modalContent === "precios" && (
                            <>
                                <h2>💲Precios</h2>
                                <p><strong>Hora:</strong> $35.00 MXN</p>
                                <p><strong>Tarifa diaria:</strong> $80.00 MXN</p>
                                <p><strong>Mensualidad:</strong> $900.00 MXN</p>
                            </>
                        )}
                        {modalContent === "acerca" && (
                            <>
                                <h2>ℹ️Acerca de Nosotros</h2>
                                <p>Somos una empresa dedicada a la automatización de estacionamientos.</p>
                                <p>Buscamos optimizar la experiencia del usuario con soluciones eficientes, seguras y tecnológicas.</p>
                            </>
                        )}
                        <button onClick={closeModal}>✖️ Cerrar</button>
                    </div>
                </div>
            )}

            <header className="home-header">
                <h1>Sistema de Automatización para Estacionamientos</h1>
                <p>Bienvenido al sistema de automatización para estacionamientos. Aquí podrás gestionar tus actividades de manera eficiente y en tiempo real.</p>
            </header>

            <main className="home-main">
                <div className="features">
                    <div className="feature-card">
                        <span style={{ fontSize: '50px' }}>🧑‍💼</span>
                        <p>Crea y administra perfiles de clientes para mayor control y seguridad.</p>
                    </div>
                    <div className="feature-card">
                        <span style={{ fontSize: '50px' }}>🎟️</span>
                        <p>Emite tickets digitales para un control preciso de entradas y salidas.</p>
                    </div>
                    <div className="feature-card">
                        <span style={{ fontSize: '50px' }}>📡</span>
                        <p>Supervisa el estado del estacionamiento en tiempo real para una gestión eficiente.</p>
                    </div>
                </div>
                <div className="actions">
                    <button className="action-button" onClick={() => setShowLogin(true)}>¡Comenzar!</button>
                </div>
            </main>
        </div>
    );
};

export default Home;
