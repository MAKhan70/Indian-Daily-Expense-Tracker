import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

export function MiniSpendingTrend({ data, month, onOpen }) {
  const [selected, setSelected] = useState(null);
  const index = selected ?? 0;
  const maximum = Math.max(1, ...data.map((row) => row.amount));
  const x = (i) => i / Math.max(1, data.length - 1) * 100;
  const y = (i) => 38 - data[i].amount / maximum * 32;
  const date = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${month}-${String(data[index].day).padStart(2, '0')}T12:00:00Z`));
  const inspect = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setSelected(Math.max(0, Math.min(data.length - 1, Math.round((event.clientX - bounds.left) / bounds.width * (data.length - 1)))));
  };
  return <div className="mini-trend-tile">
    <button type="button" className="budget-trend-link" onClick={onOpen}>Daily spending trend ↗</button>
    <div className="mini-trend-plot">
      <svg viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden="true"><polyline points={data.map((_, i) => `${x(i)},${y(i)}`).join(' ')} fill="none" stroke="var(--sage)" strokeWidth="2" vectorEffect="non-scaling-stroke" />{selected !== null && <><line x1={x(index)} x2={x(index)} y1="0" y2="44" stroke="var(--muted)" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" /><circle cx={x(index)} cy={y(index)} r="2.5" fill="var(--sage)" /></>}</svg>
      <div className="mini-trend-selector" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={data.length - 1} aria-valuenow={index} aria-label="Inspect daily spending" aria-valuetext={`${date}: ${money(data[index].amount)} spent`} onFocus={() => setSelected((current) => current ?? 0)} onPointerDown={(event) => { event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); inspect(event); }} onPointerMove={(event) => { if (event.pointerType !== 'touch' || event.buttons === 1) inspect(event); }} onKeyDown={(event) => {
        const offsets = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -7, PageUp: 7 };
        if (!(event.key in offsets) && event.key !== 'Home' && event.key !== 'End') return;
        event.preventDefault();
        setSelected(event.key === 'Home' ? 0 : event.key === 'End' ? data.length - 1 : Math.max(0, Math.min(data.length - 1, index + offsets[event.key])));
      }} />
    </div>
    <div className="mini-trend-readout" aria-live="polite">{selected === null ? <small>Hover or touch to see amounts</small> : <><small>{date}</small><strong>{money(data[index].amount)}</strong></>}</div>
  </div>;
}

export function BudgetUsageRing({ data, used, budget, spent, onOpen }) {
  const [inspecting, setInspecting] = useState(false);
  const [segment, setSegment] = useState(null);
  const row = segment === null ? null : data[segment];
  const inspect = (event) => {
    setInspecting(true);
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const radius = Math.hypot(dx, dy);
    const angle = (Math.atan2(dx, -dy) + Math.PI * 2) % (Math.PI * 2);
    const arc = Math.PI * 2 * Math.min(used, 100) / 100;
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (radius < .68 || radius > 1 || angle >= arc || !arc || !total) { setSegment(null); return; }
    let cumulative = 0;
    setSegment(data.findIndex((item) => { cumulative += item.value; return angle / arc <= cumulative / total; }));
  };
  return <div className="budget-ring-group">
    <button type="button" className="budget-ring" aria-label="Inspect monthly budget spending" aria-describedby="budget-ring-readout" onPointerEnter={inspect} onPointerMove={inspect} onPointerDown={inspect} onClick={() => setInspecting(true)} onFocus={() => setInspecting(true)} onKeyDown={(event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'Escape'].includes(event.key)) return;
      event.preventDefault(); setInspecting(true);
      if (event.key === 'Home' || event.key === 'Escape') setSegment(null);
      else setSegment((current) => { const next = (current ?? -1) + (event.key === 'ArrowRight' ? 1 : -1); return next < 0 || next >= data.length ? null : next; });
    }}>
      <div className="budget-ring-chart" aria-hidden="true"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ value: 1 }]} dataKey="value" innerRadius="76%" outerRadius="96%" fill="var(--track)" stroke="none" isAnimationActive={false} /><Pie data={data} dataKey="value" innerRadius="76%" outerRadius="96%" startAngle={90} endAngle={90 - 360 * Math.min(used, 100) / 100} stroke="none" isAnimationActive={false}>{data.map((item, i) => <Cell key={i} fill={item.fill} />)}</Pie></PieChart></ResponsiveContainer></div>
      <span><b>{budget ? Math.round(used) + '%' : '—'}</b><small>{budget ? 'budget used' : 'No budget'}</small></span>
    </button>
    <div id="budget-ring-readout" className="ring-readout" aria-live="polite">{inspecting ? <><small>{row?.name || 'Budget spent'}</small><strong>{money(row?.value ?? spent)}</strong></> : <small>Hover or tap for amounts</small>}</div>
    <button type="button" className="text-button ring-analytics-link" onClick={onOpen}>Pie analytics ↗</button>
  </div>;
}
