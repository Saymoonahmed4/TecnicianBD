import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Calendar as CalendarIcon, AirVent } from 'lucide-react';
import { Customer, ServiceStatus } from './types';
import { DashboardStats } from './components/DashboardStats';
import { CustomerCard } from './components/CustomerCard';
import { CustomerForm } from './components/CustomerForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { db } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  // Load from Firebase
  useEffect(() => {
    const q = collection(db, 'customers');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customersData: Customer[] = [];
      snapshot.forEach((doc) => {
        customersData.push(doc.data() as Customer);
      });
      setCustomers(customersData);
    });
    return () => unsubscribe();
  }, []);

  // Migration logic (Local Storage to Firebase)
  useEffect(() => {
    const migrateData = async () => {
      const migrated = localStorage.getItem('tecnicianbd_migrated_to_firebase');
      if (!migrated) {
        const saved = localStorage.getItem('tecnicianbd_customers');
        if (saved) {
          try {
            const localCustomers = JSON.parse(saved) as Customer[];
            if (localCustomers.length > 0) {
              const docs = await getDocs(collection(db, 'customers'));
              if (docs.empty) {
                // Migrate batch sequentially to avoid spamming too fast
                // or just `Promise.all` but let's keep it simple
                for (const c of localCustomers) {
                  await setDoc(doc(db, 'customers', c.id), c);
                }
              }
            }
          } catch (e) {
            console.error('Migration failed:', e);
          }
        }
        localStorage.setItem('tecnicianbd_migrated_to_firebase', 'true');
      }
    };
    migrateData();
  }, []);

  const handleSaveCustomer = async (customer: Customer) => {
    try {
      await setDoc(doc(db, 'customers', customer.id), customer);
      closeForm();
    } catch (e) {
      console.error('Error saving customer:', e);
      alert('Failed to save to cloud.');
    }
  };

  const confirmDelete = (id: string) => {
    setCustomerToDelete(id);
  };

  const executeDelete = async () => {
    if (customerToDelete) {
      try {
        await deleteDoc(doc(db, 'customers', customerToDelete));
        setCustomerToDelete(null);
      } catch (e) {
        console.error('Error deleting customer:', e);
        alert('Failed to delete from cloud.');
      }
    }
  };

  const cancelDelete = () => {
    setCustomerToDelete(null);
  };

  const handleChangeStatus = async (id: string, newStatus: ServiceStatus) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      try {
        await setDoc(doc(db, 'customers', id), { ...customer, status: newStatus });
      } catch (e) {
        console.error('Error updating status:', e);
        alert('Failed to update status.');
      }
    }
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
          <p className="text-slate-500 text-sm mt-1">AC Servicing Management System • <span className="font-semibold text-blue-500">Cloud Synced</span></p>
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
                    onDelete={confirmDelete}
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
          <span className="flex items-center gap-1.5 text-blue-500">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            CLOUD SYNC ACTIVE
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

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={customerToDelete !== null}
        title="Delete Job Entry"
        message="Are you sure you want to delete this job? This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
