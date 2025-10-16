-- Enable Row Level Security on all tables
ALTER TABLE public.dealerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Dealerships policies
CREATE POLICY "Users can view their own dealership" ON public.dealerships
    FOR SELECT USING (
        id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can update their dealership" ON public.dealerships
    FOR UPDATE USING (
        id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Profiles policies
CREATE POLICY "Users can view profiles in their dealership" ON public.profiles
    FOR SELECT USING (
        dealership_id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can create profiles in their dealership" ON public.profiles
    FOR INSERT WITH CHECK (
        dealership_id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Leads policies
CREATE POLICY "Users can view leads in their dealership" ON public.leads
    FOR SELECT USING (
        dealership_id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "BDC reps can view assigned and unassigned leads" ON public.leads
    FOR SELECT USING (
        dealership_id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid()
        ) AND (
            assigned_to = auth.uid() OR 
            assigned_to IS NULL OR
            auth.uid() IN (
                SELECT id FROM public.profiles 
                WHERE role IN ('manager', 'admin') AND dealership_id = leads.dealership_id
            )
        )
    );

CREATE POLICY "BDC reps and managers can create leads" ON public.leads
    FOR INSERT WITH CHECK (
        dealership_id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('bdc_rep', 'manager', 'admin')
        )
    );

CREATE POLICY "Assigned BDC reps and managers can update leads" ON public.leads
    FOR UPDATE USING (
        dealership_id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid()
        ) AND (
            assigned_to = auth.uid() OR
            auth.uid() IN (
                SELECT id FROM public.profiles 
                WHERE role IN ('manager', 'admin') AND dealership_id = leads.dealership_id
            )
        )
    );

CREATE POLICY "Managers and admins can delete leads" ON public.leads
    FOR DELETE USING (
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('manager', 'admin') AND dealership_id = leads.dealership_id
        )
    );

-- Vehicles policies
CREATE POLICY "Users can view vehicles in their dealership" ON public.vehicles
    FOR SELECT USING (
        dealership_id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Managers and admins can manage vehicles" ON public.vehicles
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('manager', 'admin') AND dealership_id = vehicles.dealership_id
        )
    );

-- Conversations policies
CREATE POLICY "Users can view conversations for leads in their dealership" ON public.conversations
    FOR SELECT USING (
        lead_id IN (
            SELECT id FROM public.leads 
            WHERE dealership_id IN (
                SELECT dealership_id FROM public.profiles 
                WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "BDC reps and managers can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (
        lead_id IN (
            SELECT id FROM public.leads 
            WHERE dealership_id IN (
                SELECT dealership_id FROM public.profiles 
                WHERE id = auth.uid() AND role IN ('bdc_rep', 'manager', 'admin')
            )
        )
    );

-- AI Configs policies
CREATE POLICY "Users can view AI config for their dealership" ON public.ai_configs
    FOR SELECT USING (
        dealership_id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage AI config for their dealership" ON public.ai_configs
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role = 'admin' AND dealership_id = ai_configs.dealership_id
        )
    );

-- Alerts policies
CREATE POLICY "Users can view alerts for their dealership" ON public.alerts
    FOR SELECT USING (
        dealership_id IN (
            SELECT dealership_id FROM public.profiles 
            WHERE id = auth.uid()
        ) AND (
            profile_id = auth.uid() OR 
            profile_id IS NULL OR
            auth.uid() IN (
                SELECT id FROM public.profiles 
                WHERE role IN ('manager', 'admin') AND dealership_id = alerts.dealership_id
            )
        )
    );

CREATE POLICY "Users can update their own alerts" ON public.alerts
    FOR UPDATE USING (
        profile_id = auth.uid() OR
        auth.uid() IN (
            SELECT id FROM public.profiles 
            WHERE role IN ('manager', 'admin') AND dealership_id = alerts.dealership_id
        )
    );

CREATE POLICY "System can create alerts" ON public.alerts
    FOR INSERT WITH CHECK (true); -- This will be restricted by application logic
