
import {useMemo,useState} from 'react';
import {Target,Plus,Pencil,Trash2,TrendingUp,CalendarDays,CheckCircle2,ArrowUpRight,Users} from 'lucide-react';
import Modal from './Modal';
import {formatBRL,parseBRL} from '../lib/currency';

const nowMonth=()=>new Date().toLocaleDateString('en-CA').slice(0,7);
const monthLabel=m=>new Date(`${m}-02T12:00:00`).toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
const pct=(a,b)=>b>0?a/b*100:0;
const clamp=n=>Math.min(100,Math.max(0,n));
const bar=(value,color='bg-blue-500')=><div className="h-2.5 overflow-hidden rounded-full bg-white/10"><div className={`h-full rounded-full ${color} transition-all duration-500`} style={{width:`${clamp(value)}%`}}/></div>;
export default function GoalsView({goals,purchases,profiles,selectedProfile,onSave,onDelete}){
 const [month,setMonth]=useState(nowMonth());
 const [open,setOpen]=useState(false);
 const [editing,setEditing]=useState(null);
 const [profileId,setProfileId]=useState('');
 const [amount,setAmount]=useState('');
 const [notes,setNotes]=useState('');
 const visible=selectedProfile?profiles.filter(p=>p.id===selectedProfile.id):profiles;
 const goalRows=visible.map(p=>{
   const goal=goals.find(g=>g.profile_id===p.id&&g.month===month);
   const actual=purchases.filter(v=>v.profile_id===p.id&&String(v.date||'').slice(0,7)===month).reduce((s,v)=>s+Number(v.amount||0),0);
   return {profile:p,goal,actual,target:Number(goal?.goal_amount||0)};
 });
 const target=goalRows.reduce((s,r)=>s+r.target,0), actual=goalRows.reduce((s,r)=>s+r.actual,0),percent=pct(actual,target),missing=Math.max(0,target-actual);
 const achieved=goalRows.filter(r=>r.target>0&&r.actual>=r.target).length;
 const edit=(r)=>{
   setEditing(r.goal?.id||null);setProfileId(r.profile.id);setAmount(r.goal?String(r.target):'');setNotes(r.goal?.notes||'');setOpen(true);
 };
 const save=e=>{
   e.preventDefault();const n=parseBRL(amount);
   if(!profileId||!Number.isFinite(n)||n<=0){alert('Informe um perfil e uma meta válida, maior que zero.');return;}
   onSave({profile_id:profileId,month,goal_amount:n,notes},editing);
   setOpen(false);
 };
 const formatMonth=monthLabel(month);
 return <section className="space-y-6">
   <div className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-[#142d56] via-[#111e34] to-[#0b1323] p-6 shadow-[0_20px_70px_rgba(0,0,0,.16)] sm:p-8">
     <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"/>
     <div className="relative flex flex-wrap items-start justify-between gap-5">
       <div><div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-blue-300"><Target size={16}/> Performance comercial</div><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Metas & Resultados</h2><p className="mt-2 max-w-xl text-sm text-slate-300">Acompanhe a evolução das vendas e o desempenho de cada consultor.</p></div>
       <label className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-slate-200"><CalendarDays size={17}/><input aria-label="Mês de referência" type="month" value={month} onChange={e=>setMonth(e.target.value)} className="w-[135px] bg-transparent text-white outline-none [color-scheme:dark]"/></label>
     </div>
     <div className="relative mt-9 grid gap-6 lg:grid-cols-[1fr_250px] lg:items-end">
       <div><p className="text-sm text-slate-300">Vendas realizadas · {formatMonth}</p><div className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">{formatBRL(actual)}</div><p className="mt-2 text-sm text-slate-400">de {formatBRL(target)} em metas cadastradas</p><div className="mt-6">{bar(percent,'bg-gradient-to-r from-blue-500 to-cyan-400')}</div><div className="mt-3 flex justify-between text-xs text-slate-400"><span>{target?`${percent.toFixed(1).replace('.',',')}% da meta`:'Cadastre uma meta para começar'}</span><span>{percent>=100?'Meta alcançada':'100% objetivo'}</span></div></div>
       <div className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><p className="text-xs uppercase tracking-widest text-slate-400">Falta para a meta</p><div className="mt-3 text-2xl font-bold text-white">{formatBRL(missing)}</div><div className="mt-3 flex items-center gap-2 text-xs text-slate-300">{percent>=100&&target>0?<><CheckCircle2 size={15} className="text-emerald-400"/>Objetivo alcançado</>:<><ArrowUpRight size={15} className="text-blue-300"/>Continue avançando</>}</div></div>
     </div>
   </div>
   <div className="grid gap-3 sm:grid-cols-3">
     {[{label:'Meta total',value:formatBRL(target),icon:Target,sub:'Objetivo do mês'},{label:'Atingimento',value:target?`${percent.toFixed(1).replace('.',',')}%`:'—',icon:TrendingUp,sub:'Vendas / objetivo'},{label:'Metas alcançadas',value:`${achieved} / ${goalRows.filter(r=>r.target>0).length}`,icon:CheckCircle2,sub:'Consultores com meta'}].map(x=><div key={x.label} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><div className="flex items-center justify-between text-sm text-slate-400"><span>{x.label}</span><x.icon size={18} className="text-blue-300"/></div><div className="mt-4 text-2xl font-bold">{x.value}</div><div className="mt-1 text-xs text-slate-500">{x.sub}</div></div>)}
   </div>
   <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111b2b]/75">
     <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5 sm:px-6"><div><h3 className="flex items-center gap-2 text-lg font-bold"><Users size={18} className="text-blue-300"/> Desempenho por consultor</h3><p className="mt-1 text-xs text-slate-400">Metas individuais · {formatMonth}</p></div><button onClick={()=>{const r=goalRows.find(x=>!x.goal)||goalRows[0];if(r)edit(r)}} disabled={!goalRows.length} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold hover:bg-blue-500 disabled:opacity-40"><Plus size={17}/> {selectedProfile?'Definir meta':'Adicionar meta'}</button></div>
     <div className="divide-y divide-white/[.07]">
       {goalRows.map(r=><div key={r.profile.id} className="px-5 py-5 sm:px-6">
         <div className="flex flex-wrap items-center gap-4">
           <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/15 text-lg font-bold text-blue-200">{r.profile.name[0]}</div>
           <div className="min-w-[140px] flex-1"><div className="font-semibold">{r.profile.name}</div><p className="mt-1 text-xs text-slate-400">{r.goal?'Meta definida':'Sem meta cadastrada'}</p></div>
           <div className="text-right"><p className="text-sm font-bold text-white">{formatBRL(r.actual)}</p><p className="mt-1 text-xs text-slate-400">de {formatBRL(r.target)}</p></div>
           <div className="flex gap-1"><button title="Editar meta" onClick={()=>edit(r)} className="rounded-lg p-2.5 text-blue-300 hover:bg-blue-400/10"><Pencil size={17}/></button>{r.goal&&<button title="Excluir meta" onClick={()=>{if(confirm(`Excluir meta de ${r.profile.name} em ${formatMonth}?`))onDelete(r.goal.id)}} className="rounded-lg p-2.5 text-rose-300 hover:bg-rose-400/10"><Trash2 size={17}/></button>}</div>
         </div>
         <div className="mt-4 flex items-center gap-4"><div className="flex-1">{bar(pct(r.actual,r.target),r.target>0&&r.actual>=r.target?'bg-emerald-400':'bg-blue-500')}</div><span className="w-14 text-right text-xs font-semibold text-slate-300">{r.target?`${pct(r.actual,r.target).toFixed(0)}%`:'—'}</span></div>
         {r.goal?.notes&&<p className="mt-3 text-xs text-slate-500">{r.goal.notes}</p>}
       </div>)}
       {!goalRows.length&&<p className="p-8 text-center text-slate-400">Nenhum perfil disponível.</p>}
     </div>
   </div>
   <p className="text-xs text-slate-500">O realizado considera a data e o consultor registrados em cada venda. As metas são mensais e não alteram o histórico de compras.</p>
   <Modal open={open} onClose={()=>setOpen(false)} title={editing?'Editar meta':'Definir meta mensal'}>
     <form onSubmit={save} className="space-y-4">
       <div className="rounded-xl border border-blue-400/10 bg-blue-500/5 px-4 py-3 text-sm text-blue-200">Período: <strong className="capitalize">{formatMonth}</strong></div>
       <label className="block text-sm text-slate-300">Consultor<select value={profileId} disabled={!!editing} onChange={e=>{setProfileId(e.target.value);const g=goals.find(g=>g.profile_id===e.target.value&&g.month===month);setEditing(g?.id||null);setAmount(g?String(g.goal_amount):'');setNotes(g?.notes||'')}} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 p-3">{visible.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
       <label className="block text-sm text-slate-300">Valor da meta (R$)<input required value={amount} onChange={e=>setAmount(e.target.value)} placeholder="75.000,00" inputMode="decimal" className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 p-3"/></label>
       <label className="block text-sm text-slate-300">Observações (opcional)<textarea rows="3" value={notes} onChange={e=>setNotes(e.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 p-3"/></label>
       <div className="flex justify-end gap-2"><button type="button" onClick={()=>setOpen(false)} className="rounded-lg bg-white/10 px-4 py-2">Cancelar</button><button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 font-semibold">Salvar meta</button></div>
     </form>
   </Modal>
 </section>;
}
