export type Activity = {
  id: string; // Cambiado a string para UUID
  category: number;
  name: string;
  calorias: number;
  service: string; // Tipo de servicio
  plates: string; // Placas del vehículo
  client: string;
  startTime?: number; // Tiempo de inicio para estacionamiento
  price?: number; // Precio fijo para otros servicios
  hours?: number; // Agregado para tiempo de estacionamiento
  spot?: number; // Agregado para lugar de estacionamiento
  auto?: string; // Tipo de vehículo
  color?: string; // Color del vehículo
  apellido?: string; // Apellido del cliente
  telefono?: string; // Teléfono del cliente
  status: 'activo' | 'finalizado'; // Estado del servicio
  clientId?: number; // ID del cliente en la base de datos
  isDisabled?: boolean; // Indica si el cliente tiene discapacidad
};

export type ActivityActions =
  | { type: "ADD_ACTIVITY"; payload: Activity }
  | { type: "REMOVE_ACTIVITY"; payload: string } // Updated to use UUID
  | { type: "FINISH_SERVICE"; payload: { id: string; hours?: number; price?: number } } // Actualizado para incluir horas y precio final
  | { type: "LOAD_ACTIVITIES"; payload: Activity[] } // Cargar actividades guardadas
  | { type: "RESET" };

export type ActivityState = {
  activities: Activity[];
  activeId?: Activity["id"];
};

// Cargar el estado desde localStorage si existe
const loadInitialState = (): ActivityState => {
  const savedState = localStorage.getItem('parkingActivities');
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (e) {
      console.error('Error parsing saved state:', e);
    }
  }
  return { activities: [] };
};

export const initialState: ActivityState = loadInitialState();

// Guardar el estado en localStorage cada vez que cambia
const saveState = (state: ActivityState) => {
  localStorage.setItem('parkingActivities', JSON.stringify(state));
};

export function activityReducer(state: ActivityState, action: ActivityActions): ActivityState {
  let newState: ActivityState;

  switch (action.type) {
    case "ADD_ACTIVITY":
      newState = {
        ...state,
        activities: [...state.activities, action.payload],
      };
      break;
    case "REMOVE_ACTIVITY":
      newState = {
        ...state,
        activities: state.activities.filter((activity) => activity.id !== action.payload),
      };
      break;
    case "FINISH_SERVICE":
      newState = {
        ...state,
        activities: state.activities.map((activity) =>
          activity.id === action.payload.id
            ? { 
                ...activity, 
                status: 'finalizado',
                // Actualizar horas y precio si se proporcionan
                hours: action.payload.hours !== undefined ? action.payload.hours : activity.hours,
                price: action.payload.price !== undefined ? action.payload.price : activity.price
              }
            : activity
        ),
      };
      break;
    case "LOAD_ACTIVITIES": {
      // Al cargar las actividades, aseguramos que los estados (activo/finalizado) 
      // se respeten desde el servidor
      
      // Primero, verificamos si hay actividades con clientId que están tanto en el payload como en el estado actual
      const payloadClientIds = new Set(
        action.payload
          .filter(act => act.clientId !== undefined)
          .map(act => act.clientId)
      );
      
      // Eliminamos del estado actual las actividades que tengan un clientId que está en el payload
      // porque estas serán reemplazadas por las versiones actualizadas del servidor
      const filteredActivities = state.activities.filter(act => 
        !act.clientId || !payloadClientIds.has(act.clientId)
      );
      
      newState = {
        ...state,
        activities: [...action.payload, ...filteredActivities],
      };
      break;
    }
    case "RESET":
      newState = { activities: [] };
      break;
    default:
      return state;
  }

  // Guardar el estado en localStorage
  saveState(newState);
  return newState;
}