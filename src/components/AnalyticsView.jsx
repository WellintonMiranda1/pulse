import MonthlyDetail from './MonthlyDetail';
import {useMemo,useState} from 'react';
import {Users,UserRoundMinus,RefreshCw,RotateCcw,UserRoundPlus,AlertTriangle,Building2,Trophy,Sparkles,TrendingUp,Target} from 'lucide-react';
import {ResponsiveContainer,BarChart,Bar,LineChart,Line,AreaChart,Area,PieChart,Pie,Cell,CartesianGrid,XAxis,YAxis,Tooltip,Legend} from 'recharts';
import {formatBRL} from '../lib/currency';

const DAY=86400000;
const monthKey=d=>String(d||'').slice(0,7);
const dateValue=d=>new Date(`${d}T12:00:00`).getTime();
const currentMonth=()=>new Date().toISOString().slice(0,7);
const moneyShort=v=>v>=1000?`R$${(v/1000).toFixed(0)}k`:`R$${v}`;
const formatMonth=m=>{const [y,mo]=m.split('-');return `${['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][Number(mo)-1]}/${y.slice(2)}`};
const card='rounded-2xl border border-white/10 bg-[#202c3e] p-5 shadow-sm';
const COLORS={new:'#3b82f6',repeat:'#10b981',churn:'#f43f5e',reactivation:'#a855f7'};
const tooltipStyle={backgroundColor:'#101a2a',border:'1px solid #475569',borderRadius:12,color:'#f8fafc',boxShadow:'0 12px 32px rgba(0,0,0,.35)'};
const tooltipText={color:'#f8fafc',fontWeight:600};
const clientName=c=>c.company?.trim()||c.name;
function graphData(clients,purchases,months){
 const byClient=new Map(clients.map(c=>[c.id,[]]));
 for(const p of purchases){if(byClient.has(p.client_id))byClient.get(p.client_id).push(p)}
 for(const arr of byClient.values())arr.sort((a,b)=>dateValue(a.date)-dateValue(b.date));
 return months.map(m=>{
  const end=new Date(`${m}-01T12:00:00`);end.setMonth(end.getMonth()+1);end.setDate(0);
  const endTs=end.getTime();
  let newcomers=0,repeat=0,churn=0,reactivation=0,leads=0,prospects=0,sales=0;
  for(const c of clients){
   const arr=byClient.get(c.id)||[];
   const prior=arr.filter(p=>dateValue(p.date)<=endTs);
   const inMonth=arr.filter(p=>monthKey(p.date)===m);
   sales+=inMonth.reduce((s,p)=>s+Number(p.amount||0),0);
   if(prior.length){
    const first=prior[0];
    const isNew=monthKey(first.date)===m;
    if(isNew){newcomers++;if(c.origin==='lead')leads++;if(c.origin==='prospeccao')prospects++;}
    if(inMonth.length){
      const previous=arr.filter(p=>dateValue(p.date)<dateValue(inMonth[0].date));
      if(previous.length){
       const gap=(dateValue(inMonth[0].date)-dateValue(previous[previous.length-1].date))/DAY;
       if(gap>90)reactivation++;else repeat++;
      }else if(inMonth.length>1){repeat++;}
    }
    const last=prior[prior.length-1];
    const age=(endTs-dateValue(last.date))/DAY;
    const before=new Date(`${m}-01T12:00:00`);before.setDate(0);
    const prev=arr.filter(p=>dateValue(p.date)<=before.getTime());
    const prevAge=prev.length?(before.getTime()-dateValue(prev[prev.length-1].date))/DAY:null;
    if(age>90&&(prevAge===null||prevAge<=90))churn++;
   }
  }
  return {month:m,label:formatMonth(m),newcomers,repeat,churn,reactivation,leads,prospects,sales};
 });
}
function Section({title,icon:Icon,color='#38bdf8',children,subtitle}){
 return <div className={card}><div className="mb-5 flex items-center gap-2"><Icon size={19} style={{color}}/><div><h3 className="font-semibold">{title}</h3>{subtitle&&<p className="mt-1 text-xs text-slate-400">{subtitle}</p>}</div></div>{children}</div>;
}
function ChartBase({children,height=265}){return <div style={{height}} className="w-full"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>}
function RankList({items}){
 const max=Math.max(...items.map(x=>x.value),1);
 return <div className="space-y-4">{items.length?items.map((x,i)=><div key={x.id}>
  <div className="mb-1.5 flex items-center gap-2 text-xs sm:text-sm"><span className="w-5 text-slate-400">{['🥇','🥈','🥉','4º','5º'][i]}</span><Building2 size={14} className="text-slate-400"/><span className="min-w-0 flex-1 truncate font-semibold" title={x.name}>{x.name}</span><span className="text-xs text-slate-500">{x.count} compra(s)</span><strong className="ml-2 whitespace-nowrap text-emerald-400">{formatBRL(x.value)}</strong></div>
  <div className="ml-7 h-2 overflow-hidden rounded-full bg-slate-600/60"><div className="h-full rounded-full" style={{width:`${x.value/max*100}%`,background:['#facc15','#cbd5e1','#fb923c','#60a5fa','#c084fc'][i]}}/></div>
 </div>):<p className="py-8 text-center text-sm text-slate-400">Sem compras registradas.</p>}</div>
}
export default function AnalyticsView({clients,purchases,profiles,selectedProfile}){
 const [range,setRange]=useState(7);
 const [detailOpen,setDetailOpen]=useState(false);
 const scopedClients=useMemo(()=>selectedProfile?clients.filter(c=>c.profile_id===selectedProfile.id):clients,[clients,selectedProfile]);
 const ids=new Set(scopedClients.map(c=>c.id));
 const scopedPurchases=useMemo(()=>purchases.filter(p=>selectedProfile?p.profile_id===selectedProfile.id:ids.has(p.client_id)),[purchases,selectedProfile,clients]);
 const current=currentMonth();
 const months=useMemo(()=>Array.from({length:range},(_,i)=>{const d=new Date(`${current}-01T12:00:00`);d.setMonth(d.getMonth()-(range-1-i));return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`}),[range,current]);
 const series=useMemo(()=>graphData(scopedClients,scopedPurchases,months),[scopedClients,scopedPurchases,months]);
 const month=series[series.length-1];
 const status=useMemo(()=>{
  const now=Date.now();
  let churn=0,active=0;
  for(const c of scopedClients){if(c.perdido){churn++;continue;}const ps=scopedPurchases.filter(p=>p.client_id===c.id).sort((a,b)=>dateValue(b.date)-dateValue(a.date));if(ps.length&&(now-dateValue(ps[0].date))/DAY>90)churn++;else active++;}
  return {churn,active,total:scopedClients.length};
 },[scopedClients,scopedPurchases]);
 const rank=useMemo(()=>{
  const map=new Map(scopedClients.map(c=>[c.id,{id:c.id,name:clientName(c),value:0,count:0}]));
  for(const p of scopedPurchases){const row=map.get(p.client_id);if(row){row.value+=Number(p.amount||0);row.count++}}
  return [...map.values()].filter(r=>r.count).sort((a,b)=>b.value-a.value).slice(0,5);
 },[scopedClients,scopedPurchases]);
 const perConsultant=profiles.filter(p=>!selectedProfile||p.id===selectedProfile.id).map(profile=>{
  const own=scopedClients.filter(c=>c.profile_id===profile.id);
  const list=own.map(c=>{const ps=scopedPurchases.filter(v=>v.client_id===c.id);return {id:c.id,name:clientName(c),value:ps.reduce((s,v)=>s+Number(v.amount||0),0),count:ps.length}}).filter(x=>x.count).sort((a,b)=>b.value-a.value).slice(0,5);
  return {profile,list};
 });
 const churnRate=status.total?status.churn/status.total*100:0;
 const repeatRate=month.newcomers+month.repeat+month.reactivation?month.repeat/(month.newcomers+month.repeat+month.reactivation)*100:0;
 const reactRate=status.churn+month.reactivation?month.reactivation/(status.churn+month.reactivation)*100:0;
 const metrics=[
  {label:'TOTAL DE CLIENTES',value:status.total,detail:`${status.active} ativos`,icon:Users,color:'#3b82f6'},
  {label:'CHURN',value:`${churnRate.toFixed(1)}%`,detail:`${status.churn} clientes`,icon:UserRoundMinus,color:'#f43f5e'},
  {label:'RECOMPRA (ESTE MÊS)',value:`${repeatRate.toFixed(1)}%`,detail:`${month.repeat} clientes`,icon:RefreshCw,color:'#10b981'},
  {label:'REATIVAÇÃO CHURN',value:`${reactRate.toFixed(1)}%`,detail:`${month.reactivation} clientes`,icon:RotateCcw,color:'#a855f7'},
  {label:'NOVOS (ESTE MÊS)',value:month.newcomers,detail:'primeira compra no mês',icon:UserRoundPlus,color:'#06b6d4'}
 ];
 return <section className="space-y-6">
  <div className="flex flex-wrap items-center justify-between gap-3"><div><div className="mb-1 text-xs font-bold uppercase tracking-[.2em] text-cyan-400">Pulse intelligence / Analytics</div><h2 className="text-3xl font-bold tracking-tight">Análise Comercial</h2><p className="mt-1 text-sm text-slate-400">Clientes, churn, evolução de vendas e oportunidades de relacionamento.</p></div><div className="flex items-center gap-3"><select aria-label="Período de análise" value={range} onChange={e=>setRange(Number(e.target.value))} className="rounded-xl border border-white/10 bg-[#202c3e] px-4 py-3 text-sm"><option value={7}>Últimos 7 meses</option><option value={12}>Últimos 12 meses</option><option value={24}>Últimos 24 meses</option></select><span className="flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-400"><AlertTriangle size={16}/> Risco de Churn</span></div></div>
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{metrics.map(m=><div key={m.label} className="rounded-2xl border border-white/10 bg-[#202c3e] p-5"><div className="flex items-start justify-between gap-2"><div className="text-xs font-bold text-slate-400">{m.label}</div><div className="rounded-xl p-2.5" style={{background:m.color}}><m.icon size={20}/></div></div><div className="mt-1 text-3xl font-bold">{m.value}</div><div className="mt-2 text-sm text-slate-400">{m.detail}</div></div>)}</div>
  <div className="grid gap-5 lg:grid-cols-2">
   <Section title="Clientes em Carteira" icon={Users} color="#60a5fa">
    <div className="relative mx-auto h-[245px] max-w-[400px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{name:'Ativos',value:status.active},{name:'Churn',value:status.churn}].filter(d=>d.value>0)} dataKey="value" nameKey="name" innerRadius={73} outerRadius={105} stroke="#202c3e" strokeWidth={3} paddingAngle={status.active&&status.churn?2:0}>{[status.active&&'#10b981',status.churn&&'#f43f5e'].filter(Boolean).map(c=><Cell key={c} fill={c}/>)}</Pie><Tooltip contentStyle={tooltipStyle} itemStyle={tooltipText} labelStyle={tooltipText}/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-xs uppercase tracking-wider text-slate-400">Total</span><strong className="text-4xl font-bold">{status.total}</strong><span className="text-xs text-slate-400">clientes</span></div></div>
    <div className="mt-3 flex flex-wrap items-center justify-center gap-6 text-sm"><div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-emerald-500"/><span>Ativos</span><strong>{status.total?(status.active/status.total*100).toFixed(0):0}%</strong></div><div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-rose-500"/><span>Churn</span><strong>{status.total?(status.churn/status.total*100).toFixed(0):0}%</strong></div></div>
   </Section>
   <div className={card}><div className="mb-5 flex items-center justify-between gap-3"><div className="flex items-center gap-2 font-semibold"><TrendingUp size={19} className="text-emerald-400"/> Evolução Mensal</div><button onClick={()=>setDetailOpen(true)} className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/25"><TrendingUp size={16}/> Detalhado</button></div><ChartBase height={255}><BarChart data={series}><CartesianGrid stroke="#334155" strokeDasharray="3 3"/><XAxis dataKey="label" stroke="#94a3b8" fontSize={11}/><YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false}/><Tooltip contentStyle={tooltipStyle} itemStyle={tooltipText} labelStyle={tooltipText}/><Legend/><Bar dataKey="newcomers" name="Novos" fill={COLORS.new} radius={[4,4,0,0]}/><Bar dataKey="repeat" name="Recompra" fill={COLORS.repeat} radius={[4,4,0,0]}/><Bar dataKey="churn" name="Churn" fill={COLORS.churn} radius={[4,4,0,0]}/><Bar dataKey="reactivation" name="Reativação" fill={COLORS.reactivation} radius={[4,4,0,0]}/></BarChart></ChartBase></div>
  </div>
  <Section title="Novos Churns por Mês" icon={UserRoundMinus} color="#f43f5e"><ChartBase><AreaChart data={series}><defs><linearGradient id="churnGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f43f5e" stopOpacity={.25}/><stop offset="100%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#334155" strokeDasharray="3 3"/><XAxis dataKey="label" stroke="#94a3b8"/><YAxis allowDecimals={false} stroke="#94a3b8"/><Tooltip contentStyle={tooltipStyle} itemStyle={tooltipText} labelStyle={tooltipText}/><Area type="monotone" dot={{r:4,strokeWidth:2,fill:"#202c3e"}} activeDot={{r:6}} dataKey="churn" name="Novos churns" stroke="#f43f5e" fill="url(#churnGrad)" strokeWidth={3}/></AreaChart></ChartBase></Section>
  <Section title="Evolução de Vendas por Mês" icon={TrendingUp} color="#10b981"><ChartBase><AreaChart data={series}><defs><linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={.3}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#334155" strokeDasharray="3 3"/><XAxis dataKey="label" stroke="#94a3b8"/><YAxis tickFormatter={moneyShort} stroke="#94a3b8"/><Tooltip formatter={v=>formatBRL(v)} contentStyle={tooltipStyle}/><Area type="monotone" dot={{r:4,strokeWidth:2,fill:"#202c3e"}} activeDot={{r:6}} dataKey="sales" name="Vendas" stroke="#10b981" fill="url(#salesGrad)" strokeWidth={3}/></AreaChart></ChartBase></Section>
  <Section title="Reativação de Churn (Mensal)" icon={RotateCcw} color="#c084fc"><ChartBase><BarChart data={series}><CartesianGrid stroke="#334155" strokeDasharray="3 3"/><XAxis dataKey="label" stroke="#94a3b8"/><YAxis allowDecimals={false} stroke="#94a3b8"/><Tooltip contentStyle={tooltipStyle} itemStyle={tooltipText} labelStyle={tooltipText}/><Bar dataKey="reactivation" name="Reativação" fill="#a855f7" radius={[4,4,0,0]}/></BarChart></ChartBase></Section>
  <div className="grid gap-5 lg:grid-cols-2">
   <Section title="Conversão de Prospects (Mensal)" icon={Target} color="#f59e0b"><ChartBase height={230}><BarChart data={series}><CartesianGrid stroke="#334155" strokeDasharray="3 3"/><XAxis dataKey="label" stroke="#94a3b8" fontSize={11}/><YAxis allowDecimals={false} stroke="#94a3b8"/><Tooltip contentStyle={tooltipStyle} itemStyle={tooltipText} labelStyle={tooltipText}/><Bar dataKey="prospects" name="Prospects convertidos" fill="#f59e0b" radius={[4,4,0,0]}/></BarChart></ChartBase></Section>
   <Section title="Conversão de Leads (Mensal)" icon={Target} color="#06b6d4"><ChartBase height={230}><BarChart data={series}><CartesianGrid stroke="#334155" strokeDasharray="3 3"/><XAxis dataKey="label" stroke="#94a3b8" fontSize={11}/><YAxis allowDecimals={false} stroke="#94a3b8"/><Tooltip contentStyle={tooltipStyle} itemStyle={tooltipText} labelStyle={tooltipText}/><Bar dataKey="leads" name="Leads convertidos" fill="#06b6d4" radius={[4,4,0,0]}/></BarChart></ChartBase></Section>
  </div>
  <Section title="Lookalike — Top 5 Empresas por Volume" icon={Sparkles} color="#facc15" subtitle="Empresas com maior volume total de compras (histórico geral)"><RankList items={rank}/></Section>
  <div><h3 className="mb-4 flex items-center gap-2 text-lg font-bold"><Trophy size={20} className="text-yellow-400"/> Lookalike por Consultor</h3><div className="grid gap-5 lg:grid-cols-2">{perConsultant.map(({profile,list})=><div key={profile.id} className={card}><div className="mb-5 flex items-center gap-2 font-semibold"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm">{profile.name[0]}</div>{profile.name}</div><RankList items={list}/></div>)}</div></div>
  <MonthlyDetail open={detailOpen} onClose={()=>setDetailOpen(false)} clients={clients} purchases={scopedPurchases} profiles={profiles} selectedProfile={selectedProfile}/>
  <p className="text-xs text-slate-500">Indicadores calculados a partir dos registros disponíveis nesta demonstração. Churn: mais de 90 dias sem compra. Conversões: primeira compra de clientes com origem lead ou prospecção. Reativação: nova compra após intervalo superior a 90 dias. Histórico atribuído ao consultor que registrou a venda.</p>
 </section>
}
