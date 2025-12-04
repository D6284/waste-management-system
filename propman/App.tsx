import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Properties from './components/Properties';
import Maintenance from './components/Maintenance';
import Payments from './components/Payments';

const AppContent: React.FC = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'properties': return <Properties />;
      case 'my-unit': return <Properties />; // Reuse for simplicity, handles role check internally
      case 'maintenance': return <Maintenance />;
      case 'payments': return <Payments />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
