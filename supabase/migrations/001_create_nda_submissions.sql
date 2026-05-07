CREATE TABLE nda_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Buyer Company Info
  company_name TEXT NOT NULL,
  company_registration_number TEXT NOT NULL,
  company_country TEXT NOT NULL,
  company_type TEXT NOT NULL,
  business_address TEXT NOT NULL,
  vat_tax_id TEXT,
  trade_license_number TEXT,

  -- Contact Person
  contact_full_name TEXT NOT NULL,
  contact_designation TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,

  -- Order Intent
  product_categories TEXT[] NOT NULL,
  estimated_order_volume TEXT NOT NULL,
  target_markets TEXT[] NOT NULL,

  -- Security & Fingerprint Data
  ip_address TEXT,
  ip_country TEXT,
  ip_city TEXT,
  ip_isp TEXT,
  vpn_detected BOOLEAN DEFAULT FALSE,
  proxy_detected BOOLEAN DEFAULT FALSE,
  device_fingerprint TEXT,
  user_agent TEXT,
  browser_timezone TEXT,
  screen_resolution TEXT,
  browser_language TEXT,
  cpu_cores INTEGER,
  device_memory NUMERIC,
  webrtc_ip TEXT,

  -- Signature
  signature_data TEXT NOT NULL,
  signature_type TEXT DEFAULT 'drawn',

  -- Agreement
  agreed_to_terms BOOLEAN DEFAULT FALSE,
  agreed_at TIMESTAMPTZ,

  -- PDF
  pdf_storage_path TEXT,

  -- Status
  status TEXT DEFAULT 'submitted'
);

CREATE INDEX idx_nda_email ON nda_submissions(contact_email);
CREATE INDEX idx_nda_created ON nda_submissions(created_at DESC);
CREATE INDEX idx_nda_submission_id ON nda_submissions(submission_id);
