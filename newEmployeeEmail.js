function generateNewEmployeeEmail(orgName, employeeName, designation, department, employeeCode, email, phone) {
  const subject = `🎉 New Employee Added: ${employeeName} — ${orgName}`;

  const getRow = (label, value, isLast = false) => {
    return `
      <tr>
        <td style="padding:16px 20px; vertical-align:middle; ${isLast ? '' : 'border-bottom: 1px solid #f0f3f8;'}">
          <div style="font-family: Arial, sans-serif; font-size:11px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; color:#94a3b8; margin-bottom:4px;">${label}</div>
          <div style="font-family: Arial, sans-serif; font-size:15px; font-weight:600; color:#0f172a; margin:0;">${value}</div>
        </td>
      </tr>
    `;
  };

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Frixn — New Employee Onboarded</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: Arial, sans-serif;">
  <div style="width:100%; background-color:#f8fafc; padding:40px 16px; text-align:center; box-sizing:border-box;">
    <div style="max-width:580px; margin:0 auto; background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,0.05); text-align:left;">
      
      <!-- Header section -->
      <div style="background-color:#0f0a04; padding:40px; position:relative; text-align:center;">
        <div style="display:inline-block; background:rgba(249,115,22,0.1); color:#f97316; padding:8px 16px; border-radius:20px; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px;">System Alert</div>
        <h1 style="margin:0; color:#f8fafc; font-size:26px; font-weight:800; letter-spacing:-0.5px; font-family: Arial, sans-serif;">
          New Employee Onboarded
        </h1>
        <p style="margin:8px 0 0 0; color:rgba(255,255,255,0.5); font-size:14px; font-family: Arial, sans-serif;">
          A new profile has been added under an organization subscription.
        </p>
      </div>

      <!-- Accent divider -->
      <div style="height:4px; width:100%; background:linear-gradient(90deg, #f97316 0%, #fb923c 50%, #ea6c0a 100%);"></div>

      <!-- Content section -->
      <div style="background-color:#ffffff; padding:40px 44px 44px;">
        <p style="margin:0 0 24px 0; color:#475569; font-size:15px; line-height:1.6; font-family: Arial, sans-serif;">
          Hello Sales Team,<br><br>
          This is an automated notification to inform you that a new employee profile has been successfully added to Frixn.
        </p>

        <div style="font-family: Arial, sans-serif; font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:#94a3b8; margin-bottom:16px;">
          EMPLOYEE DETAILS
        </div>
        
        <!-- Info list container -->
        <div style="border:1px solid #e8ecf2; border-radius:16px; overflow:hidden; background-color:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            ${getRow('Employee Name', employeeName)}
            ${getRow('Designation', designation)}
            ${getRow('Department', department)}
            ${getRow('Employee Code', employeeCode)}
            ${getRow('Email Address', email)}
            ${getRow('Phone Number', phone)}
            ${getRow('Organization', orgName, true)}
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:24px 40px; background-color:#f8fafc; border-top:1px solid #f0f3f8; text-align:center;">
        <p style="margin:0; font-size:12px; color:#94a3b8; font-family: Arial, sans-serif; line-height:1.6;">
          This is an automated system notification from Frixn.<br>
          Powered by <strong>Frixn</strong>
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;

  return { subject, html };
}

module.exports = { generateNewEmployeeEmail };
