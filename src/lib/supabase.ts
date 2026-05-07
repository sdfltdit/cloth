import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface NDASubmission {
  id?: string;
  submission_id?: string;
  created_at?: string;
  company_name: string;
  company_registration_number: string;
  company_country: string;
  company_type: string;
  business_address: string;
  vat_tax_id?: string;
  trade_license_number?: string;
  contact_full_name: string;
  contact_designation: string;
  contact_email: string;
  contact_phone: string;
  product_categories: string[];
  estimated_order_volume: string;
  target_markets: string[];
  ip_address?: string;
  ip_country?: string;
  ip_city?: string;
  ip_isp?: string;
  vpn_detected?: boolean;
  proxy_detected?: boolean;
  device_fingerprint?: string;
  user_agent?: string;
  browser_timezone?: string;
  screen_resolution?: string;
  browser_language?: string;
  cpu_cores?: number;
  device_memory?: number;
  webrtc_ip?: string;
  signature_data: string;
  signature_type?: string;
  agreed_to_terms?: boolean;
  agreed_at?: string;
  pdf_storage_path?: string;
  status?: string;
}

export async function checkRateLimit(ipAddress: string): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from('nda_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ipAddress)
    .gte('created_at', today.toISOString());

  if (error) {
    console.error('Rate limit check error:', error);
    return true;
  }

  return (count || 0) < 5;
}

export async function insertNDASubmission(submission: NDASubmission): Promise<{ data: NDASubmission | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('nda_submissions')
      .insert(submission)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateSubmissionPDF(submissionId: string, pdfPath: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('nda_submissions')
      .update({ pdf_storage_path: pdfPath })
      .eq('submission_id', submissionId);

    return !error;
  } catch (error) {
    console.error('Error updating submission PDF:', error);
    return false;
  }
}

export async function uploadPDFToStorage(bucketName: string, fileName: string, fileBuffer: ArrayBuffer): Promise<{ path: string | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (error) {
      return { path: null, error };
    }

    return { path: data.path, error: null };
  } catch (error) {
    return { path: null, error: error as Error };
  }
}

export async function getPublicURL(bucketName: string, path: string): Promise<string | null> {
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  } catch (error) {
    console.error('Error getting public URL:', error);
    return null;
  }
}
