import { useState, useEffect } from "react";
import { Dispatch } from "react";
import { useNavigate } from "react-router-dom";
import { ActivityActions, ActivityState, Activity } from "../reducers/activity-reducers";
import jsPDF from "jspdf";
import "./Form.css";

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  state: ActivityState; // Ajusta el tipo del estado
};

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8080" 
  : "https://api-fullstack-ryb6.onrender.com";

function Form({ dispatch, state }: FormProps) {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [placas, setPlacas] = useState("");
  const [auto, setAuto] = useState("");
  const [color, setColor] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
  const [hours, setHours] = useState(1);
  const [price, setPrice] = useState(35);
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);  const [parkingSpots, setParkingSpots] = useState(
    Array.from({ length: 20 }, (_, i) => ({ id: i + 1, status: "available" }))
  );
  const [showHistory, setShowHistory] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHours = parseInt(e.target.value, 10);
    setHours(selectedHours);
    setPrice(selectedHours * 35);
  };
  const handleSpotSelection = (spotId: number) => {
    setSelectedSpot(spotId);
    setParkingSpots((prevSpots) =>
      prevSpots.map((spot) =>
        spot.id === spotId
          ? { ...spot, status: "occupied" }
          : spot
      )
    );
    setShowModal(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };
  const handleExportPDF = () => {
    const doc = new jsPDF();
      // Título del documento
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("AparClic! - RESUMEN DE REGISTRO", 105, 20, { align: "center" });
    
    // Línea separadora
    doc.setFontSize(12);
    doc.text("=" + "=".repeat(40), 105, 30, { align: "center" });
    
    // Información del cliente
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACION DEL CLIENTE:", 20, 45);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${nombre}`, 20, 55);
    doc.text(`Apellido: ${apellido}`, 20, 65);
    doc.text(`Telefono: ${telefono}`, 20, 75);
    
    // Información del vehículo
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACION DEL VEHICULO:", 20, 90);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Placas: ${placas}`, 20, 100);
    doc.text(`Tipo de Vehiculo: ${auto}`, 20, 110);
    doc.text(`Color: ${color}`, 20, 120);
    
    // Información del servicio
    doc.setFont("helvetica", "bold");
    doc.text("DETALLES DEL SERVICIO:", 20, 135);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Horas: ${hours}`, 20, 145);
    doc.text(`Precio: $${price} MXN`, 20, 155);
    doc.text(`Lugar: #${selectedSpot}`, 20, 165);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 175);
      // Pie del documento
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("AparClic! - Sistema de Estacionamiento Inteligente", 105, 200, { align: "center" });

    doc.save(`resumen_${nombre}_${placas}.pdf`);
    setMessage("✅ PDF exportado exitosamente");
    setAlertType("success");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !placas || !auto || !color || !apellido || !telefono || !selectedSpot) {
      setMessage("Todos los campos son obligatorios, incluyendo el lugar de estacionamiento");
      setAlertType("error");
      return;
    }

    const newClient = {
      nombre,
      apellido,
      telefono,
      placas,
      auto,
      color,
      hours,
      price,
      spot: selectedSpot,
    };

    const newActivity = {
      id: Date.now().toString(),
      category: 1,
      name: nombre,
      service: "Estacionamiento",
      client: nombre,
      plates: placas,
      startTime: Date.now(),
      price: price,
      calorias: 0,
      auto,
      color,
      apellido,
      telefono,
      hours,
      spot: selectedSpot,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessages = errorResponse.errors.map((err: { msg: string }) => err.msg).join(", ");
        setMessage(`Error: ${errorMessages}`);
        setAlertType("error");
        return;
      }      setMessage("Datos guardados correctamente");
      setAlertType("success");
      dispatch({ type: "ADD_ACTIVITY", payload: newActivity });

      // Mantener el lugar seleccionado en rojo
      setParkingSpots((prevSpots) =>
        prevSpots.map((spot) =>
          spot.id === selectedSpot ? { ...spot, status: "occupied" } : spot
        )
      );

      // Mostrar automáticamente el historial después de agregar un cliente
      setShowHistory(true);

      clearForm();
    } catch {
      setMessage("Error al guardar los datos");
      setAlertType("error");
    }
  };  const handleShowHistory = () => {
    setShowHistory(true);
  };

  const handleHideHistory = () => {
    setShowHistory(false);
  };
  const handleGenerateTicket = (activity: Activity) => {
    const doc = new jsPDF();    // Configurar el documento con texto limpio
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("AparClic! - TICKET DE ESTACIONAMIENTO", 105, 20, { align: "center" });
    
    // Línea separadora
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("=" + "=".repeat(50), 105, 30, { align: "center" });
    
    // Información del ticket
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL CLIENTE:", 20, 45);
    
    doc.setFont("helvetica", "normal");
    doc.text(`Nombre: ${activity.name}`, 20, 55);
    doc.text(`Servicio: ${activity.service}`, 20, 65);
    doc.text(`Placas: ${activity.plates}`, 20, 75);
    doc.text(`Tiempo: ${activity.hours} horas`, 20, 85);
    doc.text(`Precio: $${activity.price} MXN`, 20, 95);
    doc.text(`Lugar de estacionamiento: #${activity.spot}`, 20, 105);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 115);
    
    // Línea separadora inferior
    doc.text("=" + "=".repeat(50), 105, 125, { align: "center" });
    
    // Pie del ticket
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Gracias por su preferencia", 105, 140, { align: "center" });
    doc.text("Conserve este ticket hasta su salida", 105, 150, { align: "center" });
      // Información adicional
    doc.setFontSize(8);
    doc.text("AparClic! - Sistema de Estacionamiento Inteligente v1.0", 105, 170, { align: "center" });
    doc.text(`Ticket generado: ${new Date().toLocaleString()}`, 105, 180, { align: "center" });

    doc.save(`ticket_${activity.name}_${activity.plates}.pdf`);
    setMessage("✅ Ticket generado exitosamente");
    setAlertType("success");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteActivity = (id: string) => {
    dispatch({ type: "REMOVE_ACTIVITY", payload: id });
    setMessage("✅ Registro eliminado correctamente");
    setAlertType("success");
    setTimeout(() => setMessage(""), 3000);
  };  

  // Function to clear form
  const clearForm = () => {
    setNombre("");
    setPlacas("");
    setAuto("");
    setColor("");
    setApellido("");
    setTelefono("");
    setSelectedSpot(null);
    setHours(1);
    setPrice(35);
  };

  return (
    <div className="form-container">
      {/* Premium Header */}      <div className="form-header">
        <div className="form-title">AparClic! - Sistema de Estacionamiento</div>
        <div className="header-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            🏠 Inicio
          </button>
        </div>
      </div>
      
      {/* Alert Messages */}
      {message && (
        <div className={`form-message ${alertType === "success" ? "success" : "error"}`}>
          <div className="message-content">
            <span className="message-icon">{alertType === "success" ? "✅" : "❌"}</span>
            <span className="message-text">{message}</span>
          </div>
        </div>
      )}

      {/* Dashboard Widgets */}
      <div className="dashboard-widgets">
        <div className="clock-widget">
          <div className="widget-header">
            <span className="widget-icon">🕒</span>
            <span className="widget-title">Hora Actual</span>
          </div>
          <div className="clock-time">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="clock-date">
            {currentTime.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        <div className="stats-widget">
          <div className="widget-header">
            <span className="widget-icon">📊</span>
            <span className="widget-title">Estadísticas</span>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">{state.activities.length}</div>
              <div className="stat-label">Registros</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{parkingSpots.filter(spot => spot.status === "occupied").length}</div>
              <div className="stat-label">Ocupados</div>
            </div>
          </div>
        </div>

        <div className="occupancy-widget">
          <div className="widget-header">
            <span className="widget-icon">🅿️</span>
            <span className="widget-title">Ocupación</span>
          </div>
          <div className="occupancy-bar">
            <div 
              className="occupancy-fill" 
              style={{
                width: `${(parkingSpots.filter(spot => spot.status === "occupied").length / parkingSpots.length) * 100}%`
              }}
            ></div>
          </div>
          <div className="occupancy-text">
            {parkingSpots.filter(spot => spot.status === "occupied").length}/{parkingSpots.length} lugares
          </div>
        </div>

        <div className="revenue-widget">
          <div className="widget-header">
            <span className="widget-icon">💰</span>
            <span className="widget-title">Ingresos</span>
          </div>
          <div className="revenue-amount">
            ${state.activities.reduce((sum, activity) => sum + (activity.price || 0), 0)}
          </div>
          <div className="stat-label">MXN del día</div>
        </div>
      </div>      {/* Main Content Area */}
      <div className="form-left">
        {/* Client Information Section */}
        <div className="form-section client-section">
          <div className="section-header">
            <span className="section-icon">👤</span>
            <h3 className="section-title">Información del Cliente</h3>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">
                <span className="label-icon">👤</span>
                Nombre del Cliente
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Juan Carlos"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="apellido">
                <span className="label-icon">👥</span>
                Apellido del Cliente
              </label>
              <input
                type="text"
                id="apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ej: García López"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefono">
                <span className="label-icon">📞</span>
                Teléfono del Cliente
              </label>
              <input
                type="tel"
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 55-1234-5678"
                required
              />
            </div>
          </form>
        </div>

        {/* Vehicle Information Section */}
        <div className="form-section vehicle-section">
          <div className="section-header">
            <span className="section-icon">🚗</span>
            <h3 className="section-title">Información del Vehículo</h3>
          </div>
          
          <div className="form-group">
            <label htmlFor="placas">
              <span className="label-icon">🏷️</span>
              Placas del Vehículo
            </label>
            <input
              type="text"
              id="placas"
              value={placas}
              onChange={(e) => setPlacas(e.target.value)}
              placeholder="Ej: ABC-123-XYZ"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="auto">
              <span className="label-icon">🚙</span>
              Tipo de Vehículo
            </label>
            <select
              id="auto"
              value={auto}
              onChange={(e) => setAuto(e.target.value)}
              required
            >
              <option value="">Seleccione el tipo</option>
              <option value="Sedán">Sedán</option>
              <option value="SUV">SUV</option>
              <option value="Pickup">Pickup</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Motocicleta">Motocicleta</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="color">
              <span className="label-icon">🎨</span>
              Color del Vehículo
            </label>
            <input
              type="text"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Ej: Blanco, Negro, Azul"
              required
            />
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="form-section">
          <div className="section-header">
            <span className="section-icon">⚡</span>
            <h3 className="section-title">Acciones Rápidas</h3>
          </div>
          
          <div className="quick-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setHours(1);
                setPrice(35);
              }}
            >
              🕐 1 Hora
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setHours(3);
                setPrice(105);
              }}
            >
              🕒 3 Horas
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => {
                setHours(8);
                setPrice(280);
              }}
            >
              🕗 Día Completo
            </button>
          </div>
        </div>
      </div>      {/* Right Column */}
      <div className="form-right">
        {/* Service Configuration Section */}
        <div className="form-section service-section">
          <div className="section-header">
            <span className="section-icon">⚙️</span>
            <h3 className="section-title">Configuración del Servicio</h3>
          </div>
          
          <div className="form-group">
            <label htmlFor="hours">
              <span className="label-icon">⏳</span>
              Duración del Estacionamiento
            </label>
            <select
              id="hours"
              value={hours}
              onChange={handleHoursChange}
              required
            >
              {[...Array(24)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? 'hora' : 'horas'} - ${(i + 1) * 35} MXN
                </option>
              ))}
            </select>
          </div>
          
          <div className="price-display">
            <div className="price-label">Total a Pagar</div>
            <div className="price-amount">${price} MXN</div>
          </div>
        </div>

        {/* Parking Selection Section */}
        <div className="form-section">
          <div className="section-header">
            <span className="section-icon">🅿️</span>
            <h3 className="section-title">Selección de Lugar</h3>
          </div>
          
          <div className="parking-selection-area">
            {selectedSpot ? (
              <div className="selected-spot-info">
                <div className="spot-info-card">
                  <div className="spot-number">#{selectedSpot}</div>
                  <div className="spot-status">✅ Seleccionado</div>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setSelectedSpot(null)}
                  >
                    Cambiar Lugar
                  </button>
                </div>
              </div>
            ) : (
              <div className="parking-grid-container">
                <button 
                  type="button" 
                  className="btn btn-primary parking-select-btn"
                  onClick={handleModalOpen}
                >
                  🅿️ Seleccionar Lugar de Estacionamiento
                </button>
                
                <div className="mini-parking-preview">
                  <div className="preview-title">Vista Previa del Estacionamiento</div>
                  <div className="mini-parking-grid">
                    {parkingSpots.slice(0, 12).map((spot) => (
                      <div
                        key={spot.id}
                        className={`mini-spot ${spot.status}`}
                        title={`Lugar ${spot.id} - ${spot.status === "available" ? "Disponible" : "Ocupado"}`}
                      >
                        {spot.id}
                      </div>
                    ))}
                  </div>
                  <div className="parking-legend">
                    <div className="legend-item">
                      <div className="legend-color available"></div>
                      <span>Disponible</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color occupied"></div>
                      <span>Ocupado</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        {selectedSpot && (
          <div className="form-section summary-section">
            <div className="section-header">
              <span className="section-icon">📋</span>
              <h3 className="section-title">Resumen del Registro</h3>
            </div>
            
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">👤 Cliente:</span>
                <span className="summary-value">{nombre} {apellido}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">📞 Teléfono:</span>
                <span className="summary-value">{telefono}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">🚗 Vehículo:</span>
                <span className="summary-value">{auto} {color}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">🏷️ Placas:</span>
                <span className="summary-value">{placas}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">⏰ Duración:</span>
                <span className="summary-value">{hours} {hours === 1 ? 'hora' : 'horas'}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">🅿️ Lugar:</span>
                <span className="summary-value">#{selectedSpot}</span>
              </div>
              <div className="summary-item highlight">
                <span className="summary-label">💰 Total:</span>
                <span className="summary-value">${price} MXN</span>
              </div>
            </div>
          </div>
        )}

        {/* Information Panel */}
        <div className="form-section info-section">            <div className="section-header">
              <span className="section-icon">ℹ️</span>
              <h3 className="section-title">Información de AparClic!</h3>
            </div>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">💰</span>
              <div className="info-content">
                <div className="info-title">Tarifa</div>
                <div className="info-value">$35 MXN/hora</div>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">🅿️</span>
              <div className="info-content">
                <div className="info-title">Capacidad</div>
                <div className="info-value">20 lugares</div>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⏰</span>
              <div className="info-content">
                <div className="info-title">Horario</div>
                <div className="info-value">24/7</div>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📊</span>
              <div className="info-content">
                <div className="info-title">Ocupación</div>
                <div className="info-value">
                  {Math.round((parkingSpots.filter(spot => spot.status === "occupied").length / parkingSpots.length) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Premium Action Bar */}
      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!selectedSpot || !nombre || !placas || !auto || !color || !apellido || !telefono}
        >
          💾 Guardar Registro
        </button>
        
        {selectedSpot && (
          <button 
            type="button" 
            className="btn btn-success"
            onClick={handleExportPDF}
          >
            📄 Exportar PDF
          </button>
        )}
        
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={handleShowHistory}
        >
          📋 Ver Historial ({state.activities.length})
        </button>
      </div>

      {/* Ultra-Modern Modal for Parking Selection */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <span className="modal-icon">🅿️</span>
                Selecciona un Lugar de Estacionamiento
              </h3>
              <button 
                type="button" 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="parking-grid">
                {parkingSpots.map((spot) => (
                  <button
                    key={spot.id}
                    className={`parking-spot ${spot.status}`}
                    disabled={spot.status === "occupied"}
                    onClick={() => spot.status === "available" && handleSpotSelection(spot.id)}
                    title={`Lugar ${spot.id} - ${spot.status === "available" ? "Disponible" : "Ocupado"}`}
                  >
                    <div className="spot-number">{spot.id}</div>
                    <div className="spot-status-indicator">
                      {spot.status === "available" ? "✅" : "❌"}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="parking-info">
                <div className="info-row">
                  <div className="legend-item">
                    <div className="legend-indicator available"></div>
                    <span>Disponible ({parkingSpots.filter(s => s.status === "available").length})</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-indicator occupied"></div>
                    <span>Ocupado ({parkingSpots.filter(s => s.status === "occupied").length})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}      {/* Enhanced History Section */}
      {showHistory && (
        <div className="history-overlay" onClick={handleHideHistory}>
          <div className="history-container" onClick={(e) => e.stopPropagation()}>
            <div className="history-header">
              <div className="history-title">
                <span className="history-icon">📋</span>
                <h3>Historial de Actividades</h3>
                <span className="history-count">({state.activities.length})</span>
              </div>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleHideHistory}
              >
                ✕ Cerrar
              </button>
            </div>
            
            <div className="history-content">
              {state.activities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h4>No hay registros disponibles</h4>
                  <p>Los registros de estacionamiento aparecerán aquí una vez que guardes tu primer cliente.</p>
                </div>
              ) : (
                <div className="activities-grid">
                  {state.activities.map((activity) => (
                    <div key={activity.id} className="activity-card">
                      <div className="activity-header">
                        <div className="activity-avatar">
                          {activity.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="activity-info">
                          <h4 className="activity-name">{activity.name} {activity.apellido}</h4>
                          <p className="activity-meta">
                            {activity.plates} • {activity.auto} {activity.color}
                          </p>
                        </div>
                        <div className="activity-spot">#{activity.spot}</div>
                      </div>
                      
                      <div className="activity-details">
                        <div className="detail-row">
                          <span className="detail-label">⏰ Duración:</span>
                          <span className="detail-value">{activity.hours}h</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">💰 Precio:</span>
                          <span className="detail-value">${activity.price} MXN</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">📞 Teléfono:</span>
                          <span className="detail-value">{activity.telefono}</span>
                        </div>
                      </div>
                      
                      <div className="activity-actions">
                        <button 
                          type="button" 
                          className="btn btn-primary activity-btn"
                          onClick={() => handleGenerateTicket(activity)}
                        >
                          🎫 Ticket
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-danger activity-btn"
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;