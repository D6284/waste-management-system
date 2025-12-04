import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Property, UserRole } from '../types';
import { Plus, Trash2, MapPin, Bed, Bath, Sparkles, Loader2, Home } from 'lucide-react';
import { generatePropertyDescription } from '../services/geminiService';

const Properties: React.FC = () => {
  const { user, properties, addProperty, deleteProperty } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState(0);
  const [beds, setBeds] = useState(1);
  const [baths, setBaths] = useState(1);
  const [desc, setDesc] = useState('');
  const [features, setFeatures] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!user) return null;

  const handleGenerateDescription = async () => {
    if (!title || !address) {
      alert("Please fill in basic details first.");
      return;
    }
    setIsGenerating(true);
    const generated = await generatePropertyDescription(features, "Apartment", beds, baths, address);
    setDesc(generated);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProp: Property = {
      id: Date.now().toString(),
      landlordId: user.id,
      title,
      address,
      description: desc,
      rentAmount: rent,
      bedrooms: beds,
      bathrooms: baths,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/800/600`,
      isAvailable: true
    };
    addProperty(newProp);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setAddress('');
    setRent(0);
    setBeds(1);
    setBaths(1);
    setDesc('');
    setFeatures('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Properties</h2>
        {user.role !== UserRole.TENANT && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(prop => (
          <div key={prop.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <img src={prop.imageUrl} alt={prop.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                ${prop.rentAmount}/mo
              </div>
              {!prop.isAvailable && (
                 <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                 Occupied
               </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{prop.title}</h3>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {prop.address}
              </div>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  {prop.bedrooms} Bed
                </div>
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  {prop.bathrooms} Bath
                </div>
              </div>

              <p className="text-gray-500 text-sm line-clamp-2 mb-4">{prop.description}</p>

              {user.role !== UserRole.TENANT && (
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                   <button 
                    onClick={() => deleteProperty(prop.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New Property</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <Plus className="w-6 h-6 transform rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Luxury Downtown Loft" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input required value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="123 Main St" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rent ($)</label>
                  <input type="number" required value={rent} onChange={e => setRent(Number(e.target.value))} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beds</label>
                  <input type="number" required value={beds} onChange={e => setBeds(Number(e.target.value))} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Baths</label>
                  <input type="number" required value={baths} onChange={e => setBaths(Number(e.target.value))} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-indigo-900">AI Description Generator</label>
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                </div>
                <input 
                  value={features} 
                  onChange={e => setFeatures(e.target.value)} 
                  className="w-full p-2 border border-indigo-200 rounded-lg mb-2 text-sm" 
                  placeholder="Enter key features (e.g. pool, gym, renovated kitchen)..." 
                />
                <button 
                  type="button" 
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                >
                  {isGenerating ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Sparkles className="w-3 h-3 mr-1"/>}
                  Generate with AI
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  required 
                  value={desc} 
                  onChange={e => setDesc(e.target.value)} 
                  rows={4} 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  placeholder="Property description..." 
                />
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
