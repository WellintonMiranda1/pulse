
import {useMemo,useState} from 'react';
import {Plus,Pencil,Trash2,RotateCcw,TrendingUp, CalendarDays, CheckCircle2, Search} from 'lucide-react';
import Modal from './Modal';
import MetricCard from './MetricCard';
import {parseBRL,formatBRL} from '../lib/currency';

const statuses={prospecting:'Prospecção',negotiation:'Negociação',proposal:'Proposta',closed_won:'Fechado - ganho',closed_lost:'Fechado - perdido'};
const active=p=>!['closed_won','closed_lost'].includes(p.status);
const monthOf=d=>String(d||'').slice(0,7);
const today=()=>new Date().toLocaleDateString('en-CA');
const initial={client_id:'',client_name:'',expected_amount:'',expected_date:today(),probability:'100',status:'prospecting',notes:''};

export default function SalesProjectionView({projections,clients,purchases,profiles,selectedProfile,onSave,onDelete}){
  const [editing,setEditing]=useState(null);
  const [form,setForm]=useState(initial);
  const [open,setOpen]=useState(false);
  const [filter,setFilter]=useState('active');
  const [search,setSearch]=useState('');
  const [viewMonth,setViewMonth]=useState(today().slice(0,7));
  const month=monthOf(today());
  const next=new Date(`${month}-01T12:00:00`);next.setMonth(next.getMonth()+1);
  const nextMonth=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}`;
  const items=projections.filter(p=>!p.is_lead);
  const openItems=items.filter(active);
  const weighted=m=>openItems.filter(p=>monthOf(p.expected_date)===m).reduce((s,p)=>s+Number(p.expected_amount||0),0);
  const total=openItems.reduce((s,p)=>s+Number(p.expected_amount||0),0);
  const actual=purchases.filter(p=>monthOf(p.date)===month).reduce((s,p)=>s+Number(p.amount||0),0);
  const shown=items.filter(p=>(filter==='active'?active(p):!active(p))&&p.client_name.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>String(a.expected_date).localeCompare(String(b.expected_date)));
  const availableClients=clients.filter(c=>!c.perdido&&(selectedProfile===null||c.profile_id===selectedProfile?.id));
  const start=p=>{
    setEditing(p?.id||null);
    setForm(p?{...p,expected_amount:String(p.expected_amount),probability:'100'}:{...initial});
    setOpen(true);
  };
  const save=e=>{
    e.preventDefault();
    const amount=parseBRL(form.expected_amount),prob=100;
    const name=form.client_id?clients.find(c=>c.id===form.client_id)?.name:form.client_name.trim();
    if(!name||!Number.isFinite(amount)||amount<=0||!form.expected_date){alert('Confira o cliente, valor e data.');return;}
    onSave({...form,client_name:name,expected_amount:amount,probability:prob,client_id:form.client_id||null,is_lead:false},editing);
    setOpen(false);
  };
  return <section className="space-y-5">
    <div className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-[#142d56] via-[#111e34] to-[#0b1323] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"/>
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div><div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-blue-300"><TrendingUp size={16}/> Inteligência comercial</div><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Projeção da Carteira</h2><p className="mt-2 text-sm text-slate-300">Visão das oportunidades comerciais com previsão integral de 100%.</p></div>
        <label className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2"><CalendarDays size={16}/><input aria-label="Mês de previsão" type="month" value={viewMonth} onChange={e=>setViewMonth(e.target.value)} className="bg-transparent text-sm outline-none [color-scheme:dark]"/></label>
      </div>
      <div className="relative mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/[.05] p-5"><p className="text-xs uppercase tracking-widest text-slate-400">Previsão do mês</p><div className="mt-3 text-3xl font-bold">{formatBRL(weighted(viewMonth))}</div><p className="mt-2 text-xs text-slate-400">100% do valor das oportunidades abertas para o período</p></div><div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[.06] p-5"><p className="text-xs uppercase tracking-widest text-cyan-200">Pipeline total</p><div className="mt-3 text-3xl font-bold text-cyan-100">{formatBRL(total)}</div><p className="mt-2 text-xs text-slate-400">Todas as oportunidades em andamento</p></div></div>
    </div>
    <div className="grid gap-3 sm:grid-cols-3">{[{label:'Oportunidades abertas',value:openItems.length,icon:TrendingUp,detail:'Negociações em andamento'},{label:'Vendas realizadas no mês',value:formatBRL(actual),icon:CheckCircle2,detail:'Faturamento registrado'},{label:'Próximo mês',value:formatBRL(weighted(nextMonth)),icon:CalendarDays,detail:'Previsão integral de 100%'}].map(x=><div key={x.label} className="rounded-2xl border border-white/10 bg-white/[.035] p-5"><div className="flex items-center justify-between text-sm text-slate-400"><span>{x.label}</span><x.icon size={18} className="text-blue-300"/></div><p className="mt-4 text-2xl font-bold">{x.value}</p><p className="mt-1 text-xs text-slate-500">{x.detail}</p></div>)}</div>
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111b2b]/75 p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-lg font-semibold">Projeções de Vendas</h2><p className="text-sm text-slate-400">Todos os valores são considerados integralmente (chance fixa de 100%).</p></div>
        <button onClick={()=>start(null)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold hover:bg-blue-500"><Plus size={17}/> Nova projeção</button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={()=>setFilter('active')} className={`rounded-lg px-4 py-2 text-sm ${filter==='active'?'bg-blue-600':'bg-white/10'}`}>Em andamento ({openItems.length})</button>
        <button onClick={()=>setFilter('history')} className={`rounded-lg px-4 py-2 text-sm ${filter==='history'?'bg-blue-600':'bg-white/10'}`}>Histórico ({items.length-openItems.length})</button>
        <input className="ml-auto min-w-[180px] rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm" placeholder="Buscar cliente..." value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-white/10 text-slate-400"><tr><th className="p-3">Cliente / prospect</th><th className="p-3">Valor</th><th className="p-3">Previsão</th><th className="p-3">Probabilidade</th><th className="p-3">Status</th><th className="p-3 text-right">Ações</th></tr></thead><tbody>{shown.map(p=><tr key={p.id} className="border-b border-white/5"><td className="p-3 font-medium">{p.client_name}</td><td className="p-3 text-emerald-300">{formatBRL(p.expected_amount)}</td><td className="p-3">{p.expected_date}</td><td className="p-3">{100}%</td><td className="p-3">{statuses[p.status]||p.status}</td><td className="p-3"><div className="flex justify-end gap-2"><button title="Editar" onClick={()=>start(p)} className="rounded-lg bg-white/10 p-2"><Pencil size={16}/></button>{!active(p)&&<button title="Reabrir" onClick={()=>onSave({...p,status:'prospecting'},p.id)} className="rounded-lg bg-blue-500/15 p-2 text-blue-300"><RotateCcw size={16}/></button>}<button title="Excluir" onClick={()=>{if(confirm(`Excluir projeção de ${p.client_name}?`))onDelete(p.id)}} className="rounded-lg bg-rose-500/10 p-2 text-rose-300"><Trash2 size={16}/></button></div></td></tr>)}{!shown.length&&<tr><td colSpan="6" className="p-8 text-center text-slate-500">Nenhuma projeção encontrada.</td></tr>}</tbody></table></div>
    </div>
    <Modal open={open} onClose={()=>setOpen(false)} title={editing?'Editar projeção':'Nova projeção'}>
      <form onSubmit={save} className="space-y-4">
        <label className="block text-sm text-slate-300">Vincular cliente (opcional)<select value={form.client_id||''} onChange={e=>setForm(f=>({...f,client_id:e.target.value}))} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 p-3"><option value="">Prospect não cadastrado</option>{availableClients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        {!form.client_id&&<label className="block text-sm text-slate-300">Nome do prospect *<input required value={form.client_name} onChange={e=>setForm(f=>({...f,client_name:e.target.value}))} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 p-3"/></label>}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-slate-300">Valor previsto (R$) *<input required placeholder="2.000,50" value={form.expected_amount} onChange={e=>setForm(f=>({...f,expected_amount:e.target.value}))} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 p-3"/></label>
          <label className="text-sm text-slate-300">Data prevista *<input required type="date" value={form.expected_date} onChange={e=>setForm(f=>({...f,expected_date:e.target.value}))} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 p-3"/></label>
          <label className="text-sm text-slate-300">Probabilidade (%)<div className="mt-1 rounded-lg border border-blue-400/20 bg-blue-500/10 p-3 font-semibold text-blue-200">100% · fixo</div></label>
          <label className="text-sm text-slate-300">Status<select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 p-3">{Object.entries(statuses).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
        </div>
        <label className="block text-sm text-slate-300">Observações<textarea rows="3" value={form.notes||''} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 p-3"/></label>
        <div className="flex justify-end gap-2"><button type="button" onClick={()=>setOpen(false)} className="rounded-lg bg-white/10 px-4 py-2">Cancelar</button><button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 font-semibold">Salvar projeção</button></div>
      </form>
    </Modal>
  </section>;
}
