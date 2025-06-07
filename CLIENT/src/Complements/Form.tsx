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

function Form({ dispatch }: FormProps) {
  const [nombre, setNombre] = useState("");
  const [placas, setPlacas] = useState("");
  const [auto, setAuto] = useState("");
  const [color, setColor] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !placas || !auto || !color || !apellido || !telefono) {
      setMessage("Todos los campos son obligatorios");
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
    };

    const newActivity = {
      id: Date.now().toString(),
      category: 1, // Ejemplo de categoría
      name: nombre,
      service: "Estacionamiento",
      client: nombre,
      plates: placas,
      startTime: Date.now(),
      price: 0, // Precio por defecto
      calorias: 0, // Valor predeterminado para calorías
      auto,
      color,
      apellido,
      telefono,
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
      setNombre("");
      setPlacas("");
      setAuto("");
      setColor("");
      setApellido("");
      setTelefono("");
    } catch {
      setMessage("Error al guardar los datos");
      setAlertType("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Registro de Cliente</h2>
      {message && (
        <div className={`form-message ${alertType === "success" ? "success" : "error"}`}>{message}</div>
      )}
      <div className="form-group">
        <label htmlFor="nombre">Nombre del Cliente</label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="apellido">Apellido del Cliente</label>
        <input
          type="text"
          id="apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="telefono">Teléfono del Cliente</label>
        <input
          type="text"
          id="telefono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="placas">Placas del Vehículo</label>
        <input
          type="text"
          id="placas"
          value={placas}
          onChange={(e) => setPlacas(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="auto">Tipo de Vehículo (Carro o Camioneta)</label>
        <input
          type="text"
          id="auto"
          value={auto}
          onChange={(e) => setAuto(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="color">Color del Vehículo</label>
        <input
          type="text"
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="form-btn">Guardar</button>
    </form>
  );
}

export default Form;