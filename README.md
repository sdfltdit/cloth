# SDF Ltd NDA Portal

A complete, production-ready Non-Disclosure Agreement web application for SDF Ltd, a clothing manufacturing company in Bangladesh. Built with Astro, Supabase, and modern web technologies.

## Features

- **Multi-step NDA signing process** with 6 steps
- **Digital signature** using canvas-based drawing
- **Device fingerprinting** for security tracking
- **VPN/Proxy detection** using IPQualityScore
- **PDF generation** with complete NDA document
- **Email notifications** via Resend
- **Rate limiting** (5 submissions per IP per day)
- **Bot protection** with honeypot fields
- **Business email validation** (rejects personal email domains)
- **LocalStorage persistence** for form data
- **Fully responsive** mobile-first design
- **SEO optimized** with meta tags and JSON-LD schemas

## Tech Stack

- **Framework**: Astro (latest) with TypeScript strict mode
- **Database**: Supabase (PostgreSQL + Storage)
- **Email**: Resend
- **Signature**: signature_pad (canvas)
- **Fingerprinting**: @fingerprintjs/fingerprintjs
- **PDF**: pdf-lib
- **VPN Detection**: ipqualityscore
- **Styling**: Tailwind CSS via @astrojs/tailwind
- **Output**: Hybrid (SSG + SSR for API routes)

## Project Structure

```
src/
  components/nda/
    StepIndicator.astro          # Progress indicator
    Step1CompanyInfo.astro       # Company information form
    Step2ContactInfo.astro       # Contact person form
    Step3OrderIntent.astro       # Order intent form
    Step4NDAPreview.astro        # NDA document preview
    Step5Signature.astro         # Digital signature canvas
    Step6Confirmation.astro      # Review and submit
    FingerprintCollector.astro   # Silent fingerprint collection
  layouts/
    BaseLayout.astro             # Main layout with SEO
    NDALayout.astro              # NDA-specific layout
  pages/
    index.astro                  # Homepage
    nda/
      index.astro                # Multi-step NDA form
      success.astro              # Success confirmation
    api/
      check-vpn.ts               # VPN detection API
      submit-nda.ts              # NDA submission API
  lib/
    supabase.ts                  # Supabase client and helpers
    resend.ts                    # Email template generation
    pdf-generator.ts             # PDF generation logic
    fingerprint.ts               # Fingerprint collection logic
supabase/
  migrations/
    001_create_nda_submissions.sql  # Database schema
  functions/
    send-nda-email/
      index.ts                   # Email sending Edge Function
public/
  manifest.json                 # PWA manifest
  robots.txt                    # SEO robots file
.env.example                    # Environment variables template
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd ossified-osiris
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Add the following variables to `.env`:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
IPQS_API_KEY=your_ipqualityscore_api_key
COMPANY_EMAIL=your@sdfltd.com
PUBLIC_SITE_URL=https://sdfltd.com
```

### 3. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project URL and anon key from Settings > API
3. Add them to your `.env` file

#### Run Database Migration

Run the SQL migration to create the `nda_submissions` table:

```sql
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
```

You can run this in the Supabase SQL Editor.

#### Create Storage Bucket

1. Go to Storage > Create a new bucket
2. Name it `nda-documents`
3. Make it **Public** (so signed PDFs can be downloaded)
4. Add the following RLS policy (or make bucket public for simplicity):

```sql
-- Allow public read access for PDF downloads
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'nda-documents');

-- Allow authenticated inserts
CREATE POLICY "Allow authenticated insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'nda-documents');
```

### 4. Resend Setup

