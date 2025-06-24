import { useEffect, useState } from "react";
import { Activity } from "../reducers/activity-reducers";
import jsPDF from "jspdf";
import { useActivityStore } from "../store";
import "./ActivityList.css";

interface ActivityListProps {
  activities: Activity[];
}

function ActivityList({ activities }: ActivityListProps) {
  const [activityList, setActivityList] = useState(activities);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const { finishService } = useActivityStore();
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishingActivity, setFinishingActivity] = useState<Activity | null>(null);
  const [finalServiceData, setFinalServiceData] = useState<{
    hoursParked: number, 
    finalPrice: number,
    realMinutes?: number,
    isDemo?: boolean
  } | null>(null);

  useEffect(() => {
    setActivityList(activities);
  }, [activities]);

  const generateTicket = (activity: Activity) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("AparClic! - Ticket de Estacionamiento", 10, 10);

    doc.setFontSize(12);
    doc.text(`Nombre: ${activity.name}`, 10, 20);
    doc.text(`Servicio: ${activity.service}`, 10, 30);
    doc.text(`Placas: ${activity.plates}`, 10, 40);
    doc.text(`Tiempo: ${activity.hours} horas`, 10, 50);
    doc.text(`Precio: ${activity.price} MXN`, 10, 60);
    doc.text(`Lugar de estacionamiento: #${activity.spot}`, 10, 70);
    doc.text(`Estado: ${activity.status === 'activo' ? 'En curso' : 'Finalizado'}`, 10, 80);

    doc.save(`ticket_${activity.id}.pdf`);
  };

  const handleDeleteActivity = (id: string) => {
    setActivityList(activityList.filter((activity) => activity.id !== id));
    setAlertType('success');
    setAlertMessage("El registro ha sido eliminado correctamente.");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const handleFinishService = async (activity: Activity) => {
    if (activity.status === 'finalizado') {
      setAlertType('error');
      setAlertMessage("Este servicio ya ha sido finalizado.");
      setTimeout(() => setAlertMessage(null), 3000);
      return;
    }
    
    // Guardar la actividad que se está finalizando
    setFinishingActivity(activity);
    setShowFinishModal(true);
    
    // Llamar al servicio para finalizar
    const result = await finishService(activity.id, activity.clientId);
    
    if (result) {
      setFinalServiceData({
        hoursParked: result.hoursParked,
        finalPrice: result.finalPrice,
        realMinutes: result.realMinutes,
        isDemo: result.isDemo
      });
    }
    
    setAlertType('success');
    setAlertMessage("Servicio finalizado correctamente. El cajón de estacionamiento ha sido liberado.");
    setTimeout(() => setAlertMessage(null), 3000);
  };

  return (
    <div className="activity-list">
      <h2>Historial de Actividades</h2>
      {alertMessage && (
        <div
          style={{
            backgroundColor: alertType === 'success' ? "#4CAF50" : "#f44336",
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
              <div 
                className="activity-item" 
                key={activity.id}
                style={{
                  border: `2px solid ${activity.status === 'activo' ? '#4CAF50' : '#999'}`,
                  opacity: activity.status === 'activo' ? 1 : 0.7,
                }}
              >
                <h3>{activity.name}</h3>
                <p>Servicio: {activity.service}</p>
                <p>Placas: {activity.plates}</p>
                <p>Tiempo: {activity.hours} horas</p>
                <p>Precio: ${activity.price} MXN</p>
                <p>Lugar de estacionamiento: #{activity.spot}</p>
                <p>Estado: <span style={{ 
                  fontWeight: 'bold', 
                  color: activity.status === 'activo' ? '#4CAF50' : '#999' 
                }}>
                  {activity.status === 'activo' ? 'Activo' : 'Finalizado'}
                </span></p>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
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
                  
                  {activity.status === 'activo' && (
                    <button
                      className="finish-service-btn"
                      style={{
                        backgroundColor: "#2196F3",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                      onClick={() => handleFinishService(activity)}
                    >
                      Finalizar Servicio
                    </button>
                  )}
                  
                  {/* Botón de eliminar deshabilitado para empleados - solo administradores pueden eliminar registros */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {/* Modal de finalización de servicio */}
      {showFinishModal && finishingActivity && (
        <div className="modal-overlay">
          <div className="modal-container finish-modal">
            <div className="modal-header">
              <h2 className="modal-title">
                <span className="modal-icon">✅</span>
                Servicio Finalizado
              </h2>
              <div className="modal-close" onClick={() => setShowFinishModal(false)}>✖</div>
            </div>
            <div className="modal-body">
              <div className="finish-details">
                <div className="finish-client">
                  <strong>Cliente:</strong> {finishingActivity.name} {finishingActivity.apellido}
                </div>
                <div className="finish-vehicle">
                  <strong>Vehículo:</strong> {finishingActivity.auto} {finishingActivity.color} - Placas: {finishingActivity.plates}
                </div>
                <div className="finish-location">
                  <strong>Lugar:</strong> #{finishingActivity.spot}
                </div>
                
                <div className="finish-divider"></div>
                
                {finalServiceData ? (
                  <>
                    {finalServiceData.isDemo && (
                      <div className="demo-mode-banner">
                        🚀 MODO DEMOSTRATIVO ACELERADO 🚀
                        <div className="demo-explanation">
                          1 minuto real = 1 hora simulada
                        </div>
                      </div>
                    )}
                    
                    <div className="finish-time">
                      <strong>Tiempo de estacionamiento:</strong> {finalServiceData.hoursParked} {finalServiceData.hoursParked === 1 ? 'hora' : 'horas'}
                    </div>
                    
                    {finalServiceData.realMinutes !== undefined && (
                      <div className="finish-real-time">
                        <strong>Tiempo real transcurrido:</strong> {finalServiceData.realMinutes} {finalServiceData.realMinutes === 1 ? 'minuto' : 'minutos'}
                      </div>
                    )}
                    
                    <div className="finish-price">
                      <strong>Precio final:</strong> ${finalServiceData.finalPrice} MXN
                    </div>
                  </>
                ) : (
                  <div className="finish-loading">Calculando tiempo y precio final...</div>
                )}
              </div>
              
              <div className="finish-actions">
                <button className="btn btn-primary" onClick={() => {
                  if (finishingActivity && finalServiceData) {
                    generateTicket({
                      ...finishingActivity,
                      hours: finalServiceData.hoursParked,
                      price: finalServiceData.finalPrice,
                      status: 'finalizado'
                    });
                  }
                  setShowFinishModal(false);
                }}>
                  🎫 Generar Ticket
                </button>
                <button className="btn btn-outline" onClick={() => setShowFinishModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityList;
