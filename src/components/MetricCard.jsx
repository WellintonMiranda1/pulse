export default function MetricCard({ title, value, subtitle, icon: Icon, accent = 'blue' }) {
  const accents = {
    blue: 'from-blue-500/25 to-blue-600/10',
    cyan: 'from-cyan-500/25 to-cyan-600/10',
    green: 'from-emerald-500/25 to-emerald-600/10',
    purple: 'from-violet-500/25 to-violet-600/10',
    red: 'from-rose-500/25 to-rose-600/10',
    amber: 'from-amber-500/25 to-amber-600/10',
  };

  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-br ${accents[accent]} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-bold text-white">{value}</p>
          {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="rounded-xl bg-white/10 p-3">
            <Icon className="h-6 w-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
