import { Resend } from 'resend';

const resendApiKey = import.meta.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error('Missing Resend API key');
}

const resend = new Resend(resendApiKey);

export interface EmailData {
  to: string[];
  subject: string;
  html: string;
}

export async function sendEmail(data: EmailData): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: 'SDF Ltd <noreply@sdfltd.com>',
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export function generateBuyerConfirmationEmail(
  submissionId: string,
  companyName: string,
  contactName: string,
  contactEmail: string,
  pdfUrl: string
): string {
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || 'https://www.sdfltd.com';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NDA Confirmed — SDF Ltd</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%);
      color: #c9a84c;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .header p {
      margin: 10px 0 0;
      font-size: 14px;
      color: #fff;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .confirmation-box {
      background: #e8f4f8;
      border-left: 4px solid #0a1628;
      padding: 15px;
      margin: 20px 0;
    }
    .submission-id {
      font-size: 18px;
      font-weight: bold;
      color: #0a1628;
      background: #fff;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
      margin: 15px 0;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .details-table th,
    .details-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .details-table th {
      background: #0a1628;
      color: #fff;
    }
    .details-table td {
      background: #fff;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #c9a84c 0%, #d4b85c 100%);
      color: #0a1628;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
    }
    .btn:hover {
      background: linear-gradient(135deg, #d4b85c 0%, #e0c86c 100%);
    }
    .footer {
      text-align: center;
      padding: 20px;
      font-size: 12px;
      color: #666;
      border-top: 1px solid #ddd;
      margin-top: 30px;
    }
    .highlight {
      color: #c9a84c;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>SDF Ltd</h1>
    <p>Premium Clothing Manufacturing Bangladesh</p>
  </div>
  
  <div class="content">
    <h2 style="color: #0a1628;">Non-Disclosure Agreement Confirmed</h2>
    
    <p>Dear <span class="highlight">${contactName}</span>,</p>
    
    <p>Thank you for signing the Non-Disclosure Agreement with <strong>SDF Ltd</strong>. We have successfully received your submission.</p>
    
    <div class="confirmation-box">
      <p><strong>Submission Details:</strong></p>
      <div class="submission-id">${submissionId}</div>
      <p><strong>Company:</strong> ${companyName}</p>
      <p><strong>Email:</strong> ${contactEmail}</p>
    </div>
    
    <h3 style="color: #0a1628;">What Happens Next?</h3>
    <ul>
      <li>Our team will review your NDA submission within 1-2 business days</li>
      <li>SDF Ltd will countersign the agreement</li>
      <li>You will receive the countersigned PDF via email</li>
      <li>Once countersigned, you can proceed with sharing confidential information</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="${pdfUrl}" class="btn">Download Your Signed NDA</a>
    </div>
    
    <h3 style="color: #0a1628;">Need Assistance?</h3>
    <p>If you have any questions or need immediate assistance, please contact us:</p>
    <p>
      <strong>Email:</strong> ${import.meta.env.COMPANY_EMAIL || 'info@sdfltd.com'}<br>
      <strong>Website:</strong> <a href="${siteUrl}" style="color: #c9a84c;">${siteUrl}</a>
    </p>
  </div>
  
  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} SDF Ltd. All rights reserved.</p>
    <p>This email was sent to ${contactEmail}</p>
  </div>
</body>
</html>
  `;
}

export function generateCompanyNotificationEmail(
  submissionId: string,
  companyName: string,
  registrationNumber: string,
  country: string,
  businessType: string,
  contactName: string,
  contactDesignation: string,
  contactEmail: string,
  contactPhone: string,
  productCategories: string[],
  orderVolume: string,
  targetMarkets: string[],
  ipAddress: string,
  ipCountry: string,
  vpnDetected: boolean,
  proxyDetected: boolean,
  fingerprint: string,
  userAgent: string,
  screenResolution: string,
  pdfUrl: string,
  submittedAt: string
): string {
  const vpnStatus = vpnDetected ? '<span style="color: red; font-weight: bold;">DETECTED</span>' : '<span style="color: green;">Not Detected</span>';
  const proxyStatus = proxyDetected ? '<span style="color: red; font-weight: bold;">DETECTED</span>' : '<span style="color: green;">Not Detected</span>';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New NDA Submission — SDF Ltd</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #0a1628 0%, #1a2d4a 100%);
      color: #c9a84c;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .alert {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
    }
    .alert-danger {
      background: #f8d7da;
      border-left: 4px solid #dc3545;
    }
    .section {
      background: #fff;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
      border: 1px solid #ddd;
    }
    .section h3 {
      color: #0a1628;
      margin-top: 0;
      border-bottom: 2px solid #c9a84c;
      padding-bottom: 10px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 0;
    }
    .details-table th,
    .details-table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    .details-table th {
      background: #0a1628;
      color: #fff;
      width: 35%;
    }
    .details-table td {
      background: #fff;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #c9a84c 0%, #d4b85c 100%);
      color: #0a1628;
      padding: 12px 25px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 10px 0;
    }
    .tag {
      display: inline-block;
      background: #0a1628;
      color: #fff;
      padding: 4px 10px;
      border-radius: 3px;
      font-size: 12px;
      margin: 2px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>New NDA Submission Received</h1>
  </div>
  
  <div class="content">
    <div class="alert">
      <strong>Submission ID:</strong> ${submissionId}<br>
      <strong>Submitted:</strong> ${new Date(submittedAt).toLocaleString()}
    </div>
    
    ${vpnDetected || proxyDetected ? `
    <div class="alert alert-danger">
      <strong>⚠️ SECURITY ALERT:</strong> VPN or Proxy detected for this submission!
    </div>
    ` : ''}
    
    <div class="section">
      <h3>Company Information</h3>
      <table class="details-table">
        <tr>
          <th>Company Name</th>
          <td><strong>${companyName}</strong></td>
        </tr>
        <tr>
          <th>Registration Number</th>
          <td>${registrationNumber}</td>
        </tr>
        <tr>
          <th>Country</th>
          <td>${country}</td>
        </tr>
        <tr>
          <th>Business Type</th>
          <td>${businessType}</td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <h3>Contact Person</h3>
      <table class="details-table">
        <tr>
          <th>Full Name</th>
          <td>${contactName}</td>
        </tr>
        <tr>
          <th>Designation</th>
          <td>${contactDesignation}</td>
        </tr>
        <tr>
          <th>Email</th>
          <td><a href="mailto:${contactEmail}">${contactEmail}</a></td>
        </tr>
        <tr>
          <th>Phone</th>
          <td>${contactPhone}</td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <h3>Order Intent</h3>
      <table class="details-table">
        <tr>
          <th>Product Categories</th>
          <td>${productCategories.map(cat => `<span class="tag">${cat}</span>`).join('')}</td>
        </tr>
        <tr>
          <th>Estimated Volume</th>
          <td>${orderVolume}</td>
        </tr>
        <tr>
          <th>Target Markets</th>
          <td>${targetMarkets.map(market => `<span class="tag">${market}</span>`).join('')}</td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <h3>Security Information</h3>
      <table class="details-table">
        <tr>
          <th>IP Address</th>
          <td>${ipAddress}</td>
        </tr>
        <tr>
          <th>IP Country</th>
          <td>${ipCountry}</td>
        </tr>
        <tr>
          <th>VPN Detected</th>
          <td>${vpnStatus}</td>
        </tr>
        <tr>
          <th>Proxy Detected</th>
          <td>${proxyStatus}</td>
        </tr>
        <tr>
          <th>Device Fingerprint</th>
          <td><code>${fingerprint}</code></td>
        </tr>
        <tr>
          <th>Screen Resolution</th>
          <td>${screenResolution}</td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <h3>User Agent</h3>
      <p style="font-family: monospace; font-size: 11px; background: #f0f0f0; padding: 10px; word-break: break-all;">
        ${userAgent}
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${pdfUrl}" class="btn">Download Signed NDA PDF</a>
    </div>
  </div>
</body>
</html>
  `;
}
