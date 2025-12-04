import React from 'react';
import { useStore } from '../context/StoreContext';
import { MOCK_USERS } from '../constants';
import { Building2, ArrowRight } from 'lucide-react';

const Auth: React.FC = () => {
  const { login } = useStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PropMan AI</h1>
          <p className="text-gray-500 mt-2">Smart Property Management</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center mb-4">Select a demo role to log in:</p>
          
          {MOCK_USERS.map((u) => (
            <button
              key={u.id}
              onClick={() => login(u.email)}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all group"
            >
              <div className="flex items-center">
                <img src={u.avatarUrl} alt={u.name} className="w-10 h-10 rounded-full mr-4" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{u.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{u.role.toLowerCase()}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500" />
            </button>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Secure Cloud-Based Infrastructure
            <br />
            Powered by Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
