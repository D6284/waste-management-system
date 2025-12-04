import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { api } from '../services/mockService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Truck, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getStats();
      setStats(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard analytics...</div>;

  const chartData = [
    { name: 'Mon', completed: 12, requested: 5 },
    { name: 'Tue', completed: 19, requested: 8 },
    { name: 'Wed', completed: 15, requested: 12 },
    { name: 'Thu', completed: 22, requested: 15 },
    { name: 'Fri', completed: 25, requested: 10 },
    { name: 'Sat', completed: 10, requested: 4 },
    { name: 'Sun', completed: 5, requested: 2 },
  ];

  const fillTrendData = [
    { time: '06:00', level: 45 },
    { time: '09:00', level: 60 },
    { time: '12:00', level: 75 },
    { time: '15:00', level: 85 },
    { time: '18:00', level: 90 },
  ];

  const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className={`p-4 rounded-full ${color} bg-opacity-10 mr-4`}>
          <Icon className={`w-8 h-8 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Trucks" 
          value={stats.activeTrucks} 
          icon={Truck} 
          color="bg-blue-500" 
          subtext="2 idle, 1 maintenance"
        />
        <StatCard 
          title="Pending Requests" 
          value={stats.pendingRequests} 
          icon={Trash2} 
          color="bg-amber-500" 
          subtext="+5 from yesterday"
        />
        <StatCard 
          title="Critical Bins" 
          value={stats.criticalBins} 
          icon={AlertTriangle} 
          color="bg-red-500" 
          subtext="> 80% capacity"
        />
        <StatCard 
          title="Total Completed" 
          value={stats.totalPickups} 
          icon={CheckCircle} 
          color="bg-emerald-500" 
          subtext="This week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pickup Request Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="requested" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Requested" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Bin Fill Level Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fillTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="level" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
