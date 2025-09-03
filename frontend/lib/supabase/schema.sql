-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create diagnoses table
create table public.diagnoses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  image_url text,
  disease_name text,
  confidence decimal,
  symptoms text[],
  treatment text,
  prevention text,
  language text default 'en',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create conversations table
create table public.conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  diagnosis_id uuid references public.diagnoses on delete set null,
  messages jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.diagnoses enable row level security;
alter table public.conversations enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

create policy "Users can view own diagnoses." on diagnoses
  for select using (auth.uid() = user_id);

create policy "Users can insert own diagnoses." on diagnoses
  for insert with check (auth.uid() = user_id);

create policy "Users can update own diagnoses." on diagnoses
  for update using (auth.uid() = user_id);

create policy "Users can delete own diagnoses." on diagnoses
  for delete using (auth.uid() = user_id);

create policy "Users can view own conversations." on conversations
  for select using (auth.uid() = user_id);

create policy "Users can insert own conversations." on conversations
  for insert with check (auth.uid() = user_id);

create policy "Users can update own conversations." on conversations
  for update using (auth.uid() = user_id);

create policy "Users can delete own conversations." on conversations
  for delete using (auth.uid() = user_id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.diagnoses
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.conversations
  for each row execute procedure public.handle_updated_at();