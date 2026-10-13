import { useState } from 'react';

export default function SegmentedClientOrbit({ active = 0, churn = 0, total = 0 }) {
  const [hover, setHover] = useState(null);
  const count = 72;
  const activeBars = total ? Math.round((active / total) * count) : 0;
  const churnBars = total ? count - activeBars : 0;
  const bars = Array.from({ length: count }, (_, i) => {
    const a = ((i * 360) / count - 90) * Math.PI / 180;
    const x1 = 160 + Math.cos(a) * 93, y1 = 148 + Math.sin(a) * 93;
    const x2 = 160 + Math.cos(a) * 116, y2 = 148 + Math.sin(a) * 116;
    const kind = i < activeBars ? 'active' : i < activeBars + churnBars && total ? 'churn' : 'empty';
    return { x1, y1, x2, y2, kind };
  });
  const percentage = n => total ? `${Math.round(n / total * 100)}%` : '0%';
  const activeColor = '#19e3b8', churnColor = '#ff4773';
  return <div className="pulse-orbit-v2">
    <div className="pulse-orbit-graphic">
      <svg viewBox="0 0 320 296" role="img" aria-label={`Clientes: ${total} no total, ${active} ativos, ${churn} em churn`}>
        <circle cx="160" cy="148" r="130" fill="none" stroke="#17446d" strokeWidth="1" strokeDasharray="2 9" opacity=".65" />
        <circle cx="160" cy="148" r="123" fill="none" stroke="#0a2847" strokeWidth="1" />
        {bars.map((bar, i) => <line key={i} x1={bar.x1} y1={bar.y1} x2={bar.x2} y2={bar.y2}
          stroke={bar.kind === 'active' ? activeColor : bar.kind === 'churn' ? churnColor : '#213348'}
          strokeWidth={hover === bar.kind ? 9 : 7} strokeLinecap="round"
          opacity={hover && hover !== bar.kind ? .22 : 1}
          className="pulse-orbit-segment"
          style={{ animationDelay: `${i * 9}ms`, filter: bar.kind !== 'empty' ? `drop-shadow(0 0 ${hover === bar.kind ? 9 : 4}px ${bar.kind === 'active' ? activeColor : churnColor})` : undefined }}
          onMouseEnter={() => setHover(bar.kind)} onMouseLeave={() => setHover(null)} />)}
        <circle cx="160" cy="148" r="79" fill="#06101b" stroke="#17527e" strokeWidth="1.5" />
        <text x="160" y="126" fill="#91a9c4" fontSize="12" textAnchor="middle">{hover === 'active' ? 'ATIVOS' : hover === 'churn' ? 'CHURN' : 'TOTAL'}</text>
        <text x="160" y="170" fill="#f4faff" fontSize="47" fontWeight="750" textAnchor="middle">{hover === 'active' ? active : hover === 'churn' ? churn : total}</text>
        <text x="160" y="190" fill="#91a9c4" fontSize="12" textAnchor="middle">clientes</text>
      </svg>
    </div>
    <div className="pulse-orbit-stats">
      {[{ id: 'active', label: 'Ativos', value: active, color: activeColor }, { id: 'churn', label: 'Churn', value: churn, color: churnColor }].map(item =>
        <div key={item.id} className="pulse-orbit-stat" style={{ '--status-color': item.color }} onMouseEnter={() => setHover(item.id)} onMouseLeave={() => setHover(null)}>
          <div className="pulse-orbit-stat-title"><span className="pulse-orbit-dot" />{item.label}</div>
          <div className="pulse-orbit-stat-bottom"><strong>{item.value} <small>{item.value === 1 ? 'cliente' : 'clientes'}</small></strong><b>{percentage(item.value)}</b></div>
        </div>)}
    </div>
  </div>;
}
