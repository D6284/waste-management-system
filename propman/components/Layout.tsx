import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Home, 
  Building2, 
  Wrench, 
  DollarSign, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  PieChart
} from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium transition-colors rounded-lg mb-1 ${
        activeTab === id 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-indigo-700">
          <div className="flex items-center text-white font-bold text-xl">
            <Building2 className="w-6 h-6 mr-2" />
            PropMan AI
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col h-[calc(100%-4rem)] justify-between">
          <nav>
            <div className="mb-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu
            </div>
            <NavItem id="dashboard" icon={PieChart} label="Dashboard" />
            
            {(user.role === UserRole.LANDLORD || user.role === UserRole.ADMIN) && (
               <NavItem id="properties" icon={Home} label="Properties" />
            )}
            
            {user.role === UserRole.TENANT && (
               <NavItem id="my-unit" icon={Home} label="My Unit" />
            )}

            <NavItem id="maintenance" icon={Wrench} label="Maintenance" />
            <NavItem id="payments" icon={DollarSign} label="Payments" />
          </nav>

          <div>
             <div className="flex items-center p-3 mb-3 bg-gray-50 rounded-lg border border-gray-200">
               <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-700">
                 {user.avatarUrl ? (
                   <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                 ) : (
                   <UserIcon className="w-5 h-5" />
                 )}
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                 <p className="text-xs text-gray-500 truncate capitalize">{user.role.toLowerCase()}</p>
               </div>
             </div>
             
             <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between lg:justify-end h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:flex items-center text-sm text-gray-500">
            <span className="mr-2">Welcome back,</span>
            <span className="font-semibold text-gray-800">{user.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
