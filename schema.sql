-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for appointment status and user roles
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE consultation_type AS ENUM ('physical', 'teleconsultation');

-- Create a secure schema for users
create schema if not exists auth;

-- Create a table for Public Profiles
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    first_name text,
    last_name text,
    phone_number text,
    gender text,
    date_of_birth date,
    location text,
    hometown text,
    occupation text,
    education text,
    languages text[],
    interests text[],
    relationship text,
    about text,
    avatar_url text,
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
    on profiles for select
    using (true);

create policy "Users can insert their own profile"
    on profiles for insert
    with check (auth.uid() = id);

create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid() = id);

-- Create indexes
create index if not exists profiles_first_name_idx on public.profiles (first_name);
create index if not exists profiles_last_name_idx on public.profiles (last_name);
create index if not exists profiles_location_idx on public.profiles (location);

-- Set up realtime subscriptions
alter publication supabase_realtime add table profiles;

-- Create doctors table for additional doctor information
CREATE TABLE doctors (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    specialization VARCHAR(255),
    license_number VARCHAR(100),
    bio TEXT,
    consultation_fee DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create doctor availability table
CREATE TABLE doctor_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(doctor_id, day_of_week, start_time, end_time)
);

-- Create appointments table
CREATE TABLE appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    patient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    consultation_type consultation_type NOT NULL,
    status appointment_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
    BEFORE UPDATE ON doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctor_availability_updated_at
    BEFORE UPDATE ON doctor_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Doctors policies
CREATE POLICY "Doctor profiles are viewable by everyone"
    ON doctors FOR SELECT
    USING (true);

CREATE POLICY "Doctors can update their own profile"
    ON doctors FOR UPDATE
    USING (auth.uid() = id);

-- Doctor availability policies
CREATE POLICY "Doctor availability is viewable by everyone"
    ON doctor_availability FOR SELECT
    USING (true);

CREATE POLICY "Doctors can manage their own availability"
    ON doctor_availability FOR ALL
    USING (auth.uid() = doctor_id);

-- Appointments policies
CREATE POLICY "Users can view their own appointments"
    ON appointments FOR SELECT
    USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments"
    ON appointments FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own appointments"
    ON appointments FOR UPDATE
    USING (auth.uid() = patient_id OR auth.uid() = doctor_id); 

-- Create a view for the doctor list with the exact data structure
CREATE OR REPLACE VIEW doctor_list AS
SELECT 
    d.id,
    CONCAT(p.first_name, ' ', p.last_name) as name,
    d.specialization as specialty,
    4.8 as rating,
    ARRAY['online', 'in-person']::text[] as modes,
    (
        SELECT ARRAY_AGG(
            TO_CHAR(
                (CURRENT_DATE + 
                CASE 
                    WHEN da.day_of_week < EXTRACT(DOW FROM CURRENT_DATE)::integer 
                    THEN da.day_of_week - EXTRACT(DOW FROM CURRENT_DATE)::integer + 7
                    ELSE da.day_of_week - EXTRACT(DOW FROM CURRENT_DATE)::integer
                END * INTERVAL '1 day' 
                + (da.start_time::time)::interval),
                'YYYY-MM-DD"T"HH24:MI:SS"Z"'
            )
        )
        FROM doctor_availability da
        WHERE da.doctor_id = d.id
        AND da.is_available = true
        ORDER BY 
            CURRENT_DATE + 
            CASE 
                WHEN da.day_of_week < EXTRACT(DOW FROM CURRENT_DATE)::integer 
                THEN da.day_of_week - EXTRACT(DOW FROM CURRENT_DATE)::integer + 7
                ELSE da.day_of_week - EXTRACT(DOW FROM CURRENT_DATE)::integer
            END * INTERVAL '1 day' 
            + (da.start_time::time)::interval
        LIMIT 3
    ) as next_available,
    30 as duration,
    d.consultation_fee as amount_aed,
    ARRAY['Available']::text[] as tags,
    p.avatar_url,
    ARRAY[LOWER(REPLACE(d.specialization, ' ', '-'))]::text[] as categories
FROM doctors d
JOIN profiles p ON p.id = d.id
WHERE d.id IS NOT NULL; 

-- Insérer des profils de test
INSERT INTO auth.users (id, email) VALUES
  ('d1b99f91-a2a7-4ebc-9ce9-c6f3c7910c7d', 'sarah.johnson@example.com'),
  ('d2c88e82-b3b8-5fcd-0df4-d7f4d8021c8e', 'michael.chen@example.com'),
  ('d3d77d73-c4c9-6ede-1e05-e805e9132d9f', 'emily.brown@example.com'),
  ('d4e66e64-d5d0-7fef-2f16-f906fa243e0g', 'james.wilson@example.com'),
  ('d5f55f55-e6e1-8fg0-3g27-g017gb354f1h', 'maria.garcia@example.com'),
  ('d6g44g46-f7f2-9gh1-4h38-h128hc465g2i', 'david.lee@example.com')
ON CONFLICT (id) DO NOTHING;

