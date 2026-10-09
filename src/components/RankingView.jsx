import {useMemo,useState} from 'react';
import {Trophy,Crown,Medal,TrendingUp,Target,ShoppingBag,Users,CalendarDays,ArrowUpRight,BarChart3,Sparkles} from 'lucide-react';
import {BarChart,Bar,CartesianGrid,XAxis,YAxis,Tooltip,ResponsiveContainer,Cell} from 'recharts';
import {formatBRL} from '../lib/currency';

const currentMonth=()=>new Date().toLocaleDateString('en-CA').slice(0,7);
const labelMonth=m=>new Date(`${m}-02T12:00:00`).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
const pct=(n,d)=>d>0?n/d*100:0;
const rankColors=['from-amber-400/25 to-amber-700/5','from-slate-300/20 to-slate-500/5','from-orange-400/20 to-orange-800/5'];
const rankText=['text-amber-300','text-slate-200','text-orange-300'];
const rankBorder=['border-amber-400/30','border-slate-300/25','border-orange-400/25'];
const Avatar=({profile,className=''})=><div className={`relative flex shrink-0 items-center justify-center overflow-hidden ${className}`}>{profile?.avatar?<img src={profile.avatar} alt={`Foto de ${profile.name}`} className="absolute inset-0 h-full w-full object-cover"/>:<span>{profile?.name?.charAt(0)||'—'}</span>}</div>;
const tooltipStyle={background:'#111c30',border:'1px solid #334155',borderRadius:12,color:'#fff'};
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
 const relevant=purchases.filter(p=>period==='month'?String(p.date||'').slice(0,7)===month:period==='quarter'?(()=>{const [y,m]=month.split('-').map(Number);const d=String(p.date||'').slice(0,7);const [py,pm]=d.split('-').map(Number);return py===y&&Math.floor((pm-1)/3)===Math.floor((m-1)/3)})():months.includes(String(p.date||'').slice(0,7)));
 const startMonth=period==='month'?month:period==='quarter'?(()=>{const [y,m]=month.split('-').map(Number);return `${y}-${String(Math.floor((m-1)/3)*3+1).padStart(2,'0')}`})():months[0];
 const endMonth=period==='month'?month:period==='quarter'?(()=>{const [y,m]=month.split('-').map(Number);return `${y}-${String(Math.floor((m-1)/3)*3+3).padStart(2,'0')}`})():month;
 const rows=profiles.filter(p=>p.active!==false).map(p=>{
   const sales=relevant.filter(v=>v.profile_id===p.id);
   const revenue=sales.reduce((s,v)=>s+Number(v.amount||0),0);
   const uniqueClients=new Set(sales.map(v=>v.client_id)).size;
   const firstSales=sales.filter(v=>{
     const earliest=purchases.filter(a=>a.client_id===v.client_id).sort((a,b)=>String(a.date).localeCompare(String(b.date)))[0];
     return earliest?.id===v.id&&clients.some(c=>c.id===v.client_id&&['lead','prospeccao','prospect','prospecting'].includes(String(c.origin||'').toLowerCase()));
   }).length;
   const newSales=sales.filter(v=>{const first=[...purchases].filter(a=>a.client_id===v.client_id).sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.id).localeCompare(String(b.id)))[0];return first?.id===v.id&&clients.some(c=>c.id===v.client_id&&['lead','prospeccao','prospect','prospecting'].includes(String(c.origin||'').toLowerCase()))});
   const newRevenue=newSales.reduce((sum,v)=>sum+Number(v.amount||0),0);
   const goal=goals.filter(g=>g.profile_id===p.id&&g.month>=startMonth&&g.month<=endMonth).reduce((s,g)=>s+Number(g.goal_amount||0),0);
   return {profile:p,revenue,count:sales.length,uniqueClients,firstSales:newSales.length,newRevenue,goal,achievement:pct(revenue,goal),ticket:sales.length?revenue/sales.length:0};
 });
 const monthlyRows=profiles.filter(p=>p.active!==false).map(profile=>{
   const sales=purchases.filter(v=>v.profile_id===profile.id&&String(v.date||'').slice(0,7)===month);
   const revenue=sales.reduce((a,v)=>a+Number(v.amount||0),0);
   const goal=goals.find(g=>g.profile_id===profile.id&&g.month===month);
   const target=Number(goal?.goal_amount||0);
   const newSales=sales.filter(v=>{
     const first=[...purchases].filter(a=>a.client_id===v.client_id).sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.id).localeCompare(String(b.id)))[0];
     return first?.id===v.id&&clients.some(c=>c.id===v.client_id&&['lead','prospeccao','prospect','prospecting'].includes(String(c.origin||'').toLowerCase()));
   });
   return {profile,revenue,target,achievement:pct(revenue,target),newCount:newSales.length,newRevenue:newSales.reduce((a,v)=>a+Number(v.amount||0),0)};
 });
 const metaLeaders=[...monthlyRows].filter(r=>r.target>0).sort((a,b)=>b.achievement-a.achievement||b.revenue-a.revenue).slice(0,5);
 const newLeaders=[...monthlyRows].filter(r=>r.newCount>0).sort((a,b)=>b.newRevenue-a.newRevenue||b.newCount-a.newCount).slice(0,5);
 const sorted=[...rows].sort((a,b)=>b[metric]-a[metric]||b.revenue-a.revenue||a.profile.name.localeCompare(b.profile.name,'pt-BR'));
 const total=rows.reduce((s,r)=>s+r.revenue,0), totalSales=rows.reduce((s,r)=>s+r.count,0), totalGoals=rows.reduce((s,r)=>s+r.goal,0);
 const leader=sorted[0];
 const graph=months.map(m=>({month:new Date(`${m}-02T12:00:00`).toLocaleDateString('pt-BR',{month:'short'}).replace('.',''),...Object.fromEntries(profiles.map(p=>[p.id,purchases.filter(v=>v.profile_id===p.id&&String(v.date||'').slice(0,7)===m).reduce((s,v)=>s+Number(v.amount||0),0)]))}));
 const shown=selectedProfile&&view==='mine'?sorted.filter(r=>r.profile.id===selectedProfile.id):sorted;
 const metrics=[{key:'revenue',label:'Faturamento'},{key:'count',label:'Vendas'},{key:'firstSales',label:'Novos clientes (leads)'},{key:'achievement',label:'Atingimento da meta'}];
 const metricValue=r=>metric==='revenue'?formatBRL(r.revenue):metric==='achievement'?(r.goal?`${r.achievement.toFixed(1).replace('.',',')}%`:'Sem meta'):String(r[metric]);
 return <section className="space-y-6">
   <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#15233a] p-5"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Pulse Intelligence / Comercial</div><h2 className="mt-2 text-2xl font-bold">Ranking Comercial</h2></div><div className="flex flex-wrap items-center gap-2"><label className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm"><CalendarDays size={16}/><input type="month" aria-label="Mês de referência" value={month} onChange={e=>setMonth(e.target.value)} className="w-[135px] bg-transparent outline-none [color-scheme:dark]"/></label><select aria-label="Período" value={period} onChange={e=>setPeriod(e.target.value)} className="rounded-xl border border-white/15 bg-[#17263d] px-3 py-2 text-sm"><option value="month">Mensal</option><option value="quarter">Trimestre</option><option value="six">Últimos 6 meses</option></select></div></div>
   <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-bold">Pódio de desempenho</h3><p className="mt-1 text-xs text-slate-400">Classificação por {metrics.find(x=>x.key===metric)?.label.toLowerCase()} · {period==='month'?labelMonth(month):period==='quarter'?'trimestre de referência':'6 meses até '+labelMonth(month)}</p></div><div className="flex flex-wrap gap-2"><select aria-label="Critério do ranking" value={metric} onChange={e=>setMetric(e.target.value)} className="rounded-xl border border-white/10 bg-[#19263a] px-3 py-2.5 text-sm">{metrics.map(m=><option key={m.key} value={m.key}>{m.label}</option>)}</select>{selectedProfile&&<button onClick={()=>setView(v=>v==='all'?'mine':'all')} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">{view==='all'?'Ver meu resultado':'Ver equipe'}</button>}</div></div>
   <div className="grid items-end gap-4 md:grid-cols-3 md:gap-5">
     {[1,0,2].map((place)=>{
       const r=sorted[place];const palette=place===0?'border-amber-400/40 from-[#4a381c] to-[#181d2a]':place===1?'border-slate-300/30 from-[#2b3548] to-[#171e2c]':'border-orange-400/30 from-[#3a2a26] to-[#181b28]';
       return <div key={place} className={`pulse-podium relative flex flex-col items-center overflow-hidden rounded-[26px] border bg-gradient-to-b ${palette} px-5 pt-7 text-center shadow-2xl ${place===0?'min-h-[350px] md:min-h-[415px] md:-translate-y-3':'min-h-[315px] md:min-h-[350px]'}`}>
         <div className={`absolute -top-14 h-40 w-40 rounded-full blur-3xl ${place===0?'bg-amber-400/20':place===1?'bg-slate-200/10':'bg-orange-400/10'}`}/>
         <div className={`relative mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 ${rankText[place]}`}>{place===0?<Crown size={29}/>:<Medal size={27}/>}</div>
         <Avatar profile={r?.profile} className={`relative rounded-full border-4 bg-slate-800 font-bold shadow-lg ${place===0?'h-24 w-24 border-amber-400/60 text-4xl':'h-20 w-20 border-white/25 text-3xl'}`}/>
         <div className={`mt-4 text-xs font-black uppercase tracking-[.2em] ${rankText[place]}`}>{place+1}º LUGAR</div>
         <h4 className="mt-1 text-xl font-extrabold">{r?.profile.name||'Aguardando vendedor'}</h4>
         <p className={`mt-2 text-2xl font-black ${rankText[place]}`}>{r?metricValue(r):'—'}</p>
         <p className="mt-2 text-xs text-slate-400">{r?`${r.count} venda(s) · ${r.uniqueClients} cliente(s)`:'Sem participantes'}</p>
         <div className="mt-auto w-full pt-6"><div className={`flex h-14 items-center justify-center rounded-t-xl border-t border-white/15 text-3xl font-black ${place===0?'bg-amber-400/20 text-amber-300':place===1?'bg-slate-200/10 text-slate-200':'bg-orange-400/15 text-orange-300'}`}>{place+1}</div></div>
       </div>
     })}
   </div>
   <div className="grid gap-5 lg:grid-cols-2">
     <div className="pulse-ranking-panel rounded-2xl border border-white/10 bg-[#192538] p-5 sm:p-6"><div className="mb-5 flex items-center gap-2"><TrendingUp size={19} className="text-emerald-400"/><div><h3 className="font-bold">Top 5 — Meta Atingida (Mês)</h3><p className="mt-1 text-xs text-slate-400">{labelMonth(month)} · percentual da meta individual</p></div></div><div className="space-y-3">{metaLeaders.map((r,i)=><div key={r.profile.id} className={`flex items-center gap-3 rounded-xl border p-3.5 ${i===0?'border-amber-400/35 bg-amber-400/10':i===1?'border-slate-300/20 bg-white/[.06]':i===2?'border-orange-400/20 bg-orange-400/[.07]':'border-white/10 bg-white/[.03]'}`}><div className={`w-7 shrink-0 text-center font-black ${rankText[Math.min(i,2)]}`}>{i<3?<Trophy size={21}/>:i+1}</div><Avatar profile={r.profile} className="h-10 w-10 rounded-full border border-white/20 bg-slate-700 font-bold"/><div className="min-w-0 flex-1"><div className="truncate font-semibold">{r.profile.name}</div><div className="mt-1 text-xs text-slate-400">{formatBRL(r.revenue)} / {formatBRL(r.target)}</div></div><span className="rounded-lg bg-blue-500/20 px-2.5 py-1 text-sm font-bold text-blue-300">{r.achievement.toFixed(1).replace('.',',')}%</span></div>)}{!metaLeaders.length&&<div className="rounded-xl border border-dashed border-white/15 p-7 text-center text-sm text-slate-400">Nenhuma meta cadastrada para este mês.</div>}</div></div>
     <div className="pulse-ranking-panel rounded-2xl border border-white/10 bg-[#192538] p-5 sm:p-6"><div className="mb-5 flex items-center gap-2"><Users size={19} className="text-cyan-400"/><div><h3 className="font-bold">Top 5 — Vendas de Clientes Novos (Mês)</h3><p className="mt-1 text-xs text-slate-400">Primeira compra de leads e prospecções · {labelMonth(month)}</p></div></div><div className="space-y-3">{newLeaders.map((r,i)=><div key={r.profile.id} className={`flex items-center gap-3 rounded-xl border p-3.5 ${i===0?'border-amber-400/35 bg-amber-400/10':i===1?'border-slate-300/20 bg-white/[.06]':i===2?'border-orange-400/20 bg-orange-400/[.07]':'border-white/10 bg-white/[.03]'}`}><div className={`w-7 shrink-0 text-center font-black ${rankText[Math.min(i,2)]}`}>{i<3?<Trophy size={21}/>:i+1}</div><Avatar profile={r.profile} className="h-10 w-10 rounded-full border border-white/20 bg-slate-700 font-bold"/><div className="min-w-0 flex-1"><div className="truncate font-semibold">{r.profile.name}</div><div className="mt-1 text-xs text-slate-400">{r.newCount} cliente(s) novo(s)</div></div><span className="font-bold text-emerald-400">{formatBRL(r.newRevenue)}</span></div>)}{!newLeaders.length&&<div className="rounded-xl border border-dashed border-white/15 p-7 text-center text-sm text-slate-400">Nenhuma primeira venda de lead ou prospecção neste mês.</div>}</div></div>
   </div>
   <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111b2b]/80"><div className="flex items-center justify-between border-b border-white/10 px-5 py-5"><div><h3 className="text-lg font-bold">Classificação completa</h3><p className="mt-1 text-xs text-slate-400">O ranking é recalculado a partir das vendas registradas</p></div><Trophy size={19} className="text-amber-300"/></div><div className="divide-y divide-white/[.06]">{shown.map(r=>{const position=sorted.indexOf(r)+1;return <div key={r.profile.id} className="flex items-center gap-3 px-5 py-4 hover:bg-white/[.03]"><div className="w-8 text-lg font-bold text-slate-400">{String(position).padStart(2,'0')}</div><Avatar profile={r.profile} className="h-10 w-10 rounded-xl bg-blue-500/15 font-bold text-blue-200"/><div className="min-w-0 flex-1"><div className="truncate font-semibold">{r.profile.name}</div><div className="mt-1 text-xs text-slate-400">{r.count} venda(s) · {r.firstSales} novo(s) lead(s) comprador(es)</div></div><div className="text-right"><div className="font-bold text-white">{metricValue(r)}</div><div className="mt-1 text-xs text-slate-400">{r.goal?`${r.achievement.toFixed(0)}% da meta`:'Sem meta'}</div></div></div>})}</div></div>
    <div className="rounded-2xl border border-white/10 bg-[#111b2b]/80 p-5"><div className="flex items-center justify-between"><div><h3 className="text-lg font-bold">Evolução comercial</h3><p className="mt-1 text-xs text-slate-400">Faturamento por consultor · 6 meses</p></div><BarChart3 size={19} className="text-blue-300"/></div><div className="mt-6 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={graph} margin={{top:10,right:0,left:-20,bottom:0}}><CartesianGrid stroke="#334155" strokeOpacity={.3} vertical={false}/><XAxis dataKey="month" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>v>=1000?`${(v/1000).toFixed(0)}k`:v}/><Tooltip contentStyle={tooltipStyle} formatter={(v,n)=>[formatBRL(v),profiles.find(p=>p.id===n)?.name||n]}/>{profiles.map((p,i)=><Bar key={p.id} dataKey={p.id} stackId="sales" fill={['#3b82f6','#22d3ee','#a78bfa','#f59e0b','#34d399'][i%5]} radius={i===profiles.length-1?[4,4,0,0]:[0,0,0,0]}/>)}</BarChart></ResponsiveContainer></div><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{profiles.map((p,i)=><span key={p.id} className="flex items-center gap-1.5 text-xs text-slate-400"><span className="h-2 w-2 rounded-full" style={{background:['#3b82f6','#22d3ee','#a78bfa','#f59e0b','#34d399'][i%5]}}/>{p.name}</span>)}</div></div>
   </div>
   <div className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#182f58] via-[#111e35] to-[#0b1222] p-6 sm:p-8"><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-300"><Sparkles size={15}/> Resumo do período</div>    <div className="relative mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><div className="flex justify-between text-sm text-slate-300">Faturamento <TrendingUp size={17}/></div><div className="mt-3 text-2xl font-bold sm:text-3xl">{formatBRL(total)}</div><div className="mt-2 text-xs text-slate-400">Vendas realizadas no período</div></div><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><div className="flex justify-between text-sm text-slate-300">Vendas <ShoppingBag size={17}/></div><div className="mt-3 text-3xl font-bold">{totalSales}</div><div className="mt-2 text-xs text-slate-400">{totalSales?`Ticket médio ${formatBRL(total/totalSales)}`:'Nenhuma venda registrada'}</div></div><div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><div className="flex justify-between text-sm text-slate-300">Metas <Target size={17}/></div><div className="mt-3 text-3xl font-bold">{totalGoals?`${pct(total,totalGoals).toFixed(1).replace('.',',')}%`:'—'}</div><div className="mt-2 text-xs text-slate-400">{totalGoals?`Objetivo ${formatBRL(totalGoals)}`:'Sem metas neste período'}</div></div></div>
</div>
   <div className="rounded-2xl border border-cyan-400/15 bg-cyan-500/[.05] p-5"><div className="flex items-start gap-3"><ArrowUpRight className="mt-0.5 shrink-0 text-cyan-300" size={19}/><div><div className="font-semibold">Como calculamos este ranking</div><p className="mt-1 text-sm leading-relaxed text-slate-400">Cada venda é atribuída ao consultor registrado na compra, mesmo após uma transferência de carteira. “Novos clientes (leads e prospecção)” conta a primeira compra de clientes com origem Lead ou Prospecção, dentro do período selecionado. O atingimento usa somente metas cadastradas para o mesmo período. Não há pontuação artificial nem projeções misturadas com vendas reais.</p></div></div></div>
 </section>;
}
