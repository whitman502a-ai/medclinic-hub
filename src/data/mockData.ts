import { Specialty, Doctor, Patient, Appointment, Invoice, ClinicConfig } from '@/types';
import { format, addDays, subDays } from 'date-fns';

const today = format(new Date(), 'yyyy-MM-dd');
const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
const twoDaysAgo = format(subDays(new Date(), 2), 'yyyy-MM-dd');
const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
const dayAfterTomorrow = format(addDays(new Date(), 2), 'yyyy-MM-dd');
const threeDaysFromNow = format(addDays(new Date(), 3), 'yyyy-MM-dd');

export const initialClinic: ClinicConfig = {
  name: 'Clínica MediOS Demo',
  address: 'Av. Reforma 500, Col. Centro, Ciudad de México',
  phone: '+52 55 1234 5678',
  email: 'contacto@medios.clinic',
  openTime: '09:00',
  closeTime: '19:00',
};

export const initialSpecialties: Specialty[] = [
  { id: 'spec_01', name: 'Medicina General', duration: 30, price: 800, description: 'Consulta médica general y preventiva', icon: 'Stethoscope' },
  { id: 'spec_02', name: 'Odontología', duration: 45, price: 1200, description: 'Cuidado dental integral', icon: 'SmilePlus' },
  { id: 'spec_03', name: 'Pediatría', duration: 30, price: 900, description: 'Atención médica para niños', icon: 'Baby' },
  { id: 'spec_04', name: 'Dermatología', duration: 30, price: 1000, description: 'Cuidado de la piel', icon: 'Scan' },
  { id: 'spec_05', name: 'Nutrición', duration: 45, price: 700, description: 'Planes alimenticios personalizados', icon: 'Apple' },
];

export const initialDoctors: Doctor[] = [
  {
    id: 'doc_01', name: 'Dra. Sofía Martínez', specialty_id: 'spec_01',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
    schedule: { lunes: { start: '09:00', end: '17:00' }, martes: { start: '09:00', end: '17:00' }, miercoles: { start: '09:00', end: '17:00' }, jueves: { start: '09:00', end: '17:00' }, viernes: { start: '09:00', end: '17:00' } },
    active: true, bio: 'Especialista en medicina general con 10 años de experiencia.',
  },
  {
    id: 'doc_02', name: 'Dr. Carlos Herrera', specialty_id: 'spec_02',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
    schedule: { lunes: { start: '10:00', end: '18:00' }, martes: { start: '10:00', end: '18:00' }, miercoles: { start: '10:00', end: '18:00' }, jueves: { start: '10:00', end: '18:00' }, viernes: { start: '10:00', end: '18:00' } },
    active: true, bio: 'Odontólogo con especialización en ortodoncia.',
  },
  {
    id: 'doc_03', name: 'Dra. Ana López', specialty_id: 'spec_03',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=300&h=300&fit=crop&crop=face',
    schedule: { lunes: { start: '09:00', end: '14:00' }, martes: { start: '09:00', end: '14:00' }, jueves: { start: '09:00', end: '14:00' } },
    active: true, bio: 'Pediatra certificada con enfoque en desarrollo infantil.',
  },
  {
    id: 'doc_04', name: 'Dr. Roberto Díaz', specialty_id: 'spec_04',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face',
    schedule: { martes: { start: '11:00', end: '19:00' }, jueves: { start: '11:00', end: '19:00' }, viernes: { start: '11:00', end: '19:00' } },
    active: true, bio: 'Dermatólogo especializado en dermatología estética.',
  },
];

