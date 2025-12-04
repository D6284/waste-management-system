export type UserRole = 'ADMIN' | 'OPERATOR' | 'DRIVER' | 'CITIZEN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type PickupStatus = 'REQUESTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type PickupType = 'REGULAR' | 'BULKY' | 'HAZARDOUS';

export interface PickupRequest {
  id: string;
  citizenName: string;
  address: string;
  type: PickupType;
  status: PickupStatus;
  requestedAt: string;
  scheduledFor?: string;
  completedAt?: string;
  coordinates: { x: number; y: number }; // Normalized coordinates 0-1000 for map
}

export type TruckStatus = 'IDLE' | 'EN_ROUTE' | 'OFFLINE' | 'MAINTENANCE';

export interface Truck {
  id: string;
  plateNumber: string;
  driverName: string;
  status: TruckStatus;
  location: { x: number; y: number };
  heading: number; // 0-360 degrees
  fuelLevel: number; // 0-100
  capacity: number; // 0-100 percentage full
}

export interface Bin {
  id: string;
  locationName: string;
  coordinates: { x: number; y: number };
  fillLevel: number; // 0-100
  batteryLevel: number; // 0-100
  lastServiced: string;
  type: 'GENERAL' | 'RECYCLING' | 'COMPOST';
}

export interface Route {
  id: string;
  truckId: string;
  name: string;
  stops: number;
  progress: number; // 0-100
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}
