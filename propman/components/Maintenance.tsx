import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MaintenancePriority, MaintenanceRequest, MaintenanceStatus, UserRole } from '../types';
import { analyzeMaintenanceRequest } from '../services/geminiService';
import { Plus, Clock, CheckCircle, AlertTriangle, Loader2, Bot } from 'lucide-react';

const Maintenance: React.FC = () => {
  const { user, properties, maintenanceRequests, addMaintenanceRequest, updateMaintenanceStatus } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // AI Triage
    const { priority, analysis } = await analyzeMaintenanceRequest(title, desc);

    const newReq: MaintenanceRequest = {
      id: Date.now().toString(),
      tenantId: user.id,
      propertyId,
      title,
      description: desc,
      status: MaintenanceStatus.PENDING,
      priority: priority as MaintenancePriority,
      aiAnalysis: analysis,
      createdAt: new Date().toISOString()
    };

    addMaintenanceRequest(newReq);
    setIsAnalyzing(false);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDesc('');
    setPropertyId('');
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'LOW': return 'bg-blue-100 text-blue-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'EMERGENCY': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = user.role === UserRole.TENANT
    ? maintenanceRequests.filter(r => r.tenantId === user.id)
    : maintenanceRequests;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Maintenance Requests</h2>
        {user.role === UserRole.TENANT && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No maintenance requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority (AI)</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  {user.role !== UserRole.TENANT && (
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map(req => {
                   const prop = properties.find(p => p.id === req.propertyId);
                   return (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{req.title}</div>
                        <div className="text-xs text-gray-500">{req.description}</div>
                        {req.aiAnalysis && (
                          <div className="mt-1 flex items-start text-xs text-indigo-600 bg-indigo-50 p-1 rounded border border-indigo-100 max-w-xs">
                            <Bot className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                            {req.aiAnalysis}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {prop ? prop.title : 'Unknown Property'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPriorityColor(req.priority)}`}>
                          {req.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {req.status === MaintenanceStatus.PENDING && <Clock className="w-4 h-4 text-yellow-500 mr-2" />}
                          {req.status === MaintenanceStatus.IN_PROGRESS && <Loader2 className="w-4 h-4 text-blue-500 mr-2 animate-spin" />}
                          {req.status === MaintenanceStatus.RESOLVED && <CheckCircle className="w-4 h-4 text-green-500 mr-2" />}
                          <span className="text-sm capitalize">{req.status.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      {user.role !== UserRole.TENANT && (
                        <td className="px-6 py-4">
                          <select 
                            value={req.status}
                            onChange={(e) => updateMaintenanceStatus(req.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded p-1 outline-none focus:border-indigo-500"
                          >
                            <option value={MaintenanceStatus.PENDING}>Pending</option>
                            <option value={MaintenanceStatus.IN_PROGRESS}>In Progress</option>
                            <option value={MaintenanceStatus.RESOLVED}>Resolved</option>
                          </select>
                        </td>
                      )}
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Submit Maintenance Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <select 
                  required 
                  value={propertyId} 
                  onChange={e => setPropertyId(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Select Property</option>
                  {/* In a real app, only list properties rented by this tenant */}
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
                <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="e.g. Broken AC" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full p-2 border rounded-lg" placeholder="Details about the issue..." />
              </div>
              
              <div className="flex justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="mr-3 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  {isAnalyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
