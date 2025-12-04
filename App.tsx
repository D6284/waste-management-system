import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Pickups } from './pages/Pickups';
import { FleetMap } from './pages/FleetMap';
import { Bins } from './pages/Bins';
import { Login } from './pages/Login';
import { CURRENT_USER } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'pickups': return <Pickups />;
      case 'fleet': return <FleetMap />;
      case 'bins': return <Bins />;
      case 'settings': return <div className="p-8 text-slate-500">Settings page placeholder</div>;
      default: return <Dashboard />;
    }
  };

  const getTitle = () => {
    switch (currentPage) {
        case 'dashboard': return 'Operational Dashboard';
        case 'pickups': return 'Pickup Requests';
        case 'fleet': return 'Live Fleet Map';
        case 'bins': return 'Smart Bins';
        case 'settings': return 'System Settings';
        default: return 'Dashboard';
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={() => setIsAuthenticated(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={CURRENT_USER} title={getTitle()} />
        
        <main className="flex-1 p-8 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
