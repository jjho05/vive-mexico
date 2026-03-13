-- Tablas principales para Ola México

-- 1. Micro-negocios
CREATE TABLE businesses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    tags TEXT[],
    image_url TEXT,
    lat FLOAT,
    lng FLOAT,
    rating FLOAT DEFAULT 0,
    address TEXT,
    merchant_id UUID,
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Registro de Swipes (Interacciones)
CREATE TABLE swipes (
    id SERIAL PRIMARY KEY,
    user_id UUID,
    business_id INTEGER REFERENCES businesses(id),
    action TEXT CHECK (action IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Turistas
CREATE TABLE tourists (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    country TEXT,
    preferred_currency TEXT,
    lat FLOAT,
    lng FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Comerciantes
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS merchant_id UUID;

-- RLS (Row Level Security) - Simplificado para el Nacional
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON businesses FOR SELECT USING (true);
