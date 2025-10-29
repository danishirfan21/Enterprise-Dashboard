export async function GET() {
  const kpis = [
    { label: 'Open Incidents', value: '23', delta: '+3 vs last wk' },
    { label: 'TRIR', value: '0.78', delta: '-0.04 vs last mo' },
    { label: 'Near Misses (30d)', value: '54' },
    { label: 'Inspections Due', value: '6', delta: '+1 overdue' },
  ];
  const trendMonthly = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(2024, i, 1).toLocaleString('en', { month: 'short' }),
    value: Math.floor(10 + Math.random() * 15),
  }));
  const bySeverity = [
    { label: 'Low', value: 48 },
    { label: 'Medium', value: 18 },
    { label: 'High', value: 5 },
  ];
  return Response.json({ kpis, trendMonthly, bySeverity });
}
