import React from 'react';
import { useStore } from '../context/StoreContext';
import { PaymentStatus, UserRole } from '../types';
import { Check, Clock, AlertTriangle, DollarSign } from 'lucide-react';

const Payments: React.FC = () => {
  const { user, payments, properties, markPaymentPaid } = useStore();

  if (!user) return null;

  const filteredPayments = user.role === UserRole.TENANT
    ? payments.filter(p => p.tenantId === user.id)
    : payments;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Rent Payments</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Property</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                {user.role !== UserRole.TENANT && (
                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map(pay => {
                const prop = properties.find(p => p.id === pay.propertyId);
                const isOverdue = new Date(pay.dueDate) < new Date() && pay.status !== PaymentStatus.PAID;
                
                return (
                  <tr key={pay.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{prop?.title}</div>
                      <div className="text-xs text-gray-500">{prop?.address}</div>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-gray-700">
                      ${pay.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(pay.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {pay.status === PaymentStatus.PAID && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" /> Paid
                        </span>
                      )}
                      {pay.status === PaymentStatus.PENDING && !isOverdue && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-3 h-3 mr-1" /> Pending
                        </span>
                      )}
                      {(isOverdue || pay.status === PaymentStatus.OVERDUE) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Overdue
                        </span>
                      )}
                    </td>
                    {user.role !== UserRole.TENANT && (
                      <td className="px-6 py-4">
                        {pay.status !== PaymentStatus.PAID && (
                          <button 
                            onClick={() => markPaymentPaid(pay.id)}
                            className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md border border-indigo-200 hover:bg-indigo-100 transition-colors"
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
