function generateLeadReminderEmail(employeeName, todayLeads, olderLeads) {
  const subject = `Action Required: You have ${todayLeads.length + olderLeads.length} Lead(s) to Follow Up`;

  const renderLeadCard = (lead) => {
    const formatCurrency = (amount) => amount ? `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'N/A';
    
    return `
      <div style="background:#ffffff;border:1px solid #e8ecf2;border-radius:12px;padding:24px;margin-bottom:20px;box-shadow:0 2px 10px rgba(0,0,0,0.02);">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:12px;border-bottom:1px solid #f0f3f8;margin-bottom:12px;">
              <h3 style="margin:0 0 4px;font-size:18px;color:#0f172a;">${lead.visitor_name || 'Unknown Name'}</h3>
              <p style="margin:0;font-size:14px;color:#64748b;">${lead.lead_designation || ''} ${lead.lead_designation && lead.visitor_company ? 'at' : ''} ${lead.visitor_company || ''}</p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:16px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="vertical-align:top;padding-right:10px;">
                    <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;">Contact Details</p>
                    <p style="margin:0 0 4px;font-size:14px;color:#334155;"><strong>Email:</strong> ${lead.visitor_email || 'N/A'}</p>
                    <p style="margin:0 0 4px;font-size:14px;color:#334155;"><strong>Phone:</strong> ${lead.visitor_phone || 'N/A'}</p>
                  </td>
                  <td width="50%" style="vertical-align:top;padding-left:10px;">
                    <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;">Lead Details</p>
                    <p style="margin:0 0 4px;font-size:14px;color:#334155;"><strong>Product:</strong> ${lead.product || 'N/A'}</p>
                    <p style="margin:0 0 4px;font-size:14px;color:#334155;"><strong>Revenue:</strong> ${formatCurrency(lead.revenue)}</p>
                    <p style="margin:0 0 4px;font-size:14px;color:#334155;"><strong>Follow-up:</strong> ${new Date(lead.followup_date).toLocaleDateString()}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${lead.notes ? `
          <tr>
            <td style="padding-top:16px;">
              <div style="background:#f8fafc;border-radius:8px;padding:12px;">
                <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;">Notes</p>
                <p style="margin:0;font-size:14px;color:#475569;line-height:1.5;">${lead.notes}</p>
              </div>
            </td>
          </tr>` : ''}
        </table>
      </div>
    `;
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frixn - Lead Follow-up Reminder</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header Card -->
          <tr>
            <td style="background:#0f0a04;border-radius:24px 24px 0 0;padding:40px;text-align:center;">
              <h1 style="margin:0 0 12px;color:#f8fafc;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Lead Follow-up Reminder</h1>
              <p style="margin:0;color:rgba(255,255,255,0.6);font-size:15px;">You have prospects waiting to hear from you.</p>
            </td>
          </tr>
          
          <!-- Orange accent line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#f97316 0%,#fb923c 50%,#ea6c0a 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 24px 24px;padding:40px;box-shadow:0 10px 40px rgba(0,0,0,0.05);">
              
              <p style="margin:0 0 24px;font-size:16px;color:#334155;line-height:1.6;">
                Hi <strong>${employeeName}</strong>,<br><br>
                This is a friendly reminder to follow up with the following leads.
              </p>

              ${todayLeads.length > 0 ? `
                <div style="margin-bottom:32px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                    <tr>
                      <td style="padding:12px 16px;background:#fff7ed;border-left:4px solid #f97316;border-radius:4px;">
                        <h2 style="margin:0;font-size:16px;color:#c2410c;font-weight:700;">Scheduled for Today</h2>
                      </td>
                    </tr>
                  </table>
                  ${todayLeads.map(lead => renderLeadCard(lead)).join('')}
                </div>
              ` : ''}

              ${olderLeads.length > 0 ? `
                <div style="margin-bottom:32px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                    <tr>
                      <td style="padding:12px 16px;background:#f1f5f9;border-left:4px solid #64748b;border-radius:4px;">
                        <h2 style="margin:0;font-size:16px;color:#334155;font-weight:700;">Overdue Follow-ups</h2>
                      </td>
                    </tr>
                  </table>
                  ${olderLeads.map(lead => renderLeadCard(lead)).join('')}
                </div>
              ` : ''}

              <!-- Footer CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:40px;text-align:center;">
                <tr>
                  <td>
                    <a href="https://www.frixn.in/sites/frixn/admin/leads" style="display:inline-block;padding:14px 32px;background:#0f0a04;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">View All Leads in Dashboard</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
          
          <!-- Email Footer -->
          <tr>
            <td style="padding:32px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                You are receiving this email because you have notifications enabled for your leads.<br>
                Powered by Frixn
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;

  return { subject, html };
}

module.exports = { generateLeadReminderEmail };