-- Insérer des profils publics
INSERT INTO public.profiles (id, first_name, last_name, avatar_url, created_at, updated_at) VALUES
  ('d1b99f91-a2a7-4ebc-9ce9-c6f3c7910c7d', 'Sarah', 'Johnson', '/images/avatars/albert-flores.png', NOW(), NOW()),
  ('d2c88e82-b3b8-5fcd-0df4-d7f4d8021c8e', 'Michael', 'Chen', '/images/avatars/cameron-williamson.png', NOW(), NOW()),
  ('d3d77d73-c4c9-6ede-1e05-e805e9132d9f', 'Emily', 'Brown', '/images/avatars/dianne-russell.png', NOW(), NOW()),
  ('d4e66e64-d5d0-7fef-2f16-f906fa243e0g', 'James', 'Wilson', '/images/avatars/robert-fox.png', NOW(), NOW()),
  ('d5f55f55-e6e1-8fg0-3g27-g017gb354f1h', 'Maria', 'Garcia', '/images/avatars/annette-black.png', NOW(), NOW()),
  ('d6g44g46-f7f2-9gh1-4h38-h128hc465g2i', 'David', 'Lee', '/images/avatars/cody-fisher.png', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insérer des médecins
INSERT INTO public.doctors (id, specialization, license_number, bio, consultation_fee, created_at, updated_at) VALUES
  ('d1b99f91-a2a7-4ebc-9ce9-c6f3c7910c7d', 'Dental Care', 'DEN2024-001', 'Experienced dentist specializing in preventive care and cosmetic dentistry.', 150, NOW(), NOW()),
  ('d2c88e82-b3b8-5fcd-0df4-d7f4d8021c8e', 'Pediatrics', 'PED2024-002', 'Dedicated pediatrician with over 10 years of experience in child healthcare.', 200, NOW(), NOW()),
  ('d3d77d73-c4c9-6ede-1e05-e805e9132d9f', 'General Medicine', 'GEN2024-003', 'Family physician focused on preventive care and chronic disease management.', 120, NOW(), NOW()),
  ('d4e66e64-d5d0-7fef-2f16-f906fa243e0g', 'Mental Health', 'MEN2024-004', 'Experienced psychiatrist specializing in anxiety and depression treatment.', 250, NOW(), NOW()),
  ('d5f55f55-e6e1-8fg0-3g27-g017gb354f1h', 'Home Nursing', 'NUR2024-005', 'Skilled nurse providing comprehensive home care services.', 300, NOW(), NOW()),
  ('d6g44g46-f7f2-9gh1-4h38-h128hc465g2i', 'Chronic Care', 'CHR2024-006', 'Specialist in managing chronic conditions and long-term care.', 200, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Créer une fonction pour générer les créneaux horaires pour les 7 prochains jours
CREATE OR REPLACE FUNCTION generate_future_slots(
  p_start_date date,
  p_days integer,
  p_start_time time,
  p_end_time time,
  p_interval interval
)
RETURNS TABLE (slot_datetime timestamp) AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE dates AS (
    SELECT p_start_date as date
    UNION ALL
    SELECT date + interval '1 day'
    FROM dates
    WHERE date < p_start_date + (p_days || ' days')::interval
  ),
  times AS (
    SELECT generate_series(
      p_start_time,
      p_end_time - p_interval,
      p_interval
    ) as time
  )
  SELECT (dates.date + times.time)::timestamp
  FROM dates
  CROSS JOIN times
  WHERE EXTRACT(DOW FROM dates.date) NOT IN (0, 6) -- Exclure les weekends
  ORDER BY 1;
END;
$$ LANGUAGE plpgsql;

-- Insérer les disponibilités pour les 7 prochains jours
DO $$
DECLARE
  doctor_id uuid;
  slot_time timestamp;
BEGIN
  -- Pour chaque docteur
  FOR doctor_id IN SELECT id FROM doctors LOOP
    -- Générer des créneaux pour les 7 prochains jours
    FOR slot_time IN
      SELECT * FROM generate_future_slots(
        CURRENT_DATE,
        7,
        '09:00'::time,
        '17:00'::time,
        '30 minutes'::interval
      )
    LOOP
      -- Insérer le créneau avec une probabilité de 70% (pour simuler des créneaux déjà pris)
      IF random() < 0.7 THEN
        INSERT INTO doctor_availability (
          doctor_id,
          day_of_week,
          start_time,
          end_time,
          is_available
        ) VALUES (
          doctor_id,
          EXTRACT(DOW FROM slot_time),
          slot_time::time,
          (slot_time + '30 minutes'::interval)::time,
          true
        ) ON CONFLICT DO NOTHING;
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Créer la vue pour l'affichage des docteurs avec leurs disponibilités
CREATE OR REPLACE VIEW doctor_list AS
WITH available_slots AS (
  SELECT 
    da.doctor_id,
    CURRENT_DATE + 
    make_interval(days := CASE 
      WHEN da.day_of_week < EXTRACT(DOW FROM CURRENT_DATE)::integer 
      THEN da.day_of_week - EXTRACT(DOW FROM CURRENT_DATE)::integer + 7
      ELSE da.day_of_week - EXTRACT(DOW FROM CURRENT_DATE)::integer
    END) + 
    (da.start_time::time)::interval as slot_datetime
  FROM doctor_availability da
  WHERE da.is_available = true
),
next_slots AS (
  SELECT 
    doctor_id,
    array_agg(
      TO_CHAR(slot_datetime, 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
      ORDER BY slot_datetime
    ) as next_available
  FROM (
    SELECT doctor_id, slot_datetime
    FROM available_slots
    WHERE slot_datetime > CURRENT_TIMESTAMP
    ORDER BY slot_datetime
    LIMIT 3
  ) sub
  GROUP BY doctor_id
)
SELECT 
  d.id,
  CONCAT(p.first_name, ' ', p.last_name) as name,
  d.specialization as specialty,
  4.8 as rating,
  ARRAY['online', 'in-person']::text[] as modes,
  COALESCE(ns.next_available, ARRAY[]::text[]) as next_available,
  30 as duration,
  d.consultation_fee as amount_aed,
  ARRAY['Available']::text[] as tags,
  p.avatar_url,
  ARRAY[LOWER(REPLACE(d.specialization, ' ', '-'))]::text[] as categories
FROM doctors d
JOIN profiles p ON p.id = d.id
LEFT JOIN next_slots ns ON ns.doctor_id = d.id; 