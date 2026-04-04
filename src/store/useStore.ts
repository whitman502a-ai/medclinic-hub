import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Specialty, Doctor, Patient, Appointment, Invoice, ClinicConfig, Role, AppointmentStatus, PaymentMethod, VALID_TRANSITIONS } from '@/types';
import { initialClinic, initialSpecialties, initialDoctors, initialPatients, initialAppointments, initialInvoices } from '@/data/mockData';

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

  // Actions
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

const getInitialState = () => ({
  role: null as Role | null,
  currentDoctorId: null as string | null,
  currentPatientId: null as string | null,
  onboardingCompleted: false,
  clinic: { ...initialClinic },
  specialties: [...initialSpecialties],
  doctors: [...initialDoctors],
  patients: [...initialPatients],
  appointments: [...initialAppointments],
  invoices: [...initialInvoices],
});

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setRole: (role) => {
        const updates: Partial<StoreState> = { role };
        if (role === 'doctor') updates.currentDoctorId = 'doc_01';
        else updates.currentDoctorId = null;
        if (role === 'patient') updates.currentPatientId = 'pac_01';
        else updates.currentPatientId = null;
        set(updates as any);
      },

      setOnboardingCompleted: (v) => set({ onboardingCompleted: v }),

      updateClinic: (c) => set((s) => ({ clinic: { ...s.clinic, ...c } })),

      addDoctor: (d) => set((s) => ({ doctors: [...s.doctors, d] })),
      updateDoctor: (id, d) => set((s) => ({ doctors: s.doctors.map((doc) => doc.id === id ? { ...doc, ...d } : doc) })),

      addPatient: (p) => set((s) => ({ patients: [...s.patients, p] })),
      updatePatient: (id, p) => set((s) => ({ patients: s.patients.map((pat) => pat.id === id ? { ...pat, ...p } : pat) })),

      addAppointment: (a) => set((s) => {
        const patient = s.patients.find(p => p.id === a.patient_id);
        const updatedPatients = patient
          ? s.patients.map(p => p.id === a.patient_id ? { ...p, appointment_ids: [...p.appointment_ids, a.id] } : p)
          : s.patients;
        return { appointments: [...s.appointments, a], patients: updatedPatients };
      }),

      transitionAppointment: (id, newStatus) => {
        const state = get();
        const apt = state.appointments.find(a => a.id === id);
        if (!apt) return 'Cita no encontrada';
        const valid = VALID_TRANSITIONS[apt.status];
        if (!valid.includes(newStatus)) return `No se puede cambiar de "${apt.status}" a "${newStatus}"`;
        set({
          appointments: state.appointments.map(a =>
            a.id === id ? {
              ...a,
              status: newStatus,
              events: [...a.events, { type: newStatus, timestamp: new Date().toISOString() }],
            } : a
          ),
        });
        return null;
      },

      updateAppointmentNotes: (id, notes) => set((s) => ({
        appointments: s.appointments.map(a =>
          a.id === id ? { ...a, notes, events: [...a.events, { type: 'notes_added', timestamp: new Date().toISOString() }] } : a
        ),
      })),

      addInvoice: (i) => set((s) => ({ invoices: [...s.invoices, i] })),
      updateInvoice: (id, i) => set((s) => ({ invoices: s.invoices.map((inv) => inv.id === id ? { ...inv, ...i } : inv) })),

      addSpecialty: (s_new) => set((s) => ({ specialties: [...s.specialties, s_new] })),
      updateSpecialty: (id, updates) => set((s) => ({ specialties: s.specialties.map((sp) => sp.id === id ? { ...sp, ...updates } : sp) })),

      resetStore: () => set({ ...getInitialState(), role: null }),
    }),
    { name: 'medios-store' }
  )
);
