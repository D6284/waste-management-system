import { User, UserRole, Property, MaintenanceStatus, MaintenancePriority, PaymentStatus, Payment, MaintenanceRequest } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@propman.ai',
    role: UserRole.ADMIN,
    avatarUrl: 'https://picsum.photos/seed/admin/100/100'
  },
  {
    id: 'u2',
    name: 'Sarah Landlord',
    email: 'sarah@owner.com',
    role: UserRole.LANDLORD,
    avatarUrl: 'https://picsum.photos/seed/sarah/100/100'
  },
  {
    id: 'u3',
    name: 'John Tenant',
    email: 'john@renter.com',
    role: UserRole.TENANT,
    avatarUrl: 'https://picsum.photos/seed/john/100/100'
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    landlordId: 'u2',
    title: 'Sunny Downtown Apartment',
    address: '123 Market St, San Francisco, CA',
    description: 'A beautiful 2-bedroom apartment with city views and modern amenities.',
    rentAmount: 2500,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://picsum.photos/seed/prop1/800/600',
    isAvailable: true
  },
  {
    id: 'p2',
    landlordId: 'u2',
    title: 'Cozy Suburban Home',
    address: '456 Oak Ln, San Mateo, CA',
    description: 'Perfect family home with a large backyard and garage.',
    rentAmount: 3800,
    bedrooms: 3,
    bathrooms: 2.5,
    imageUrl: 'https://picsum.photos/seed/prop2/800/600',
    isAvailable: false // Rented by u3
  }
];

export const MOCK_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'm1',
    tenantId: 'u3',
    propertyId: 'p2',
    title: 'Leaky Faucet',
    description: 'The kitchen faucet is dripping constantly.',
    status: MaintenanceStatus.PENDING,
    priority: MaintenancePriority.LOW,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    aiAnalysis: 'This appears to be a minor plumbing issue. Low priority recommended.'
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay1',
    tenantId: 'u3',
    propertyId: 'p2',
    amount: 3800,
    dueDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    paidDate: new Date(Date.now() - 86400000 * 12).toISOString(),
    status: PaymentStatus.PAID
  },
  {
    id: 'pay2',
    tenantId: 'u3',
    propertyId: 'p2',
    amount: 3800,
    dueDate: new Date(Date.now() + 86400000 * 20).toISOString(),
    status: PaymentStatus.PENDING
  }
];