export const initialPatients: Patient[] = [
  { id: 'pac_01', name: 'María García', phone: '5512345001', email: 'maria@email.com', dob: '1991-03-15', appointment_ids: ['apt_01', 'apt_03', 'apt_08'] },
  { id: 'pac_02', name: 'Juan Rodríguez', phone: '5512345002', email: 'juan@email.com', dob: '1998-07-22', appointment_ids: ['apt_02', 'apt_07'] },
  { id: 'pac_03', name: 'Laura Sánchez', phone: '5512345003', email: 'laura@email.com', dob: '1984-11-08', appointment_ids: ['apt_04', 'apt_09'] },
  { id: 'pac_04', name: 'Pedro González', phone: '5512345004', email: 'pedro@email.com', dob: '1971-05-30', appointment_ids: ['apt_05', 'apt_10'] },
  { id: 'pac_05', name: 'Ana Torres', phone: '5512345005', email: 'ana.t@email.com', dob: '2018-01-12', appointment_ids: ['apt_06'] },
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt_01', patient_id: 'pac_01', doctor_id: 'doc_01', service_id: 'spec_01',
    date: today, time: '10:00', duration: 30, status: 'in_progress',
    reason: 'Dolor de cabeza persistente', notes: 'Paciente refiere cefalea de 3 días de evolución.',
    events: [
      { type: 'created', timestamp: subDays(new Date(), 3).toISOString() },
      { type: 'confirmed', timestamp: subDays(new Date(), 1).toISOString() },
      { type: 'in_progress', timestamp: new Date().toISOString() },
    ],
  },
  {
    id: 'apt_02', patient_id: 'pac_02', doctor_id: 'doc_02', service_id: 'spec_02',
    date: today, time: '11:00', duration: 45, status: 'confirmed',
    reason: 'Limpieza dental', notes: '',
    events: [
      { type: 'created', timestamp: subDays(new Date(), 5).toISOString() },
      { type: 'confirmed', timestamp: subDays(new Date(), 2).toISOString() },
    ],
  },
  {
    id: 'apt_03', patient_id: 'pac_01', doctor_id: 'doc_01', service_id: 'spec_01',
    date: twoDaysAgo, time: '09:00', duration: 30, status: 'completed',
    reason: 'Consulta de seguimiento', notes: 'Evolución favorable. Se ajusta medicamento.',
    events: [
      { type: 'created', timestamp: subDays(new Date(), 7).toISOString() },
      { type: 'confirmed', timestamp: subDays(new Date(), 3).toISOString() },
      { type: 'in_progress', timestamp: subDays(new Date(), 2).toISOString() },
      { type: 'completed', timestamp: subDays(new Date(), 2).toISOString() },
    ],
  },
  {
    id: 'apt_04', patient_id: 'pac_03', doctor_id: 'doc_04', service_id: 'spec_04',
    date: twoDaysAgo, time: '11:00', duration: 30, status: 'completed',
    reason: 'Revisión de lunar', notes: 'Lunar benigno. Control en 6 meses.',
    events: [
      { type: 'created', timestamp: subDays(new Date(), 6).toISOString() },
      { type: 'completed', timestamp: subDays(new Date(), 2).toISOString() },
    ],
  },
  {
    id: 'apt_05', patient_id: 'pac_04', doctor_id: 'doc_01', service_id: 'spec_01',
    date: tomorrow, time: '09:30', duration: 30, status: 'scheduled',
    reason: 'Chequeo general', notes: '',
    events: [{ type: 'created', timestamp: subDays(new Date(), 2).toISOString() }],
  },
  {
    id: 'apt_06', patient_id: 'pac_05', doctor_id: 'doc_03', service_id: 'spec_03',
    date: tomorrow, time: '10:00', duration: 30, status: 'scheduled',
    reason: 'Control pediátrico', notes: '',
    events: [{ type: 'created', timestamp: subDays(new Date(), 1).toISOString() }],
  },
  {
    id: 'apt_07', patient_id: 'pac_02', doctor_id: 'doc_02', service_id: 'spec_02',
    date: dayAfterTomorrow, time: '14:00', duration: 45, status: 'scheduled',
    reason: 'Revisión de brackets', notes: '',
    events: [{ type: 'created', timestamp: new Date().toISOString() }],
  },
  {
    id: 'apt_08', patient_id: 'pac_01', doctor_id: 'doc_01', service_id: 'spec_01',
    date: today, time: '14:00', duration: 30, status: 'confirmed',
    reason: 'Resultados de análisis', notes: '',
    events: [
      { type: 'created', timestamp: subDays(new Date(), 4).toISOString() },
      { type: 'confirmed', timestamp: subDays(new Date(), 1).toISOString() },
    ],
  },
  {
    id: 'apt_09', patient_id: 'pac_03', doctor_id: 'doc_04', service_id: 'spec_04',
    date: yesterday, time: '12:00', duration: 30, status: 'no_show',
    reason: 'Consulta dermatológica', notes: '',
    events: [
      { type: 'created', timestamp: subDays(new Date(), 5).toISOString() },
      { type: 'no_show', timestamp: subDays(new Date(), 1).toISOString() },
    ],
  },
  {
    id: 'apt_10', patient_id: 'pac_04', doctor_id: 'doc_01', service_id: 'spec_01',
    date: threeDaysFromNow, time: '16:00', duration: 30, status: 'cancelled',
    reason: 'Dolor de espalda', notes: '',
    events: [
      { type: 'created', timestamp: subDays(new Date(), 3).toISOString() },
      { type: 'cancelled', timestamp: subDays(new Date(), 1).toISOString() },
    ],
  },
];

export const initialInvoices: Invoice[] = [
  { id: 'inv_01', appointment_id: 'apt_03', patient_id: 'pac_01', amount: 800, status: 'paid', method: 'efectivo', date: twoDaysAgo, notes: '' },
  { id: 'inv_02', appointment_id: 'apt_04', patient_id: 'pac_03', amount: 1000, status: 'paid', method: 'tarjeta', date: twoDaysAgo, notes: '' },
  { id: 'inv_03', appointment_id: 'apt_03', patient_id: 'pac_01', amount: 800, status: 'pending', method: 'transferencia', date: today, notes: 'Cobro pendiente de segunda consulta' },
];
