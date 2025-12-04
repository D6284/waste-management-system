import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { api } from '../services/mockService';
import { PickupRequest } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { Filter, Check, Clock } from 'lucide-react';

export const Pickups: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  useEffect(() => {
    loadPickups();
  }, []);

  const loadPickups = async () => {
    setLoading(true);
    const data = await api.getPickups();
    setPickups(data);
    setLoading(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: PickupRequest['status']) => {
    await api.updatePickupStatus(id, newStatus);
    loadPickups();
  };

  const filteredPickups = pickups.filter(p => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return ['REQUESTED', 'SCHEDULED', 'IN_PROGRESS'].includes(p.status);
    if (filter === 'COMPLETED') return p.status === 'COMPLETED';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED': return <Badge variant="info">Requested</Badge>;
      case 'SCHEDULED': return <Badge variant="warning">Scheduled</Badge>;
      case 'IN_PROGRESS': return <Badge variant="warning">In Progress</Badge>;
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>;
      case 'CANCELLED': return <Badge variant="error">Cancelled</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'HAZARDOUS': return <span className="text-red-600 font-medium text-xs uppercase tracking-wider">Hazardous</span>;
      case 'BULKY': return <span className="text-purple-600 font-medium text-xs uppercase tracking-wider">Bulky</span>;
      default: return <span className="text-slate-500 font-medium text-xs uppercase tracking-wider">Regular</span>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pickup Requests</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'ALL' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('ALL')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'PENDING' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('PENDING')}
          >
            Pending
          </Button>
          <Button 
            variant={filter === 'COMPLETED' ? 'primary' : 'ghost'} 
            size="sm" 
            onClick={() => setFilter('COMPLETED')}
          >
            Completed
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading requests...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Citizen / Address</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPickups.map((pickup) => (
                  <tr key={pickup.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">#{pickup.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{pickup.citizenName}</div>
                      <div className="text-slate-500">{pickup.address}</div>
                    </td>
                    <td className="px-6 py-4">{getTypeBadge(pickup.type)}</td>
                    <td className="px-6 py-4">{getStatusBadge(pickup.status)}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {format(new Date(pickup.requestedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {pickup.status === 'REQUESTED' && (
                        <Button size="sm" onClick={() => handleStatusUpdate(pickup.id, 'SCHEDULED')}>
                          <Clock className="w-4 h-4 mr-1" /> Schedule
                        </Button>
                      )}
                      {pickup.status === 'SCHEDULED' && (
                        <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(pickup.id, 'IN_PROGRESS')}>
                          Start
                        </Button>
                      )}
                      {pickup.status === 'IN_PROGRESS' && (
                        <Button size="sm" variant="primary" onClick={() => handleStatusUpdate(pickup.id, 'COMPLETED')}>
                          <Check className="w-4 h-4 mr-1" /> Complete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
