import { supabase } from '@/integrations/supabase/client';
import { Specialty, Doctor, Patient, Appointment, Invoice, ClinicConfig, AppointmentStatus, PaymentMethod, PaymentStatus } from '@/types';

// Helper to map DB rows to app types
const mapSpecialty = (r: any): Specialty => ({ id: r.id, name: r.name, duration: r.duration, price: Number(r.price), description: r.description || '', icon: r.icon || 'Stethoscope' });
const mapDoctor = (r: any): Doctor => ({ id: r.id, name: r.name, specialty_id: r.specialty_id, photo: r.photo || '', schedule: r.schedule as any || {}, active: r.active, bio: r.bio || '' });
const mapPatient = (r: any): Patient => ({ id: r.id, name: r.name, phone: r.phone || '', email: r.email || '', dob: r.dob || '', appointment_ids: [] });
const mapAppointment = (r: any): Appointment => ({ id: r.id, patient_id: r.patient_id, doctor_id: r.doctor_id, service_id: r.service_id, date: r.date, time: r.time, duration: r.duration, status: r.status as AppointmentStatus, reason: r.reason || '', notes: r.notes || '', events: (r.events as any[]) || [] });
const mapInvoice = (r: any): Invoice => ({ id: r.id, appointment_id: r.appointment_id, patient_id: r.patient_id, amount: Number(r.amount), status: r.status as PaymentStatus, method: r.method as PaymentMethod, date: r.date, notes: r.notes || '' });

export async function fetchClinic(): Promise<ClinicConfig> {
  const { data } = await supabase.from('clinic_config').select('*').limit(1).single();
  if (!data) return { name: 'MediOS', address: '', phone: '', email: '', openTime: '09:00', closeTime: '19:00' };
  return { name: data.name, address: data.address || '', phone: data.phone || '', email: data.email || '', openTime: data.open_time, closeTime: data.close_time };
}

export async function fetchSpecialties(): Promise<Specialty[]> {
  const { data } = await supabase.from('specialties').select('*').order('name');
  return (data || []).map(mapSpecialty);
}

export async function fetchDoctors(): Promise<Doctor[]> {
  const { data } = await supabase.from('doctors').select('*').order('name');
  return (data || []).map(mapDoctor);
}

export async function fetchPatients(): Promise<Patient[]> {
  const { data: pats } = await supabase.from('patients').select('*').order('name');
  const { data: apts } = await supabase.from('appointments').select('id, patient_id');
  const patients = (pats || []).map(mapPatient);
  // Populate appointment_ids
  patients.forEach(p => {
    p.appointment_ids = (apts || []).filter(a => a.patient_id === p.id).map(a => a.id);
  });
  return patients;
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const { data } = await supabase.from('appointments').select('*').order('date', { ascending: false });
  return (data || []).map(mapAppointment);
}

export async function fetchInvoices(): Promise<Invoice[]> {
  const { data } = await supabase.from('invoices').select('*').order('date', { ascending: false });
  return (data || []).map(mapInvoice);
}

// Write operations
export async function upsertClinic(c: ClinicConfig) {
  const { data: existing } = await supabase.from('clinic_config').select('id').limit(1).single();
  if (existing) {
    await supabase.from('clinic_config').update({ name: c.name, address: c.address, phone: c.phone, email: c.email, open_time: c.openTime, close_time: c.closeTime }).eq('id', existing.id);
  }
}

export async function insertDoctor(d: Doctor) {
  await supabase.from('doctors').insert({ id: d.id, name: d.name, specialty_id: d.specialty_id, photo: d.photo, schedule: d.schedule as any, active: d.active, bio: d.bio });
}

export async function updateDoctorDb(id: string, d: Partial<Doctor>) {
  const updates: any = {};
  if (d.name !== undefined) updates.name = d.name;
  if (d.specialty_id !== undefined) updates.specialty_id = d.specialty_id;
  if (d.photo !== undefined) updates.photo = d.photo;
  if (d.schedule !== undefined) updates.schedule = d.schedule;
  if (d.active !== undefined) updates.active = d.active;
  if (d.bio !== undefined) updates.bio = d.bio;
  await supabase.from('doctors').update(updates).eq('id', id);
}

export async function insertPatient(p: Patient) {
  await supabase.from('patients').insert({ id: p.id, name: p.name, phone: p.phone, email: p.email, dob: p.dob || null });
}

export async function insertAppointment(a: Appointment) {
  await supabase.from('appointments').insert({
    id: a.id, patient_id: a.patient_id, doctor_id: a.doctor_id, service_id: a.service_id,
    date: a.date, time: a.time, duration: a.duration, status: a.status as any,
    reason: a.reason, notes: a.notes, events: a.events as any,
  });
}

export async function updateAppointmentDb(id: string, updates: { status?: AppointmentStatus; notes?: string; events?: any[] }) {
  const u: any = {};
  if (updates.status !== undefined) u.status = updates.status;
  if (updates.notes !== undefined) u.notes = updates.notes;
  if (updates.events !== undefined) u.events = updates.events;
  await supabase.from('appointments').update(u).eq('id', id);
}

export async function insertInvoice(i: Invoice) {
  await supabase.from('invoices').insert({
    id: i.id, appointment_id: i.appointment_id, patient_id: i.patient_id,
    amount: i.amount, status: i.status as any, method: i.method as any,
    date: i.date, notes: i.notes,
  });
}

export async function updateInvoiceDb(id: string, updates: Partial<Invoice>) {
  const u: any = {};
  if (updates.status !== undefined) u.status = updates.status;
  if (updates.method !== undefined) u.method = updates.method;
  if (updates.amount !== undefined) u.amount = updates.amount;
  if (updates.notes !== undefined) u.notes = updates.notes;
  await supabase.from('invoices').update(u).eq('id', id);
}

export async function updateSpecialtyDb(id: string, updates: Partial<Specialty>) {
  const u: any = {};
  if (updates.name !== undefined) u.name = updates.name;
  if (updates.price !== undefined) u.price = updates.price;
  if (updates.duration !== undefined) u.duration = updates.duration;
  if (updates.description !== undefined) u.description = updates.description;
  if (updates.icon !== undefined) u.icon = updates.icon;
  await supabase.from('specialties').update(u).eq('id', id);
}
