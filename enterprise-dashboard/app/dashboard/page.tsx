import KPICard from '@/components/KPICard';
import ChartCard from '@/components/ChartCard';
import { GET as metricsHandler } from '@/app/api/metrics/route';

async function fetchMetrics() {
  // Prefer direct in-repo handler during build to avoid external HTTP calls.
  try {
    const res = await metricsHandler();
    return await res.json();
  } catch {
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${base}/api/metrics`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load metrics');
    return res.json();
  }
}

export default async function DashboardPage() {
  const metrics = await fetchMetrics();
  const { kpis, trendMonthly, bySeverity } = metrics;

  const lineData = {
    labels: trendMonthly.map((d: any) => d.label),
    datasets: [
      { label: 'Incidents', data: trendMonthly.map((d: any) => d.value) },
    ],
  };
  const barData = {
    labels: ['Chemical', 'Slip', 'Fire', 'Equipment', 'Other'],
    datasets: [{ label: 'Type count', data: [12, 9, 4, 8, 5] }],
  };
  const doughnutData = {
    labels: bySeverity.map((d: any) => d.label),
    datasets: [{ data: bySeverity.map((d: any) => d.value) }],
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        {kpis.map((k: any) => (
          <KPICard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
          />
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <ChartCard title="Incidents Over Time" type="line" data={lineData} />
        <ChartCard title="Incidents by Type" type="bar" data={barData} />
        <ChartCard title="Severity Mix" type="doughnut" data={doughnutData} />
      </div>
    </div>
  );
}
