import { Bin, PickupRequest, Route, Truck, User } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Admin',
  email: 'admin@klincam.com',
  role: 'ADMIN',
  avatarUrl: 'https://picsum.photos/200',
};

export const INITIAL_PICKUPS: PickupRequest[] = [
  { id: 'p1', citizenName: 'John Doe', address: '123 Maple Ave', type: 'BULKY', status: 'REQUESTED', requestedAt: '2023-10-25T08:30:00Z', coordinates: { x: 200, y: 300 } },
  { id: 'p2', citizenName: 'Jane Smith', address: '456 Oak Ln', type: 'HAZARDOUS', status: 'SCHEDULED', requestedAt: '2023-10-24T14:15:00Z', scheduledFor: '2023-10-27', coordinates: { x: 550, y: 150 } },
  { id: 'p3', citizenName: 'Bob Brown', address: '789 Pine St', type: 'REGULAR', status: 'COMPLETED', requestedAt: '2023-10-23T09:00:00Z', completedAt: '2023-10-25T10:00:00Z', coordinates: { x: 800, y: 600 } },
  { id: 'p4', citizenName: 'Alice Green', address: '101 Cedar Blvd', type: 'BULKY', status: 'IN_PROGRESS', requestedAt: '2023-10-26T11:20:00Z', coordinates: { x: 300, y: 450 } },
  { id: 'p5', citizenName: 'Charlie White', address: '202 Birch Rd', type: 'REGULAR', status: 'REQUESTED', requestedAt: '2023-10-26T16:45:00Z', coordinates: { x: 150, y: 750 } },
];

export const INITIAL_TRUCKS: Truck[] = [
  { id: 't1', plateNumber: 'KLN-101', driverName: 'Mike Ross', status: 'EN_ROUTE', location: { x: 250, y: 320 }, heading: 45, fuelLevel: 78, capacity: 45 },
  { id: 't2', plateNumber: 'KLN-102', driverName: 'Rachel Zane', status: 'IDLE', location: { x: 100, y: 100 }, heading: 0, fuelLevel: 95, capacity: 0 },
  { id: 't3', plateNumber: 'KLN-103', driverName: 'Harvey Specter', status: 'EN_ROUTE', location: { x: 600, y: 500 }, heading: 180, fuelLevel: 32, capacity: 85 },
  { id: 't4', plateNumber: 'KLN-104', driverName: 'Donna Paulsen', status: 'MAINTENANCE', location: { x: 900, y: 100 }, heading: 90, fuelLevel: 10, capacity: 0 },
];

export const INITIAL_BINS: Bin[] = [
  { id: 'b1', locationName: 'Central Park North', coordinates: { x: 400, y: 200 }, fillLevel: 85, batteryLevel: 90, lastServiced: '2023-10-24', type: 'GENERAL' },
  { id: 'b2', locationName: 'Main St. Plaza', coordinates: { x: 450, y: 220 }, fillLevel: 15, batteryLevel: 95, lastServiced: '2023-10-26', type: 'RECYCLING' },
  { id: 'b3', locationName: 'Market District', coordinates: { x: 600, y: 400 }, fillLevel: 92, batteryLevel: 45, lastServiced: '2023-10-22', type: 'COMPOST' },
  { id: 'b4', locationName: 'School Zone A', coordinates: { x: 200, y: 500 }, fillLevel: 45, batteryLevel: 80, lastServiced: '2023-10-25', type: 'GENERAL' },
  { id: 'b5', locationName: 'Train Station', coordinates: { x: 750, y: 300 }, fillLevel: 60, batteryLevel: 88, lastServiced: '2023-10-25', type: 'RECYCLING' },
];

export const INITIAL_ROUTES: Route[] = [
  { id: 'r1', truckId: 't1', name: 'Downtown Morning', stops: 12, progress: 45, status: 'ACTIVE' },
  { id: 'r2', truckId: 't3', name: 'Suburban Loop', stops: 18, progress: 70, status: 'ACTIVE' },
  { id: 'r3', truckId: 't2', name: 'Industrial Sector', stops: 8, progress: 0, status: 'PENDING' },
];