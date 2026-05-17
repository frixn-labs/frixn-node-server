const express = require('express');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { generateSalesInquiryEmail } = require('./salesEmail');
const { generateLeadReminderEmail } = require('./leadEmail');
const { generateTapNotificationEmail } = require('./tapEmail');
const { generateNfcStatusEmail } = require('./nfcEmail');
const { generatePaymentReminderEmail } = require('./paymentEmail');
const { generateInvoiceEmail } = require('./invoiceEmail');
const { generateDailyReportEmail } = require('./dailyReportEmail');
const { generateWeeklyReportEmail } = require('./weeklyReportEmail');
const { generateMonthlyReportEmail } = require('./monthlyReportEmail');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket },
});

// Simple Job Queue for Emails
class EmailQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  add(job) {
    this.queue.push(job);
    this.process();
  }

  async process() {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();
      try {
        await job();
      } catch (err) {
        console.error('Job error in EmailQueue:', err);
      }
      // Delay of 1s between emails to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.isProcessing = false;
  }
}
const leadEmailQueue = new EmailQueue();
const tapEmailQueue = new EmailQueue();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Transporter Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: parseInt(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify Transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to SMTP server:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});

// Helper function to send emails
async function sendEmail(res, from, to, subject, html, attachments = []) {
  try {
    const info = await transporter.sendMail({
      from: `"Frixn" <${from}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log(`Message sent: ${info.messageId}`);
    if (res) return res.status(200).json({ success: true, messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    if (res) return res.status(500).json({ error: 'Failed to send email' });
    throw error;
  }
}

// 1. Sales Endpoint
app.post('/api/email/sales', async (req, res) => {
  const { fullName, phone, email, organization, teamSize } = req.body;

  if (!fullName || !phone || !email || !organization || !teamSize) {
    return res.status(400).json({ error: 'Missing required fields: fullName, phone, email, organization, teamSize' });
  }

  const { subject, html } = generateSalesInquiryEmail(fullName, phone, email, organization, teamSize);

  const attachments = [
    { filename: 'icons8-person-48.png', path: path.join(__dirname, 'icons', 'icons8-person-48.png'), cid: 'icon-person' },
    { filename: 'icons8-phone-48.png', path: path.join(__dirname, 'icons', 'icons8-phone-48.png'), cid: 'icon-phone' },
    { filename: 'icons8-email-48.png', path: path.join(__dirname, 'icons', 'icons8-email-48.png'), cid: 'icon-envelope' },
    { filename: 'icons8-organization-48.png', path: path.join(__dirname, 'icons', 'icons8-organization-48.png'), cid: 'icon-building' },
    { filename: 'icons8-team-48.png', path: path.join(__dirname, 'icons', 'icons8-team-48.png'), cid: 'icon-group' }
  ];

  // From: noreply, To: sales
  return sendEmail(res, 'noreply@frixn.in', 'manoj@frixn.in', subject, html, attachments);
});

// 2. Onboarding Endpoint
app.post('/api/email/onboarding', async (req, res) => {
  const { FullName, Email, OnboardingLink } = req.body;

  if (!FullName || !Email || !OnboardingLink) {
    return res.status(400).json({ error: 'Missing required fields: FullName, Email, OnboardingLink' });
  }

  const subject = "You're invited \u2014 Set up your Frixn account";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frixn - You're Invited</title>
</head>
<body style="margin:0;padding:0;background:#0f0a04;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0a04;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.5),0 0 80px rgba(249,115,22,0.08);">

              <!-- Header -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0f0a04;padding:44px 44px 40px;">
                    <h1 style="margin:0 0 12px;color:#f8fafc;font-size:28px;font-weight:800;letter-spacing:-0.6px;">Welcome to<br>Frixn</h1>
                    <p style="margin:0;color:rgba(255,255,255,0.4);font-size:14px;line-height:1.6;">Your account has been created by your organization. Complete your setup to get started.</p>
                  </td>
                </tr>
                <!-- Orange accent line -->
                <tr>
                  <td style="height:3px;background:linear-gradient(90deg,#f97316 0%,#fb923c 50%,transparent 100%);font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Content -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:40px 44px;">

                    <!-- Greeting -->
                    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7;">
                      Hi <strong style="color:#0f172a;">${FullName}</strong>,<br><br>
                      Your Frixn account has been created and is ready to set up. Complete your account to start using Frixn \u2014 the smart NFC-powered digital business card and lead capture platform.
                    </p>

                    <!-- Account info -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1.5px solid #fed7aa;border-radius:16px;padding:20px 24px;margin-bottom:32px;">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#c2660a;">Your Account</p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#1a0f06;">${Email}</p>
                        </td>
                      </tr>
                    </table>

                    <!-- Steps label -->
                    <p style="margin:0 0 16px;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;">Get started in 3 steps</p>

                    <!-- Steps list -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8ecf2;border-radius:16px;overflow:hidden;margin-bottom:32px;">

                      <!-- Step 1 -->
                      <tr>
                        <td style="padding:20px 24px;border-bottom:1px solid #f0f3f8;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="vertical-align:top;padding-right:16px;width:28px;">
                                <div style="width:26px;height:26px;background:#0f0a04;border-radius:8px;text-align:center;line-height:26px;font-size:12px;font-weight:800;color:#f97316;">1</div>
                              </td>
                              <td style="vertical-align:middle;">
                                <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#0f172a;">Click the setup link below</p>
                                <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Open the link on your browser to access your personal setup page.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Step 2 -->
                      <tr>
                        <td style="padding:20px 24px;border-bottom:1px solid #f0f3f8;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="vertical-align:top;padding-right:16px;width:28px;">
                                <div style="width:26px;height:26px;background:#0f0a04;border-radius:8px;text-align:center;line-height:26px;font-size:12px;font-weight:800;color:#f97316;">2</div>
                              </td>
                              <td style="vertical-align:middle;">
                                <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#0f172a;">Set your password</p>
                                <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Choose a strong password to secure your Frixn account.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Step 3 -->
                      <tr>
                        <td style="padding:20px 24px;">
                          <table cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="vertical-align:top;padding-right:16px;width:28px;">
                                <div style="width:26px;height:26px;background:#0f0a04;border-radius:8px;text-align:center;line-height:26px;font-size:12px;font-weight:800;color:#f97316;">3</div>
                              </td>
                              <td style="vertical-align:middle;">
                                <p style="margin:0 0 3px;font-size:14px;font-weight:700;color:#0f172a;">Log in and access Frixn</p>
                                <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">Your profile, NFC card, and dashboard will be ready and waiting.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    </table>

                    <!-- CTA Button -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                      <tr>
                        <td align="center">
                          <a href="${OnboardingLink}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#ea6c0a 0%,#1a0f06 100%);color:#ffffff;text-decoration:none;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.2px;box-shadow:0 4px 20px rgba(249,115,22,0.35);">
                            Complete Your Account Setup
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                      <tr>
                        <td style="border-top:1px solid #f0f3f8;font-size:0;line-height:0;">&nbsp;</td>
                      </tr>
                    </table>

                    <!-- Security notices -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e8ecf2;border-radius:12px;overflow:hidden;margin-bottom:0;">

                      <tr>
                        <td style="padding:14px 20px;border-bottom:1px solid #f0f3f8;">
                          <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">
                            <strong style="color:#0f172a;">Link expires in 24 hours.</strong> After that, you'll need to request a new setup link from your organization admin.
                          </p>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:14px 20px;">
                          <p style="margin:0;font-size:13px;color:#475569;line-height:1.6;">
                            <strong style="color:#0f172a;">Keep this link private.</strong> Do not forward or share this email. This link is unique to your account and can only be used once.
                          </p>
                        </td>
                      </tr>

                    </table>

                  </td>
                </tr>
              </table>

              <!-- Footer -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#f8fafc;border-top:1px solid #f0f3f8;padding:20px 44px 24px;text-align:center;">
                    <p style="margin:0;font-size:12px;color:#b0bac8;line-height:1.7;">
                      This invitation was sent by <strong style="color:#64748b;">Frixn</strong>.<br>
                      If you weren't expecting this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  // Send onboarding email to the user
  return sendEmail(res, 'noreply@frixn.in', Email, subject, html);
});

// 3. Updates Endpoint
app.post('/api/email/updates', async (req, res) => {
  const { to, subject, html } = req.body;
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }
  // From: updates, To: [from request]
  return sendEmail(res, 'updates@frixn.in', to, subject, html);
});

// 4. Lead Updates Endpoint (Triggered by Supabase Webhook / Cron)
app.post('/api/email/lead-updates', async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // Query Supabase for leads that need follow-up
    const { data: leadsData, error } = await supabase
      .schema('tapconnect')
      .from('leads')
      .select(`
        *,
        employees (
          id, name, email,
          notification_settings (
            leads
          )
        ),
        organizations (
          id, admin_email,
          notification_settings (
            leads
          )
        )
      `)
      .lte('followup_date', todayStr)
      .eq('status', 'new')
      .eq('reminder_status', 'pending');

    if (error) {
      console.error('Error fetching leads:', error);
      return res.status(500).json({ error: 'Failed to fetch leads from Supabase' });
    }

    if (!leadsData || leadsData.length === 0) {
      return res.status(200).json({ message: 'No pending leads found.' });
    }

    // Filter and group leads for employees and admins
    const leadsByEmployee = {};
    const leadsByAdmin = {};
    const processedLeadIds = new Set();

    for (const lead of leadsData) {
      let isProcessed = false;

      // Employee check
      if (lead.employees?.email) {
        const notif = lead.employees.notification_settings;
        const empEnabled = Array.isArray(notif) ? (notif.length > 0 && notif[0].leads) : (notif && notif.leads);
        if (empEnabled) {
          const email = lead.employees.email;
          if (!leadsByEmployee[email]) leadsByEmployee[email] = { employeeName: lead.employees.name, leads: [] };
          leadsByEmployee[email].leads.push(lead);
          isProcessed = true;
        }
      }

      // Admin check
      if (lead.organizations?.admin_email) {
        const notif = lead.organizations.notification_settings;
        const adminEnabled = Array.isArray(notif) ? (notif.length > 0 && notif[0].leads) : (notif && notif.leads);
        if (adminEnabled) {
          const email = lead.organizations.admin_email;
          if (!leadsByAdmin[email]) leadsByAdmin[email] = { leads: [] };
          leadsByAdmin[email].leads.push(lead);
          isProcessed = true;
        }
      }

      if (isProcessed) {
        processedLeadIds.add(lead.id);
      }
    }

    if (processedLeadIds.size === 0) {
      return res.status(200).json({ message: 'No pending leads with notifications enabled.' });
    }

    // Send immediate response back to trigger
    res.status(202).json({
      message: 'Lead updates queued for processing',
      queuedEmployees: Object.keys(leadsByEmployee).length,
      queuedAdmins: Object.keys(leadsByAdmin).length,
      totalLeads: processedLeadIds.size
    });

    // Enqueue jobs for employees
    for (const email in leadsByEmployee) {
      const data = leadsByEmployee[email];
      const todayLeads = data.leads.filter(l => l.followup_date === todayStr);
      const olderLeads = data.leads.filter(l => l.followup_date !== todayStr);

      leadEmailQueue.add(async () => {
        try {
          const { subject, html } = generateLeadReminderEmail(data.employeeName, todayLeads, olderLeads);
          await sendEmail(null, 'updates@frixn.in', email, subject, html);
          console.log(`Successfully processed employee leads for ${email}`);
        } catch (err) {
          console.error('Failed to send lead reminder email to employee:', email, err);
        }
      });
    }

    // Enqueue jobs for admins
    for (const email in leadsByAdmin) {
      const data = leadsByAdmin[email];
      // Avoid sending duplicate if admin and employee are the same email and they already got the exact same leads
      // (Simplified: just send it, but greet as Admin)
      const todayLeads = data.leads.filter(l => l.followup_date === todayStr);
      const olderLeads = data.leads.filter(l => l.followup_date !== todayStr);

      leadEmailQueue.add(async () => {
        try {
          const { subject, html } = generateLeadReminderEmail('Admin', todayLeads, olderLeads);
          await sendEmail(null, 'updates@frixn.in', email, subject, html);
          console.log(`Successfully processed admin leads for ${email}`);
        } catch (err) {
          console.error('Failed to send lead reminder email to admin:', email, err);
        }
      });
    }

    // Update reminder_status in supabase
    const leadIdsArray = Array.from(processedLeadIds);
    supabase
      .schema('tapconnect')
      .from('leads')
      .update({ reminder_status: 'sent' })
      .in('id', leadIdsArray)
      .then(({ error }) => {
        if (error) console.error('Failed to update lead reminder_status', error);
      });

  } catch (err) {
    console.error('Unexpected error in /api/email/lead-updates:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// 5. Tap Updates Endpoint (Triggered by Supabase Webhook)
app.post('/api/email/tap-updates', async (req, res) => {
  try {
    const { tap_id } = req.body;
    if (!tap_id) {
      return res.status(400).json({ success: false, error: 'Missing tap_id in request body.' });
    }

    // Fetch tap details and employee info
    const { data: tapData, error } = await supabase
      .schema('tapconnect')
      .from('taps')
      .select(`
        *,
        employees (
          id, name, email,
          notification_settings (
            taps
          )
        ),
        organizations (
          admin_email,
          notification_settings (
            taps
          )
        )
      `)
      .eq('id', tap_id)
      .single();

    if (error || !tapData) {
      console.error(`Error fetching tap ${tap_id}:`, error);
      return res.status(404).json({ success: false, error: `Could not find tap with ID: ${tap_id}` });
    }

    // Check if notifications are enabled for employee and admin
    const employee = tapData.employees;
    let empTapsEnabled = false;
    if (employee?.email) {
      const empNotif = employee.notification_settings;
      empTapsEnabled = Array.isArray(empNotif) ? (empNotif.length > 0 && empNotif[0].taps) : (empNotif && empNotif.taps);
    }

    const org = tapData.organizations;
    let adminTapsEnabled = false;
    if (org?.admin_email) {
      const orgNotif = org.notification_settings;
      adminTapsEnabled = Array.isArray(orgNotif) ? (orgNotif.length > 0 && orgNotif[0].taps) : (orgNotif && orgNotif.taps);
    }

    if (!empTapsEnabled && !adminTapsEnabled) {
      return res.status(200).json({ success: false, message: 'No tap notifications enabled for employee or admin. No email sent.' });
    }

    if (empTapsEnabled) {
      tapEmailQueue.add(async () => {
        try {
          const { subject, html } = generateTapNotificationEmail(employee.name, tapData, employee.id);
          await sendEmail(null, 'updates@frixn.in', employee.email, subject, html);
          console.log(`Successfully sent tap notification for tap ${tap_id} to ${employee.email}`);
        } catch (err) {
          console.error('Failed to send tap notification email:', err);
        }
      });
    }

    if (adminTapsEnabled && org.admin_email !== employee?.email) {
      tapEmailQueue.add(async () => {
        try {
          const { subject, html } = generateTapNotificationEmail('Admin', tapData, employee.id);
          await sendEmail(null, 'updates@frixn.in', org.admin_email, subject, html);
          console.log(`Successfully sent tap notification for tap ${tap_id} to admin ${org.admin_email}`);
        } catch (err) {
          console.error('Failed to send tap notification email to admin:', err);
        }
      });
    }

    return res.status(200).json({ success: true, message: 'Tap notification queued successfully' });

  } catch (err) {
    console.error('Unexpected error in /api/email/tap-updates:', err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: 'Internal Server Error during tap notification processing.' });
    }
  }
});

// 6. NFC Updates Endpoint (Triggered by Supabase Webhook)
const nfcUpdatesHandler = async (req, res) => {
  try {
    const { id, status, description } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, error: 'Missing required fields: id, status.' });
    }

    // Fetch NFC card details and employee info
    const { data: nfcData, error } = await supabase
      .schema('tapconnect')
      .from('nfc_cards')
      .select(`
        *,
        employees (
          id, name, email,
          notification_settings (
            nfc_cards
          )
        ),
        organizations (
          admin_email,
          notification_settings (
            nfc_cards
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error || !nfcData) {
      console.error(`Error fetching NFC card ${id}:`, error);
      return res.status(404).json({ success: false, error: `Could not find NFC card with ID: ${id}` });
    }

    // Check if notifications are enabled for employee and admin
    const employee = nfcData.employees;
    let empNfcEnabled = false;
    if (employee?.email) {
      const empNotif = employee.notification_settings;
      empNfcEnabled = Array.isArray(empNotif) ? (empNotif.length > 0 && empNotif[0].nfc_cards) : (empNotif && empNotif.nfc_cards);
    }

    const org = nfcData.organizations;
    let adminNfcEnabled = false;
    if (org?.admin_email) {
      const orgNotif = org.notification_settings;
      adminNfcEnabled = Array.isArray(orgNotif) ? (orgNotif.length > 0 && orgNotif[0].nfc_cards) : (orgNotif && orgNotif.nfc_cards);
    }

    if (!empNfcEnabled && !adminNfcEnabled) {
      return res.status(200).json({ success: false, message: 'No nfc_cards notifications enabled for employee or admin. No email sent.' });
    }

    // Reuse tapEmailQueue or global queue
    if (empNfcEnabled) {
      tapEmailQueue.add(async () => {
        try {
          const { subject, html } = generateNfcStatusEmail(employee.name, status, description, employee.id);
          await sendEmail(null, 'updates@frixn.in', employee.email, subject, html);
          console.log(`Successfully sent NFC status notification for card ${id} to ${employee.email}`);
        } catch (err) {
          console.error('Failed to send NFC status notification email:', err);
        }
      });
    }

    if (adminNfcEnabled && org.admin_email !== employee?.email) {
      tapEmailQueue.add(async () => {
        try {
          const { subject, html } = generateNfcStatusEmail('Admin', status, description, employee.id);
          await sendEmail(null, 'updates@frixn.in', org.admin_email, subject, html);
          console.log(`Successfully sent NFC status notification for card ${id} to admin ${org.admin_email}`);
        } catch (err) {
          console.error('Failed to send NFC status notification email to admin:', err);
        }
      });
    }

    return res.status(200).json({ success: true, message: 'NFC status notification queued successfully' });

  } catch (err) {
    console.error('Unexpected error in NFC updates:', err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: 'Internal Server Error during NFC notification processing.' });
    }
  }
};



app.post('/api/email/nfc-updates', nfcUpdatesHandler);

// 7. Payment Reminder Endpoint (Triggered by pg_cron)
app.post('/api/email/payments', async (req, res) => {
  try {
    const { org_id } = req.body;
    if (!org_id) {
      return res.status(400).json({ success: false, error: 'Missing org_id in request body.' });
    }

    // Fetch org details and latest pending billing
    const { data: orgData, error: orgError } = await supabase
      .schema('tapconnect')
      .from('organizations')
      .select('id, name, admin_email, admin_name')
      .eq('id', org_id)
      .single();

    if (orgError || !orgData) {
      console.error(`Error fetching organization ${org_id}:`, orgError);
      return res.status(404).json({ success: false, error: `Could not find organization with ID: ${org_id}` });
    }

    if (!orgData.admin_email) {
      return res.status(400).json({ success: false, error: 'No admin email found for this organization.' });
    }

    // Check notification settings for upcoming_bills
    const { data: notifData, error: notifError } = await supabase
      .schema('tapconnect')
      .from('notification_settings')
      .select('upcoming_bills')
      .eq('org_id', org_id)
      .single();

    if (notifError) {
      console.error(`Error fetching notification settings for org ${org_id}:`, notifError);
    }

    if (!notifData || notifData.upcoming_bills !== true) {
      return res.status(200).json({ success: false, message: 'Payment reminder notifications are disabled for this organization. No email sent.' });
    }

    const { data: billingData, error: billingError } = await supabase
      .schema('tapconnect')
      .from('billing')
      .select('id, created_at, status')
      .eq('org_id', org_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (billingError || !billingData) {
      console.error(`Error fetching billing for org ${org_id}:`, billingError);
      return res.status(404).json({ success: false, error: `No billing record found for org: ${org_id}` });
    }

    // Compute due date (created_at + 1 month) and days left
    const dueDate = new Date(billingData.created_at);
    dueDate.setMonth(dueDate.getMonth() + 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffMs = dueDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Fetch active employee count for the org
    const { count: employeeCount, error: empError } = await supabase
      .schema('tapconnect')
      .from('employees')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', org_id)
      .eq('is_active', true);

    if (empError) {
      console.error(`Error fetching employee count for org ${org_id}:`, empError);
    }

    const activeSeats = employeeCount || 0;
    const projectedAmount = activeSeats * 499;

    // Queue the email
    tapEmailQueue.add(async () => {
      try {
        const { subject, html } = generatePaymentReminderEmail(
          orgData.name,
          orgData.admin_name,
          dueDate,
          daysLeft,
          activeSeats,
          projectedAmount
        );
        await sendEmail(null, 'updates@frixn.in', orgData.admin_email, subject, html);
        console.log(`Successfully sent payment reminder to ${orgData.admin_email} for org ${org_id} (${daysLeft} days left)`);
      } catch (err) {
        console.error('Failed to send payment reminder email:', err);
      }
    });

    return res.status(200).json({
      success: true,
      message: `Payment reminder queued for ${orgData.admin_email}`,
      daysLeft,
      dueDate: dueDate.toISOString().split('T')[0],
      activeSeats,
      projectedAmount
    });

  } catch (err) {
    console.error('Unexpected error in /api/email/payments:', err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: 'Internal Server Error during payment reminder processing.' });
    }
  }
});

// 8. New Invoice Endpoint (Triggered by Supabase Webhook on billing INSERT)
app.post('/api/email/invoice', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing billing id in request body.' });
    }

    // Fetch the billing record to get org_id and metadata
    const { data: billingData, error: billingError } = await supabase
      .schema('tapconnect')
      .from('billing')
      .select('id, org_id, created_at, status, invoice_number')
      .eq('id', id)
      .single();

    if (billingError || !billingData) {
      console.error(`Error fetching billing record ${id}:`, billingError);
      return res.status(404).json({ success: false, error: `No billing record found with ID: ${id}` });
    }

    // Fetch org details
    const { data: orgData, error: orgError } = await supabase
      .schema('tapconnect')
      .from('organizations')
      .select('id, name, admin_email, admin_name')
      .eq('id', billingData.org_id)
      .single();

    if (orgError || !orgData) {
      console.error(`Error fetching organization for billing ${id}:`, orgError);
      return res.status(404).json({ success: false, error: `No organization found for this billing record.` });
    }

    if (!orgData.admin_email) {
      return res.status(400).json({ success: false, error: 'No admin email found for this organization.' });
    }

    // Check notification settings for invoices_receipts
    const { data: notifData, error: notifError } = await supabase
      .schema('tapconnect')
      .from('notification_settings')
      .select('invoices_receipts')
      .eq('org_id', billingData.org_id)
      .single();

    if (notifError) {
      console.error(`Error fetching notification settings for org ${billingData.org_id}:`, notifError);
    }

    if (!notifData || notifData.invoices_receipts !== true) {
      return res.status(200).json({ success: false, message: 'Invoice notifications are disabled for this organization. No email sent.' });
    }

    // Fetch active employee count for line item calculation
    const { count: employeeCount, error: empError } = await supabase
      .schema('tapconnect')
      .from('employees')
      .select('id', { count: 'exact', head: true })
      .eq('org_id', billingData.org_id)
      .eq('is_active', true);

    if (empError) {
      console.error(`Error fetching employee count for org ${billingData.org_id}:`, empError);
    }

    const activeSeats = employeeCount || 0;
    const amountPerSeat = 499;
    const totalAmount = activeSeats * amountPerSeat;

    // Compute invoice number from billing column and due date
    const invoiceNumber = billingData.invoice_number || billingData.id.replace(/-/g, '').substring(0, 8).toUpperCase();
    const invoiceDate = billingData.created_at;
    const dueDate = new Date(billingData.created_at);
    dueDate.setMonth(dueDate.getMonth() + 1);

    // Queue the email
    tapEmailQueue.add(async () => {
      try {
        const { subject, html } = generateInvoiceEmail(
          orgData.name,
          orgData.admin_name,
          {
            invoiceNumber,
            invoiceDate,
            dueDate: dueDate.toISOString(),
            activeSeats,
            amountPerSeat,
            totalAmount,
            status: billingData.status
          }
        );
        await sendEmail(null, 'updates@frixn.in', orgData.admin_email, subject, html);
        console.log(`Successfully sent invoice #${invoiceNumber} to ${orgData.admin_email}`);
      } catch (err) {
        console.error('Failed to send invoice email:', err);
      }
    });

    return res.status(200).json({
      success: true,
      message: `Invoice email queued for ${orgData.admin_email}`,
      invoiceNumber,
      dueDate: dueDate.toISOString().split('T')[0],
      activeSeats,
      totalAmount
    });

  } catch (err) {
    console.error('Unexpected error in /api/email/invoice:', err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: 'Internal Server Error during invoice email processing.' });
    }
  }
});

