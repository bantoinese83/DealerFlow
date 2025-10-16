-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgsodium";

-- Create dealerships table
CREATE TABLE IF NOT EXISTS public.dealerships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    crm_type TEXT,
    crm_config_json JSONB,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    phone TEXT,
    website TEXT,
    timezone TEXT DEFAULT 'America/New_York',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'bdc_rep')),
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE NOT NULL,
    crm_lead_id TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'disqualified', 'closed')),
    source TEXT NOT NULL CHECK (source IN ('website', 'walk_in', 'ai_generated', 'phone', 'referral', 'other')),
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    preferred_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    notes TEXT,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    follow_up_due_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE NOT NULL,
    vin TEXT UNIQUE NOT NULL,
    make TEXT,
    model TEXT,
    year INTEGER,
    trim TEXT,
    mileage INTEGER,
    price DECIMAL(10, 2),
    availability_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (availability_status IN ('in_stock', 'sold', 'pending')),
    last_scraped_at TIMESTAMP WITH TIME ZONE,
    scraped_url TEXT,
    image_urls TEXT[] DEFAULT '{}',
    details_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
    participant TEXT NOT NULL CHECK (participant IN ('ai', 'lead', 'bdc_rep')),
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    intent TEXT CHECK (intent IN ('inquiry', 'appointment_request', 'price_inquiry', 'disinterest', 'follow_up', 'complaint', 'other')),
    ai_model_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_configs table
CREATE TABLE IF NOT EXISTS public.ai_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE UNIQUE NOT NULL,
    model_name TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    temperature DECIMAL(3, 2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 1000,
    follow_up_frequency_days INTEGER DEFAULT 3,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dealership_id UUID REFERENCES public.dealerships(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('critical', 'warning', 'info')),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_dealership_id ON public.profiles(dealership_id);
CREATE INDEX IF NOT EXISTS idx_leads_dealership_id ON public.leads(dealership_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_vehicles_dealership_id ON public.vehicles(dealership_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_vin ON public.vehicles(vin);
CREATE INDEX IF NOT EXISTS idx_vehicles_make_model ON public.vehicles(make, model);
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON public.conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON public.conversations(timestamp);
CREATE INDEX IF NOT EXISTS idx_alerts_dealership_id ON public.alerts(dealership_id);
CREATE INDEX IF NOT EXISTS idx_alerts_profile_id ON public.alerts(profile_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON public.alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_alerts_triggered_at ON public.alerts(triggered_at);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_leads_search ON public.leads USING gin(to_tsvector('english', first_name || ' ' || COALESCE(last_name, '') || ' ' || email || ' ' || COALESCE(phone, '') || ' ' || COALESCE(notes, '')));
CREATE INDEX IF NOT EXISTS idx_vehicles_search ON public.vehicles USING gin(to_tsvector('english', COALESCE(make, '') || ' ' || COALESCE(model, '') || ' ' || COALESCE(year::text, '') || ' ' || COALESCE(trim, '') || ' ' || vin));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_dealerships_updated_at BEFORE UPDATE ON public.dealerships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_configs_updated_at BEFORE UPDATE ON public.ai_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
