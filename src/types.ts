export type ServiceStatus = 'Pending' | 'In Progress' | 'Completed';
export type JobPriority = 'High' | 'Medium' | 'Low';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  serviceDate: string; // YYYY-MM-DD
  address: string;
  location: string;
  serviceCharge: number;
  notes?: string;
  status: ServiceStatus;
  priority: JobPriority;
  createdAt: number;
}
