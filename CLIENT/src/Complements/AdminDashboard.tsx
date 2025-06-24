import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8080" 
  : "https://api-fullstack-ryb6.onrender.com";

interface Client {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  placas: string;
  auto: string;
  color: string;
  status: string;
  hours: number;
  price: number;
  spotId: number;
  isDisabled: boolean;
  startTime: string;
  endTime?: string;
}

interface User {
  id: number;
  nombreCompleto: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string;
}

interface ParkingSpot {
  id: number;
  occupied: boolean;
  isDisabledOnly: boolean;
}

interface DashboardStats {
  totalActiveClients: number;
  totalFinishedClients: number;
  totalRevenue: number;
  occupiedSpots: number;
  availableSpots: number;
  disabledSpots: number;
}

function AdminDashboard() {
  const [activeClients, setActiveClients] = useState<Client[]>([]);
  const [finishedClients, setFinishedClients] = useState<Client[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalActiveClients: 0,
    totalFinishedClients: 0,
    totalRevenue: 0,
    occupiedSpots: 0,
    availableSpots: 0,
    disabledSpots: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'stats' | 'clients' | 'users' | 'spots'>('stats');
  const [activeClientTab, setActiveClientTab] = useState<'active' | 'finished'>('active');
  useEffect(() => {
    // El eslint-disable evita advertencias sobre el array de dependencias
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchDashboardData();
  }, []);

  const showSuccessMessage = (message: string) => {
    setSuccess(message);
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Iniciando carga de datos del dashboard...');
      console.log(`URL base de la API: ${API_BASE_URL}`);
      
      // Fetch active clients
      console.log('Solicitando clientes activos...');
      const activeClientsResponse = await fetch(`${API_BASE_URL}/api/clients/active`);
      if (!activeClientsResponse.ok) {
        throw new Error(`Error al cargar clientes activos: ${activeClientsResponse.status} ${activeClientsResponse.statusText}`);
      }
      const activeClientsData = await activeClientsResponse.json();
      console.log('Clientes activos recibidos:', activeClientsData);
      setActiveClients(activeClientsData.data || []);      // Fetch finished clients
      console.log('Solicitando clientes finalizados...');
      const finishedClientsResponse = await fetch(`${API_BASE_URL}/api/clients/finished`);
      if (!finishedClientsResponse.ok) {
        throw new Error(`Error al cargar clientes finalizados: ${finishedClientsResponse.status} ${finishedClientsResponse.statusText}`);
      }
      const finishedClientsData = await finishedClientsResponse.json();
      console.log('Clientes finalizados recibidos:', finishedClientsData);
      setFinishedClients(finishedClientsData.data || []);

      // Fetch users
      console.log('Solicitando usuarios...');
      const usersResponse = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': localStorage.getItem('userId') || ''
        }
      });
      if (!usersResponse.ok) {
        throw new Error(`Error al cargar usuarios: ${usersResponse.status} ${usersResponse.statusText}`);
      }
      const usersData = await usersResponse.json();
      console.log('Usuarios recibidos:', usersData);
      setUsers(usersData.data || []);

      // Fetch parking spots
      console.log('Solicitando lugares de estacionamiento...');
      const parkingSpotsResponse = await fetch(`${API_BASE_URL}/api/parking-spots`);
      if (!parkingSpotsResponse.ok) {
        throw new Error(`Error al cargar lugares de estacionamiento: ${parkingSpotsResponse.status} ${parkingSpotsResponse.statusText}`);
      }
      const parkingSpotsData = await parkingSpotsResponse.json();
      console.log('Lugares de estacionamiento recibidos:', parkingSpotsData);
      setParkingSpots(parkingSpotsData.data || []);

      // Calculate stats
      const allClients = [...(activeClientsData.data || []), ...(finishedClientsData.data || [])];
      const allSpots = parkingSpotsData.data || [];

      const totalRevenue = allClients.reduce((sum: number, client: Client) => sum + client.price, 0);
      const occupiedSpots = allSpots.filter((spot: ParkingSpot) => spot.occupied).length;
      const disabledSpots = allSpots.filter((spot: ParkingSpot) => spot.isDisabledOnly).length;

      setStats({
        totalActiveClients: activeClientsData.data?.length || 0,
        totalFinishedClients: finishedClientsData.data?.length || 0,
        totalRevenue,
        occupiedSpots,
        availableSpots: allSpots.length - occupiedSpots,
        disabledSpots
      });    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      
      // Usar datos de ejemplo para poder mostrar la interfaz
      console.log('Usando datos de ejemplo para mostrar la interfaz');
      setActiveClients(mockData.activeClients);
      setFinishedClients(mockData.finishedClients);
      setUsers(mockData.users);
      setParkingSpots(mockData.parkingSpots);
      
      // Calcular estadísticas con los datos de ejemplo
      const allClients = [...mockData.activeClients, ...mockData.finishedClients];
      const totalRevenue = allClients.reduce((sum, client) => sum + client.price, 0);
      const occupiedSpots = mockData.parkingSpots.filter(spot => spot.occupied).length;
      const disabledSpots = mockData.parkingSpots.filter(spot => spot.isDisabledOnly).length;
      
      setStats({
        totalActiveClients: mockData.activeClients.length,
        totalFinishedClients: mockData.finishedClients.length,
        totalRevenue,
        occupiedSpots,
        availableSpots: mockData.parkingSpots.length - occupiedSpots,
        disabledSpots
      });
      
      setError(`Error al cargar los datos del dashboard: ${errorMessage}. Mostrando datos de ejemplo.`);
    } finally {
      setLoading(false);
      console.log('Carga de datos finalizada');
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleFinishService = async (clientId: number) => {
    if (!confirm('¿Está seguro que desea finalizar este servicio?')) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/${clientId}/finish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al finalizar el servicio');
      }
      
      const result = await response.json();
      console.log('Servicio finalizado:', result);
      
      // Actualizar la lista de clientes
      showSuccessMessage(`Servicio finalizado con éxito. Importe: $${result.finalPrice} MXN`);
      fetchDashboardData();
    } catch (err) {
      console.error('Error al finalizar servicio:', err);
      setError('Error al finalizar el servicio. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm(`¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.`)) {
      return;
    }
    
    setLoading(true);
    try {
      // Simular que enviamos el ID del usuario administrador para autorización
      const adminId = localStorage.getItem('userId');
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}?userId=${adminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': adminId || ''
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
      
      showSuccessMessage(`Usuario eliminado correctamente`);
      
      // Actualizar la lista de usuarios
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setError('Error al eliminar el usuario. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Datos de ejemplo para usar cuando la API no responde
  const mockData = {
    activeClients: [
      {
        id: 1,
        nombre: 'Cliente',
        apellido: 'Ejemplo',
        telefono: '1234567890',
        placas: 'ABC123',
        auto: 'Toyota Corolla',
        color: 'Rojo',
        status: 'activo',
        hours: 2,
        price: 70,
        spotId: 3,
        isDisabled: false,
        startTime: new Date().toISOString()
      }
    ],
    finishedClients: [
      {
        id: 2,
        nombre: 'Cliente',
        apellido: 'Finalizado',
        telefono: '9876543210',
        placas: 'XYZ789',
        auto: 'Honda Civic',
        color: 'Azul',
        status: 'finalizado',
        hours: 3,
        price: 105,
        spotId: 5,
        isDisabled: false,
        startTime: '2023-06-24T10:00:00Z',
        endTime: '2023-06-24T13:00:00Z'
      }
    ],
    users: [
      {
        id: 1,
        nombreCompleto: 'Admin',
        apellido: 'Sistema',
        email: 'admin@example.com',
        telefono: '1111111111',
        rol: 'administrador'
      },
      {
        id: 2,
        nombreCompleto: 'Usuario',
        apellido: 'Empleado',
        email: 'empleado@example.com',
        telefono: '2222222222',
        rol: 'empleado'
      }
    ],
    parkingSpots: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      occupied: i < 3,
      isDisabledOnly: i === 9
    }))
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading-state">
        <div className="loading-spinner"></div>
        <p>Cargando datos del dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard error-state">
        <div className="error-icon">⚠️</div>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={handleRefresh} className="refresh-button">Intentar nuevamente</button>
      </div>
    );
  }
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Panel de Administrador</h1>
        <div className="actions">
          <button onClick={handleRefresh} className="refresh-button">
            <span className="refresh-icon">↻</span> Actualizar
          </button>
        </div>
      </div>
      
      {error && (
        <div className="error-message" style={{ marginBottom: '15px' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message" style={{ marginBottom: '15px' }}>
          {success}
        </div>
      )}

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Estadísticas
        </button>
        <button 
          className={`tab ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          🚗 Clientes
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Usuarios
        </button>
        <button 
          className={`tab ${activeTab === 'spots' ? 'active' : ''}`}
          onClick={() => setActiveTab('spots')}
        >
          🅿️ Lugares
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'stats' && (
          <div className="stats-container">
            <h2>Estadísticas Generales</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon active-icon">🚗</div>
                <div className="stat-info">
                  <h3>Clientes Activos</h3>
                  <div className="stat-value">{stats.totalActiveClients}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon finished-icon">✅</div>
                <div className="stat-info">
                  <h3>Servicios Finalizados</h3>
                  <div className="stat-value">{stats.totalFinishedClients}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon revenue-icon">💰</div>
                <div className="stat-info">
                  <h3>Ingresos Totales</h3>
                  <div className="stat-value">${stats.totalRevenue.toFixed(2)} MXN</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon spots-icon">🅿️</div>
                <div className="stat-info">
                  <h3>Lugares Disponibles</h3>
                  <div className="stat-value">{stats.availableSpots} de {parkingSpots.length}</div>
                  <div className="stat-detail">
                    <span className="disabled-spots">{stats.disabledSpots} para discapacitados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="clients-container">
            <h2>Gestión de Clientes</h2>
            <div className="client-tabs">
              <button 
                className={`client-tab ${activeClientTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveClientTab('active')}
              >
                Activos ({activeClients.length})
              </button>
              <button 
                className={`client-tab ${activeClientTab === 'finished' ? 'active' : ''}`}
                onClick={() => setActiveClientTab('finished')}
              >
                Finalizados ({finishedClients.length})
              </button>
            </div>
            <div className="clients-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Vehículo</th>
                    <th>Placas</th>
                    <th>Lugar</th>
                    <th>Tiempo</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {activeClientTab === 'active' && Array.isArray(activeClients) && activeClients.map(client => (
                    <tr key={client.id}>
                      <td>{client.id}</td>
                      <td>
                        <div className="client-info">
                          <div className="client-name">{client.nombre} {client.apellido}</div>
                          <div className="client-phone">{client.telefono}</div>
                        </div>
                      </td>
                      <td>
                        {client.auto} - {client.color}
                        {client.isDisabled && <span className="disabled-badge">♿</span>}
                      </td>
                      <td>{client.placas}</td>
                      <td>#{client.spotId}</td>
                      <td>{client.hours}h</td>
                      <td>${client.price} MXN</td>                      <td>
                        <div className="actions-cell">                          {client.status === 'activo' ? (
                            <>
                              <button 
                                className="action-button finish"
                                onClick={() => handleFinishService(client.id)}
                              >
                                Finalizar
                              </button>
                              <button className="action-button edit">Editar</button>
                            </>
                          ) : (
                            <>
                              <button className="action-button view">Ver detalles</button>
                              <button className="action-button delete">Eliminar</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeClientTab === 'finished' && Array.isArray(finishedClients) && finishedClients.map(client => (
                    <tr key={client.id}>
                      <td>{client.id}</td>
                      <td>
                        <div className="client-info">
                          <div className="client-name">{client.nombre} {client.apellido}</div>
                          <div className="client-phone">{client.telefono}</div>
                        </div>
                      </td>
                      <td>
                        {client.auto} - {client.color}
                        {client.isDisabled && <span className="disabled-badge">♿</span>}
                      </td>
                      <td>{client.placas}</td>
                      <td>#{client.spotId}</td>
                      <td>{client.hours}h</td>
                      <td>${client.price} MXN</td>
                      <td>
                        <div className="actions-cell">
                          <button className="action-button edit">Editar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-container">
            <h2>Gestión de Usuarios</h2>
            <div className="add-user-container">
              <button className="add-user-button">+ Agregar Nuevo Usuario</button>
            </div>
            <div className="users-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nombreCompleto} {user.apellido}</td>
                      <td>{user.email}</td>
                      <td>{user.telefono}</td>
                      <td>
                        <span className={`role-badge ${user.rol === 'administrador' ? 'admin' : 'employee'}`}>
                          {user.rol === 'administrador' ? 'Administrador' : 'Empleado'}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">                          <button className="action-button edit">Editar</button>
                          <button 
                            className="action-button delete"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'spots' && (
          <div className="spots-container">
            <h2>Gestión de Lugares de Estacionamiento</h2>
            <div className="spots-grid">
              {Array.isArray(parkingSpots) && parkingSpots.map(spot => (
                <div 
                  key={spot.id} 
                  className={`spot-card ${spot.occupied ? 'occupied' : 'available'} ${spot.isDisabledOnly ? 'disabled-spot' : ''}`}
                >
                  <div className="spot-number">#{spot.id}</div>
                  <div className="spot-status">
                    {spot.occupied ? 'Ocupado' : 'Disponible'}
                  </div>
                  {spot.isDisabledOnly && <div className="disabled-icon">♿</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
