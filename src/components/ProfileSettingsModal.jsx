import { useState } from 'react';
import { Pencil, Power, Trash2, Check, X } from 'lucide-react';
import Modal from './Modal';

export default function ProfileSettingsModal({ open, onClose, profiles, clients, purchases, goals, projections, notes, transferNotifications, onRename, onSetActive, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  if (!open) return null;
  const hasRecords = id => clients.some(x => x.profile_id === id) || purchases.some(x => x.profile_id === id) || goals.some(x => x.profile_id === id) || projections.some(x => x.profile_id === id) || notes.some(x => x.profile_id === id) || transferNotifications.some(x => x.from_profile_id === id || x.to_profile_id === id);
  return <Modal open={open} onClose={onClose} title="Configurações · Perfis" maxWidth="max-w-3xl">
    <p className="mb-5 text-sm text-slate-400">Inativar um perfil oculta seu acesso na seleção inicial, mas mantém todo o histórico de vendas, metas, análises e transferências.</p>
    <div className="space-y-3">{profiles.map(profile => <div key={profile.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 font-bold text-white">{profile.avatar ? <img src={profile.avatar} alt="" className="h-full w-full object-cover"/> : profile.name.slice(0,1).toUpperCase()}</div>
          <div><div className="font-semibold">{profile.name}</div><span className={profile.active === false ? 'text-xs text-amber-400' : 'text-xs text-emerald-400'}>{profile.active === false ? 'Inativo · histórico preservado' : 'Ativo'}</span></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => {setEditing(profile.id);setName(profile.name);setMessage('');}} className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"><Pencil size={15}/> Nome</button>
          <button type="button" onClick={() => { if (profile.active !== false && !window.confirm(`Inativar ${profile.name}? Todo o histórico será preservado.`)) return; onSetActive(profile.id, profile.active === false); setMessage('Status atualizado.'); }} className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"><Power size={15}/>{profile.active === false ? 'Reativar' : 'Inativar'}</button>
          <button type="button" disabled={hasRecords(profile.id)} title={hasRecords(profile.id) ? 'Este perfil possui registros. Inative-o para preservar o histórico.' : 'Excluir perfil sem registros'} onClick={() => {if (!window.confirm(`Excluir definitivamente o perfil vazio ${profile.name}?`)) return; setMessage(onDelete(profile.id) ? 'Perfil excluído.' : 'Não é possível excluir um perfil com histórico.');}} className="flex items-center gap-1 rounded-lg border border-rose-500/30 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-35"><Trash2 size={15}/> Excluir</button>
        </div>
      </div>
      {editing === profile.id && <form className="mt-4 flex gap-2" onSubmit={e => {e.preventDefault(); if(onRename(profile.id,name)){setEditing(null);setMessage('Nome atualizado.');}}}><input autoFocus value={name} onChange={e=>setName(e.target.value)} maxLength={70} required className="min-w-0 flex-1 rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white" aria-label="Novo nome do perfil"/><button type="submit" className="rounded-lg bg-blue-600 px-3 text-white"><Check size={18}/></button><button type="button" onClick={()=>setEditing(null)} className="rounded-lg border border-white/20 px-3"><X size={18}/></button></form>}
      {hasRecords(profile.id) && <p className="mt-3 text-xs text-slate-400">Exclusão bloqueada: existem dados vinculados a este perfil. Use Inativar.</p>}
    </div>)}</div>
    {message && <p role="status" className="mt-4 text-sm text-emerald-400">{message}</p>}
  </Modal>;
}
