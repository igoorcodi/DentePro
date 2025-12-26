
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  AGENDA = 'AGENDA',
  PATIENTS = 'PATIENTS',
  FINANCIAL = 'FINANCIAL',
  INVENTORY = 'INVENTORY',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
  CARE = 'CARE'
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  lastVisit: string;
  status: 'active' | 'inactive';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  professional: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled';
}

export interface Tooth {
  id: number;
  position: 'top' | 'bottom';
  side: 'left' | 'right';
  status: 'healthy' | 'decay' | 'restoration' | 'missing' | 'implant';
  notes?: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
}
