function generateInvoiceEmail(orgName, adminName, invoiceDetails) {
  const {
    invoiceNumber,
    invoiceDate,
    dueDate,
    activeSeats,
    amountPerSeat,
    totalAmount,
    status
  } = invoiceDetails;

  const subject = `Invoice #${invoiceNumber} – Frixn Subscription`;

  const invoiceDateFormatted = new Date(invoiceDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  const dueDateFormatted = new Date(dueDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0
  }).format(amount || 0);

  const statusColor = status === 'paid' ? '#16a34a' : '#f97316';
  const statusBg    = status === 'paid' ? '#f0fdf4'  : '#fff7ed';
  const statusLabel = status === 'paid' ? 'Paid'     : 'Pending';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frixn – Invoice #${invoiceNumber}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0f0a04;border-radius:24px 24px 0 0;padding:40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:rgba(255,255,255,0.4);">Tax Invoice</p>
                    <h1 style="margin:0;color:#f8fafc;font-size:26px;font-weight:900;">Invoice #${invoiceNumber}</h1>
                  </td>
                  <td align="right">
                    <div style="display:inline-block;background:${statusBg};color:${statusColor};padding:8px 18px;border-radius:20px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">${statusLabel}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent line -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#f97316 0%,#fb923c 50%,#ea6c0a 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 24px 24px;padding:40px;box-shadow:0 10px 40px rgba(0,0,0,0.05);">

              <!-- Greeting -->
              <p style="margin:0 0 32px;font-size:16px;color:#334155;line-height:1.7;">
                Hi <strong>${adminName || 'Admin'}</strong>,<br><br>
                Please find below your subscription invoice for <strong>${orgName || 'your organization'}</strong>. Kindly complete the payment before the due date to avoid any interruption in service.
              </p>

              <!-- Invoice Meta (From / To / Dates) -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="vertical-align:top;padding-right:12px;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Billed By</p>
                    <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#0f172a;">Frixn Technologies</p>
                    <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">support@frixn.in<br>www.frixn.in</p>
                  </td>
                  <td width="50%" style="vertical-align:top;padding-left:12px;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Billed To</p>
                    <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#0f172a;">${orgName || 'Your Organization'}</p>
                    <p style="margin:0;font-size:13px;color:#64748b;">${adminName || 'Admin'}</p>
                  </td>
                </tr>
              </table>

              <!-- Date row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="vertical-align:top;padding-right:12px;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Invoice Date</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">${invoiceDateFormatted}</p>
                  </td>
                  <td width="50%" style="vertical-align:top;padding-left:12px;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Due Date</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">${dueDateFormatted}</p>
                  </td>
                </tr>
              </table>

              <!-- Line Items Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8ecf2;border-radius:14px;overflow:hidden;margin-bottom:8px;">
                <!-- Table header -->
                <tr style="background:#f8fafc;">
                  <td style="padding:12px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Description</td>
                  <td style="padding:12px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;text-align:center;">Qty</td>
                  <td style="padding:12px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;text-align:right;">Unit Price</td>
                  <td style="padding:12px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;text-align:right;">Total</td>
                </tr>

                <!-- Line Item -->
                <tr style="border-top:1px solid #f0f3f8;">
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#0f172a;">Frixn Subscription</p>
                    <p style="margin:0;font-size:13px;color:#64748b;">Active employee seats · Monthly Plan</p>
                  </td>
                  <td style="padding:18px 20px;font-size:15px;color:#334155;text-align:center;">${activeSeats}</td>
                  <td style="padding:18px 20px;font-size:15px;color:#334155;text-align:right;">${formatINR(amountPerSeat)}</td>
                  <td style="padding:18px 20px;font-size:15px;font-weight:700;color:#0f172a;text-align:right;">${formatINR(totalAmount)}</td>
                </tr>

                <!-- Total row -->
                <tr style="background:#0f0a04;">
                  <td colspan="3" style="padding:18px 20px;font-size:15px;font-weight:700;color:rgba(255,255,255,0.7);">Total Amount Due</td>
                  <td style="padding:18px 20px;font-size:20px;font-weight:900;color:#f97316;text-align:right;">${formatINR(totalAmount)}</td>
                </tr>
              </table>

              <p style="margin:0 0 32px;font-size:13px;color:#94a3b8;padding:0 4px;">All amounts are in Indian Rupees (INR) and inclusive of applicable taxes.</p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="text-align:center;margin-bottom:28px;">
                <tr>
                  <td>
                    <a href="https://www.frixn.in/sites/frixn/admin/settings" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#ea6c0a 0%,#1a0f06 100%);color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.2px;box-shadow:0 4px 20px rgba(249,115,22,0.3);">Pay Invoice &rarr;</a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #f0f3f8;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">
                Questions about this invoice? Contact us at <a href="mailto:support@frixn.in" style="color:#f97316;text-decoration:none;">support@frixn.in</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                This invoice was automatically generated by <strong>Frixn</strong>.<br>
                Sent to the admin of <strong>${orgName || 'your organization'}</strong>.
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

module.exports = { generateInvoiceEmail };
