import { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, MessageSquare, Pencil, Search, Trash2 } from 'lucide-react';
import { getClientStatus } from '../lib/metrics';

const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const monthNow = () => today().slice(0, 7);
const formatDate = d => d ? d.split('-').reverse().join('/') : '—';

export default function RelacionamentoView({ clients, purchases, profiles, notes, onAddNote, onEditNote, onDeleteNote, onToggleOverdue }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [draft, setDraft] = useState('');
  const [draftDate, setDraftDate] = useState(today());
  const [editing, setEditing] = useState(null);
  const notesByClient = useMemo(() => {
    const map = new Map();
    notes.forEach(n => { if (!map.has(n.client_id)) map.set(n.client_id, []); map.get(n.client_id).push(n); });
    for (const entries of map.values()) entries.sort((a,b) => (b.note_date || '').localeCompare(a.note_date || ''));
    return map;
  }, [notes]);
  const noObservation = c => !(notesByClient.get(c.id) || []).some(n => (n.note_date || '').slice(0,7) === monthNow());
  const overdueCount = clients.filter(c => c.inadimplente).length;
  const missingCount = clients.filter(noObservation).length;
  const visible = clients.filter(c => {
    const q = search.trim().toLocaleLowerCase('pt-BR');
    if (q && !`${c.name} ${c.company || ''} ${c.segment || ''}`.toLocaleLowerCase('pt-BR').includes(q)) return false;
    if (filter === 'missing') return noObservation(c);
    if (filter === 'overdue') return !!c.inadimplente;
    return true;
  }).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));
  const openClient = id => { setExpanded(v => v === id ? null : id); setDraft(''); setDraftDate(today()); setEditing(null); };
  const save = client => {
    if (!draft.trim() || !draftDate) return;
    if (editing) onEditNote(editing, { note: draft.trim(), note_date: draftDate });
    else onAddNote({ client_id: client.id, profile_id: client.profile_id || null, note: draft.trim(), note_date: draftDate });
    setDraft(''); setDraftDate(today()); setEditing(null);
  };
  const startEdit = note => { setEditing(note.id); setDraft(note.note); setDraftDate(note.note_date || today()); };
  return <section className="space-y-5">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full max-w-lg"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"/><input className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 outline-none focus:border-cyan-500/50" placeholder="Buscar cliente, empresa ou segmento..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div className="flex flex-wrap gap-2 text-sm"><button onClick={()=>setFilter('all')} className={`rounded-lg border px-3 py-2 ${filter==='all'?'pulse-filter-active border-cyan-400/50 bg-cyan-500/15 text-cyan-200':'border-white/10 text-slate-300'}`}>Todos ({clients.length})</button><button onClick={()=>setFilter('overdue')} className={`rounded-lg border px-3 py-2 ${filter==='overdue'?'pulse-filter-active border-orange-400/50 bg-orange-500/15 text-orange-200':'border-white/10 text-orange-300'}`}>{overdueCount} inadimplentes</button><button onClick={()=>setFilter('missing')} className={`rounded-lg border px-3 py-2 ${filter==='missing'?'pulse-filter-active border-amber-400/50 bg-amber-500/15 text-amber-200':'border-white/10 text-amber-300'}`}>{missingCount} sem obs. este mês</button></div>
    </div>
    <div className="space-y-2">{visible.map(client => {
      const clientNotes = notesByClient.get(client.id) || [];
      const missing = noObservation(client);
      const isOpen = expanded === client.id;
      const owner = profiles.find(p=>p.id===client.profile_id);
      return <div key={client.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045]">
        <button onClick={()=>openClient(client.id)} className="flex w-full items-center gap-3 p-4 text-left hover:bg-white/[0.035]">
          {missing ? <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400"/> : <MessageSquare className="h-5 w-5 shrink-0 text-emerald-400"/>}
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{client.name}</span><span className="text-xs text-slate-400">{client.company || ''}</span></div><div className="mt-1 text-xs text-slate-400">{client.segment || 'Sem segmento'} · {owner?.name || 'Sem responsável'}</div></div>
          <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">{missing && <span className="rounded-md bg-amber-500/15 px-2 py-1 text-xs text-amber-300">Sem obs. este mês</span>}{client.inadimplente && <span className="rounded-md bg-orange-500/15 px-2 py-1 text-xs text-orange-300">Inadimplente</span>}<span className="rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300">{getClientStatus(client.id,purchases)}</span><span className="text-xs text-slate-400">{clientNotes.length} obs.</span></div>
          {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-400"/> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400"/>}
        </button>
        {isOpen && <div className="space-y-4 border-t border-white/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-sm text-slate-400">Status: <strong className="text-white">{getClientStatus(client.id,purchases)}</strong></span><label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={!!client.inadimplente} onChange={()=>onToggleOverdue(client.id)} className="h-4 w-4 accent-orange-500"/> Cliente inadimplente</label></div>
          <div className="space-y-2">{clientNotes.length===0 && <p className="text-sm text-slate-400">Nenhuma observação registrada.</p>}{clientNotes.map(n=><div key={n.id} className="flex gap-3 rounded-xl border border-white/10 bg-slate-950/30 p-3"><div className="min-w-0 flex-1"><div className="mb-1 text-xs text-slate-400">{formatDate(n.note_date)}</div><p className="whitespace-pre-wrap break-words text-sm">{n.note}</p></div><button title="Editar observação" onClick={()=>startEdit(n)} className="self-start rounded-lg p-2 text-amber-300 hover:bg-white/10"><Pencil className="h-4 w-4"/></button><button title="Excluir observação" onClick={()=>{if(confirm('Excluir esta observação?')) {onDeleteNote(n.id); if(editing===n.id){setEditing(null);setDraft('');}}}} className="self-start rounded-lg p-2 text-rose-300 hover:bg-white/10"><Trash2 className="h-4 w-4"/></button></div>)}</div>
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.025] p-4"><h3 className="font-semibold">{editing?'Editar observação':'Nova observação'}</h3><textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={3} placeholder="Registre o contato ou acompanhamento realizado..." className="w-full resize-y rounded-lg border border-white/10 bg-slate-950/50 p-3 text-sm outline-none focus:border-cyan-500/50"/><div className="flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm text-slate-400">Data <input type="date" value={draftDate} onChange={e=>setDraftDate(e.target.value)} className="rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-white"/></label><div className="flex gap-2">{editing && <button onClick={()=>{setEditing(null);setDraft('');setDraftDate(today());}} className="rounded-lg border border-white/10 px-4 py-2 text-sm">Cancelar</button>}<button disabled={!draft.trim() || !draftDate} onClick={()=>save(client)} className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{editing?'Salvar alterações':'Adicionar observação'}</button></div></div></div>
        </div>}
      </div>;
    })}{visible.length===0 && <div className="rounded-xl border border-white/10 p-10 text-center text-slate-400">Nenhum cliente encontrado.</div>}</div>
  </section>;
}
