import React, { useState, useEffect } from 'react';
import './Home.css';
import Login from './Login';

const Home: React.FC = () => {
    const [modalContent, setModalContent] = useState<null | string>(null);
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Reset state when component mounts (when returning to Home)
    useEffect(() => {
        setShowLogin(false);
        setIsLoggedIn(false);
        setModalContent(null);
    }, []);    // Manage body scroll when modal is open
    useEffect(() => {
        if (modalContent) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
            document.documentElement.style.overflow = 'hidden';
            document.documentElement.classList.add('modal-open');
        } else {
            document.body.style.overflow = 'auto';
            document.body.classList.remove('modal-open');
            document.documentElement.style.overflow = 'auto';
            document.documentElement.classList.remove('modal-open');
        }
        
        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'auto';
            document.body.classList.remove('modal-open');
            document.documentElement.style.overflow = 'auto';
            document.documentElement.classList.remove('modal-open');
        };
    }, [modalContent]);

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
                    <li><a href="#">AparClic!</a></li>
                    <li>
                        <a href="#" onClick={() => setModalContent("contacto")}>Contacto</a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setModalContent("ubicacion")}>Ubicación</a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setModalContent("precios")}>Precios</a>
                    </li>                    <li>
                        <a href="#" onClick={() => setModalContent("acerca")}>Acerca de AparClic!</a>
                    </li>
                </ul>
            </nav>            {modalContent && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>×</button>
                          {modalContent === "contacto" && (
                            <>
                                <div className="modal-header">
                                    <div className="modal-icon contact-icon">📞</div>
                                    <h2>Información de Contacto</h2>
                                </div>
                                <div className="modal-body">
                                    <div className="contact-item">
                                        <span className="label">Encargado</span>
                                        <span className="value">Oscar Garduño Reyes</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="label">Correo Electrónico</span>
                                        <span className="value">garduñoreyes@gmail.com</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="label">Teléfono</span>
                                        <span className="value">712 141 6913</span>
                                    </div>
                                </div>
                            </>
                        )}                        {modalContent === "ubicacion" && (
                            <>
                                <div className="modal-header">
                                    <div className="modal-icon location-icon">📍</div>
                                    <h2>Nuestra Ubicación</h2>
                                </div>
                                <div className="modal-body">
                                    <div className="location-item">
                                        <span className="label">Dirección</span>
                                        <span className="value">Manzana 007, Francisco I Madero</span>
                                    </div>
                                    <div className="location-item">
                                        <span className="label">Municipio</span>
                                        <span className="value">El Oro de Hidalgo</span>
                                    </div>
                                    <div className="location-item">
                                        <span className="label">Código Postal</span>
                                        <span className="value">50603</span>
                                    </div>
                                </div>
                            </>
                        )}                        {modalContent === "precios" && (
                            <>
                                <div className="modal-header">
                                    <div className="modal-icon price-icon">💰</div>
                                    <h2>Tarifas y Precios</h2>
                                </div>
                                <div className="modal-body">
                                    <div className="price-grid">
                                        <div className="price-card">
                                            <h3>Por Hora</h3>
                                            <div className="price">$35.00 <span>MXN</span></div>
                                            <p>Ideal para estancias cortas</p>
                                        </div>
                                        <div className="price-card">
                                            <h3>Tarifa Diaria</h3>
                                            <div className="price">$280.00 <span>MXN</span></div>
                                            <p>Hasta 24 horas completas</p>
                                        </div>
                                        <div className="price-card featured">
                                            <h3>Mensualidad</h3>
                                            <div className="price">$900.00 <span>MXN</span></div>
                                            <p>La mejor opción para usuarios frecuentes</p>
                                            <div className="badge">Más Popular</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}                        {modalContent === "acerca" && (
                            <>                                <div className="modal-header">
                                    <div className="modal-icon about-icon">🏢</div>
                                    <h2>Acerca de AparClic!</h2>
                                </div>
                                <div className="modal-body">
                                    <div className="about-section">
                                        <h3>Nuestra Misión</h3>
                                        <p>AparClic! es una empresa líder en automatización de estacionamientos, comprometida con la innovación y la excelencia en el servicio al cliente.</p>
                                    </div>
                                    <div className="about-section">
                                        <h3>Nuestra Visión</h3>
                                        <p>Proporcionar soluciones tecnológicas avanzadas que optimicen la gestión de estacionamientos con AparClic!, mejorando la experiencia del usuario y la eficiencia operativa.</p>
                                    </div>
                                    <div className="about-features">
                                        <div className="feature-item">
                                            <span className="feature-icon">⚡</span>
                                            <span>Tecnología de Vanguardia</span>
                                        </div>
                                        <div className="feature-item">
                                            <span className="feature-icon">🛡️</span>
                                            <span>Seguridad Garantizada</span>
                                        </div>
                                        <div className="feature-item">
                                            <span className="feature-icon">📱</span>
                                            <span>Interfaz Intuitiva</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <main className="home-main">                <header className="home-header">
                    <h1>
                        <span>AparClic!</span><br />
                        Sistema de Estacionamiento Inteligente
                    </h1>
                    <p>
                        Revoluciona la gestión de tu estacionamiento con AparClic!. 
                        Control total, eficiencia máxima y experiencia de usuario excepcional.
                    </p>
                </header>

                <div className="features">
                    <div className="feature-card">
                        <span className="icon">👥</span>
                        <p>
                            <strong>Gestión de Clientes</strong><br />
                            Sistema avanzado de perfiles y seguimiento de clientes para un control completo y personalizado.
                        </p>
                    </div>
                    <div className="feature-card">
                        <span className="icon">🎫</span>
                        <p>
                            <strong>Tickets Digitales</strong><br />
                            Generación automática de tickets con códigos únicos y seguimiento en tiempo real.
                        </p>
                    </div>
                    <div className="feature-card">
                        <span className="icon">📊</span>
                        <p>
                            <strong>Monitoreo en Tiempo Real</strong><br />
                            Dashboard inteligente con estadísticas, ocupación y análisis de ingresos instantáneos.
                        </p>
                    </div>
                </div>

                <div className="actions">
                    <button className="action-button" onClick={() => setShowLogin(true)}>
                        ¡Comenzar Ahora!
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;
