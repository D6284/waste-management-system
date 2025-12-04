import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { api } from '../services/mockService';
import { Bin } from '../types';
import { Badge } from '../components/ui/Badge';
import { Battery, Signal, Trash2 } from 'lucide-react';

export const Bins: React.FC = () => {
  const [bins, setBins] = useState<Bin[]>([]);

  useEffect(() => {
    api.getBins().then(setBins);
  }, []);

  const getFillColor = (level: number) => {
    if (level < 50) return 'bg-emerald-500';
    if (level < 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Smart Bin IoT Monitor</h2>
        <div className="flex gap-2 text-sm text-slate-500">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Optimal</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Filling</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Critical</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bins.map(bin => (
          <Card key={bin.id} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${getFillColor(bin.fillLevel)}`} />
            <CardContent className="pl-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-slate-900">{bin.locationName}</h3>
                    <p className="text-xs text-slate-500 font-mono">ID: {bin.id}</p>
                </div>
                <Badge variant={bin.type === 'RECYCLING' ? 'info' : bin.type === 'COMPOST' ? 'success' : 'neutral'}>
                    {bin.type}
                </Badge>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Fill Level</span>
                <span className={`text-lg font-bold ${bin.fillLevel > 80 ? 'text-red-600' : 'text-slate-900'}`}>
                    {bin.fillLevel}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6">
                <div 
                    className={`h-2.5 rounded-full ${getFillColor(bin.fillLevel)} transition-all duration-1000`} 
                    style={{ width: `${bin.fillLevel}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1">
                    <Battery className={`w-3 h-3 ${bin.batteryLevel < 20 ? 'text-red-500' : 'text-slate-400'}`} />
                    {bin.batteryLevel}%
                </div>
                <div className="flex items-center gap-1">
                    <Signal className="w-3 h-3 text-slate-400" />
                    Online
                </div>
                <div>
                   {new Date(bin.lastServiced).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
