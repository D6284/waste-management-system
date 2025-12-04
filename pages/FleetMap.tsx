import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { api } from '../services/mockService';
import { Truck, Bin, Route } from '../types';
import { Badge } from '../components/ui/Badge';
import { Truck as TruckIcon, Navigation, BatteryCharging } from 'lucide-react';

export const FleetMap: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [bins, setBins] = useState<Bin[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);

  // Poll for updates to simulate live tracking
  useEffect(() => {
    const fetchData = async () => {
      const [truckData, routeData, binData] = await Promise.all([
        api.getTrucks(),
        api.getRoutes(),
        api.getBins()
      ]);
      setTrucks(truckData);
      setRoutes(routeData);
      setBins(binData);
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // 2-second poll for "live" movement
    return () => clearInterval(interval);
  }, []);

  // Simple coordinate mapping: 0-1000 width, 0-600 height
  // In a real app, this would be a Leaflet/Google Maps component
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Map Area */}
      <Card className="flex-1 relative overflow-hidden bg-slate-100 border-slate-300">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/city-fields.png')] opacity-30 pointer-events-none"></div>
        
        {/* SVG Map Visualization */}
        <svg viewBox="0 0 1000 600" className="w-full h-full preserve-3d">
            {/* Grid Lines for reference */}
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
            </pattern>
            <rect width="1000" height="600" fill="url(#grid)" />

            {/* Routes - Simplified straight lines for MVP */}
            {routes.filter(r => r.status === 'ACTIVE').map(route => {
                const truck = trucks.find(t => t.id === route.truckId);
                if (!truck) return null;
                // Draw a mock path history
                return (
                    <path 
                        key={route.id}
                        d={`M ${truck.location.x} ${truck.location.y} L ${truck.location.x - 50} ${truck.location.y - 20} L ${truck.location.x - 100} ${truck.location.y + 30}`} 
                        stroke="#3b82f6" 
                        strokeWidth="3" 
                        fill="none" 
                        strokeDasharray="5,5" 
                        opacity="0.6"
                    />
                );
            })}

            {/* Bins */}
            {bins.map(bin => (
                <g key={bin.id} transform={`translate(${bin.coordinates.x}, ${bin.coordinates.y})`}>
                    <circle r="8" fill={bin.fillLevel > 80 ? '#ef4444' : '#10b981'} stroke="white" strokeWidth="2" />
                    <title>{bin.locationName} ({bin.fillLevel}%)</title>
                </g>
            ))}

            {/* Trucks */}
            {trucks.map(truck => (
                <g 
                    key={truck.id} 
                    transform={`translate(${truck.location.x}, ${truck.location.y}) rotate(${truck.heading})`}
                    onClick={() => setSelectedTruck(truck.id)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <polygon points="-10,-10 15,0 -10,10" fill={truck.status === 'MAINTENANCE' ? '#f59e0b' : '#2563eb'} stroke="white" strokeWidth="2" />
                    <circle r="15" fill="rgba(59, 130, 246, 0.2)" className="animate-ping" />
                </g>
            ))}
        </svg>

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-2 rounded shadow-sm text-xs text-slate-500">
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-blue-600"></div> Active Truck</div>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Maintenance</div>
            <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></div> Bin (Normal)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500 border border-white"></div> Bin (Critical)</div>
        </div>
      </Card>

      {/* Sidebar Info */}
      <div className="w-full lg:w-80 space-y-4 overflow-y-auto">
        {selectedTruck ? (
            <TruckDetails truck={trucks.find(t => t.id === selectedTruck)!} onClose={() => setSelectedTruck(null)} />
        ) : (
            <Card>
                <CardHeader><CardTitle>Fleet Overview</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {trucks.map(truck => (
                        <div 
                            key={truck.id} 
                            className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={() => setSelectedTruck(truck.id)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-slate-800">{truck.plateNumber}</span>
                                <Badge variant={truck.status === 'EN_ROUTE' ? 'success' : truck.status === 'MAINTENANCE' ? 'warning' : 'neutral'}>
                                    {truck.status.replace('_', ' ')}
                                </Badge>
                            </div>
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                                <TruckIcon className="w-3 h-3" /> {truck.driverName}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
};

const TruckDetails: React.FC<{ truck: Truck; onClose: () => void }> = ({ truck, onClose }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{truck.plateNumber}</CardTitle>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Driver</label>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs">
                            {truck.driverName.charAt(0)}
                        </div>
                        <span className="font-medium">{truck.driverName}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                            <BatteryCharging className="w-3 h-3" /> Fuel
                        </div>
                        <div className="font-bold text-lg">{Math.round(truck.fuelLevel)}%</div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${truck.fuelLevel}%` }}></div>
                        </div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                            <TruckIcon className="w-3 h-3" /> Load
                        </div>
                        <div className="font-bold text-lg">{truck.capacity}%</div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${truck.capacity}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                     <label className="text-xs font-semibold text-slate-500 uppercase">Current Location</label>
                     <div className="text-sm font-mono bg-slate-900 text-green-400 p-2 rounded">
                        X: {truck.location.x.toFixed(2)} | Y: {truck.location.y.toFixed(2)}
                     </div>
                </div>
            </CardContent>
        </Card>
    );
};
