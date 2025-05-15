/*
  # Add Education and Finance Tables

  1. New Tables
    - `schools`
      - Basic school information
      - Contact details
      - Facilities
    - `students`
      - Student registration
      - Academic records
    - `scholarships`
      - Scholarship programs
      - Eligibility criteria
    - `financial_schemes`
      - Government schemes
      - Loan programs
    - `financial_applications`
      - Applications for financial assistance
      - Loan applications

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
*/

-- Education Tables
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  contact_number text,
  email text,
  facilities jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  school_id uuid REFERENCES schools,
  enrollment_number text UNIQUE,
  current_grade text,
  admission_date date,
  academic_records jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scholarships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  eligibility_criteria jsonb NOT NULL,
  amount numeric(10,2),
  deadline date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Finance Tables
CREATE TABLE IF NOT EXISTS financial_schemes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  description text,
  eligibility_criteria jsonb NOT NULL,
  amount_range jsonb,
  interest_rate numeric(5,2),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS financial_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  scheme_id uuid REFERENCES financial_schemes,
  amount numeric(10,2) NOT NULL,
  purpose text NOT NULL,
  status text DEFAULT 'pending',
  documents jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active scholarships"
  ON scholarships FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active financial schemes"
  ON financial_schemes FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view own financial applications"
  ON financial_applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create financial applications"
  ON financial_applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own student records"
  ON students FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own student records"
  ON students FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view schools"
  ON schools FOR SELECT
  TO authenticated
  USING (true);