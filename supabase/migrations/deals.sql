create table public.deals (
  id uuid primary key default uuid_generate_v4(),
  company text not null,
  amount numeric not null,
  raas numeric not null,
  owner text not null,
  product text not null,
  stage text not null,
  demoDate timestamp with time zone,
  summary text,
  updatedAt timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.deals enable row level security;

-- Allow read access to all authenticated users
create policy "Allow read access to all users"
  on public.deals
  for select
  to authenticated
  using (true);

-- Allow insert/update access to all authenticated users
create policy "Allow insert/update access to all users"
  on public.deals
  for insert
  to authenticated
  with check (true);

create policy "Allow update access to all users"
  on public.deals
  for update
  to authenticated
  using (true); 