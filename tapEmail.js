function generateTapNotificationEmail(employeeName, tapDetails, employeeId) {
  const subject = `New Tap on Your Frixn Card!`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frixn - New Tap Notification</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header Card -->
          <tr>
            <td style="background:#0f0a04;border-radius:24px 24px 0 0;padding:40px;text-align:center;">
              <div style="display:inline-block;background:rgba(249,115,22,0.1);color:#f97316;padding:8px 16px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">New Interaction</div>
              <h1 style="margin:0 0 12px;color:#f8fafc;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Someone tapped your card!</h1>
              <p style="margin:0;color:rgba(255,255,255,0.6);font-size:15px;">Your digital presence is growing.</p>
            </td>
          </tr>
          
          <!-- Orange accent line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#f97316 0%,#fb923c 50%,#ea6c0a 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 24px 24px;padding:40px;box-shadow:0 10px 40px rgba(0,0,0,0.05);">
              
              <p style="margin:0 0 32px;font-size:16px;color:#334155;line-height:1.6;">
                Hi <strong>${employeeName}</strong>,<br><br>
                Great news! Your Frixn NFC card was just tapped. Here are the details of the interaction:
              </p>

              <!-- Tap Details Card -->
              <div style="background:#f8fafc;border:1px solid #e8ecf2;border-radius:12px;padding:24px;margin-bottom:32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:12px;border-bottom:1px solid #e8ecf2;">
                      <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;">Time of Tap</p>
                      <p style="margin:0;font-size:15px;color:#0f172a;font-weight:600;">${new Date(tapDetails.tapped_at).toLocaleString()}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:16px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="33%" style="vertical-align:top;">
                            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;">Location</p>
                            <p style="margin:0;font-size:14px;color:#334155;">${tapDetails.city || 'Unknown'}</p>
                          </td>
                          <td width="33%" style="vertical-align:top;">
                            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;">Device</p>
                            <p style="margin:0;font-size:14px;color:#334155;">${tapDetails.device || 'Unknown'}</p>
                          </td>
                          <td width="33%" style="vertical-align:top;">
                            <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;font-weight:700;">OS</p>
                            <p style="margin:0;font-size:14px;color:#334155;">${tapDetails.os || 'Unknown'}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Footer CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="text-align:center;">
                <tr>
                  <td>
                    <a href="https://www.frixn.in/sites/frixn/admin/employees/${employeeId || ''}" style="display:inline-block;padding:14px 32px;background:#0f0a04;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">View Analytics Dashboard</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
          
          <!-- Email Footer -->
          <tr>
            <td style="padding:32px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                You are receiving this email because you have 'taps' notifications enabled.<br>
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

module.exports = { generateTapNotificationEmail };
