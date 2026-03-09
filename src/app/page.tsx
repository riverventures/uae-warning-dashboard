import data from "@/data/situation.json";

const statusColors: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  green: { bg: "bg-green-950/40", border: "border-green-700/50", badge: "bg-green-600", text: "text-green-400" },
  amber: { bg: "bg-yellow-950/40", border: "border-yellow-700/50", badge: "bg-yellow-600", text: "text-yellow-400" },
  red: { bg: "bg-red-950/40", border: "border-red-700/50", badge: "bg-red-600", text: "text-red-400" },
  unknown: { bg: "bg-zinc-900/40", border: "border-zinc-700/50", badge: "bg-zinc-600", text: "text-zinc-400" },
};

const trendIcons: Record<string, string> = {
  up: "↑",
  down: "↓",
  stable: "→",
  unknown: "?",
};

const statusLabels: Record<string, string> = {
  green: "MANAGEABLE",
  amber: "PREPARE TO MOVE",
  red: "LEAVE",
};

function OverallBanner() {
  const s = statusColors[data.overallStatus] || statusColors.unknown;
  return (
    <div className={`${s.bg} ${s.border} border-2 rounded-xl p-6 mb-8`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`${s.badge} px-3 py-1 rounded-full text-sm font-bold text-white uppercase tracking-wider`}>
              {statusLabels[data.overallStatus] || "UNKNOWN"}
            </span>
            <span className="text-zinc-400 text-sm">Day {data.conflictDay} — Operation Epic Fury</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">UAE Crisis Warning Dashboard</h1>
          <p className="text-zinc-400 mt-1 text-sm max-w-2xl">{data.disclaimer}</p>
        </div>
        <div className="text-right">
          <div className="text-zinc-500 text-xs uppercase tracking-wider">Last Updated</div>
          <div className="text-white font-mono text-sm">
            {new Date(data.lastUpdated).toLocaleString("en-GB", {
              timeZone: "Asia/Dubai",
              dateStyle: "medium",
              timeStyle: "short",
            })}
            {" GST"}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: (typeof data.sections)[number] }) {
  const s = statusColors[section.status] || statusColors.unknown;
  return (
    <div className={`${s.bg} ${s.border} border rounded-lg p-5 flex flex-col gap-4`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">{section.title}</h2>
        <span className={`${s.badge} px-2 py-0.5 rounded text-xs font-bold text-white uppercase`}>
          {section.status}
        </span>
      </div>
      <p className="text-zinc-300 text-sm leading-relaxed">{section.summary}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {section.metrics.map((m) => (
          <div key={m.label} className="bg-black/30 rounded px-3 py-2">
            <div className="text-zinc-500 text-xs uppercase tracking-wider">{m.label}</div>
            <div className="text-white font-mono text-sm flex items-center gap-1">
              {m.value}
              <span className={m.trend === "up" ? "text-red-400" : m.trend === "down" ? "text-green-400" : "text-zinc-500"}>
                {trendIcons[m.trend] || ""}
              </span>
            </div>
          </div>
        ))}
      </div>
      <details className="group">
        <summary className="text-zinc-500 text-xs cursor-pointer hover:text-zinc-300 transition-colors">
          Analysis & Sources
        </summary>
        <div className="mt-3 space-y-2">
          <p className="text-zinc-400 text-xs leading-relaxed">{section.analysis}</p>
          {section.sources.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {section.sources.map((src) => (
                <a
                  key={src.name}
                  href={src.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-xs underline"
                >
                  {src.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </details>
    </div>
  );
}

function TriggerTable() {
  const { triggerList } = data;
  const allTriggers = [
    ...triggerList.red.map((t) => ({ ...t, tier: "red" as const, tierLabel: "🔴 LEAVE NOW" })),
    ...triggerList.amber.map((t) => ({ ...t, tier: "amber" as const, tierLabel: "🟡 RECONSIDER" })),
    ...triggerList.green.map((t) => ({ ...t, tier: "green" as const, tierLabel: "🟢 STAY" })),
  ];
  return (
    <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-lg p-5 mt-8">
      <h2 className="text-lg font-semibold text-white mb-4">Decision Triggers</h2>
      <div className="space-y-2">
        {allTriggers.map((t) => {
          const triggerStatusColor = statusColors[t.status] || statusColors.unknown;
          return (
            <div key={t.trigger} className="flex items-start gap-3 bg-black/20 rounded px-3 py-2">
              <span className={`${triggerStatusColor.badge} w-2.5 h-2.5 rounded-full mt-1.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm">{t.trigger}</span>
                  <span className="text-zinc-600 text-xs">({t.tierLabel})</span>
                </div>
                <div className="text-zinc-500 text-xs mt-0.5">{t.note}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AttackChart() {
  const { dailyAttackData } = data;
  const maxVal = Math.max(...dailyAttackData.map((d) => d.ballistic + d.drones + d.cruise));
  return (
    <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-lg p-5 mt-8">
      <h2 className="text-lg font-semibold text-white mb-4">Daily Attack Volume (UAE)</h2>
      <div className="space-y-2">
        {dailyAttackData.map((d) => {
          const total = d.ballistic + d.drones + d.cruise;
          const pct = (total / maxVal) * 100;
          const ballisticPct = (d.ballistic / total) * pct;
          const dronePct = (d.drones / total) * pct;
          const cruisePct = (d.cruise / total) * pct;
          return (
            <div key={d.day} className="flex items-center gap-3">
              <div className="text-zinc-500 text-xs w-16 shrink-0 font-mono">Day {d.day}</div>
              <div className="flex-1 flex h-6 rounded overflow-hidden bg-black/30">
                <div className="bg-red-600/80" style={{ width: `${ballisticPct}%` }} title={`Ballistic: ${d.ballistic}`} />
                <div className="bg-orange-500/80" style={{ width: `${dronePct}%` }} title={`Drones: ${d.drones}`} />
                {cruisePct > 0 && (
                  <div className="bg-purple-500/80" style={{ width: `${cruisePct}%` }} title={`Cruise: ${d.cruise}`} />
                )}
              </div>
              <div className="text-zinc-400 text-xs w-12 text-right font-mono">{total}</div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3 text-xs text-zinc-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-600/80 rounded" /> Ballistic</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500/80 rounded" /> Drones</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500/80 rounded" /> Cruise</span>
      </div>
    </div>
  );
}

function GCCDistribution() {
  const countries = [
    { code: "🇦🇪", name: "UAE", count: 1668, pct: 57.4 },
    { code: "🇰🇼", name: "Kuwait", count: 651, pct: 22.4 },
    { code: "🇧🇭", name: "Bahrain", count: 259, pct: 8.9 },
    { code: "🇶🇦", name: "Qatar", count: 194, pct: 6.7 },
    { code: "🇸🇦", name: "KSA", count: 124, pct: 4.3 },
    { code: "🇴🇲", name: "Oman", count: 8, pct: 0.3 },
  ];
  return (
    <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-lg p-5 mt-8">
      <h2 className="text-lg font-semibold text-white mb-4">GCC Attack Distribution (Total: 2,904)</h2>
      <div className="space-y-2">
        {countries.map((c) => (
          <div key={c.name} className="flex items-center gap-3">
            <div className="text-lg w-8">{c.code}</div>
            <div className="text-white text-sm w-16">{c.name}</div>
            <div className="flex-1 h-5 rounded overflow-hidden bg-black/30">
              <div
                className={c.name === "Oman" ? "bg-green-600/60 h-full" : c.pct > 20 ? "bg-red-600/60 h-full" : "bg-yellow-600/60 h-full"}
                style={{ width: `${c.pct}%` }}
              />
            </div>
            <div className="text-zinc-400 text-xs w-20 text-right font-mono">
              {c.count.toLocaleString()} ({c.pct}%)
            </div>
          </div>
        ))}
      </div>
      <p className="text-zinc-500 text-xs mt-3">Source: Ibrahim Jalal (@IbrahimJalalYE) — Mar 9, 05:30 GST</p>
    </div>
  );
}

function MarketTicker() {
  const markets = [
    { label: "WTI Crude", value: "$109.75", change: "+20.7%", bad: true },
    { label: "Brent", value: "$109.15", change: "+17.8%", bad: true },
    { label: "Gold", value: "$5,108", change: "-1.2%", bad: false },
    { label: "VIX", value: "29.49", change: "+39%", bad: true },
    { label: "Fear/Greed", value: "12/100", change: "Extreme Fear", bad: true },
    { label: "Dow Futures", value: "—", change: "-848 pts", bad: true },
  ];
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {markets.map((m) => (
        <div key={m.label} className="bg-zinc-900/80 border border-zinc-800 rounded px-3 py-2 text-center">
          <div className="text-zinc-500 text-[10px] uppercase tracking-wider">{m.label}</div>
          <div className="text-white font-mono text-sm">{m.value}</div>
          <div className={`text-xs font-mono ${m.bad ? "text-red-400" : "text-green-400"}`}>{m.change}</div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <OverallBanner />
        <MarketTicker />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
        <TriggerTable />
        <AttackChart />
        <GCCDistribution />
        <footer className="mt-12 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-600 text-xs">
            Built for decision-support during the 2026 Iran-Gulf conflict.
            Not official guidance. Sources linked per section.
          </p>
          <p className="text-zinc-700 text-[10px] mt-1">
            Data: UAE MOD, Ibrahim Jalal, CNBC, Bloomberg, Reuters, SitDeck | Updated manually from OSINT
          </p>
        </footer>
      </div>
    </main>
  );
}
