import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Customer, ServiceStatus, JobPriority } from '../types';

interface CustomerFormProps {
  initialData?: Customer;
  onSubmit: (customer: Customer) => void;
  onCancel: () => void;
}

export function CustomerForm({ initialData, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    serviceDate: new Date().toISOString().split('T')[0],
    address: '',
    location: '',
    serviceCharge: 0,
    notes: '',
    status: 'Pending',
    priority: 'Medium',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'serviceCharge' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.serviceDate) {
      alert('Please fill out all required fields.');
      return;
    }
    
    const submittedData: Customer = {
      id: initialData?.id || crypto.randomUUID(),
      name: formData.name!,
      phone: formData.phone!,
      serviceDate: formData.serviceDate!,
      address: formData.address || '',
      location: formData.location || '',
      serviceCharge: formData.serviceCharge || 0,
      notes: formData.notes || '',
      status: formData.status as ServiceStatus || 'Pending',
      priority: formData.priority as JobPriority || 'Medium',
      createdAt: initialData?.createdAt || Date.now(),
    };

    onSubmit(submittedData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-blue-900 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto text-white">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            {initialData ? 'Edit Job Entry' : 'Add New Job'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-300 tracking-widest mb-1.5">Customer Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-blue-800/50 border border-blue-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300/50"
                placeholder="e.g. Hasan Mahbub"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-blue-300 tracking-widest mb-1.5">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-blue-800/50 border border-blue-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300/50"
                  placeholder="017..."
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-blue-300 tracking-widest mb-1.5">Date *</label>
                <input
                  type="date"
                  name="serviceDate"
                  required
                  value={formData.serviceDate}
                  onChange={handleChange}
                  className="w-full bg-blue-800/50 border border-blue-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] uppercase font-bold text-blue-300 tracking-widest mb-1.5">Charge (৳)</label>
                <input
                  type="number"
                  name="serviceCharge"
                  min="0"
                  value={formData.serviceCharge}
                  onChange={handleChange}
                  className="w-full bg-blue-800/50 border border-blue-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300/50"
                  placeholder="1500"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] uppercase font-bold text-blue-300 tracking-widest mb-1.5">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-blue-800/50 border border-blue-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                >
                  <option value="Pending" className="text-black">Pending</option>
                  <option value="In Progress" className="text-black">In Progress</option>
                  <option value="Completed" className="text-black">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-300 tracking-widest mb-1.5">Priority</label>
              <select
                name="priority"
                value={formData.priority || 'Medium'}
                onChange={handleChange}
                className="w-full bg-blue-800/50 border border-blue-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
              >
                <option value="High" className="text-black">High Priority</option>
                <option value="Medium" className="text-black">Medium Priority</option>
                <option value="Low" className="text-black">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-300 tracking-widest mb-1.5">Service Address</label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-blue-800/50 border border-blue-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300/50"
                placeholder="Flat 4A, Road..."
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-300 tracking-widest mb-1.5">Location Link</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-blue-800/50 border border-blue-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300/50"
                placeholder="Google Maps link or neighborhood"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-blue-300 tracking-widest mb-1.5">Notes</label>
              <textarea
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                className="w-full bg-blue-800/50 border border-blue-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-300/50"
                placeholder="Any special requirements..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl font-bold uppercase text-xs tracking-widest transition-colors border border-blue-700/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-xl shadow-lg transition-colors font-bold uppercase text-xs tracking-widest"
              >
                {initialData ? 'Save Changes' : 'Create Job Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