1. Go to [resend.com](https://resend.com) and sign up
2. Get your API key from API Keys section
3. Add it to your `.env` file
4. Verify your sender domain (e.g., sdfltd.com)

### 5. IPQualityScore Setup (Optional)

1. Go to [ipqualityscore.com](https://www.ipqualityscore.com) and sign up
2. Get your API key
3. Add it to your `.env` file
4. If not provided, VPN detection will be skipped gracefully

### 6. Deploy Supabase Edge Function

Navigate to the Supabase Edge Function directory:

```bash
cd supabase/functions/send-nda-email
```

Deploy using the Supabase CLI:

```bash
supabase functions deploy send-nda-email --project-ref YOUR_PROJECT_REF
```

Or use the Supabase Dashboard:
1. Go to Edge Functions > Create New Function
2. Name it `send-nda-email`
3. Copy the contents of `supabase/functions/send-nda-email/index.ts`
4. Add environment variables:
   - `RESEND_API_KEY`
   - `COMPANY_EMAIL`
   - `PUBLIC_SITE_URL`

## Running Locally

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:4321`

### Production Build

```bash
npm run build
npm run preview
```

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
vercel
```

### 4. Add Environment Variables in Vercel Dashboard

Go to your project settings in Vercel > Environment Variables and add:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `IPQS_API_KEY`
- `COMPANY_EMAIL`
- `PUBLIC_SITE_URL`

## NDA Form Flow

1. **Step 1 - Company Information**: Legal company name, registration number, country, business type, address
2. **Step 2 - Contact Person**: Full name, designation, business email, phone number
3. **Step 3 - Order Intent**: Product categories, estimated volume, target markets
4. **Step 4 - NDA Preview**: Full NDA document text for review
5. **Step 5 - Digital Signature**: Draw signature on canvas, agree to terms
6. **Step 6 - Review & Submit**: Summary of all information, submit

## Security Features

- **Rate Limiting**: Maximum 5 submissions per IP per day
- **Honeypot Field**: Hidden field to detect bots
- **Input Sanitization**: All inputs sanitized server-side
- **Business Email Validation**: Rejects personal email domains
- **Device Fingerprinting**: Collects unique device identifier
- **VPN/Proxy Detection**: Alerts when VPN is detected
- **CSP Headers**: Content Security Policy configured

## Email Notifications

Two emails are sent upon successful submission:

1. **To Buyer**: Confirmation with submission ID, summary, and PDF download link
2. **To Company**: Full submission details including security data

## Validation Rules

- Company name: Minimum 2 characters
- Registration number: Minimum 3 characters
- Business address: Minimum 10 characters
- Email: Must be business domain (rejects Gmail, Yahoo, etc.)
- Phone: 7-15 digits
- Product categories: At least 1 required
- Target markets: At least 1 required
- Signature: Canvas must not be empty
- Both checkboxes must be checked

## Cloudflare Configuration

### Disable Rocket Loader

To prevent script loading issues, disable Rocket Loader from Cloudflare Dashboard:

1. Go to Cloudflare Dashboard → Speed → Optimization
2. Find Content Optimization → Rocket Loader
3. Set to **OFF**

**Note**: The following meta tag has been added to disable Rocket Loader:
```html
<meta name="cf-2fa-verify" content="off" />
```

All script tags include `data-cfasync="false"` attribute to prevent Rocket Loader interference.

### Disable Web Analytics

To disable Cloudflare Web Analytics:

1. Go to Cloudflare Dashboard → Analytics & Logs
2. Find Web Analytics
3. Set to **OFF**

## Troubleshooting

### PDF Generation Fails

- Ensure Supabase storage bucket `nda-documents` exists
- Check bucket permissions allow uploads
- Verify `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are correct

### Emails Not Sending

- Verify Resend API key is valid
- Check sender domain is verified in Resend
- Ensure Edge Function is deployed with correct environment variables
- Check Edge Function logs in Supabase Dashboard

### VPN Detection Not Working

- Verify `IPQS_API_KEY` is set in `.env`
- Check API key has available credits
- If not provided, application will continue without VPN detection

### Form Data Not Persisting

- Check browser localStorage is enabled
- Clear localStorage if encountering issues
- Data persists between steps but is cleared after successful submission

## License

MIT

## Support

For issues or questions, contact: [your@sdfltd.com](mailto:your@sdfltd.com)
