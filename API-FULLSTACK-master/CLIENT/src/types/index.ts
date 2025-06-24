export type Category = {
      id: number, // Added id property
      category: number,
      name: string,    
      calorias: number}

export type Activity = {
  id: string; // Cambiado a string para UUID
  category: string; // Updated to string for service name
  name: string; // Added name property
  calorias: number; // Existing property
  hours: number; // Added hours property
  price: number; // Added price property
  spot: number; // Added spot property
};