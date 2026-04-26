import React, { useState } from 'react';
import { PhoneCall, MapPin, Pencil, Trash2, Calendar, Map, CheckCircle, Clock, Wrench, X } from 'lucide-react';
import { Customer, ServiceStatus, JobPriority } from '../types';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, newStatus: ServiceStatus) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit, onDelete, onChangeStatus }) => {
    const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority?: JobPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Low':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'; // Default for old data
    }
  };

  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case 'Pending': return <Clock className="w-3.5 h-3.5 mr-1" />;
      case 'In Progress': return <Wrench className="w-3.5 h-3.5 mr-1" />;
      case 'Completed': return <CheckCircle className="w-3.5 h-3.5 mr-1" />;
    }
  };

  const locationUrl = customer.location.startsWith('http') 
    ? customer.location 
    : `https://maps.google.com/?q=${encodeURIComponent(customer.location || customer.address)}`;

  return (
    <div className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 p-5 flex flex-col transition-all hover:shadow-md cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">{customer.name}</h3>
          <div className="flex items-center mt-1 space-x-2">
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getStatusColor(customer.status)}`}>
              {customer.status}
            </span>
            {(customer.priority || 'Medium') && (
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full border ${getPriorityColor(customer.priority || 'Medium')}`}>
                {customer.priority || 'Medium'}
              </span>
            )}
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
          <p className="text-sm font-bold text-slate-800 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">৳{customer.serviceCharge}</p>
        </div>
      </div>

      <div className="space-y-3 flex-grow my-2">
        <div className="flex items-start text-xs text-slate-600">
          <PhoneCall className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
          <a href={`tel:${customer.phone}`} className="hover:text-blue-600 hover:underline">
            {customer.phone}
          </a>
        </div>
        
        <div className="flex items-start text-xs text-slate-600">
          <Calendar className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
          <span>{customer.serviceDate}</span>
        </div>

        {(customer.address || customer.location) && (
          <div className="flex items-start text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{customer.address || customer.location}</span>
          </div>
        )}

        {customer.notes && (
          <div className="mt-2 p-2 bg-slate-100 rounded-lg text-xs text-slate-600 italic">
            "{customer.notes}"
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {/* Status toggles */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => onChangeStatus(customer.id, 'Pending')}
            disabled={customer.status === 'Pending'}
            className={`flex-1 text-[10px] uppercase tracking-wider py-1.5 px-2 rounded-lg font-bold border transition-colors ${
              customer.status === 'Pending' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => onChangeStatus(customer.id, 'In Progress')}
            disabled={customer.status === 'In Progress'}
            className={`flex-1 text-[10px] uppercase tracking-wider py-1.5 px-2 rounded-lg font-bold border transition-colors ${
              customer.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => onChangeStatus(customer.id, 'Completed')}
            disabled={customer.status === 'Completed'}
            className={`flex-1 text-[10px] uppercase tracking-wider py-1.5 px-2 rounded-lg font-bold border transition-colors ${
              customer.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200/60">
          <a
            href={`tel:${customer.phone}`}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            title="Call Customer"
          >
            <PhoneCall className="w-4 h-4" />
          </a>
          
          <a
            href={locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            title="Open Location"
          >
            <Map className="w-4 h-4" />
          </a>
          
          <button
            onClick={() => onEdit(customer)}
            className="p-2 border bg-white border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4 text-slate-500" />
          </button>
          
          {isDeleting ? (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Sure?</span>
              <button
                onClick={() => setIsDeleting(false)}
                className="p-2 border bg-white border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
              <button
                onClick={() => {
                  onDelete(customer.id);
                  setIsDeleting(false);
                }}
                className="p-2 border bg-red-600 border-red-600 rounded-lg hover:bg-red-700 text-white transition-colors"
                title="Confirm Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsDeleting(true)}
              className="p-2 border bg-white border-red-100 rounded-lg hover:bg-red-50 text-red-500 transition-colors ml-auto"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
