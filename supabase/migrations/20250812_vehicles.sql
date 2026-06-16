-- Create vehicles table
CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price numeric NOT NULL,
  mileage integer NOT NULL,
  transmission text NOT NULL,
  fuel_type text NOT NULL,
  engine_capacity text,
  body_type text,
  condition text NOT NULL, -- 'Brand New', 'Used', 'Reconditioned'
  description text NOT NULL, -- Rich-text HTML format
  images text[] DEFAULT '{}'::text[] NOT NULL, -- Storage paths to files in 'vehicles' bucket
  featured boolean DEFAULT false,
  status text NOT NULL DEFAULT 'Available', -- 'Available', 'Sold', 'Reserved'
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Vehicles table policies
CREATE POLICY "Allow read for all" ON public.vehicles
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated" ON public.vehicles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

CREATE POLICY "Allow update for owners" ON public.vehicles
  FOR UPDATE USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow delete for owners" ON public.vehicles
  FOR DELETE USING (created_by = auth.uid());

-- Create index for performance
CREATE INDEX vehicles_created_at_idx ON public.vehicles (created_at DESC);

-- Create a storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public)
  VALUES ('vehicles', 'vehicles', true);

-- Storage bucket policies for vehicle images
CREATE POLICY "Public read vehicles" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicles');

CREATE POLICY "Authenticated upload vehicles" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vehicles' AND auth.role() = 'authenticated');

CREATE POLICY "Owner update vehicles" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'vehicles' AND auth.role() = 'authenticated' AND split_part(name, '/', 1) = auth.uid()::text
  ) WITH CHECK (
    bucket_id = 'vehicles' AND auth.role() = 'authenticated' AND split_part(name, '/', 1) = auth.uid()::text
  );

CREATE POLICY "Owner delete vehicles" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'vehicles' AND auth.role() = 'authenticated' AND split_part(name, '/', 1) = auth.uid()::text
  );
