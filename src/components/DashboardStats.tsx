import { CheckCircle, Clock, Wrench } from 'lucide-react';
import { Customer } from '../types';

interface DashboardStatsProps {
  customers: Customer[];
}

export function DashboardStats({ customers }: DashboardStatsProps) {
  const total = customers.length;
  const pending = customers.filter((c) => c.status === 'Pending').length;
  const inProgress = customers.filter((c) => c.status === 'In Progress').length;
  const completed = customers.filter((c) => c.status === 'Completed').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between h-32">
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Jobs</span>
        <div className="flex items-end justify-between">
          <span className="text-4xl font-bold text-slate-900">{total}</span>
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 flex flex-col justify-between h-32">
        <span className="text-red-500 text-xs font-bold uppercase tracking-wider">Pending</span>
        <div className="flex items-end justify-between">
          <span className="text-4xl font-bold text-slate-900">{pending}</span>
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 font-bold italic text-xl">
            !
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-yellow-100 flex flex-col justify-between h-32">
        <span className="text-yellow-600 text-xs font-bold uppercase tracking-wider">In Progress</span>
        <div className="flex items-end justify-between">
          <span className="text-4xl font-bold text-slate-900">{inProgress}</span>
          <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-600">
            <Wrench className="w-5 h-5 animate-pulse text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100 flex flex-col justify-between h-32">
        <span className="text-green-600 text-xs font-bold uppercase tracking-wider">Completed</span>
        <div className="flex items-end justify-between">
          <span className="text-4xl font-bold text-slate-900">{completed}</span>
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
