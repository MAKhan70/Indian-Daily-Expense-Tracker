import { useMemo, useState } from "react";
import {
  Archive, Bell, CalendarPlus, CaretLeft, CaretRight, ClockCountdown,
  PencilSimple, Plus,
} from "@phosphor-icons/react";
import { DISPLAY_DATE, formatINR, titleCaseDate } from "./domain.js";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function dateParts(key) {
  const [year, month, day] = key.split("-").map(Number);
  return { year, month, day };
}

function dateKey(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function daysFromToday(key) {
  const target = new Date(`${key}T12:00:00+05:30`);
  const today = new Date(`${DISPLAY_DATE}T12:00:00+05:30`);
  return Math.round((target - today) / 86400000);
}

function reminderLabel(expense) {
  const days = daysFromToday(expense.date);
  if (days < 0) return { tone: "overdue", text: `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue` };
  if (days === 0) return { tone: "due", text: "Due today" };
  if (days <= 7 && ["week", "both"].includes(expense.reminder)) return { tone: "due", text: `Due in ${days} day${days === 1 ? "" : "s"}` };
  if (days <= 31 && ["month", "both"].includes(expense.reminder)) return { tone: "soon", text: `Due in ${days} days` };
  return null;
}

function LedgerRecord({ expense, aliases, onEdit }) {
  return (
    <button type="button" className={`ledger-record ${expense.status === "planned" ? "planned" : ""}`} onClick={() => onEdit(expense)}>
      <span className="ledger-record-icon">{expense.status === "planned" ? <ClockCountdown size={20} /> : <PencilSimple size={18} />}</span>
      <span><strong>{expense.name}</strong><small>{expense.merchant || expense.category} · {aliases[expense.payment]}</small>{expense.planNote && <em>{expense.planNote}</em>}</span>
      <span className="ledger-record-meta"><b>{formatINR(expense.amount)}</b><small>{expense.status === "planned" ? "Planned" : "Recorded"}</small></span>
    </button>
  );
}

export function LedgerView({ records, archives, aliases, onEdit, onAdd }) {
  const initial = dateParts(DISPLAY_DATE);
  const [cursor, setCursor] = useState({ year: initial.year, month: initial.month - 1 });
  const [selectedDate, setSelectedDate] = useState(DISPLAY_DATE);
  const [showArchive, setShowArchive] = useState(false);
  const years = Array.from({ length: 31 }, (_, index) => initial.year - 15 + index);
  const monthKey = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}`;
  const monthRecords = records.filter((record) => record.date.startsWith(monthKey));
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const firstDayOffset = (new Date(cursor.year, cursor.month, 1).getDay() + 6) % 7;
  const selectedRecords = records.filter((record) => record.date === selectedDate);
  const reminders = useMemo(() => records.filter((record) => record.status === "planned").map((record) => ({ record, alert: reminderLabel(record) })).filter(({ alert }) => alert).sort((a, b) => a.record.date.localeCompare(b.record.date)), [records]);

  const moveMonth = (delta) => {
    const next = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
    setSelectedDate(dateKey(next.getFullYear(), next.getMonth(), 1));
  };
  const selectMonth = (month) => { setCursor((current) => ({ ...current, month: Number(month) })); setSelectedDate(dateKey(cursor.year, Number(month), 1)); };
  const selectYear = (year) => { setCursor((current) => ({ ...current, year: Number(year) })); setSelectedDate(dateKey(Number(year), cursor.month, 1)); };
  const selectedIsFuture = selectedDate > DISPLAY_DATE;

  return (
    <div className="ledger-page">
      <section className="module-card reminder-centre" aria-labelledby="reminder-title">
        <div className="ledger-section-head"><div><span className="eyebrow"><Bell size={16} /> Upcoming reminders</span><h2 id="reminder-title">Planned expense alerts</h2></div><strong>{reminders.length}</strong></div>
        {reminders.length ? <div className="reminder-list">{reminders.map(({ record, alert }) => <button type="button" key={record.id} onClick={() => { const parts = dateParts(record.date); setCursor({ year: parts.year, month: parts.month - 1 }); setSelectedDate(record.date); }}><span className={`reminder-dot ${alert.tone}`} /><span><strong>{record.name}</strong><small>{titleCaseDate(record.date)} · {record.planNote || "No note added"}</small></span><b>{alert.text}</b></button>)}</div> : <p className="quiet-message">No planned expenses are inside their reminder window.</p>}
      </section>

      <section className="module-card calendar-view">
        <div className="ledger-toolbar">
          <div className="calendar-head"><button type="button" className="icon-button" aria-label="Previous month" onClick={() => moveMonth(-1)}><CaretLeft /></button><div className="month-year-controls"><label><span className="visually-hidden">Month</span><select name="ledger-month" value={cursor.month} onChange={(event) => selectMonth(event.target.value)}>{MONTHS.map((month, index) => <option value={index} key={month}>{month}</option>)}</select></label><label><span className="visually-hidden">Year</span><select name="ledger-year" value={cursor.year} onChange={(event) => selectYear(event.target.value)}>{years.map((year) => <option key={year}>{year}</option>)}</select></label></div><button type="button" className="icon-button" aria-label="Next month" onClick={() => moveMonth(1)}><CaretRight /></button></div>
          <div className="ledger-actions"><button type="button" className="secondary-button" onClick={() => { setCursor({ year: initial.year, month: initial.month - 1 }); setSelectedDate(DISPLAY_DATE); }}>Today</button><button type="button" className={showArchive ? "secondary-button active" : "secondary-button"} onClick={() => setShowArchive((value) => !value)} aria-expanded={showArchive}><Archive size={18} /> Archived <span>{archives.length}</span></button></div>
        </div>
        <div className="calendar-grid calendar-labels">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="calendar-grid">{Array.from({ length: firstDayOffset }, (_, index) => <span className="calendar-blank" key={`blank-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => { const key = dateKey(cursor.year, cursor.month, day); const dayRecords = monthRecords.filter((record) => record.date === key); const actualTotal = dayRecords.filter((record) => record.status !== "planned").reduce((sum, record) => sum + Number(record.amount), 0); const planned = dayRecords.filter((record) => record.status === "planned").length; return <button type="button" className={`calendar-day ${key === DISPLAY_DATE ? "today" : ""} ${key === selectedDate ? "selected" : ""} ${planned ? "has-planned" : ""}`} key={day} onClick={() => setSelectedDate(key)} aria-label={`${titleCaseDate(key)}${dayRecords.length ? `, ${dayRecords.length} entries` : ", no entries"}`}><span>{day}</span><span className="day-summary">{actualTotal > 0 && <strong>{formatINR(actualTotal)}</strong>}{planned > 0 && <small><ClockCountdown size={12} /> {planned} planned</small>}</span></button>; })}</div>
      </section>

      <section className="module-card day-ledger" aria-live="polite">
        <div className="ledger-section-head"><div><span className="eyebrow">Selected date</span><h2>{titleCaseDate(selectedDate)}</h2><p>{selectedIsFuture ? "Add a planned expense and choose when you want an in-app reminder." : "Select an entry to edit it. The previous version will be archived."}</p></div><button type="button" className="primary-button" onClick={() => onAdd(selectedDate, selectedIsFuture)}>{selectedIsFuture ? <CalendarPlus size={18} /> : <Plus size={18} />}{selectedIsFuture ? "Plan expense" : "Add expense"}</button></div>
        <div className="selected-records">{selectedRecords.length ? selectedRecords.map((record) => <LedgerRecord expense={record} aliases={aliases} onEdit={onEdit} key={record.id} />) : <div className="quiet-message">No entries on this date yet.</div>}</div>
      </section>

      {showArchive && <section className="module-card archive-panel"><div className="ledger-section-head"><div><span className="eyebrow"><Archive size={16} /> Audit history</span><h2>Archived values</h2><p>Read-only snapshots retained before an expense was edited or deleted.</p></div></div>{archives.length ? <div className="archive-list">{archives.map((item) => <article key={item.archiveId}><span><strong>{item.name}</strong><small>{item.date} · {item.merchant || item.category}</small></span><span><b>{formatINR(item.amount)}</b><small>{item.archiveReason || "Edited"} · {new Date(item.archivedAt).toLocaleString("en-IN")}</small></span></article>)}</div> : <p className="quiet-message">Archived versions will appear here after your first edit.</p>}</section>}
    </div>
  );
}
