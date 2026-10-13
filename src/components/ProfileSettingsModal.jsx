import { useState } from 'react';
import { Pencil, Power, Trash2, Check, X, KeyRound, UserPlus, ShieldCheck } from 'lucide-react';
import Modal from './Modal';

export default function ProfileSettingsModal({
  open, onClose, profiles, adminAuth, clients, purchases, goals, projections, notes, transferNotifications,
  onUpdateAdminAccess, onCreateProfile, onUpdateProfileAccess, onRename, onSetActive, onDelete
}) {
  const [editingName, setEditingName] = useState(null);
  const [editingAccess, setEditingAccess] = useState(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('ok');
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '' });
  const [adminUsername, setAdminUsername] = useState(adminAuth?.username || 'Geral');
  const [adminPassword, setAdminPassword] = useState('');

  if (!open) return null;

  const showMessage = (result) => {
    setMessage(result?.message || (result?.ok ? 'Atualizado com sucesso.' : 'Não foi possível concluir.'));
    setMessageType(result?.ok ? 'ok' : 'error');
    return Boolean(result?.ok);
  };

  const hasRecords = id => clients.some(x => x.profile_id === id) || purchases.some(x => x.profile_id === id) || goals.some(x => x.profile_id === id) || projections.some(x => x.profile_id === id) || notes.some(x => x.profile_id === id) || transferNotifications.some(x => x.from_profile_id === id || x.to_profile_id === id);

  const submitAdmin = event => {
    event.preventDefault();
    const result = onUpdateAdminAccess({ username: adminUsername, password: adminPassword });
    if (showMessage(result)) setAdminPassword('');
  };

  const submitNewUser = event => {
    event.preventDefault();
    const result = onCreateProfile(newUser);
    if (showMessage(result)) setNewUser({ name: '', username: '', password: '' });
  };

  return <Modal open={open} onClose={onClose} title="Configurações · Usuários" maxWidth="max-w-4xl">
    <div className="mb-5 rounded-2xl border border-blue-400/20 bg-blue-500/5 p-4">
      <div className="mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-cyan-300"/><h3 className="font-semibold">Acesso do administrador</h3></div>
      <p className="mb-4 text-sm text-slate-400">O administrador entra na Visão Geral e pode acompanhar toda a operação e gerenciar os usuários.</p>
      <form onSubmit={submitAdmin} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <label className="space-y-1"><span className="text-xs text-slate-400">Usuário</span><input value={adminUsername} onChange={e=>setAdminUsername(e.target.value)} required className="w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2.5"/></label>
        <label className="space-y-1"><span className="text-xs text-slate-400">Nova senha</span><input value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} type="password" placeholder="Deixe vazio para manter" className="w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2.5"/></label>
        <button type="submit" className="mt-auto rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-500">Salvar</button>
      </form>
    </div>

    <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-3 flex items-center gap-2"><UserPlus size={18} className="text-cyan-300"/><h3 className="font-semibold">Criar novo usuário</h3></div>
      <form onSubmit={submitNewUser} className="grid gap-3 md:grid-cols-[1.1fr_1fr_1fr_auto]">
        <label className="space-y-1"><span className="text-xs text-slate-400">Nome</span><input value={newUser.name} onChange={e=>setNewUser(v=>({...v,name:e.target.value}))} required placeholder="Ex.: Carlos" className="w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2.5"/></label>
        <label className="space-y-1"><span className="text-xs text-slate-400">Usuário</span><input value={newUser.username} onChange={e=>setNewUser(v=>({...v,username:e.target.value}))} required placeholder="Ex.: carlos" className="w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2.5"/></label>
        <label className="space-y-1"><span className="text-xs text-slate-400">Senha</span><input value={newUser.password} onChange={e=>setNewUser(v=>({...v,password:e.target.value}))} required type="password" placeholder="Mínimo 4 caracteres" className="w-full rounded-lg border border-white/15 bg-slate-900/70 px-3 py-2.5"/></label>
        <button type="submit" className="mt-auto rounded-lg bg-cyan-500/20 px-4 py-2.5 font-semibold text-cyan-200 ring-1 ring-cyan-400/30 hover:bg-cyan-500/30">Criar</button>
      </form>
    </div>

    <p className="mb-4 text-sm text-slate-400">Inativar um usuário bloqueia seu login, mas preserva todo o histórico de vendas, metas, análises e transferências.</p>

    <div className="space-y-3">{profiles.map(profile => <div key={profile.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 font-bold text-white">{profile.avatar ? <img src={profile.avatar} alt="" className="h-full w-full object-cover"/> : profile.name.slice(0,1).toUpperCase()}</div>
          <div className="min-w-0">
            <div className="font-semibold">{profile.name}</div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"><span className="text-slate-400">Usuário: <strong className="text-slate-200">{profile.username || profile.name}</strong></span><span className={profile.active === false ? 'text-amber-400' : 'text-emerald-400'}>{profile.active === false ? 'Inativo' : 'Ativo'}</span></div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => {setEditingName(profile.id);setEditingAccess(null);setName(profile.name);setMessage('');}} className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"><Pencil size={15}/> Nome</button>
          <button type="button" onClick={() => {setEditingAccess(profile.id);setEditingName(null);setUsername(profile.username || profile.name);setPassword('');setMessage('');}} className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"><KeyRound size={15}/> Acesso</button>
          <button type="button" onClick={() => { if (profile.active !== false && !window.confirm(`Inativar ${profile.name}? O login será bloqueado e o histórico será preservado.`)) return; onSetActive(profile.id, profile.active === false); setMessage('Status atualizado.'); setMessageType('ok'); }} className="flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"><Power size={15}/>{profile.active === false ? 'Reativar' : 'Inativar'}</button>
          <button type="button" disabled={hasRecords(profile.id)} title={hasRecords(profile.id) ? 'Este usuário possui registros. Inative-o para preservar o histórico.' : 'Excluir usuário sem registros'} onClick={() => {if (!window.confirm(`Excluir definitivamente o usuário vazio ${profile.name}?`)) return; const ok=onDelete(profile.id); setMessage(ok ? 'Usuário excluído.' : 'Não é possível excluir um usuário com histórico.'); setMessageType(ok?'ok':'error');}} className="flex items-center gap-1 rounded-lg border border-rose-500/30 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-35"><Trash2 size={15}/> Excluir</button>
        </div>
      </div>

      {editingName === profile.id && <form className="mt-4 flex gap-2" onSubmit={e => {e.preventDefault(); if(onRename(profile.id,name)){setEditingName(null);setMessage('Nome atualizado.');setMessageType('ok');}}}><input autoFocus value={name} onChange={e=>setName(e.target.value)} maxLength={70} required className="min-w-0 flex-1 rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white" aria-label="Novo nome do usuário"/><button type="submit" className="rounded-lg bg-blue-600 px-3 text-white"><Check size={18}/></button><button type="button" onClick={()=>setEditingName(null)} className="rounded-lg border border-white/20 px-3"><X size={18}/></button></form>}

      {editingAccess === profile.id && <form className="mt-4 grid gap-2 md:grid-cols-[1fr_1fr_auto_auto]" onSubmit={e => {e.preventDefault(); const result=onUpdateProfileAccess(profile.id,{username,password}); if(showMessage(result)){setEditingAccess(null);setPassword('');}}}><input autoFocus value={username} onChange={e=>setUsername(e.target.value)} required placeholder="Usuário" className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white"/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Nova senha (opcional)" className="rounded-lg border border-white/20 bg-slate-800 px-3 py-2 text-white"/><button type="submit" className="rounded-lg bg-blue-600 px-3 text-white"><Check size={18}/></button><button type="button" onClick={()=>setEditingAccess(null)} className="rounded-lg border border-white/20 px-3"><X size={18}/></button></form>}

      {hasRecords(profile.id) && <p className="mt-3 text-xs text-slate-400">Exclusão bloqueada porque existem dados vinculados. Use Inativar para preservar o histórico.</p>}
    </div>)}</div>

    {message && <p role="status" className={`mt-4 text-sm ${messageType === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>{message}</p>}
    <p className="mt-4 text-xs text-slate-500">Versão demonstrativa: os acessos ainda ficam armazenados neste navegador. Antes da comercialização, o Pulse deverá usar autenticação e banco de dados no servidor.</p>
  </Modal>;
}
