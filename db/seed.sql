-- Insert sample dealership
INSERT INTO public.dealerships (id, name, crm_type, address, city, state, zip_code, phone, website, timezone) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Premier Auto Group', 'CDK', '123 Main Street', 'Anytown', 'CA', '90210', '(555) 123-4567', 'https://premierauto.com', 'America/Los_Angeles');

-- Insert sample AI config for the dealership
INSERT INTO public.ai_configs (dealership_id, model_name, system_prompt, temperature, max_tokens, follow_up_frequency_days) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'gpt-4-turbo', 'You are an AI assistant for Premier Auto Group, a luxury car dealership. Your role is to help potential customers with their vehicle inquiries, schedule appointments, and provide excellent customer service. Always be professional, friendly, and helpful. Focus on understanding customer needs and guiding them toward the right vehicle or service.', 0.7, 1000, 3);

-- Insert sample vehicles
INSERT INTO public.vehicles (dealership_id, vin, make, model, year, trim, mileage, price, availability_status, image_urls) VALUES
('550e8400-e29b-41d4-a716-446655440000', '1HGBH41JXMN109186', 'Honda', 'Civic', 2023, 'Sport', 15000, 25000.00, 'in_stock', ARRAY['https://example.com/civic1.jpg', 'https://example.com/civic2.jpg']),
('550e8400-e29b-41d4-a716-446655440000', '1FTFW1ET5DFC12345', 'Ford', 'F-150', 2023, 'XLT', 25000, 45000.00, 'in_stock', ARRAY['https://example.com/f1501.jpg', 'https://example.com/f1502.jpg']),
('550e8400-e29b-41d4-a716-446655440000', 'WBAFR9C50BC123456', 'BMW', '3 Series', 2023, '330i', 12000, 42000.00, 'in_stock', ARRAY['https://example.com/bmw1.jpg', 'https://example.com/bmw2.jpg']),
('550e8400-e29b-41d4-a716-446655440000', '1G1ZD5ST8LF123456', 'Chevrolet', 'Camaro', 2023, 'SS', 8000, 38000.00, 'sold', ARRAY['https://example.com/camaro1.jpg']),
('550e8400-e29b-41d4-a716-446655440000', '1FTFW1ET5DFC54321', 'Ford', 'Mustang', 2023, 'GT', 5000, 35000.00, 'pending', ARRAY['https://example.com/mustang1.jpg', 'https://example.com/mustang2.jpg']);

-- Insert sample leads
INSERT INTO public.leads (dealership_id, first_name, last_name, email, phone, status, source, preferred_vehicle_id, notes, follow_up_due_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'John', 'Doe', 'john.doe@email.com', '(555) 123-4567', 'new', 'website', '550e8400-e29b-41d4-a716-446655440001', 'Interested in Honda Civic Sport', NOW() + INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440000', 'Jane', 'Smith', 'jane.smith@email.com', '(555) 234-5678', 'contacted', 'walk_in', '550e8400-e29b-41d4-a716-446655440002', 'Looking for a truck for work', NOW() + INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440000', 'Mike', 'Johnson', 'mike.johnson@email.com', '(555) 345-6789', 'qualified', 'phone', '550e8400-e29b-41d4-a716-446655440003', 'Serious buyer, ready to purchase BMW', NOW() + INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440000', 'Sarah', 'Williams', 'sarah.williams@email.com', '(555) 456-7890', 'new', 'ai_generated', '550e8400-e29b-41d4-a716-446655440004', 'AI generated lead from website chat', NOW() + INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440000', 'David', 'Brown', 'david.brown@email.com', '(555) 567-8901', 'disqualified', 'referral', NULL, 'Not interested in current inventory', NULL);

-- Insert sample conversations
INSERT INTO public.conversations (lead_id, participant, message, sentiment, intent, ai_model_used) VALUES
((SELECT id FROM public.leads WHERE email = 'john.doe@email.com'), 'ai', 'Hello John! I see you''re interested in our Honda Civic Sport. It''s a fantastic choice with great fuel economy and sporty handling. Would you like to schedule a test drive?', 'positive', 'inquiry', 'gpt-4-turbo'),
((SELECT id FROM public.leads WHERE email = 'john.doe@email.com'), 'lead', 'Yes, I''d love to test drive it. What times are available this weekend?', 'positive', 'appointment_request', NULL),
((SELECT id FROM public.leads WHERE email = 'jane.smith@email.com'), 'bdc_rep', 'Hi Jane, thanks for visiting our showroom today. I''ll send you some information about our Ford F-150 trucks that would be perfect for your work needs.', 'positive', 'follow_up', NULL),
((SELECT id FROM public.leads WHERE email = 'mike.johnson@email.com'), 'ai', 'Hi Mike! I understand you''re interested in our BMW 3 Series. It''s a beautiful car with excellent performance and luxury features. The 330i trim offers the perfect balance of power and efficiency.', 'positive', 'inquiry', 'gpt-4-turbo'),
((SELECT id FROM public.leads WHERE email = 'sarah.williams@email.com'), 'ai', 'Welcome Sarah! I''m here to help you find the perfect vehicle. What type of car are you looking for?', 'neutral', 'inquiry', 'gpt-4-turbo');

-- Insert sample alerts
INSERT INTO public.alerts (dealership_id, lead_id, type, message, triggered_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM public.leads WHERE email = 'mike.johnson@email.com'), 'info', 'New qualified lead: Mike Johnson is ready to purchase BMW 3 Series', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440000', (SELECT id FROM public.leads WHERE email = 'sarah.williams@email.com'), 'info', 'AI generated new lead: Sarah Williams from website chat', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440000', NULL, 'warning', 'Follow-up overdue: John Doe was due for contact 2 hours ago', NOW() - INTERVAL '2 hours');
