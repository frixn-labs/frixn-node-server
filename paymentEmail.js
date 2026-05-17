function generatePaymentReminderEmail(orgName, adminName, dueDate, daysLeft, activeSeats, projectedAmount) {
  const subject = `⚠️ Payment Due in ${daysLeft} Day${daysLeft !== 1 ? 's' : ''} – Action Required`;

  const urgencyColor  = daysLeft <= 1 ? '#ef4444' : daysLeft <= 3 ? '#f97316' : '#f59e0b';
  const urgencyBg     = daysLeft <= 1 ? '#fef2f2' : daysLeft <= 3 ? '#fff7ed' : '#fffbeb';
  const urgencyBorder = daysLeft <= 1 ? '#fecaca' : daysLeft <= 3 ? '#fed7aa' : '#fde68a';
  const urgencyText   = daysLeft <= 1 ? '#991b1b' : daysLeft <= 3 ? '#c2410c' : '#92400e';

  const dueDateFormatted = new Date(dueDate).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const nextCycleDateFormatted = new Date(dueDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0
  }).format(projectedAmount || 0);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frixn - Payment Reminder</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0f0a04;border-radius:24px 24px 0 0;padding:40px;text-align:center;">
              <div style="display:inline-block;background:rgba(249,115,22,0.15);color:#f97316;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">Billing Reminder</div>
              <h1 style="margin:0 0 12px;color:#f8fafc;font-size:26px;font-weight:800;letter-spacing:-0.5px;">Your invoice is due soon</h1>
              <p style="margin:0;color:rgba(255,255,255,0.5);font-size:15px;">Please take action to avoid service interruption.</p>
            </td>
          </tr>

          <!-- Accent line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#f97316 0%,#fb923c 50%,#ea6c0a 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 24px 24px;padding:40px;box-shadow:0 10px 40px rgba(0,0,0,0.05);">

              <p style="margin:0 0 28px;font-size:16px;color:#334155;line-height:1.7;">
                Hi <strong>${adminName || 'Admin'}</strong>,<br><br>
                This is a reminder that the subscription invoice for <strong>${orgName || 'your organization'}</strong> is due in <strong>${daysLeft} day${daysLeft !== 1 ? 's' : ''}</strong>. Please complete the payment to ensure uninterrupted access to all Frixn services.
              </p>

              <!-- Urgency Badge -->
              <div style="background:${urgencyBg};border:1.5px solid ${urgencyBorder};border-radius:12px;padding:20px 24px;margin-bottom:28px;text-align:center;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:${urgencyText};">Payment Due In</p>
                <p style="margin:0;font-size:40px;font-weight:900;color:${urgencyColor};letter-spacing:-2px;">${daysLeft} Day${daysLeft !== 1 ? 's' : ''}</p>
                <p style="margin:4px 0 0;font-size:14px;color:${urgencyText};">${dueDateFormatted}</p>
              </div>

              <!-- Upcoming Subscription Cycle -->
              <p style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">Upcoming Subscription Cycle</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8ecf2;border-radius:14px;overflow:hidden;margin-bottom:32px;">

                <!-- Next Billing Date -->
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #f0f3f8;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Next Billing Date</p>
                          <p style="margin:0;font-size:18px;font-weight:700;color:#0f172a;">${nextCycleDateFormatted}</p>
                        </td>
                        <td align="right">
                          <div style="background:#f0fdf4;color:#16a34a;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:700;">Active</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Active Seats -->
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #f0f3f8;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Active Seats (Employees)</p>
                          <p style="margin:0;font-size:18px;font-weight:700;color:#0f172a;">${activeSeats || 0} Seat${(activeSeats || 0) !== 1 ? 's' : ''}</p>
                        </td>
                        <td align="right">
                          <p style="margin:0;font-size:14px;color:#64748b;">@ ₹499/seat</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Projected Invoice Amount -->
                <tr>
                  <td style="padding:20px 24px;background:#fafafa;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Projected Invoice Amount</p>
                          <p style="margin:0;font-size:24px;font-weight:900;color:#0f172a;">${formattedAmount} <span style="font-size:14px;font-weight:500;color:#64748b;">/ month</span></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="text-align:center;margin-bottom:28px;">
                <tr>
                  <td>
                    <a href="https://www.frixn.in/sites/frixn/admin/settings" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#ea6c0a 0%,#1a0f06 100%);color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.2px;box-shadow:0 4px 20px rgba(249,115,22,0.3);">Pay Now &rarr;</a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="border-top:1px solid #f0f3f8;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">
                If you have already made the payment, please disregard this email.<br>
                Need help? Contact us at <a href="mailto:support@frixn.in" style="color:#f97316;text-decoration:none;">support@frixn.in</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                This is an automated billing reminder from <strong>Frixn</strong>.<br>
                You are receiving this because you are the admin of <strong>${orgName || 'your organization'}</strong>.
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

module.exports = { generatePaymentReminderEmail };
