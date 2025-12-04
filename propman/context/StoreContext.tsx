import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Property, MaintenanceRequest, Payment, UserRole } from '../types';
import { MOCK_USERS, MOCK_PROPERTIES, MOCK_MAINTENANCE, MOCK_PAYMENTS } from '../constants';

interface StoreContextType {
  user: User | null;
  users: User[];
  properties: Property[];
  maintenanceRequests: MaintenanceRequest[];
  payments: Payment[];
  login: (email: string) => void;
  logout: () => void;
  addProperty: (property: Property) => void;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  addMaintenanceRequest: (req: MaintenanceRequest) => void;
  updateMaintenanceStatus: (id: string, status: string) => void;
  markPaymentPaid: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state from local storage or mocks
  const [user, setUser] = useState<User | null>(null);
  
  // In a real app, these would come from an API
  const [users] = useState<User[]>(MOCK_USERS);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(MOCK_MAINTENANCE);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);

  const login = (email: string) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addProperty = (property: Property) => {
    setProperties(prev => [...prev, property]);
  };

  const updateProperty = (updatedProp: Property) => {
    setProperties(prev => prev.map(p => p.id === updatedProp.id ? updatedProp : p));
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const addMaintenanceRequest = (req: MaintenanceRequest) => {
    setMaintenanceRequests(prev => [req, ...prev]);
  };

  const updateMaintenanceStatus = (id: string, status: string) => {
    setMaintenanceRequests(prev => prev.map(req => 
      req.id === id ? { ...req, status: status as any } : req
    ));
  };

  const markPaymentPaid = (id: string) => {
    setPayments(prev => prev.map(p => 
      p.id === id ? { ...p, status: 'PAID' as any, paidDate: new Date().toISOString() } : p
    ));
  };

  return (
    <StoreContext.Provider value={{
      user,
      users,
      properties,
      maintenanceRequests,
      payments,
      login,
      logout,
      addProperty,
      updateProperty,
      deleteProperty,
      addMaintenanceRequest,
      updateMaintenanceStatus,
      markPaymentPaid
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
