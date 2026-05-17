function generateNfcStatusEmail(employeeName, status, description, employeeId) {
  const isActive = status === 'active';
  const subject = isActive 
    ? 'Your Frixn NFC Card is Active!' 
    : 'Your Frixn NFC Card has been Deactivated';

  const badgeColor = isActive ? '#22c55e' : '#ef4444';
  const badgeBg = isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)';
  const badgeText = isActive ? 'Card Activated' : 'Card Deactivated';

  const title = isActive 
    ? 'Ready to connect!' 
    : 'Card Status Update';
    
  const bodyText = isActive
    ? 'Your Frixn NFC card has been successfully activated and linked to your profile. You can now start tapping to share your digital business card and capture leads effortlessly.'
    : 'Your Frixn NFC card has been deactivated. It will no longer share your digital profile when tapped.';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frixn - NFC Card Status Update</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          
          <!-- Header Card -->
          <tr>
            <td style="background:#0f0a04;border-radius:24px 24px 0 0;padding:40px;text-align:center;">
              <div style="display:inline-block;background:${badgeBg};color:${badgeColor};padding:8px 16px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">${badgeText}</div>
              <h1 style="margin:0 0 12px;color:#f8fafc;font-size:24px;font-weight:800;letter-spacing:-0.5px;">${title}</h1>
              <p style="margin:0;color:rgba(255,255,255,0.6);font-size:15px;">Frixn Hardware Update</p>
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
                ${bodyText}
              </p>

              ${!isActive && description ? `
              <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin-bottom:32px;">
                <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#ef4444;font-weight:700;">Deactivation Reason</p>
                <p style="margin:0;font-size:15px;color:#7f1d1d;font-weight:500;">${description}</p>
              </div>
              ` : ''}

              <!-- Footer CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="text-align:center;margin-top:16px;">
                <tr>
                  <td>
                    <a href="https://www.frixn.in/sites/frixn/admin/cards/${employeeId || ''}" style="display:inline-block;padding:14px 32px;background:#0f0a04;color:#ffffff;text-decoration:none;border-radius:8px;font-size:15px;font-weight:600;">Manage Your Card</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
          
          <!-- Email Footer -->
          <tr>
            <td style="padding:32px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                You are receiving this email because you have 'nfc_cards' notifications enabled.<br>
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

module.exports = { generateNfcStatusEmail };
