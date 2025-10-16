-- Fix RLS infinite recursion on profiles and allow self-profile creation
-- 1) Introduce SECURITY DEFINER helper to fetch current user's dealership_id without triggering RLS
create or replace function public.current_user_dealership_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select p.dealership_id
  from public.profiles p
  where p.id = auth.uid();
$$;

-- 2) Replace problematic profiles policies
drop policy if exists "Users can view profiles in their dealership" on public.profiles;
drop policy if exists "Admins can create profiles in their dealership" on public.profiles;

-- Keep/update policy: Users can update their own profile (already exists in initial migration)

-- New SELECT policy: allow selecting own profile OR anyone in the same dealership via SECURITY DEFINER helper
create policy "Read profiles in same dealership or self" on public.profiles
  for select using (
    id = auth.uid() OR dealership_id = public.current_user_dealership_id()
  );

-- New INSERT policy: allow a user to create their own profile (self-serve signup)
create policy "Self create own profile" on public.profiles
  for insert with check (
    id = auth.uid()
  );


