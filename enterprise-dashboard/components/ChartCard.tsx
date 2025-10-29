'use client';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function ChartCard({
  title,
  type,
  data,
}: {
  title: string;
  type: 'line' | 'bar' | 'doughnut';
  data: any;
}) {
  const Chart = type === 'line' ? Line : type === 'bar' ? Bar : Doughnut;
  return (
    <div className="card card-pad">
      <div className="mb-3 font-medium">{title}</div>
      <Chart
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
        }}
        height={220}
      />
    </div>
  );
}
