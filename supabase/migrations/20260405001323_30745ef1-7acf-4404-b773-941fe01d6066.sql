
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Appointment status enum
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

-- Payment status enum
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'cancelled');

-- Payment method enum
CREATE TYPE public.payment_method AS ENUM ('efectivo', 'tarjeta', 'transferencia');

-- Clinic config
CREATE TABLE public.clinic_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  open_time TEXT NOT NULL DEFAULT '09:00',
  close_time TEXT NOT NULL DEFAULT '19:00',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clinic_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read clinic_config" ON public.clinic_config FOR SELECT USING (true);
CREATE POLICY "Public write clinic_config" ON public.clinic_config FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_clinic_config_updated_at BEFORE UPDATE ON public.clinic_config
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Specialties
CREATE TABLE public.specialties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration INT NOT NULL DEFAULT 30,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read specialties" ON public.specialties FOR SELECT USING (true);
CREATE POLICY "Public write specialties" ON public.specialties FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_specialties_updated_at BEFORE UPDATE ON public.specialties
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Doctors
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty_id UUID REFERENCES public.specialties(id),
  photo TEXT,
  schedule JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Public write doctors" ON public.doctors FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON public.doctors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Patients
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  dob DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Public write patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Appointments
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.specialties(id),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration INT NOT NULL DEFAULT 30,
  status public.appointment_status NOT NULL DEFAULT 'scheduled',
  reason TEXT,
  notes TEXT,
  events JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read appointments" ON public.appointments FOR SELECT USING (true);
CREATE POLICY "Public write appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Invoices
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  status public.payment_status NOT NULL DEFAULT 'pending',
  method public.payment_method NOT NULL DEFAULT 'efectivo',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Public write invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
