import { useReducer, useEffect, useState } from 'react';
import { activityReducer, initialState, Activity, ActivityState } from './reducers/activity-reducers';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? "http://localhost:8080"
  : "https://api-fullstack-ryb6.onrender.com";

// Hook personalizado para usar el reducer con persistencia y carga inicial
export const useActivityStore = () => {
  const [state, dispatch] = useReducer(activityReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
    // Definir interface para los datos del cliente
  interface ClientData {
    id: number;
    nombre: string;
    apellido: string;
    telefono: string;
    placas: string;
    auto: string;
    color: string;
    status: 'activo' | 'finalizado';
    hours: number;
    price: number;
    spotId: number;
    startTime: string;
    endTime?: string;
    isDisabled: boolean;
  }

  // Función para convertir datos del cliente en objeto Activity
  const clientToActivity = (client: ClientData, prefix: string): Activity => ({
    id: `server-${prefix}-${client.id}`,
    category: 1,
    name: client.nombre,
    service: "Estacionamiento",
    client: client.nombre,
    plates: client.placas,
    startTime: new Date(client.startTime).getTime(),
    price: client.price,
    calorias: 0,
    auto: client.auto,
    color: client.color,
    apellido: client.apellido,
    telefono: client.telefono,
    hours: client.hours,
    spot: client.spotId,
    status: client.status,
    clientId: client.id,
    isDisabled: client.isDisabled
  });

  // Efecto para cargar los clientes activos y finalizados al iniciar
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        
        // Cargar clientes activos y finalizados en paralelo
        const [activeClientsResponse, finishedClientsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/clients/active`),
          fetch(`${API_BASE_URL}/api/clients/finished`)
        ]);
        
        if (!activeClientsResponse.ok) {
          throw new Error('Error al cargar clientes activos');
        }
        
        if (!finishedClientsResponse.ok) {
          throw new Error('Error al cargar clientes finalizados');
        }

        const activeClientsData = await activeClientsResponse.json();
        const finishedClientsData = await finishedClientsResponse.json();
        
        // Transformar los datos de clientes activos al formato de actividades
        const activeActivities: Activity[] = activeClientsData.data && Array.isArray(activeClientsData.data) ? 
          activeClientsData.data.map((client: ClientData) => clientToActivity(client, 'active')) : [];
          
        // Transformar los datos de clientes finalizados al formato de actividades
        const finishedActivities: Activity[] = finishedClientsData.data && Array.isArray(finishedClientsData.data) ? 
          finishedClientsData.data.map((client: ClientData) => clientToActivity(client, 'finished')) : [];

        // Combinar clientes activos y finalizados
        const serverActivities = [...activeActivities, ...finishedActivities];
          
        // Evitar duplicados comparando por ID de cliente
        // Si ya tenemos el registro en localStorage, no lo agregamos nuevamente
        const clientIdsFromApi = new Set(serverActivities.map(act => act.clientId));
        const localActivities = state.activities.filter(activity => 
          // Conservamos actividades locales que no están en la API o que no tienen clientId
          !activity.clientId || !clientIdsFromApi.has(activity.clientId)
        );

        dispatch({
          type: "LOAD_ACTIVITIES",
          payload: [...serverActivities, ...localActivities]
        });
      } catch (error) {
        console.error("Error cargando clientes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  // No es necesario incluir state.activities como dependencia ya que solo necesitamos cargar los clientes una vez al inicio
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para finalizar un servicio
  const finishService = async (activityId: string, clientId?: number) => {
    // Si hay un ID de cliente, actualizamos en el servidor
    if (clientId) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/finish`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al finalizar el servicio en el servidor');
        }
        
        // Obtener la respuesta del servidor con el precio actualizado
        const data = await response.json();
        
        // Actualizar la actividad con el precio y horas finales
        dispatch({ 
          type: "FINISH_SERVICE", 
          payload: { 
            id: activityId, 
            hours: data.hoursParked, 
            price: data.finalPrice 
          } 
        });
        
        // Ya no eliminamos la actividad después de finalizar, mantenemos el historial
        
        return data; // Devolver la respuesta para que pueda ser usada por el componente
        
      } catch (error) {
        console.error("Error finalizando el servicio:", error);
        return null;
      }
    } else {
      // Si no hay ID de cliente, solo actualizamos el estado local
      dispatch({ type: "FINISH_SERVICE", payload: { id: activityId } });
      return null;
    }
  };

  // Asegurar que los lugares de estacionamiento ocupados se actualicen cuando cambia el estado
  useEffect(() => {
    // Solo actualizamos cuando hay cambios en las actividades
    if (state.activities.length > 0) {
      // Encontrar todas las actividades activas con lugares de estacionamiento asignados
      const activeActivitiesWithSpots = state.activities.filter(
        activity => activity.status === 'activo' && activity.spot
      );
      
      console.log('Actividades activas con lugares de estacionamiento:', activeActivitiesWithSpots);
    }
  }, [state.activities]);

  return { state, dispatch, isLoading, finishService };
};