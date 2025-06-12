import { useEffect, useState } from "react";
import { Activity } from "../reducers/activity-reducers";
import jsPDF from "jspdf";

interface ActivityListProps {
  activities: Activity[];
}

function ActivityList({ activities }: ActivityListProps) {
  const [activityList, setActivityList] = useState(activities);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    setActivityList(activities);
  }, [activities]);

  const generateTicket = (activity: Activity) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Ticket de Estacionamiento", 10, 10);

    doc.setFontSize(12);
    doc.text(`Nombre: ${activity.name}`, 10, 20);
    doc.text(`Servicio: ${activity.service}`, 10, 30);
    doc.text(`Placas: ${activity.plates}`, 10, 40);
    doc.text(`Tiempo: ${activity.hours} horas`, 10, 50);
    doc.text(`Precio: ${activity.price} MXN`, 10, 60);
    doc.text(`Lugar de estacionamiento: #${activity.spot}`, 10, 70);

    doc.save(`ticket_${activity.id}.pdf`);
  };

  const deleteActivity = (id: string) => {
    setActivityList(activityList.filter((activity) => activity.id !== id));
    setAlertMessage("El registro ha sido eliminado correctamente.");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  return (
    <div className="activity-list">
      <h2>Historial de Actividades</h2>
      {alertMessage && (
        <div
          style={{
            backgroundColor: "#f44336",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "10px",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          {alertMessage}
        </div>
      )}
      {activityList.length === 0 ? (
        <p>No hay actividades registradas.</p>
      ) : (
        <ul>
          {activityList.map((activity) => (
            <li key={activity.id}>
              <div className="activity-item" key={activity.id}>
                <h3>{activity.name}</h3>
                <p>Servicio: {activity.service}</p>
                <p>Placas: {activity.plates}</p>
                <p>Tiempo: {activity.hours} horas</p>
                <p>Precio: ${activity.price} MXN</p>
                <p>Lugar de estacionamiento: #{activity.spot}</p>
                <button
                  className="generate-ticket-btn"
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                  onClick={() => generateTicket(activity)}
                >
                  Generar Ticket
                </button>
                <button
                  className="delete-activity-btn"
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginLeft: "10px",
                  }}
                  onClick={() => deleteActivity(activity.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityList;
