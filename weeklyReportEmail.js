function generateWeeklyReportEmail(orgName, adminName, weekRange, reportData) {
  const { leads, taps, deactivatedCards, topLinks = [] } = reportData;
  const subject = `📈 Weekly Roundup – ${orgName} – ${weekRange}`;

  const renderMedal = (rank) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `${rank + 1}.`;
  };

  const topLeadRows = leads.topEmployees.length > 0
    ? leads.topEmployees.map((emp, i) => `
      <tr style="border-bottom:1px solid #f0f3f8;">
        <td style="padding:14px 20px;font-size:14px;color:#334155;">${renderMedal(i)} ${emp.name}</td>
        <td style="padding:14px 20px;font-size:14px;font-weight:700;color:#0f172a;text-align:right;">${emp.count} Lead${emp.count !== 1 ? 's' : ''}</td>
      </tr>`).join('')
    : `<tr><td colspan="2" style="padding:20px;text-align:center;font-size:14px;color:#94a3b8;">No leads captured this week.</td></tr>`;

  const topTapRows = taps.topEmployees.length > 0
    ? taps.topEmployees.map((emp, i) => `
      <tr style="border-bottom:1px solid #f0f3f8;">
        <td style="padding:14px 20px;font-size:14px;color:#334155;">${renderMedal(i)} ${emp.name}</td>
        <td style="padding:14px 20px;font-size:14px;font-weight:700;color:#0f172a;text-align:right;">${emp.count} Tap${emp.count !== 1 ? 's' : ''}</td>
      </tr>`).join('')
    : `<tr><td colspan="2" style="padding:20px;text-align:center;font-size:14px;color:#94a3b8;">No taps recorded this week.</td></tr>`;

  const deactivatedCardRows = deactivatedCards.length > 0
    ? deactivatedCards.map(card => `
      <tr style="border-bottom:1px solid #f0f3f8;">
        <td style="padding:14px 20px;font-size:14px;color:#334155;">${card.employeeName || 'Unknown'}</td>
        <td style="padding:14px 20px;font-size:13px;color:#ef4444;font-weight:600;text-align:right;">${card.reason || 'No reason provided'}</td>
      </tr>`).join('')
    : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frixn – Weekly Roundup</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0f0a04;border-radius:24px 24px 0 0;padding:40px;">
              <div style="display:inline-block;background:rgba(249,115,22,0.15);color:#f97316;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">Weekly Roundup</div>
              <h1 style="margin:0 0 8px;color:#f8fafc;font-size:26px;font-weight:900;">Week in Review</h1>
              <p style="margin:0;color:rgba(255,255,255,0.5);font-size:14px;">${orgName} · ${weekRange}</p>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,#f97316 0%,#fb923c 50%,#ea6c0a 100%);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background:#ffffff;border-radius:0 0 24px 24px;padding:40px;box-shadow:0 10px 40px rgba(0,0,0,0.05);">

              <p style="margin:0 0 36px;font-size:16px;color:#334155;line-height:1.7;">
                Hi <strong>${adminName || 'Admin'}</strong>,<br><br>
                Here is your team's performance summary for the past week. Great things happen every week — keep pushing!
              </p>

              <!-- SUMMARY STATS ROW -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                <tr>
                  <td width="33%" style="text-align:center;padding:20px;background:#fff7ed;border-radius:12px;margin-right:8px;">
                    <p style="margin:0 0 4px;font-size:28px;font-weight:900;color:#f97316;">${leads.total}</p>
                    <p style="margin:0;font-size:13px;color:#c2410c;font-weight:600;">Leads</p>
                  </td>
                  <td width="4px">&nbsp;</td>
                  <td width="33%" style="text-align:center;padding:20px;background:#f0fdf4;border-radius:12px;">
                    <p style="margin:0 0 4px;font-size:28px;font-weight:900;color:#16a34a;">${taps.total}</p>
                    <p style="margin:0;font-size:13px;color:#15803d;font-weight:600;">Taps</p>
                  </td>
                  <td width="4px">&nbsp;</td>
                  <td width="33%" style="text-align:center;padding:20px;background:#eff6ff;border-radius:12px;">
                    <p style="margin:0 0 4px;font-size:28px;font-weight:900;color:#2563eb;">${topLinks.reduce((a, l) => a + l.count, 0)}</p>
                    <p style="margin:0;font-size:13px;color:#1d4ed8;font-weight:600;">Link Clicks</p>
                  </td>
                </tr>
              </table>

              <!-- LEADS SECTION -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:14px 20px;background:#0f0a04;border-radius:12px 12px 0 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td><p style="margin:0;font-size:16px;font-weight:800;color:#ffffff;">🎯 Leads Captured</p></td>
                        <td align="right"><span style="background:#f97316;color:#fff;padding:4px 14px;border-radius:20px;font-size:14px;font-weight:800;">${leads.total} Total</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border:1px solid #e8ecf2;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr style="background:#f8fafc;">
                        <td style="padding:10px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Top Performers</td>
                        <td style="padding:10px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;text-align:right;">Leads</td>
                      </tr>
                      ${topLeadRows}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- TAPS SECTION -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:14px 20px;background:#0f0a04;border-radius:12px 12px 0 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td><p style="margin:0;font-size:16px;font-weight:800;color:#ffffff;">📡 NFC Taps</p></td>
                        <td align="right"><span style="background:#f97316;color:#fff;padding:4px 14px;border-radius:20px;font-size:14px;font-weight:800;">${taps.total} Total</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border:1px solid #e8ecf2;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      ${taps.topCity ? `
                      <tr style="background:#fff7ed;border-bottom:1px solid #f0f3f8;">
                        <td style="padding:14px 20px;font-size:14px;color:#c2410c;font-weight:700;">📍 Most Active City</td>
                        <td style="padding:14px 20px;font-size:14px;font-weight:800;color:#c2410c;text-align:right;">${taps.topCity.city} (${taps.topCity.count})</td>
                      </tr>` : ''}
                      <tr style="background:#f8fafc;">
                        <td style="padding:10px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Top Performers</td>
                        <td style="padding:10px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;text-align:right;">Taps</td>
                      </tr>
                      ${topTapRows}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- TOP LINKS SECTION -->
              ${topLinks.length > 0 ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:14px 20px;background:#0f0a04;border-radius:12px 12px 0 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td><p style="margin:0;font-size:16px;font-weight:800;color:#ffffff;">🔗 Top Clicked Links</p></td>
                        <td align="right"><span style="background:#f97316;color:#fff;padding:4px 14px;border-radius:20px;font-size:14px;font-weight:800;">${topLinks.reduce((a, l) => a + l.count, 0)} Clicks</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border:1px solid #e8ecf2;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr style="background:#f8fafc;">
                        <td style="padding:10px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Link</td>
                        <td style="padding:10px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;text-align:right;">Clicks</td>
                      </tr>
                      ${topLinks.map((link, i) => `
                      <tr style="border-bottom:1px solid #f0f3f8;">
                        <td style="padding:14px 20px;">
                          <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#0f172a;">${renderMedal(i)} ${link.title}</p>
                          <a href="${link.url}" style="font-size:12px;color:#94a3b8;text-decoration:none;">${link.url}</a>
                        </td>
                        <td style="padding:14px 20px;font-size:14px;font-weight:700;color:#0f172a;text-align:right;">${link.count}</td>
                      </tr>`).join('')}
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- DEACTIVATED NFC CARDS SECTION -->
              ${deactivatedCards.length > 0 ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:14px 20px;background:#7f1d1d;border-radius:12px 12px 0 0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td><p style="margin:0;font-size:16px;font-weight:800;color:#ffffff;">⚠️ Deactivated NFC Cards</p></td>
                        <td align="right"><span style="background:#ef4444;color:#fff;padding:4px 14px;border-radius:20px;font-size:14px;font-weight:800;">${deactivatedCards.length} Card${deactivatedCards.length !== 1 ? 's' : ''}</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border:1px solid #fecaca;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;background:#fef2f2;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr style="background:#fef2f2;">
                        <td style="padding:10px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#ef4444;">Employee</td>
                        <td style="padding:10px 20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#ef4444;text-align:right;">Reason</td>
                      </tr>
                      ${deactivatedCardRows}
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="text-align:center;margin-bottom:28px;">
                <tr>
                  <td>
                    <a href="https://www.frixn.in/sites/frixn/admin/analytics" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#ea6c0a 0%,#1a0f06 100%);color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;box-shadow:0 4px 20px rgba(249,115,22,0.3);">View Full Analytics &rarr;</a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr><td style="border-top:1px solid #f0f3f8;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.7;text-align:center;">
                This is your automated weekly roundup from Frixn.<br>
                Manage your notification preferences in <a href="https://www.frixn.in/sites/frixn/admin/settings" style="color:#f97316;text-decoration:none;">Settings</a>.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                Powered by <strong>Frixn</strong> · Weekly Roundup for <strong>${orgName}</strong>
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

module.exports = { generateWeeklyReportEmail };
