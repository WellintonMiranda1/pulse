import {useMemo,useState} from 'react';
import {Trophy,Crown,Medal,TrendingUp,TrendingDown,Target,ShoppingBag,Users,CalendarDays,ArrowUpRight,BarChart3,Sparkles,Star,Zap,Award,Flame,Minus,ChevronUp} from 'lucide-react';
import {BarChart,Bar,CartesianGrid,XAxis,YAxis,Tooltip,ResponsiveContainer} from 'recharts';
import {formatBRL} from '../lib/currency';

const currentMonth=()=>new Date().toLocaleDateString('en-CA').slice(0,7);
const labelMonth=m=>new Date(`${m}-02T12:00:00`).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
const pct=(n,d)=>d>0?n/d*100:0;
const rankText=['text-amber-300','text-slate-200','text-orange-300'];
const Avatar=({profile,className=''})=><div className={`relative flex shrink-0 items-center justify-center overflow-hidden ${className}`}>{profile?.avatar?<img src={profile.avatar} alt={`Foto de ${profile.name}`} className="absolute inset-0 h-full w-full object-cover"/>:<span>{profile?.name?.charAt(0)||'—'}</span>}</div>;
const tooltipStyle={background:'#111c30',border:'1px solid #334155',borderRadius:12,color:'#fff'};
const monthShift=(m,delta)=>{const [y,mo]=m.split('-').map(Number);const d=new Date(y,mo-1+delta,1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`};
const diffPct=(now,prev)=>prev>0?((now-prev)/prev)*100:null;
const trendIcon=v=>v==null?<Minus size={13}/>:v>0?<TrendingUp size={13}/>:v<0?<TrendingDown size={13}/>:<Minus size={13}/>;
const formatMetricGap=(metric,value)=>metric==='revenue'?formatBRL(Math.abs(value)):metric==='achievement'?`${Math.abs(value).toFixed(1).replace('.',',')} p.p.`:String(Math.abs(Math.round(value)));

export default function RankingView({profiles,clients,purchases,goals,selectedProfile}){
 const [month,setMonth]=useState(currentMonth());
 const [period,setPeriod]=useState('month');
 const [metric,setMetric]=useState('revenue');
 const [view,setView]=useState('all');
 const months=useMemo(()=>{
   const arr=[];const [y,m]=month.split('-').map(Number);
   for(let i=5;i>=0;i--){const d=new Date(y,m-1-i,1);arr.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`)}
   return arr;
 },[month]);
 const periodMonths=period==='month'?[month]:period==='quarter'?(()=>{const [y,m]=month.split('-').map(Number);const start=Math.floor((m-1)/3)*3+1;return [0,1,2].map(i=>`${y}-${String(start+i).padStart(2,'0')}`)})():months;
 const previousMonths=periodMonths.map(m=>monthShift(m,-periodMonths.length));
 const relevant=purchases.filter(p=>periodMonths.includes(String(p.date||'').slice(0,7)));
 const previousRelevant=purchases.filter(p=>previousMonths.includes(String(p.date||'').slice(0,7)));
 const startMonth=periodMonths[0],endMonth=periodMonths[periodMonths.length-1];
 const activeProfiles=profiles.filter(p=>p.active!==false);

 const rows=activeProfiles.map(p=>{
   const sales=relevant.filter(v=>v.profile_id===p.id);
   const previousSales=previousRelevant.filter(v=>v.profile_id===p.id);
   const revenue=sales.reduce((s,v)=>s+Number(v.amount||0),0);
   const prevRevenue=previousSales.reduce((s,v)=>s+Number(v.amount||0),0);
   const uniqueClients=new Set(sales.map(v=>v.client_id)).size;
   const newSales=sales.filter(v=>{const first=[...purchases].filter(a=>a.client_id===v.client_id).sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.id).localeCompare(String(b.id)))[0];return first?.id===v.id});
   const newRevenue=newSales.reduce((sum,v)=>sum+Number(v.amount||0),0);
   const goal=goals.filter(g=>g.profile_id===p.id&&g.month>=startMonth&&g.month<=endMonth).reduce((s,g)=>s+Number(g.goal_amount||0),0);
   return {profile:p,revenue,prevRevenue,growth:diffPct(revenue,prevRevenue),count:sales.length,uniqueClients,firstSales:newSales.length,newRevenue,goal,achievement:pct(revenue,goal),ticket:sales.length?revenue/sales.length:0};
 });

 const monthlyRows=activeProfiles.map(profile=>{
   const sales=purchases.filter(v=>v.profile_id===profile.id&&String(v.date||'').slice(0,7)===month);
   const prevSales=purchases.filter(v=>v.profile_id===profile.id&&String(v.date||'').slice(0,7)===monthShift(month,-1));
   const revenue=sales.reduce((a,v)=>a+Number(v.amount||0),0),prevRevenue=prevSales.reduce((a,v)=>a+Number(v.amount||0),0);
   const goal=goals.find(g=>g.profile_id===profile.id&&g.month===month);const target=Number(goal?.goal_amount||0);
   const newSales=sales.filter(v=>{const first=[...purchases].filter(a=>a.client_id===v.client_id).sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.id).localeCompare(String(b.id)))[0];return first?.id===v.id});
   return {profile,revenue,prevRevenue,growth:diffPct(revenue,prevRevenue),target,achievement:pct(revenue,target),newCount:newSales.length,newRevenue:newSales.reduce((a,v)=>a+Number(v.amount||0),0),count:sales.length,ticket:sales.length?revenue/sales.length:0};
 });

 const historicalSales=useMemo(()=>{
   const ordered=[...purchases].filter(v=>v.client_id&&v.profile_id).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||String(a.id||'').localeCompare(String(b.id||'')));
   const firstIds=new Set();const seen=new Set();
   for(const sale of ordered){const key=String(sale.client_id);if(!seen.has(key)){seen.add(key);firstIds.add(sale.id)}}
   return {firstIds};
 },[purchases]);
 const allTimeRows=activeProfiles.map(profile=>{
   const sales=purchases.filter(v=>v.profile_id===profile.id);
   const revenue=sales.reduce((sum,v)=>sum+Number(v.amount||0),0);
   const first=sales.filter(v=>historicalSales.firstIds.has(v.id));
   const newRevenue=first.reduce((sum,v)=>sum+Number(v.amount||0),0);
   return {profile,revenue,count:sales.length,ticket:sales.length?revenue/sales.length:0,newCount:first.length,newRevenue};
 });
 const allTimeSorted=[...allTimeRows].sort((a,b)=>b.revenue-a.revenue||b.count-a.count||a.profile.name.localeCompare(b.profile.name,'pt-BR'));
 const firstTimeSorted=[...allTimeRows].sort((a,b)=>b.newCount-a.newCount||b.newRevenue-a.newRevenue||a.profile.name.localeCompare(b.profile.name,'pt-BR'));
 const totalHistorical=allTimeRows.reduce((sum,r)=>sum+r.revenue,0);
 const totalFirstTime=allTimeRows.reduce((sum,r)=>sum+r.newRevenue,0);
 const metaLeaders=[...monthlyRows].filter(r=>r.target>0).sort((a,b)=>b.achievement-a.achievement||b.revenue-a.revenue).slice(0,5);
 const newLeaders=[...monthlyRows].filter(r=>r.newCount>0).sort((a,b)=>b.newRevenue-a.newRevenue||b.newCount-a.newCount).slice(0,5);
 const sorted=[...rows].sort((a,b)=>b[metric]-a[metric]||b.revenue-a.revenue||a.profile.name.localeCompare(b.profile.name,'pt-BR'));
 const total=rows.reduce((s,r)=>s+r.revenue,0),totalSales=rows.reduce((s,r)=>s+r.count,0),totalGoals=rows.reduce((s,r)=>s+r.goal,0);
 const leader=sorted[0];
 const second=sorted[1];
 const closestPair=useMemo(()=>{if(rows.length<2)return null;const byRevenue=[...rows].sort((a,b)=>b.revenue-a.revenue);let best=null;for(let i=0;i<byRevenue.length-1;i++){const gap=Math.abs(byRevenue[i].revenue-byRevenue[i+1].revenue);if(!best||gap<best.gap)best={a:byRevenue[i],b:byRevenue[i+1],gap};}return best;},[rows]);
 const bestGrowth=[...monthlyRows].filter(r=>r.growth!=null).sort((a,b)=>b.growth-a.growth)[0];
 const bestTicket=[...rows].sort((a,b)=>b.ticket-a.ticket)[0];
 const bestNew=[...rows].sort((a,b)=>b.firstSales-a.firstSales||b.newRevenue-a.newRevenue)[0];
 const bestGoal=[...rows].filter(r=>r.goal>0).sort((a,b)=>b.achievement-a.achievement)[0];
 const goalsHit=rows.filter(r=>r.goal>0&&r.achievement>=100).length;
 const graph=months.map(m=>({month:new Date(`${m}-02T12:00:00`).toLocaleDateString('pt-BR',{month:'short'}).replace('.',''),...Object.fromEntries(activeProfiles.map(p=>[p.id,purchases.filter(v=>v.profile_id===p.id&&String(v.date||'').slice(0,7)===m).reduce((s,v)=>s+Number(v.amount||0),0)]))}));
 const shown=selectedProfile&&view==='mine'?sorted.filter(r=>r.profile.id===selectedProfile.id):sorted;
 const metrics=[{key:'revenue',label:'Faturamento'},{key:'count',label:'Vendas'},{key:'firstSales',label:'Novos clientes'},{key:'achievement',label:'Atingimento da meta'}];
 const metricValue=r=>metric==='revenue'?formatBRL(r.revenue):metric==='achievement'?(r.goal?`${r.achievement.toFixed(1).replace('.',',')}%`:'Sem meta'):String(r[metric]);
 const periodLabel=period==='month'?labelMonth(month):period==='quarter'?'trimestre de referência':'6 meses até '+labelMonth(month);

 return <section className="space-y-6">
   <div className="pulse-ranking-hero relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#132a4e] via-[#0e1d32] to-[#070f1c] p-6 sm:p-7">
     <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"/>
     <div className="relative flex flex-wrap items-start justify-between gap-5"><div><div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.22em] text-cyan-300"><Sparkles size={15}/> Pulse Intelligence / Comercial</div><h2 className="mt-2 text-3xl font-black tracking-tight">Ranking Comercial</h2><p className="mt-2 text-sm text-slate-400">Performance, disputa e evolução da equipe em um só painel.</p></div><div className="flex flex-wrap items-center gap-2"><label className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"><CalendarDays size={16}/><input type="month" aria-label="Mês de referência" value={month} onChange={e=>setMonth(e.target.value)} className="w-[135px] bg-transparent outline-none [color-scheme:dark]"/></label><select aria-label="Período" value={period} onChange={e=>setPeriod(e.target.value)} className="rounded-xl border border-white/15 bg-[#17263d] px-3 py-2 text-sm"><option value="month">Mensal</option><option value="quarter">Trimestre</option><option value="six">Últimos 6 meses</option></select></div></div>
     <div className="relative mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
       <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4"><div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Líder atual</div><div className="mt-2 flex items-center gap-3"><Crown size={22} className="text-amber-300"/><div><div className="font-bold">{leader?.profile.name||'—'}</div><div className="text-xs text-slate-400">{leader?formatBRL(leader.revenue):'Sem vendas'}</div></div></div></div>
       <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4"><div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Disputa mais apertada</div><div className="mt-2 font-bold">{closestPair?`${closestPair.a.profile.name} × ${closestPair.b.profile.name}`:'—'}</div><div className="mt-1 text-xs text-cyan-300">{closestPair?`${formatBRL(closestPair.gap)} de diferença`:'Sem comparação'}</div></div>
       <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4"><div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Maior evolução</div><div className="mt-2 flex items-center gap-2 font-bold"><TrendingUp size={18} className="text-emerald-300"/>{bestGrowth?.profile.name||'—'}</div><div className="mt-1 text-xs text-emerald-300">{bestGrowth?.growth!=null?`${bestGrowth.growth>=0?'+':''}${bestGrowth.growth.toFixed(1).replace('.',',')}% vs mês anterior`:'Sem histórico'}</div></div>
       <div className="rounded-2xl border border-white/10 bg-white/[.055] p-4"><div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Metas batidas</div><div className="mt-2 flex items-center gap-2 text-2xl font-black"><Target size={20} className="text-blue-300"/>{goalsHit}<span className="text-sm font-medium text-slate-500">/ {rows.filter(r=>r.goal>0).length}</span></div><div className="mt-1 text-xs text-slate-400">consultores acima de 100%</div></div>
     </div>
   </div>

   <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-bold">Pódio de desempenho</h3><p className="mt-1 text-xs text-slate-400">Classificação por {metrics.find(x=>x.key===metric)?.label.toLowerCase()} · {periodLabel}</p></div><div className="flex flex-wrap gap-2"><select aria-label="Critério do ranking" value={metric} onChange={e=>setMetric(e.target.value)} className="rounded-xl border border-white/10 bg-[#19263a] px-3 py-2.5 text-sm">{metrics.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}</select>{selectedProfile&&<button onClick={()=>setView(v=>v==='all'?'mine':'all')} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">{view==='all'?'Ver meu resultado':'Ver equipe'}</button>}</div></div>

   <div className="grid items-end gap-4 md:grid-cols-3 md:gap-5">
     {[1,0,2].map((place)=>{
       const r=sorted[place];
       const gap=r?place===0&&second?r[metric]-second[metric]:place>0&&leader?leader[metric]-r[metric]:0:0;
       const palette=place===0?'pulse-podium-first border-amber-400/45 from-[#513a16] via-[#252230] to-[#141a28]':place===1?'border-slate-300/30 from-[#2a3448] to-[#141c2b]':'border-orange-400/30 from-[#3a2927] to-[#151a27]';
       return <div key={place} className={`pulse-podium relative flex flex-col items-center overflow-hidden rounded-[28px] border bg-gradient-to-b ${palette} px-5 pt-7 text-center shadow-2xl ${place===0?'min-h-[390px] md:min-h-[455px] md:-translate-y-4':'min-h-[345px] md:min-h-[385px]'}`}>
         <div className={`absolute -top-14 h-44 w-44 rounded-full blur-3xl ${place===0?'bg-amber-400/25':place===1?'bg-slate-200/10':'bg-orange-400/10'}`}/>
         {place===0&&<div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[.16em] text-amber-300"><Star size={11}/> Top seller</div>}
         <div className={`relative mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 ${rankText[place]}`}>{place===0?<Crown size={29}/>:<Medal size={27}/>}</div>
         <div className="relative"><Avatar profile={r?.profile} className={`relative rounded-full border-4 bg-slate-800 font-bold shadow-lg ${place===0?'h-28 w-28 border-amber-400/65 text-4xl':'h-20 w-20 border-white/25 text-3xl'}`}/>{r?.goal>0&&<div className="absolute -bottom-2 -right-2 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#111c2c] text-[10px] font-black text-emerald-300 shadow-lg" style={{background:`conic-gradient(#34d399 ${Math.min(100,r.achievement)}%, #1e293b 0)`}}><span className="grid h-8 w-8 place-items-center rounded-full bg-[#111c2c]">{Math.round(r.achievement)}%</span></div>}</div>
         <div className={`mt-5 text-xs font-black uppercase tracking-[.2em] ${rankText[place]}`}>{place+1}º LUGAR</div>
         <h4 className="mt-1 text-xl font-extrabold">{r?.profile.name||'Aguardando vendedor'}</h4>
         <p className={`mt-2 text-2xl font-black ${rankText[place]}`}>{r?metricValue(r):'—'}</p>
         <div className="mt-3 flex flex-wrap justify-center gap-2 text-[11px]"><span className="rounded-full border border-white/10 bg-white/[.05] px-2.5 py-1 text-slate-300">{r?`${r.count} vendas`:'—'}</span><span className="rounded-full border border-white/10 bg-white/[.05] px-2.5 py-1 text-slate-300">{r?`${r.uniqueClients} clientes`:'—'}</span>{r&&<span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 ${r.growth==null?'border-white/10 text-slate-400':r.growth>=0?'border-emerald-400/20 bg-emerald-400/[.07] text-emerald-300':'border-rose-400/20 bg-rose-400/[.07] text-rose-300'}`}>{trendIcon(r.growth)}{r.growth==null?'sem histórico':`${r.growth>=0?'+':''}${r.growth.toFixed(1).replace('.',',')}%`}</span>}</div>
         {r&&gap!==0&&<div className="mt-4 text-xs text-slate-400">{place===0?'À frente do 2º':'Distância do líder'}: <strong className="text-white">{formatMetricGap(metric,gap)}</strong></div>}
         <div className="mt-auto w-full pt-6"><div className={`flex h-14 items-center justify-center rounded-t-xl border-t border-white/15 text-3xl font-black ${place===0?'bg-amber-400/20 text-amber-300':place===1?'bg-slate-200/10 text-slate-200':'bg-orange-400/15 text-orange-300'}`}>{place+1}</div></div>
       </div>
     })}
   </div>

   <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
     {[{title:'Maior ticket médio',row:bestTicket,icon:Award,value:bestTicket?formatBRL(bestTicket.ticket):'—',sub:bestTicket?.profile.name},{title:'Mais clientes novos',row:bestNew,icon:Users,value:bestNew?`${bestNew.firstSales} novo(s)`:'—',sub:bestNew?.profile.name},{title:'Maior evolução',row:bestGrowth,icon:Flame,value:bestGrowth?.growth!=null?`${bestGrowth.growth>=0?'+':''}${bestGrowth.growth.toFixed(1).replace('.',',')}%`:'—',sub:bestGrowth?.profile.name},{title:'Melhor meta',row:bestGoal,icon:Target,value:bestGoal?`${bestGoal.achievement.toFixed(1).replace('.',',')}%`:'—',sub:bestGoal?.profile.name}].map(x=><div key={x.title} className="rounded-2xl border border-white/10 bg-[#101a29]/80 p-4"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500"><span>{x.title}</span><x.icon size={16} className="text-cyan-300"/></div><div className="mt-3 text-xl font-black">{x.value}</div><div className="mt-1 text-xs text-slate-400">{x.sub||'Sem dados'}</div></div>)}
   </div>

   <div className="grid gap-5 lg:grid-cols-2">
     <div className="pulse-ranking-panel rounded-2xl border border-white/10 bg-[#192538] p-5 sm:p-6"><div className="mb-5 flex items-center gap-2"><TrendingUp size={19} className="text-emerald-400"/><div><h3 className="font-bold">Top 5 — Meta Atingida (Mês)</h3><p className="mt-1 text-xs text-slate-400">{labelMonth(month)} · percentual da meta individual</p></div></div><div className="space-y-3">{metaLeaders.map((r,i)=><div key={r.profile.id} className={`flex items-center gap-3 rounded-xl border p-3.5 ${i===0?'border-amber-400/35 bg-amber-400/10':i===1?'border-slate-300/20 bg-white/[.06]':i===2?'border-orange-400/20 bg-orange-400/[.07]':'border-white/10 bg-white/[.03]'}`}><div className={`w-7 shrink-0 text-center font-black ${rankText[Math.min(i,2)]}`}>{i<3?<Trophy size={21}/>:i+1}</div><Avatar profile={r.profile} className="h-10 w-10 rounded-full border border-white/20 bg-slate-700 font-bold"/><div className="min-w-0 flex-1"><div className="truncate font-semibold">{r.profile.name}</div><div className="mt-1 text-xs text-slate-400">{formatBRL(r.revenue)} / {formatBRL(r.target)}</div></div><span className={`rounded-lg px-2.5 py-1 text-sm font-bold ${r.achievement>=100?'bg-emerald-500/15 text-emerald-300':'bg-blue-500/20 text-blue-300'}`}>{r.achievement.toFixed(1).replace('.',',')}%</span></div>)}{!metaLeaders.length&&<div className="rounded-xl border border-dashed border-white/15 p-7 text-center text-sm text-slate-400">Nenhuma meta cadastrada para este mês.</div>}</div></div>
     <div className="pulse-ranking-panel rounded-2xl border border-white/10 bg-[#192538] p-5 sm:p-6"><div className="mb-5 flex items-center gap-2"><Users size={19} className="text-cyan-400"/><div><h3 className="font-bold">Top 5 — Vendas de Clientes Novos (Mês)</h3><p className="mt-1 text-xs text-slate-400">Primeira compra de cada cliente · {labelMonth(month)}</p></div></div><div className="space-y-3">{newLeaders.map((r,i)=><div key={r.profile.id} className={`flex items-center gap-3 rounded-xl border p-3.5 ${i===0?'border-amber-400/35 bg-amber-400/10':i===1?'border-slate-300/20 bg-white/[.06]':i===2?'border-orange-400/20 bg-orange-400/[.07]':'border-white/10 bg-white/[.03]'}`}><div className={`w-7 shrink-0 text-center font-black ${rankText[Math.min(i,2)]}`}>{i<3?<Trophy size={21}/>:i+1}</div><Avatar profile={r.profile} className="h-10 w-10 rounded-full border border-white/20 bg-slate-700 font-bold"/><div className="min-w-0 flex-1"><div className="truncate font-semibold">{r.profile.name}</div><div className="mt-1 text-xs text-slate-400">{r.newCount} cliente(s) novo(s)</div></div><span className="font-bold text-emerald-400">{formatBRL(r.newRevenue)}</span></div>)}{!newLeaders.length&&<div className="rounded-xl border border-dashed border-white/15 p-7 text-center text-sm text-slate-400">Nenhuma primeira compra neste mês.</div>}</div></div>
   </div>

   <div className="grid gap-5 xl:grid-cols-2">
     <div className="overflow-hidden rounded-2xl border border-blue-400/20 bg-[#111b2b]/80">
       <div className="flex items-center justify-between border-b border-white/10 px-5 py-5"><div><div className="flex items-center gap-2"><Trophy size={19} className="text-amber-300"/><h3 className="text-lg font-bold">Ranking geral · Histórico completo</h3></div><p className="mt-1 text-xs text-slate-400">Todas as vendas, recompras e reativações · desde o primeiro registro</p></div></div>
       <div className="grid grid-cols-2 gap-3 border-b border-white/10 bg-blue-500/[.04] px-5 py-4"><div><p className="text-[11px] uppercase tracking-wider text-slate-400">Faturamento acumulado</p><p className="mt-1 text-xl font-black text-blue-200">{formatBRL(totalHistorical)}</p></div><div><p className="text-[11px] uppercase tracking-wider text-slate-400">Líder histórico</p><p className="mt-1 text-lg font-bold">{allTimeSorted[0]?.revenue>0?allTimeSorted[0].profile.name:'—'}</p></div></div>
       <div className="overflow-x-auto"><div className="min-w-[540px]"><div className="grid grid-cols-[40px_1.3fr_1fr_55px_1fr] gap-2 border-b border-white/[.06] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500"><span>Pos.</span><span>Consultor</span><span>Faturamento</span><span>Vendas</span><span>Ticket médio</span></div>
       {allTimeSorted.map((r,i)=><div key={r.profile.id} className="grid grid-cols-[40px_1.3fr_1fr_55px_1fr] items-center gap-2 border-b border-white/[.05] px-4 py-4 transition hover:bg-white/[.04]"><span className={`font-black ${i===0?'text-amber-300':i===1?'text-slate-300':i===2?'text-orange-300':'text-slate-500'}`}>{String(i+1).padStart(2,'0')}</span><div className="flex min-w-0 items-center gap-2"><Avatar profile={r.profile} className="h-9 w-9 rounded-lg bg-blue-500/15 font-bold text-blue-200"/><span className="truncate text-sm font-semibold">{r.profile.name}</span></div><span className="text-sm font-bold">{formatBRL(r.revenue)}</span><span className="text-sm">{r.count}</span><span className="text-xs text-slate-300">{formatBRL(r.ticket)}</span></div>)}
       {!allTimeSorted.length&&<p className="p-5 text-sm text-slate-400">Nenhum consultor cadastrado.</p>}</div></div>
     </div>
     <div className="overflow-hidden rounded-2xl border border-emerald-400/20 bg-[#111b2b]/80">
       <div className="flex items-center justify-between border-b border-white/10 px-5 py-5"><div><div className="flex items-center gap-2"><Users size={19} className="text-emerald-300"/><h3 className="text-lg font-bold">Ranking de novas vendas</h3></div><p className="mt-1 text-xs text-slate-400">Somente a primeira compra de cada cliente · histórico completo</p></div></div>
       <div className="grid grid-cols-2 gap-3 border-b border-white/10 bg-emerald-500/[.04] px-5 py-4"><div><p className="text-[11px] uppercase tracking-wider text-slate-400">Primeiras compras</p><p className="mt-1 text-xl font-black text-emerald-300">{allTimeRows.reduce((sum,r)=>sum+r.newCount,0)} <span className="text-xs font-normal text-slate-400">clientes</span></p></div><div><p className="text-[11px] uppercase tracking-wider text-slate-400">Faturamento de novas vendas</p><p className="mt-1 text-lg font-bold">{formatBRL(totalFirstTime)}</p></div></div>
       <div className="overflow-x-auto"><div className="min-w-[540px]"><div className="grid grid-cols-[40px_1.3fr_80px_1fr_1fr] gap-2 border-b border-white/[.06] px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500"><span>Pos.</span><span>Consultor</span><span>Clientes</span><span>Faturamento</span><span>Ticket inicial</span></div>
       {firstTimeSorted.map((r,i)=><div key={r.profile.id} className="grid grid-cols-[40px_1.3fr_80px_1fr_1fr] items-center gap-2 border-b border-white/[.05] px-4 py-4 transition hover:bg-white/[.04]"><span className={`font-black ${i===0?'text-amber-300':i===1?'text-slate-300':i===2?'text-orange-300':'text-slate-500'}`}>{String(i+1).padStart(2,'0')}</span><div className="flex min-w-0 items-center gap-2"><Avatar profile={r.profile} className="h-9 w-9 rounded-lg bg-emerald-500/10 font-bold text-emerald-200"/><span className="truncate text-sm font-semibold">{r.profile.name}</span></div><span className="text-sm font-bold text-emerald-300">{r.newCount}</span><span className="text-sm font-bold">{formatBRL(r.newRevenue)}</span><span className="text-xs text-slate-300">{formatBRL(r.newCount?r.newRevenue/r.newCount:0)}</span></div>)}
       {!firstTimeSorted.length&&<p className="p-5 text-sm text-slate-400">Nenhum consultor cadastrado.</p>}</div></div>
     </div>
   </div>
   <div className="rounded-2xl border border-white/10 bg-[#111b2b]/80 p-5"><div className="flex items-center justify-between"><div><h3 className="text-lg font-bold">Evolução comercial</h3><p className="mt-1 text-xs text-slate-400">Faturamento por consultor · 6 meses</p></div><BarChart3 size={19} className="text-blue-300"/></div><div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={graph} margin={{top:10,right:0,left:-20,bottom:0}}><CartesianGrid stroke="#334155" strokeOpacity={.3} vertical={false}/><XAxis dataKey="month" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v}/><Tooltip contentStyle={tooltipStyle} formatter={(v,n)=>[formatBRL(v),profiles.find(p=>p.id===n)?.name||n]}/>{activeProfiles.map((p,i)=><Bar key={p.id} dataKey={p.id} stackId="sales" fill={['#3b82f6','#22d3ee','#a78bfa','#f59e0b','#34d399'][i%5]} radius={i===activeProfiles.length-1?[4,4,0,0]:[0,0,0,0]}/>)}</BarChart></ResponsiveContainer></div><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{activeProfiles.map((p,i)=><span key={p.id} className="flex items-center gap-1.5 text-xs text-slate-400"><span className="h-2 w-2 rounded-full" style={{background:['#3b82f6','#22d3ee','#a78bfa','#f59e0b','#34d399'][i%5]}}/>{p.name}</span>)}</div></div>

   <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#182f58] via-[#111e35] to-[#0b1222] p-6 sm:p-8"><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-300"><Sparkles size={15}/> Resumo do período</div><div className="relative mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><div className="flex justify-between text-sm text-slate-300">Faturamento <TrendingUp size={17}/></div><div className="mt-3 text-2xl font-bold sm:text-3xl">{formatBRL(total)}</div><div className="mt-2 text-xs text-slate-400">Vendas realizadas no período</div></div><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><div className="flex justify-between text-sm text-slate-300">Vendas <ShoppingBag size={17}/></div><div className="mt-3 text-3xl font-bold">{totalSales}</div><div className="mt-2 text-xs text-slate-400">{totalSales?`Ticket médio ${formatBRL(total/totalSales)}`:'Nenhuma venda registrada'}</div></div><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><div className="flex justify-between text-sm text-slate-300">Metas <Target size={17}/></div><div className="mt-3 text-3xl font-bold">{totalGoals?`${pct(total,totalGoals).toFixed(1).replace('.',',')}%`:'—'}</div><div className="mt-2 text-xs text-slate-400">{totalGoals?`Objetivo ${formatBRL(totalGoals)}`:'Sem metas neste período'}</div></div></div></div>

   <div className="rounded-2xl border border-cyan-400/15 bg-cyan-500/[.05] p-5"><div className="flex items-start gap-3"><ArrowUpRight className="mt-0.5 shrink-0 text-cyan-300" size={19}/><div><div className="font-semibold">Como calculamos este ranking</div><p className="mt-1 text-sm leading-relaxed text-slate-400">Cada venda é atribuída ao consultor registrado na compra, mesmo após uma transferência de carteira. “Novos clientes” conta a primeira compra de cada cliente, independentemente da origem, dentro do período selecionado. Os dois quadros de classificação histórica não dependem do filtro de período: o ranking geral considera todas as vendas registradas, e o ranking de novas vendas atribui cada primeira compra ao consultor que a realizou. O atingimento usa somente metas cadastradas para o mesmo período. Não há pontuação artificial nem projeções misturadas com vendas reais.</p></div></div></div>
 </section>;
}