// 9. Daily Report Endpoint (Triggered by pg_cron every day at 10 AM IST)
app.post('/api/email/dailyreport', async (req, res) => {
  try {
    // Yesterday's date range
    const now = new Date();
    const yesterdayStart = new Date(now);
    yesterdayStart.setDate(now.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);
    const yesterdayEnd = new Date(now);
    yesterdayEnd.setHours(0, 0, 0, 0);
    const yStart = yesterdayStart.toISOString();
    const yEnd = yesterdayEnd.toISOString();
    const reportDate = yesterdayStart.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

    // Fetch all orgs with admin details and notification settings
    const { data: orgs, error: orgsError } = await supabase
      .schema('tapconnect')
      .from('organizations')
      .select(`
        id, name, admin_email, admin_name,
        notification_settings ( daily_pulse )
      `);

    if (orgsError || !orgs || orgs.length === 0) {
      console.error('Error fetching organizations:', orgsError);
      return res.status(500).json({ success: false, error: 'Failed to fetch organizations.' });
    }

    // Filter to only orgs with daily_pulse enabled and a valid admin_email
    const eligibleOrgs = orgs.filter(org => {
      if (!org.admin_email) return false;
      const notif = org.notification_settings;
      const enabled = Array.isArray(notif) ? (notif.length > 0 && notif[0].daily_pulse) : (notif && notif.daily_pulse);
      return enabled === true;
    });

    if (eligibleOrgs.length === 0) {
      return res.status(200).json({ success: false, message: 'No organizations with daily_pulse notifications enabled.' });
    }

    // Respond immediately
    res.status(202).json({ success: true, message: `Daily reports queued for ${eligibleOrgs.length} organization(s).` });

    // Process each org
    for (const org of eligibleOrgs) {
      leadEmailQueue.add(async () => {
        try {
          const orgId = org.id;

          // --- LEADS ---
          const { data: leadsRaw } = await supabase
            .schema('tapconnect')
            .from('leads')
            .select('id, employee_id, employees(name)')
            .eq('org_id', orgId)
            .gte('captured_at', yStart)
            .lt('captured_at', yEnd);

          const leadsTotal = leadsRaw?.length || 0;
          const leadsEmpMap = {};
          for (const lead of (leadsRaw || [])) {
            const empId = lead.employee_id;
            const empName = lead.employees?.name || 'Unknown';
            if (!leadsEmpMap[empId]) leadsEmpMap[empId] = { name: empName, count: 0 };
            leadsEmpMap[empId].count++;
          }
          const topLeadEmployees = Object.values(leadsEmpMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

          // --- TAPS ---
          const { data: tapsRaw } = await supabase
            .schema('tapconnect')
            .from('taps')
            .select('id, employee_id, city, employees(name)')
            .eq('org_id', orgId)
            .gte('tapped_at', yStart)
            .lt('tapped_at', yEnd);

          const tapsTotal = tapsRaw?.length || 0;
          const tapsCityMap = {};
          const tapsEmpMap = {};
          for (const tap of (tapsRaw || [])) {
            // City aggregation
            if (tap.city) {
              tapsCityMap[tap.city] = (tapsCityMap[tap.city] || 0) + 1;
            }
            // Employee aggregation
            const empId = tap.employee_id;
            const empName = tap.employees?.name || 'Unknown';
            if (!tapsEmpMap[empId]) tapsEmpMap[empId] = { name: empName, count: 0 };
            tapsEmpMap[empId].count++;
          }
          const topCity = Object.entries(tapsCityMap)
            .sort((a, b) => b[1] - a[1])
            .map(([city, count]) => ({ city, count }))[0] || null;
          const topTapEmployees = Object.values(tapsEmpMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

          // --- DEACTIVATED NFC CARDS ---
          const { data: deactivatedRaw } = await supabase
            .schema('tapconnect')
            .from('nfc_cards')
            .select('id, deactivation_reason, employees(name)')
            .eq('org_id', orgId)
            .eq('status', 'deactivated')
            .gte('updated_at', yStart)
            .lt('updated_at', yEnd);

          const deactivatedCards = (deactivatedRaw || []).map(card => ({
            employeeName: card.employees?.name || 'Unknown',
            reason: card.deactivation_reason
          }));

          // --- TOP LINK CLICKS ---
          const { data: clicksRaw } = await supabase
            .schema('tapconnect')
            .from('card_link_clicks')
            .select('card_link_id, card_links(title, url)')
            .eq('org_id', orgId)
            .gte('clicked_at', yStart)
            .lt('clicked_at', yEnd);

          const linksMap = {};
          for (const click of (clicksRaw || [])) {
            const linkId = click.card_link_id;
            const title = click.card_links?.title || 'Untitled Link';
            const url   = click.card_links?.url   || '#';
            if (!linksMap[linkId]) linksMap[linkId] = { title, url, count: 0 };
            linksMap[linkId].count++;
          }
          const topLinks = Object.values(linksMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

          // Build report and send email
          const reportData = {
            leads: { total: leadsTotal, topEmployees: topLeadEmployees },
            taps:  { total: tapsTotal,  topCity, topEmployees: topTapEmployees },
            deactivatedCards,
            topLinks
          };

          const { subject, html } = generateDailyReportEmail(org.name, org.admin_name, reportDate, reportData);
          await sendEmail(null, 'updates@frixn.in', org.admin_email, subject, html);
          console.log(`Daily report sent to ${org.admin_email} for org: ${org.name}`);
        } catch (err) {
          console.error(`Failed to send daily report for org ${org.id}:`, err);
        }
      });
    }

  } catch (err) {
    console.error('Unexpected error in /api/email/dailyreport:', err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: 'Internal Server Error during daily report processing.' });
    }
  }
});

// 10. Weekly Report Endpoint (Triggered by pg_cron every Saturday at 6 PM IST)
app.post('/api/email/weeklyreport', async (req, res) => {
  try {
    // Last 7 days date range
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setHours(0, 0, 0, 0);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 7);
    const wStart = weekStart.toISOString();
    const wEnd = weekEnd.toISOString();

    const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const weekRange = `${fmtDate(weekStart)} – ${fmtDate(new Date(weekEnd.getTime() - 1))}`;

    // Fetch all orgs with admin details and notification settings
    const { data: orgs, error: orgsError } = await supabase
      .schema('tapconnect')
      .from('organizations')
      .select(`
        id, name, admin_email, admin_name,
        notification_settings ( weekly_roundup )
      `);

    if (orgsError || !orgs || orgs.length === 0) {
      console.error('Error fetching organizations:', orgsError);
      return res.status(500).json({ success: false, error: 'Failed to fetch organizations.' });
    }

    // Filter orgs with weekly_roundup enabled
    const eligibleOrgs = orgs.filter(org => {
      if (!org.admin_email) return false;
      const notif = org.notification_settings;
      const enabled = Array.isArray(notif) ? (notif.length > 0 && notif[0].weekly_roundup) : (notif && notif.weekly_roundup);
      return enabled === true;
    });

    if (eligibleOrgs.length === 0) {
      return res.status(200).json({ success: false, message: 'No organizations with weekly_roundup notifications enabled.' });
    }

    // Respond immediately
    res.status(202).json({ success: true, message: `Weekly reports queued for ${eligibleOrgs.length} organization(s).` });

    // Process each org
    for (const org of eligibleOrgs) {
      leadEmailQueue.add(async () => {
        try {
          const orgId = org.id;

          // --- LEADS ---
          const { data: leadsRaw } = await supabase
            .schema('tapconnect')
            .from('leads')
            .select('id, employee_id, employees(name)')
            .eq('org_id', orgId)
            .gte('captured_at', wStart)
            .lt('captured_at', wEnd);

          const leadsTotal = leadsRaw?.length || 0;
          const leadsEmpMap = {};
          for (const lead of (leadsRaw || [])) {
            const empId = lead.employee_id;
            const empName = lead.employees?.name || 'Unknown';
            if (!leadsEmpMap[empId]) leadsEmpMap[empId] = { name: empName, count: 0 };
            leadsEmpMap[empId].count++;
          }
          const topLeadEmployees = Object.values(leadsEmpMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

          // --- TAPS ---
          const { data: tapsRaw } = await supabase
            .schema('tapconnect')
            .from('taps')
            .select('id, employee_id, city, employees(name)')
            .eq('org_id', orgId)
            .gte('tapped_at', wStart)
            .lt('tapped_at', wEnd);

          const tapsTotal = tapsRaw?.length || 0;
          const tapsCityMap = {};
          const tapsEmpMap = {};
          for (const tap of (tapsRaw || [])) {
            if (tap.city) tapsCityMap[tap.city] = (tapsCityMap[tap.city] || 0) + 1;
            const empId = tap.employee_id;
            const empName = tap.employees?.name || 'Unknown';
            if (!tapsEmpMap[empId]) tapsEmpMap[empId] = { name: empName, count: 0 };
            tapsEmpMap[empId].count++;
          }
          const topCity = Object.entries(tapsCityMap)
            .sort((a, b) => b[1] - a[1])
            .map(([city, count]) => ({ city, count }))[0] || null;
          const topTapEmployees = Object.values(tapsEmpMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

          // --- DEACTIVATED NFC CARDS ---
          const { data: deactivatedRaw } = await supabase
            .schema('tapconnect')
            .from('nfc_cards')
            .select('id, deactivation_reason, employees(name)')
            .eq('org_id', orgId)
            .eq('status', 'deactivated')
            .gte('updated_at', wStart)
            .lt('updated_at', wEnd);

          const deactivatedCards = (deactivatedRaw || []).map(card => ({
            employeeName: card.employees?.name || 'Unknown',
            reason: card.deactivation_reason
          }));

          // --- TOP LINK CLICKS ---
          const { data: clicksRaw } = await supabase
            .schema('tapconnect')
            .from('card_link_clicks')
            .select('card_link_id, card_links(title, url)')
            .eq('org_id', orgId)
            .gte('clicked_at', wStart)
            .lt('clicked_at', wEnd);

          const linksMap = {};
          for (const click of (clicksRaw || [])) {
            const linkId = click.card_link_id;
            const title = click.card_links?.title || 'Untitled Link';
            const url   = click.card_links?.url   || '#';
            if (!linksMap[linkId]) linksMap[linkId] = { title, url, count: 0 };
            linksMap[linkId].count++;
          }
          const topLinks = Object.values(linksMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

          // Build report and send email
          const reportData = {
            leads: { total: leadsTotal, topEmployees: topLeadEmployees },
            taps:  { total: tapsTotal, topCity, topEmployees: topTapEmployees },
            deactivatedCards,
            topLinks
          };

          const { subject, html } = generateWeeklyReportEmail(org.name, org.admin_name, weekRange, reportData);
          await sendEmail(null, 'updates@frixn.in', org.admin_email, subject, html);
          console.log(`Weekly report sent to ${org.admin_email} for org: ${org.name}`);
        } catch (err) {
          console.error(`Failed to send weekly report for org ${org.id}:`, err);
        }
      });
    }

  } catch (err) {
    console.error('Unexpected error in /api/email/weeklyreport:', err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: 'Internal Server Error during weekly report processing.' });
    }
  }
});

// 11. Monthly Report Endpoint (Triggered by pg_cron on last day of month)
app.post('/api/email/monthlyreport', async (req, res) => {
  try {
    // Current month date range: first day to today (last day)
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 1); // exclusive
    const mStart = monthStart.toISOString();
    const mEnd   = monthEnd.toISOString();

    const monthLabel = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    // Fetch all orgs with admin details and notification settings
    const { data: orgs, error: orgsError } = await supabase
      .schema('tapconnect')
      .from('organizations')
      .select(`
        id, name, admin_email, admin_name,
        notification_settings ( monthly_digest )
      `);

    if (orgsError || !orgs || orgs.length === 0) {
      console.error('Error fetching organizations:', orgsError);
      return res.status(500).json({ success: false, error: 'Failed to fetch organizations.' });
    }

    // Filter orgs with monthly_digest enabled
    const eligibleOrgs = orgs.filter(org => {
      if (!org.admin_email) return false;
      const notif = org.notification_settings;
      const enabled = Array.isArray(notif) ? (notif.length > 0 && notif[0].monthly_digest) : (notif && notif.monthly_digest);
      return enabled === true;
    });

    if (eligibleOrgs.length === 0) {
      return res.status(200).json({ success: false, message: 'No organizations with monthly_digest notifications enabled.' });
    }

    // Respond immediately
    res.status(202).json({ success: true, message: `Monthly reports queued for ${eligibleOrgs.length} organization(s).` });

    // Process each org
    for (const org of eligibleOrgs) {
      leadEmailQueue.add(async () => {
        try {
          const orgId = org.id;

          // --- LEADS ---
          const { data: leadsRaw } = await supabase
            .schema('tapconnect')
            .from('leads')
            .select('id, employee_id, employees(name)')
            .eq('org_id', orgId)
            .gte('captured_at', mStart)
            .lt('captured_at', mEnd);

          const leadsTotal = leadsRaw?.length || 0;
          const leadsEmpMap = {};
          for (const lead of (leadsRaw || [])) {
            const empId = lead.employee_id;
            const empName = lead.employees?.name || 'Unknown';
            if (!leadsEmpMap[empId]) leadsEmpMap[empId] = { name: empName, count: 0 };
            leadsEmpMap[empId].count++;
          }
          const topLeadEmployees = Object.values(leadsEmpMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5 for monthly

          // --- TAPS ---
          const { data: tapsRaw } = await supabase
            .schema('tapconnect')
            .from('taps')
            .select('id, employee_id, city, employees(name)')
            .eq('org_id', orgId)
            .gte('tapped_at', mStart)
            .lt('tapped_at', mEnd);

          const tapsTotal = tapsRaw?.length || 0;
          const tapsCityMap = {};
          const tapsEmpMap = {};
          for (const tap of (tapsRaw || [])) {
            if (tap.city) tapsCityMap[tap.city] = (tapsCityMap[tap.city] || 0) + 1;
            const empId = tap.employee_id;
            const empName = tap.employees?.name || 'Unknown';
            if (!tapsEmpMap[empId]) tapsEmpMap[empId] = { name: empName, count: 0 };
            tapsEmpMap[empId].count++;
          }
          const topCities = Object.entries(tapsCityMap)
            .sort((a, b) => b[1] - a[1])
            .map(([city, count]) => ({ city, count }))
            .slice(0, 3);
          const topTapEmployees = Object.values(tapsEmpMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5 for monthly

          // --- DEACTIVATED NFC CARDS ---
          const { data: deactivatedRaw } = await supabase
            .schema('tapconnect')
            .from('nfc_cards')
            .select('id, deactivation_reason, employees(name)')
            .eq('org_id', orgId)
            .eq('status', 'deactivated')
            .gte('updated_at', mStart)
            .lt('updated_at', mEnd);

          const deactivatedCards = (deactivatedRaw || []).map(card => ({
            employeeName: card.employees?.name || 'Unknown',
            reason: card.deactivation_reason
          }));

          // --- TOP LINK CLICKS ---
          const { data: clicksRaw } = await supabase
            .schema('tapconnect')
            .from('card_link_clicks')
            .select('card_link_id, card_links(title, url)')
            .eq('org_id', orgId)
            .gte('clicked_at', mStart)
            .lt('clicked_at', mEnd);

          const linksMap = {};
          for (const click of (clicksRaw || [])) {
            const linkId = click.card_link_id;
            const title = click.card_links?.title || 'Untitled Link';
            const url   = click.card_links?.url   || '#';
            if (!linksMap[linkId]) linksMap[linkId] = { title, url, count: 0 };
            linksMap[linkId].count++;
          }
          const topLinks = Object.values(linksMap)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5 for monthly

          // --- NEW EMPLOYEES JOINED THIS MONTH ---
          const { count: newEmployees } = await supabase
            .schema('tapconnect')
            .from('employees')
            .select('id', { count: 'exact', head: true })
            .eq('org_id', orgId)
            .gte('created_at', mStart)
            .lt('created_at', mEnd);

          // Build and send report
          const reportData = {
            leads:  { total: leadsTotal, topEmployees: topLeadEmployees },
            taps:   { total: tapsTotal, topCities, topEmployees: topTapEmployees },
            deactivatedCards,
            topLinks,
            newEmployees: newEmployees || 0
          };

          const { subject, html } = generateMonthlyReportEmail(org.name, org.admin_name, monthLabel, reportData);
          await sendEmail(null, 'updates@frixn.in', org.admin_email, subject, html);
          console.log(`Monthly report sent to ${org.admin_email} for org: ${org.name}`);
        } catch (err) {
          console.error(`Failed to send monthly report for org ${org.id}:`, err);
        }
      });
    }

  } catch (err) {
    console.error('Unexpected error in /api/email/monthlyreport:', err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: 'Internal Server Error during monthly report processing.' });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
