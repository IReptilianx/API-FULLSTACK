import { useState } from "react";
import { Dispatch } from "react";
import { ActivityActions, ActivityState } from "../reducers/activity-reducers";

type FormProps = {
  dispatch: Dispatch<ActivityActions>;
  state: ActivityState; // Ajusta el tipo del estado
};

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8080" 
  : "https://api-fullstack-ryb6.onrender.com";

function Form({ dispatch, state }: FormProps) {
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
  const [showModal, setShowModal] = useState(false);
  const [parkingSpots, setParkingSpots] = useState(
    Array.from({ length: 20 }, (_, i) => ({ id: i + 1, status: "available" }))
  );
  const [showHistory, setShowHistory] = useState(false);

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

  const handleSpotDeselection = (spotId: number) => {
    setParkingSpots((prevSpots) =>
      prevSpots.map((spot) =>
        spot.id === spotId
          ? { ...spot, status: "available" }
          : spot
      )
    );
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleExportPDF = () => {
    const summary = {
      nombre,
      placas,
      auto,
      color,
      apellido,
      telefono,
      hours,
      price,
      spot: selectedSpot,
      fecha: new Date().toLocaleString(),
    };

    const pdfContent = `Resumen Actual:\n\nNombre: ${summary.nombre}\nPlacas: ${summary.placas}\nTipo de Vehículo: ${summary.auto}\nColor: ${summary.color}\nApellido: ${summary.apellido}\nTeléfono: ${summary.telefono}\nHoras: ${summary.hours}\nPrecio: $${summary.price} MXN\nLugar: ${summary.spot}\nFecha: ${summary.fecha}`;

    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resumen.pdf";
    link.click();
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
      }

      setMessage("Datos guardados correctamente");
      setAlertType("success");
      dispatch({ type: "ADD_ACTIVITY", payload: newActivity });

      // Mantener el lugar seleccionado en rojo
      setParkingSpots((prevSpots) =>
        prevSpots.map((spot) =>
          spot.id === selectedSpot ? { ...spot, status: "occupied" } : spot
        )
      );

      setNombre("");
      setPlacas("");
      setAuto("");
      setColor("");
      setApellido("");
      setTelefono("");
      setSelectedSpot(null);
    } catch {
      setMessage("Error al guardar los datos");
      setAlertType("error");
    }
  };

  const handleShowHistory = () => {
    setShowHistory(true);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>📋 Registro de Cliente</h2>
      {message && (
        <div className={`form-message ${alertType === "success" ? "success" : "error"}`}>
          {alertType === "success" ? "✅ " : "❌ "}{message}
        </div>
      )}
      <div className="form-group">
        <label htmlFor="nombre">👤 Nombre del Cliente</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="apellido">👥 Apellido del Cliente</label>
        <input
          type="text"
          id="apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="telefono">📞 Teléfono del Cliente</label>
        <input
          type="text"
          id="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="placas">🚗 Placas del Vehículo</label>
        <input
          type="text"
          id="placas"
          value={placas}
          onChange={(e) => setPlacas(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="auto">🚙 Tipo de Vehículo (Carro o Camioneta)</label>
        <input
          type="text"
          id="auto"
          value={auto}
          onChange={(e) => setAuto(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="color">🎨 Color del Vehículo</label>
        <input
          type="text"
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="hours">⏳ Horas de Estacionamiento</label>
        <select
          id="hours"
          value={hours}
          onChange={handleHoursChange}
          required
        >
          {[...Array(24)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1} hora(s)</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <p>💰 Precio: ${price} MXN</p>
      </div>
      <div className="form-group">
        <button type="button" className="form-btn" onClick={handleModalOpen}>Elegir Lugar de Estacionamiento</button>
        {selectedSpot && <p>🅿️ Lugar seleccionado: {selectedSpot}</p>}
      </div>

      {showModal && (
        <div className="modal">
          <h3>Selecciona un lugar de estacionamiento</h3>
          <div className="parking-spots">
            {parkingSpots.map((spot) => (
              <button
                key={spot.id}
                className={`spot ${spot.status}`}
                style={{
                  backgroundColor: spot.status === "available" ? "#4CAF50" : "#f44336",
                  color: "white",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  fontSize: "16px",
                  border: "none",
                  cursor: spot.status === "available" ? "pointer" : "not-allowed",
                  margin: "5px",
                  outline: "none",
                }}
                onClick={() =>
                  spot.status === "available"
                    ? handleSpotSelection(spot.id)
                    : handleSpotDeselection(spot.id)
                }
              >
                {spot.id}
              </button>
            ))}
          </div>
        </div>
      )}

      <button type="submit" className="form-btn">💾 Guardar</button>

      {selectedSpot && (
        <div className="summary">
          <h3>Resumen Actual</h3>
          <p><strong>Estacionamiento:</strong> Normal</p>
          <p><strong>Vehículo:</strong> {auto}</p>
          <p><strong>Placas:</strong> {placas}</p>
          <p><strong>Color:</strong> {color}</p>
          <p><strong>Modelo:</strong> {auto}</p>
          <p><strong>Marca:</strong> {apellido}</p>
          <p><strong>Tiempo:</strong> {hours} horas</p>
          <p><strong>Lugar:</strong> #{selectedSpot}</p>
          <p><strong>Fecha:</strong> {new Date().toLocaleString()}</p>
          <p><strong>Total:</strong> ${price} MXN</p>
          <button type="button" className="form-btn" onClick={handleExportPDF}>Exportar a PDF</button>
          <button type="button" className="form-btn" onClick={handleShowHistory}>Ver Historial</button>
        </div>
      )}

      {showHistory && (
        <div className="history">
          <h3>Historial de Actividades</h3>
          <ul>
            {state.activities.map((activity) => (
              <li key={activity.id}>
                <p><strong>Nombre:</strong> {activity.name}</p>
                <p><strong>Servicio:</strong> {activity.service}</p>
                <p><strong>Placas:</strong> {activity.plates}</p>
                <p><strong>Tiempo:</strong> {activity.hours} horas</p>
                <p><strong>Precio:</strong> ${activity.price} MXN</p>
                <p><strong>Lugar:</strong> #{activity.spot}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

export default Form;