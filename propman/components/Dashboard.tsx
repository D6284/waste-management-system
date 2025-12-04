import React from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole, MaintenanceStatus, PaymentStatus } from '../types';
import { 
  TrendingUp, 
  Users, 
  AlertCircle, 
  CheckCircle,
  Home,
  DollarSign,
  Wrench
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    {subtext && <p className="text-xs text-green-600 mt-1">{subtext}</p>}
  </div>
);

const Dashboard: React.FC = () => {
  const { user, properties, maintenanceRequests, payments } = useStore();

  if (!user) return null;

  // Landlord/Admin Stats
  const totalProperties = properties.length;
  const occupiedProperties = properties.filter(p => !p.isAvailable).length;
  const openRequests = maintenanceRequests.filter(m => m.status !== MaintenanceStatus.RESOLVED).length;
  const totalRevenue = payments
    .filter(p => p.status === PaymentStatus.PAID)
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Tenant Stats
  const myRequests = maintenanceRequests.filter(m => m.tenantId === user.id);
  const myPendingPayments = payments.filter(p => p.tenantId === user.id && p.status === PaymentStatus.PENDING).length;

  const chartData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
  ];

  if (user.role === UserRole.TENANT) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">My Home Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <StatCard 
            title="Open Maintenance Requests" 
            value={myRequests.filter(r => r.status !== 'RESOLVED').length} 
            icon={AlertCircle} 
            color="bg-orange-500" 
          />
           <StatCard 
            title="Pending Payments" 
            value={myPendingPayments} 
            icon={DollarSign} 
            color="bg-green-500" 
          />
           <StatCard 
            title="Lease Status" 
            value="Active" 
            icon={CheckCircle} 
            color="bg-blue-500" 
            subtext="Expires Dec 2025"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          {myRequests.length === 0 ? (
            <p className="text-gray-500">No recent activity.</p>
          ) : (
            <div className="space-y-4">
              {myRequests.slice(0, 3).map(req => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">{req.title}</h4>
                    <p className="text-sm text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium 
                    ${req.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
         <span className="text-sm text-gray-500">Last updated: Just now</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Properties" 
          value={totalProperties} 
          icon={Home} 
          color="bg-indigo-600" 
        />
        <StatCard 
          title="Occupancy Rate" 
          value={`${Math.round((occupiedProperties / totalProperties) * 100)}%`} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Maintenance Requests" 
          value={openRequests} 
          icon={Wrench} 
          color="bg-orange-500" 
          subtext="Requires attention"
        />
        <StatCard 
          title="Total Revenue (YTD)" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={TrendingUp} 
          color="bg-green-500" 
          subtext="+12% from last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6">Recent Maintenance</h3>
          <div className="space-y-4">
             {maintenanceRequests.slice(0, 4).map(req => (
                <div key={req.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                   <div className={`w-2 h-12 rounded-full mr-4 ${
                     req.priority === 'HIGH' || req.priority === 'EMERGENCY' ? 'bg-red-500' : 'bg-blue-500'
                   }`} />
                   <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{req.title}</h4>
                      <p className="text-xs text-gray-500 truncate">{req.description}</p>
                   </div>
                   <span className="text-xs font-medium text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;