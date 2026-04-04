export type Role = 'admin' | 'doctor' | 'patient';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type PaymentStatus = 'pending' | 'paid' | 'cancelled';
export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';

export interface Specialty {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  icon: string;
}

export interface DoctorSchedule {
  [day: string]: { start: string; end: string } | null;
}

export interface Doctor {
  id: string;
  name: string;
  specialty_id: string;
  photo: string;
  schedule: DoctorSchedule;
  active: boolean;
  bio: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  appointment_ids: string[];
}

export interface AppointmentEvent {
  type: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  service_id: string;
  date: string;
  time: string;
  duration: number;
  status: AppointmentStatus;
  reason: string;
  notes: string;
  events: AppointmentEvent[];
}

export interface Invoice {
  id: string;
  appointment_id: string;
  patient_id: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  date: string;
  notes: string;
}

export interface ClinicConfig {
  name: string;
  address: string;
  phone: string;
  email: string;
  openTime: string;
  closeTime: string;
}

export const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  scheduled: ['confirmed', 'cancelled', 'no_show'],
  confirmed: ['in_progress', 'cancelled', 'no_show'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
  no_show: [],
};

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Agendada',
  confirmed: 'Confirmada',
  in_progress: 'En consulta',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No se presentó',
};

export const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  cancelled: 'Cancelado',
};
