function getIconSvg(type) {
  const imgStyle = 'display:block; outline:none; border:none; text-decoration:none;';
  switch (type) {
    case 'person':
      return `<img src="cid:icon-person" width="24" height="24" style="${imgStyle}" alt="person" />`;
    case 'phone':
      return `<img src="cid:icon-phone" width="24" height="24" style="${imgStyle}" alt="phone" />`;
    case 'envelope':
      return `<img src="cid:icon-envelope" width="24" height="24" style="${imgStyle}" alt="email" />`;
    case 'building':
      return `<img src="cid:icon-building" width="24" height="24" style="${imgStyle}" alt="organization" />`;
    case 'group':
      return `<img src="cid:icon-group" width="24" height="24" style="${imgStyle}" alt="team size" />`;
    default:
      return '';
  }
}

function generateSalesInquiryEmail(fullName, phone, email, organization, teamSize) {
  const firstName = fullName.split(' ')[0] || fullName;
  const subject = `New Sales Inquiry from ${fullName} \u2014 ${organization}`;

  const getRow = (iconType, label, value, isLast = false) => {
    return `
      <tr>
        <td style="padding:16px 16px 16px 20px; width:36px; vertical-align:middle; ${isLast ? '' : 'border-bottom: 1px solid #f0f3f8;'}">
          <div style="width:36px; height:36px; border-radius:10px; background-color:#fff7ed; border:1px solid #fed7aa; display:inline-block; text-align:center;">
            <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0; padding:0; width:100%; height:100%;">
              <tr>
                <td align="center" valign="middle" style="padding:0; margin:0; line-height:0;">
                  ${getIconSvg(iconType)}
                </td>
              </tr>
            </table>
          </div>
        </td>
        <td style="padding:16px 20px 16px 16px; vertical-align:middle; ${isLast ? '' : 'border-bottom: 1px solid #f0f3f8;'}">
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
</head>
<body style="margin:0; padding:0; background-color:#ffffff; font-family: Arial, sans-serif;">
  <div style="width:100%; background-color:#ffffff; padding:32px 16px; text-align:center; box-sizing:border-box;">
    <div style="max-width:580px; margin:0 auto; background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 0 80px rgba(249,115,22,0.08); text-align:left;">
      
      <!-- Header section -->
      <div style="background-color:#0f0a04; background-image:linear-gradient(rgba(249,115,22,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.15) 1px, transparent 1px); background-size:32px 32px; padding:44px; position:relative;">
        <h1 style="margin:0; color:#f8fafc; font-size:32px; font-weight:800; letter-spacing:-0.8px; font-family: Arial, sans-serif;">
          Sales Inquiry<br>Received
        </h1>
        <p style="margin:12px 0 0 0; color:rgba(255,255,255,0.4); font-size:14px; font-family: Arial, sans-serif;">
          A new prospect has reached out to the sales team.
        </p>
      </div>

      <!-- Accent divider -->
      <div style="height:3px; width:100%; background:linear-gradient(90deg, #f97316 0%, #fb923c 50%, transparent 100%);"></div>

      <!-- Content section -->
      <div style="background-color:#ffffff; padding:40px 44px 44px;">
        <div style="font-family: Arial, sans-serif; font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase; color:#94a3b8; margin-bottom:16px;">
          CONTACT DETAILS
        </div>
        
        <!-- Info list container -->
        <div style="border:1px solid #e8ecf2; border-radius:16px; overflow:hidden; background-color:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
            ${getRow('person', 'Full Name', fullName)}
            ${getRow('building', 'Organization', organization)}
            ${getRow('envelope', 'Email Address', email)}
            ${getRow('phone', 'Phone Number', phone)}
            ${getRow('group', 'Team Size', teamSize, true)}
          </table>
        </div>

        <!-- CTA section -->
        <div style="margin-top:32px; padding-top:28px; border-top:1px solid #f0f3f8;">
          <p style="margin:0 0 16px 0; color:#94a3b8; font-size:13px; font-family: Arial, sans-serif;">
            Ready to connect? Reply directly to ${firstName}.
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <a href="mailto:${email}" style="display:inline-block; padding:15px 32px; background:linear-gradient(135deg, #ea6c0a 0%, #1a0f06 100%); background-color:#ea6c0a; color:#ffffff; border-radius:12px; font-weight:700; font-size:15px; text-decoration:none; box-shadow:0 4px 20px rgba(249,115,22,0.35); font-family: Arial, sans-serif;">
                  Reply to ${firstName}
                </a>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:20px 44px 24px; background-color:#f8fafc; border-top:1px solid #f0f3f8; text-align:center;">
        <p style="margin:0; font-size:12px; color:#b0bac8; font-family: Arial, sans-serif;">
          Auto-generated by Frixn &middot; Sales Inquiry Form<br>
          <span style="display:inline-block; margin-top:4px;">Do not reply to this notification email.</span>
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;

  return { subject, html };
}

module.exports = { generateSalesInquiryEmail };
