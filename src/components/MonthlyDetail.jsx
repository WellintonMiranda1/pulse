import {useMemo,useState} from 'react';
import {ChevronLeft,ChevronRight,Users,UserRound, List,CalendarDays} from 'lucide-react';
import {PieChart,Pie,Cell,ResponsiveContainer,Tooltip} from 'recharts';
import Modal from './Modal';
import {formatBRL} from '../lib/currency';

const monthKey=d=>String(d||'').slice(0,7);
const monthLabel=m=>{const [y,mo]=m.split('-');return `${['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][Number(mo)-1]}/${y}`};
const shift=(m,n)=>{const d=new Date(`${m}-01T12:00:00`);d.setMonth(d.getMonth()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`};
const types=[{key:'lead',name:'Novo (Lead)',color:'#f59e0b'},{key:'prospeccao',name:'Novo (Prospect)',color:'#38bdf8'},{key:'repeat',name:'Recompra',color:'#10b981'},{key:'reactivation',name:'Reativação',color:'#a855f7'},{key:'other',name:'Novo (Outros)',color:'#64748b'}];
function breakdown(clients,purchases,month,profileId){
 const map=new Map(clients.map(c=>[c.id,c]));
 const groups={};types.forEach(t=>groups[t.key]=[]);
 const byClient=new Map();
 for(const p of purchases){if(profileId&&p.profile_id!==profileId)continue;if(!map.has(p.client_id))continue;const arr=byClient.get(p.client_id)||[];arr.push(p);byClient.set(p.client_id,arr)}
 for(const [id,arr] of byClient){arr.sort((a,b)=>String(a.date).localeCompare(String(b.date)));const c=map.get(id);const monthly=arr.filter(p=>monthKey(p.date)===month);if(!monthly.length)continue;
 const firstEver=purchases.filter(p=>p.client_id===id).sort((a,b)=>String(a.date).localeCompare(String(b.date)))[0];
 const firstMonth=monthKey(firstEver?.date)===month;
 const earlier=purchases.filter(p=>p.client_id===id&&p.date<monthly[0].date).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 const gap=earlier.length?(new Date(monthly[0].date)-new Date(earlier[0].date))/86400000:0;
 const kind=firstMonth?(c.origin==='lead'?'lead':c.origin==='prospeccao'?'prospeccao':'other'):(gap>90?'reactivation':'repeat');
 groups[kind].push({id,name:c.company||c.name,amount:monthly.reduce((s,p)=>s+Number(p.amount||0),0),count:monthly.length,profile_id:monthly[0].profile_id});
 }
 return groups;
}
function Donut({groups}){
 const data=types.map(t=>({...t,value:(groups[t.key]||[]).reduce((s,x)=>s+x.amount,0)})).filter(x=>x.value>0);
 const total=data.reduce((s,x)=>s+x.value,0);
 return <div><div className="relative mx-auto h-56 max-w-sm"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.length?data:[{name:'Sem vendas',value:1,color:'#334155'}]} dataKey="value" nameKey="name" innerRadius={58} outerRadius={89} paddingAngle={data.length>1?2:0} stroke="none">{(data.length?data:[{color:'#334155'}]).map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip formatter={v=>formatBRL(v)} contentStyle={{backgroundColor:'#111b2b',color:'#f8fafc',border:'1px solid #475569',borderRadius:10,boxShadow:'0 12px 32px rgba(0,0,0,.35)'}} itemStyle={{color:'#f8fafc',fontWeight:600}} labelStyle={{color:'#e2e8f0',fontWeight:600}}/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-xs text-slate-400">Total</span><strong className="text-lg">{formatBRL(total)}</strong></div></div><div className="flex flex-wrap justify-center gap-x-4 gap-y-2">{data.map(d=><span key={d.key} className="flex items-center gap-1.5 text-xs text-slate-300"><i className="h-2.5 w-2.5 rounded-sm" style={{background:d.color}}/>{d.name} · {(d.value/total*100).toFixed(0)}%</span>)}</div></div>
}
export default function MonthlyDetail({open,onClose,clients,purchases,profiles,selectedProfile}){
 const [month,setMonth]=useState(new Date().toISOString().slice(0,7));
 const [tab,setTab]=useState('general');
 const [consultant,setConsultant]=useState('all');
 const shownProfiles=selectedProfile?profiles.filter(p=>p.id===selectedProfile.id):profiles;
 const relevant=useMemo(()=>selectedProfile?purchases.filter(p=>p.profile_id===selectedProfile.id):purchases,[purchases,selectedProfile]);
 const groups=useMemo(()=>breakdown(clients,relevant,month,consultant==='all'?null:consultant),[clients,relevant,month,consultant]);
 const totalCount=types.reduce((s,t)=>s+groups[t.key].length,0);
 const setDate=m=>{setMonth(m);setConsultant('all')};
 return <Modal open={open} onClose={onClose} title="Evolução Mensal — Detalhado" maxWidth="max-w-5xl">
  <div className="space-y-5">
   <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"><button aria-label="Mês anterior" onClick={()=>setDate(shift(month,-1))} className="rounded-lg bg-white/10 p-2 hover:bg-white/20"><ChevronLeft size={18}/></button><div className="flex items-center gap-3"><input aria-label="Selecionar mês" type="month" value={month} onChange={e=>setDate(e.target.value)} className="rounded-lg border border-white/10 bg-slate-700 px-3 py-2 [color-scheme:dark]"/>{month===new Date().toISOString().slice(0,7)&&<span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">Mês atual</span>}</div><button aria-label="Próximo mês" onClick={()=>setDate(shift(month,1))} className="rounded-lg bg-white/10 p-2 hover:bg-white/20"><ChevronRight size={18}/></button></div>
   <div className="flex flex-wrap gap-2">{[['general',Users,'Geral'],['consultant',UserRound,'Por Consultor'],['clients',List,'Clientes']].map(([key,Icon,label])=><button key={key} onClick={()=>setTab(key)} className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${tab===key?'border-blue-500 bg-blue-600/25 text-white':'border-white/10 bg-white/5 text-slate-300'}`}><Icon size={16}/>{label}</button>)}</div>
   {tab==='general'&&<div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6"><h3 className="mb-3 font-semibold">Distribuição de Valor — {monthLabel(month)}</h3><Donut groups={groups}/></div>}
   {tab==='consultant'&&<div className="grid gap-4 md:grid-cols-2">{shownProfiles.map(p=><div key={p.id} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="mb-3 font-semibold">{p.name}</h3><Donut groups={breakdown(clients,relevant,month,p.id)}/></div>)}</div>}
   {tab==='clients'&&<div className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-3 text-sm text-slate-400">Consultor:<select value={consultant} onChange={e=>setConsultant(e.target.value)} className="min-w-48 rounded-lg border border-white/10 bg-slate-700 p-2 text-white"><option value="all">Todos</option>{shownProfiles.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><span className="text-sm text-slate-400">{totalCount} cliente(s)</span></div>{types.filter(t=>groups[t.key].length).map(t=><div key={t.key}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="rounded-full px-3 py-1 font-semibold" style={{color:t.color,background:`${t.color}22`}}>{t.name} · {groups[t.key].length} cliente(s)</span><strong>{formatBRL(groups[t.key].reduce((s,c)=>s+c.amount,0))}</strong></div><div className="overflow-x-auto"><table className="w-full min-w-[500px] text-sm"><thead className="border-b border-white/10 text-left text-xs uppercase text-slate-400"><tr><th className="py-3">Cliente</th><th className="py-3 text-right">Valor (mês)</th><th className="py-3 text-right">Compras</th></tr></thead><tbody>{groups[t.key].map(c=><tr key={c.id} className="border-b border-white/5"><td className="py-3 font-semibold">{c.name}</td><td className="py-3 text-right font-semibold text-emerald-400">{formatBRL(c.amount)}</td><td className="py-3 text-right">{c.count}</td></tr>)}</tbody></table></div></div>)}{!totalCount&&<p className="py-12 text-center text-slate-400">Nenhuma compra registrada neste mês.</p>}</div>}
  </div>
 </Modal>;
}
