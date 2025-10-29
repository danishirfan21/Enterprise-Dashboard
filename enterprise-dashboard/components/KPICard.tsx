export default function KPICard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="card card-pad">
      <div className="text-slate-400 text-xs">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {delta && <div className="text-xs mt-1 text-slate-400">{delta}</div>}
    </div>
  );
}
