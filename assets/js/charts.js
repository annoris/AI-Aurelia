/**
 * Aurelia AI — Pure Inline SVG Charts (zero external charting libraries)
 * Uses CSS custom properties so dark and light themes update instantaneously.
 */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Overview radial progress ring showing Knowledge Base attachment coverage.
 */
export function renderOverviewCoverageRingSvg(attachedCount, totalCount, attachedChunks) {
  const safeTotal = Math.max(totalCount, 1);
  const pct = Math.round((attachedCount / safeTotal) * 100);
  const radius = 46;
  const cx = 66;
  const cy = 78;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;
  const ringColor = attachedCount > 0 ? 'var(--accent)' : 'var(--warning)';

  return `
    <svg viewBox="0 0 308 156" width="100%" height="auto" role="img" aria-label="Knowledge coverage ${pct}% (${attachedCount} of ${totalCount} documents attached)">
      <title>Knowledge Coverage Ring</title>
      <circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="var(--border)" stroke-width="11" opacity="0.5" />
      <circle
        cx="${cx}"
        cy="${cy}"
        r="${radius}"
        fill="none"
        stroke="${ringColor}"
        stroke-width="11"
        stroke-linecap="round"
        stroke-dasharray="${circumference.toFixed(2)}"
        stroke-dashoffset="${dashOffset.toFixed(2)}"
        transform="rotate(-90 ${cx} ${cy})"
      />
      <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-size="22" font-weight="700" font-family="var(--font-mono)" fill="var(--fg)">${pct}%</text>
      <text x="${cx}" y="${cy + 20}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--muted)">GROUNDED</text>

      <text x="134" y="42" font-size="10.5" font-weight="700" letter-spacing="0.06em" font-family="var(--font-mono)" fill="var(--muted)">ACTIVE CONTEXT</text>
      <text x="134" y="64" font-size="17" font-weight="700" fill="var(--fg)">${attachedCount} of ${totalCount} Docs</text>
      <text x="134" y="88" font-size="12" fill="var(--muted)">Indexed Vectors:</text>
      <text x="134" y="106" font-size="14" font-weight="700" font-family="var(--font-mono)" fill="var(--accent)">${attachedChunks} active chunks</text>
      <text x="134" y="128" font-size="11" fill="${attachedCount > 0 ? 'var(--gold-text)' : 'var(--warning)'}">${attachedCount > 0 ? 'Citations strictly enforced' : 'Attach docs to enable RAG'}</text>
    </svg>
  `;
}

/**
 * Overview 7-day Workspace Queries vertical bar chart with generous padding.
 */
export function renderOverviewWeeklyQueriesSvg(weeklyQueries, workspaceName) {
  const series = Array.isArray(weeklyQueries) ? weeklyQueries : [20, 28, 32, 30, 44, 48, 38];
  const rawMax = Math.max(...series, 10);
  const yMax = Math.ceil(rawMax / 20) * 20;
  const yMid = Math.round(yMax / 2);

  const leftPad = 42;
  const rightPad = 18;
  const topPad = 24;
  const plotHeight = 112;
  const plotWidth = 480 - leftPad - rightPad;
  const slotWidth = plotWidth / series.length;
  const barWidth = Math.min(30, slotWidth * 0.54);
  const peakVal = Math.max(...series);

  const gridLines = [
    { val: yMax, y: topPad },
    { val: yMid, y: topPad + plotHeight / 2 },
    { val: 0, y: topPad + plotHeight }
  ]
    .map(
      (tick) => `
      <line x1="${leftPad}" y1="${tick.y}" x2="${480 - rightPad}" y2="${tick.y}" stroke="var(--border)" stroke-width="1" stroke-dasharray="${tick.val === 0 ? 'none' : '3 3'}" />
      <text x="${leftPad - 8}" y="${tick.y + 4}" text-anchor="end" font-size="10.5" font-family="var(--font-mono)" fill="var(--muted)">${tick.val}</text>
    `
    )
    .join('');

  const bars = series
    .map((val, idx) => {
      const h = Math.max(4, Math.round((val / yMax) * plotHeight));
      const x = leftPad + idx * slotWidth + (slotWidth - barWidth) / 2;
      const y = topPad + (plotHeight - h);
      const isPeak = val === peakVal;
      const fill = isPeak ? 'var(--gold)' : 'var(--accent)';
      return `
        <g>
          <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${h}" rx="5" fill="${fill}" opacity="${isPeak ? '0.96' : '0.82'}" />
          <text x="${(x + barWidth / 2).toFixed(1)}" y="${Math.max(13, y - 6).toFixed(1)}" text-anchor="middle" font-size="10.5" font-weight="700" font-family="var(--font-mono)" fill="var(--fg)">${val}</text>
          <text x="${(x + barWidth / 2).toFixed(1)}" y="${topPad + plotHeight + 20}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--muted)">${DAYS[idx]}</text>
        </g>
      `;
    })
    .join('');

  return `
    <svg viewBox="0 0 480 174" width="100%" height="auto" role="img" aria-label="7-day grounded queries chart for ${escapeXml(workspaceName || 'workspace')}">
      <title>7-Day Workspace Query Volume</title>
      ${gridLines}
      ${bars}
    </svg>
  `;
}

/**
 * CRM Pipeline Value horizontal bar breakdown by stage.
 */
export function renderCrmPipelineChartSvg(leads) {
  const stages = [
    { name: 'Qualified', color: 'var(--accent)' },
    { name: 'Proposal Sent', color: 'var(--gold)' },
    { name: 'Booked', color: 'var(--accent)' },
    { name: 'Won', color: 'var(--success)' },
    { name: 'Follow-Up', color: 'var(--muted)' }
  ];

  const rows = stages.map((st) => {
    const matched = (leads || []).filter((lead) => lead.stage === st.name);
    const total = matched.reduce((sum, item) => sum + Number(item.value || 0), 0);
    return { ...st, count: matched.length, total };
  });

  const maxTotal = Math.max(...rows.map((r) => r.total), 1000);
  const labelRight = 112;
  const barStart = 124;
  const maxBarWidth = 290;
  const rowHeight = 32;
  const startY = 16;

  const barsSvg = rows
    .map((row, i) => {
      const y = startY + i * rowHeight;
      const width = row.total > 0 ? Math.max(10, Math.round((row.total / maxTotal) * maxBarWidth)) : 4;
      const valueText = `$${row.total.toLocaleString('en-US')} (${row.count})`;

      return `
        <g>
          <text x="${labelRight}" y="${y + 16}" text-anchor="end" font-size="12" font-weight="600" fill="var(--fg)">${escapeXml(row.name)}</text>
          <rect x="${barStart}" y="${y + 4}" width="${maxBarWidth}" height="16" rx="5" fill="var(--border)" opacity="0.28" />
          <rect x="${barStart}" y="${y + 4}" width="${width}" height="16" rx="5" fill="${row.color}" opacity="0.88" />
          <text x="${barStart + maxBarWidth + 14}" y="${y + 16}" text-anchor="start" font-size="11.5" font-weight="700" font-family="var(--font-mono)" fill="var(--fg)">${valueText}</text>
        </g>
      `;
    })
    .join('');

  const height = startY + rows.length * rowHeight + 10;

  return `
    <svg viewBox="0 0 580 ${height}" width="100%" height="auto" role="img" aria-label="CRM Pipeline Value Breakdown by Stage">
      <title>CRM Pipeline Value by Stage</title>
      ${barsSvg}
    </svg>
  `;
}
