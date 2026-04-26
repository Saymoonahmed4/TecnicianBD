import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Calendar as CalendarIcon, AirVent } from 'lucide-react';
import { Customer, ServiceStatus } from './types';
import { DashboardStats } from './components/DashboardStats';
import { CustomerCard } from './components/CustomerCard';
import { CustomerForm } from './components/CustomerForm';

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('tecnicianbd_customers');
    if (saved) {
      try {
        setCustomers(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse customers from localStorage', e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('tecnicianbd_customers', JSON.stringify(customers));
  }, [customers]);

  const handleSaveCustomer = (customer: Customer) => {
    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
    } else {
      setCustomers([customer, ...customers]);
    }
    closeForm();
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  const handleChangeStatus = (id: string, newStatus: ServiceStatus) => {
    setCustomers(customers.map((c) => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  const openFormForAdd = () => {
    setEditingCustomer(undefined);
    setIsFormOpen(true);
  };

  const openFormForEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(undefined);
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.phone.includes(searchQuery);
      const matchesDate = dateFilter ? c.serviceDate === dateFilter : true;
      
      return matchesSearch && matchesDate;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [customers, searchQuery, dateFilter]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col p-4 sm:p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
            Tecnician<span className="text-blue-500">bd</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">AC Servicing Management System • <span className="font-semibold">Offline Mode</span></p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="relative flex-1 md:w-auto">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {(searchQuery || dateFilter) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDateFilter('');
              }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={openFormForAdd}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center px-4 py-2 rounded-xl font-semibold text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Job</span>
            <span className="inline sm:hidden">Add</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0 mx-auto w-full max-w-7xl">
        <DashboardStats customers={customers} />

        {/* Customer Grid */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col mt-2">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Job Queue</h2>
            <div className="flex gap-2 text-sm font-medium">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full">{filteredCustomers.length} Total</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {filteredCustomers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onEdit={openFormForEdit}
                    onDelete={handleDeleteCustomer}
                    onChangeStatus={handleChangeStatus}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <AirVent className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
                <p className="text-slate-500 mt-1">
                  {customers.length === 0 
                    ? "You haven't added any jobs yet." 
                    : "Try adjusting your search or filters."}
                </p>
                {customers.length === 0 && (
                  <button
                    onClick={openFormForAdd}
                    className="mt-6 bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center px-5 py-3 rounded-xl font-semibold transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create First Job Entry
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-6 pt-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-bold tracking-wider uppercase gap-2 w-full max-w-7xl mx-auto">
        <p>© {new Date().getFullYear()} TECNICIANBD DASHBOARD</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            LOCAL-FIRST ACTIVE
          </span>
        </div>
      </footer>

      {/* Modal Form */}
      {isFormOpen && (
        <CustomerForm
          initialData={editingCustomer}
          onSubmit={handleSaveCustomer}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}
