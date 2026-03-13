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

-- RLS (Row Level Security) - Simplificado para el Nacional
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON businesses FOR SELECT USING (true);
