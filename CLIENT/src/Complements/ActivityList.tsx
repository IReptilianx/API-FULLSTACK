import React, { useEffect, useState } from "react";

interface Activity {
  id: string;
  service: string;
  client: string;
  plates?: string;
  startTime?: number;
  price?: number;
}

interface ActivityListProps {
  activities: Activity[];
}

function ActivityList({ activities }: ActivityListProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateCost = (startTime: number | undefined) => {
    if (!startTime) return 0;
    const elapsedSeconds = (currentTime - startTime) / 1000;
    const ratePerHour = 20; // Tarifa por hora
    return Math.ceil((elapsedSeconds / 3600) * ratePerHour);
  };

  const formatTime = (startTime: number | undefined) => {
    if (!startTime) return "00:00:00";
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="activity-list">
      <h2>Historial de Actividades</h2>
      {activities.length === 0 ? (
        <p>No hay actividades registradas.</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              <div>
                <p>
                  <b>Servicio:</b> {activity.service}
                </p>
                <p>
                  <b>Cliente:</b> {activity.client}
                </p>
                {activity.service === "Estacionamiento" && (
                  <>
                    <p>
                      <b>Placas:</b> {activity.plates}
                    </p>
                    <p>
                      <b>Tiempo:</b> {formatTime(activity.startTime)}
                    </p>
                    <p>
                      <b>Costo:</b> ${calculateCost(activity.startTime)}
                    </p>
                  </>
                )}
                {activity.service !== "Estacionamiento" && (
                  <p>
                    <b>Precio:</b> ${activity.price}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityList;
