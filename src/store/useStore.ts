import { create } from 'zustand';
import { Specialty, Doctor, Patient, Appointment, Invoice, ClinicConfig, Role, AppointmentStatus, VALID_TRANSITIONS } from '@/types';
import { initialClinic, initialSpecialties, initialDoctors, initialPatients, initialAppointments, initialInvoices } from '@/data/mockData';
import * as db from '@/lib/supabaseData';

interface StoreState {
  // Auth
  role: Role | null;
  currentDoctorId: string | null;
  currentPatientId: string | null;
  onboardingCompleted: boolean;
  setRole: (role: Role | null) => void;
  setOnboardingCompleted: (v: boolean) => void;

  // Data
  clinic: ClinicConfig;
  specialties: Specialty[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  loaded: boolean;

  // Actions
  loadFromDb: () => Promise<void>;
  updateClinic: (c: Partial<ClinicConfig>) => void;
  addDoctor: (d: Doctor) => void;
  updateDoctor: (id: string, d: Partial<Doctor>) => void;
  addPatient: (p: Patient) => void;
  updatePatient: (id: string, p: Partial<Patient>) => void;
  addAppointment: (a: Appointment) => void;
  transitionAppointment: (id: string, newStatus: AppointmentStatus) => string | null;
  updateAppointmentNotes: (id: string, notes: string) => void;
  addInvoice: (i: Invoice) => void;
  updateInvoice: (id: string, i: Partial<Invoice>) => void;
  addSpecialty: (s: Specialty) => void;
  updateSpecialty: (id: string, s: Partial<Specialty>) => void;
  resetStore: () => void;
}

export const useStore = create<StoreState>()((set, get) => ({
  role: null,
  currentDoctorId: null,
  currentPatientId: null,
  onboardingCompleted: false,
  clinic: { ...initialClinic },
  specialties: [...initialSpecialties],
  doctors: [...initialDoctors],
  patients: [...initialPatients],
  appointments: [...initialAppointments],
  invoices: [...initialInvoices],
  loaded: false,

  loadFromDb: async () => {
    try {
      const [clinic, specialties, doctors, patients, appointments, invoices] = await Promise.all([
        db.fetchClinic(),
        db.fetchSpecialties(),
        db.fetchDoctors(),
        db.fetchPatients(),
        db.fetchAppointments(),
        db.fetchInvoices(),
      ]);
      set({
        clinic,
        specialties: specialties.length > 0 ? specialties : [...initialSpecialties],
        doctors: doctors.length > 0 ? doctors : [...initialDoctors],
        patients: patients.length > 0 ? patients : [...initialPatients],
        appointments: appointments.length > 0 ? appointments : [...initialAppointments],
        invoices: invoices.length > 0 ? invoices : [...initialInvoices],
        loaded: true,
      });
    } catch {
      // Fallback to mock data if DB fails
      set({ loaded: true });
    }
  },

  setRole: (role) => {
    const state = get();
    const updates: any = { role };
    if (role === 'doctor') updates.currentDoctorId = state.doctors[0]?.id || null;
    else updates.currentDoctorId = null;
    if (role === 'patient') updates.currentPatientId = state.patients[0]?.id || null;
    else updates.currentPatientId = null;
    set(updates);
  },

  setOnboardingCompleted: (v) => set({ onboardingCompleted: v }),

  updateClinic: (c) => {
    set((s) => {
      const updated = { ...s.clinic, ...c };
      db.upsertClinic(updated);
      return { clinic: updated };
    });
  },

  addDoctor: (d) => {
    set((s) => ({ doctors: [...s.doctors, d] }));
    db.insertDoctor(d);
  },

  updateDoctor: (id, d) => {
    set((s) => ({ doctors: s.doctors.map((doc) => doc.id === id ? { ...doc, ...d } : doc) }));
    db.updateDoctorDb(id, d);
  },

  addPatient: (p) => {
    set((s) => ({ patients: [...s.patients, p] }));
    db.insertPatient(p);
  },

  updatePatient: (id, p) => set((s) => ({ patients: s.patients.map((pat) => pat.id === id ? { ...pat, ...p } : pat) })),

  addAppointment: (a) => {
    set((s) => {
      const patient = s.patients.find(p => p.id === a.patient_id);
      const updatedPatients = patient
        ? s.patients.map(p => p.id === a.patient_id ? { ...p, appointment_ids: [...p.appointment_ids, a.id] } : p)
        : s.patients;
      return { appointments: [...s.appointments, a], patients: updatedPatients };
    });
    db.insertAppointment(a);
  },

  transitionAppointment: (id, newStatus) => {
    const state = get();
    const apt = state.appointments.find(a => a.id === id);
    if (!apt) return 'Cita no encontrada';
    const valid = VALID_TRANSITIONS[apt.status];
    if (!valid.includes(newStatus)) return `No se puede cambiar de "${apt.status}" a "${newStatus}"`;
    const newEvents = [...apt.events, { type: newStatus, timestamp: new Date().toISOString() }];
    set({
      appointments: state.appointments.map(a =>
        a.id === id ? { ...a, status: newStatus, events: newEvents } : a
      ),
    });
    db.updateAppointmentDb(id, { status: newStatus, events: newEvents });
    return null;
  },

  updateAppointmentNotes: (id, notes) => {
    set((s) => ({
      appointments: s.appointments.map(a =>
        a.id === id ? { ...a, notes, events: [...a.events, { type: 'notes_added', timestamp: new Date().toISOString() }] } : a
      ),
    }));
    const apt = get().appointments.find(a => a.id === id);
    if (apt) db.updateAppointmentDb(id, { notes, events: apt.events });
  },

  addInvoice: (i) => {
    set((s) => ({ invoices: [...s.invoices, i] }));
    db.insertInvoice(i);
  },

  updateInvoice: (id, i) => {
    set((s) => ({ invoices: s.invoices.map((inv) => inv.id === id ? { ...inv, ...i } : inv) }));
    db.updateInvoiceDb(id, i);
  },

  addSpecialty: (s_new) => set((s) => ({ specialties: [...s.specialties, s_new] })),

  updateSpecialty: (id, updates) => {
    set((s) => ({ specialties: s.specialties.map((sp) => sp.id === id ? { ...sp, ...updates } : sp) }));
    db.updateSpecialtyDb(id, updates);
  },

  resetStore: () => {
    set({
      role: null,
      currentDoctorId: null,
      currentPatientId: null,
      onboardingCompleted: false,
      loaded: false,
    });
    // Reload from DB
    get().loadFromDb();
  },
}));
