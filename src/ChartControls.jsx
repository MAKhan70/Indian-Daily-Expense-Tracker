const OPTIONS = {
  pie: [['payment','Payment method'],['category','Category'],['frequency','Expense frequency'],['budget','Budget treatment']],
  bar: [['category','Category'],['payment','Payment method'],['frequency','Expense frequency'],['day','Day of month']],
  trend: [['daily','Daily spending'],['cumulative','Cumulative spending'],['budget','Budget pace vs actual'],['payment','Top payment methods']],
};
export function ChartControls({ type, selected, onToggle }) {
  return <details className="inline-chart-controls"><summary><span>Chart attributes</span><small>{selected.map((key) => OPTIONS[type].find(([value]) => value === key)?.[1]).join(' · ')}</small></summary><fieldset className="chart-multi-select"><legend>{type === 'pie' ? 'Pie chart data' : type === 'bar' ? 'Bar chart data' : 'Trend chart data'}</legend>{OPTIONS[type].map(([value, text]) => <label key={value} htmlFor={`${type}-attribute-${value}`}><input id={`${type}-attribute-${value}`} name={`${type}-attributes`} type="checkbox" checked={selected.includes(value)} onChange={() => onToggle(type, value)} /><span>{text}</span></label>)}<small>{type === 'trend' ? 'Selected series are overlaid.' : 'Selected dimensions are combined without duplicating spending.'} Keep at least one attribute selected.</small></fieldset></details>;
}
