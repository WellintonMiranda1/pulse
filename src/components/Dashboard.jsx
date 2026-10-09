import AnalyticsView from './AnalyticsView';
import RankingView from './RankingView';
import LeadsView from './LeadsView';
import GoalsView from './GoalsView';
import SalesProjectionView from './SalesProjectionView';
import { useMemo, useState, useRef } from 'react';
import {
  ArrowLeft, BarChart3, Bell, MessageSquare, Target, TrendingUp,
  Trophy, UserPlus, Users, Skull, Moon, Sun, Search, Eye, Pencil, Trash2, Check, CheckCheck, Camera,
  ArrowRightLeft, ShoppingBag
} from 'lucide-react';
import MetricCard from './MetricCard';
import RelacionamentoView from './RelacionamentoView';
import ClientFormModal from './ClientFormModal';
import ClientDetailModal from './ClientDetailModal';
import PurchaseFormModal from './PurchaseFormModal';
import TransferPortfolioModal from './TransferPortfolioModal';
import { getClientStatus, getClientPurchaseStats, totalPipeline, totalSalesByProfile } from '../lib/metrics';

const tabs = [
  ['clients', 'Carteira de Clientes', Users],
  ['rel', 'Relacionamento', MessageSquare],
  ['sales', 'Projeção de Vendas', TrendingUp],
  ['goals', 'Metas', Target],
  ['leads', 'Projeção de Leads', UserPlus],
  ['ranking', 'Ranking', Trophy],
  ['analytics', 'Análise', BarChart3],
  ['lost', 'Perdidos', Skull]
];

const money = n => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Dashboard({
  theme, onToggleTheme, selectedProfile, onBack, profiles, onSaveAvatar, transferNotifications, onMarkNotificationRead, onMarkAllNotificationsRead, clients, purchases, projections, goals, onSaveGoal, onDeleteGoal, onSaveProjection, onDeleteProjection,
  onSaveClient, onDeleteClient, onSavePurchase, onEditPurchase, onDeletePurchase, onToggleLost, onTransferPortfolio,
  notes, onAddNote, onEditNote, onDeleteNote, onToggleOverdue
}) {
  const [tab, setTab] = useState('clients');
  const [search, setSearch] = useState('');
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [detailClient, setDetailClient] = useState(null);
  const [purchaseClient, setPurchaseClient] = useState(null);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const avatarInputRef = useRef(null);
  const [avatarError, setAvatarError] = useState('');
  const profileNotifications = useMemo(() => (transferNotifications || [])
    .filter(n => !selectedProfile || n.to_profile_id === selectedProfile.id)
    .sort((a,b) => String(b.transfer_date).localeCompare(String(a.transfer_date))), [transferNotifications, selectedProfile]);
  const unreadCount = profileNotifications.filter(n => !n.read).length;
  const avatarProfile = selectedProfile ? profiles.find(p => p.id === selectedProfile.id) : null;
  const onAvatarFile = event => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !selectedProfile) return;
    if (!file.type.startsWith('image/')) { setAvatarError('Selecione uma imagem.'); return; }
    if (file.size > 4 * 1024 * 1024) { setAvatarError('A imagem deve ter no máximo 4 MB.'); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 256;
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      const crop = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width-crop)/2, (img.height-crop)/2, crop, crop, 0, 0, size, size);
      try { onSaveAvatar(selectedProfile.id, canvas.toDataURL('image/jpeg', 0.78)); setAvatarError(''); }
      catch { setAvatarError('Não foi possível salvar a imagem.'); }
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { URL.revokeObjectURL(url); setAvatarError('Imagem inválida.'); };
    img.src = url;
  };

  const ownedClients = useMemo(() => {
    let list = clients;
    if (selectedProfile) list = list.filter(c => c.profile_id === selectedProfile.id);
    return list;
  }, [clients, selectedProfile]);

  const visibleClients = useMemo(() => {
    let list = ownedClients.filter(c => !c.perdido);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(s) ||
        (c.company || '').toLowerCase().includes(s) ||
        (c.segment || '').toLowerCase().includes(s)
      );
    }
    return list;
  }, [ownedClients, search]);

  const lostClients = useMemo(() => {
    let list = ownedClients.filter(c => c.perdido);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(s) || (c.company || '').toLowerCase().includes(s));
    }
    return list;
  }, [ownedClients, search]);

  const profilePurchases = useMemo(
    () => selectedProfile ? purchases.filter(p => p.profile_id === selectedProfile.id) : purchases,
    [purchases, selectedProfile]
  );

  const profileProjections = useMemo(
    () => selectedProfile ? projections.filter(p => p.profile_id === selectedProfile.id) : projections,
    [projections, selectedProfile]
  );

  const sales = totalSalesByProfile(selectedProfile?.id, purchases);
  const pipeline = totalPipeline(profileProjections.filter(p => !p.is_lead));

  const openNew = () => {
    setEditingClient(null);
    setClientFormOpen(true);
  };

  const openEdit = (client) => {
    setEditingClient(client);
    setClientFormOpen(true);
  };

  const confirmDeleteClient = (client) => {
    if (confirm(`Excluir "${client.name}"? As compras desse cliente também serão removidas nesta versão local.`)) {
      onDeleteClient(client.id);
      if (detailClient?.id === client.id) setDetailClient(null);
    }
  };

  const renderClientTable = (list, lost = false) => (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-slate-400">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Segmento</th>
              <th className="px-4 py-3">Origem</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total Compras</th>
              <th className="px-4 py-3">Última Compra</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map(client => {
              const stats = getClientPurchaseStats(client.id, purchases);
              return (
                <tr key={client.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-4">
                    <div className="font-semibold">{client.name}</div>
                    {client.inadimplente && <span className="mt-1 inline-flex rounded-md bg-orange-500/15 px-2 py-0.5 text-xs text-orange-300">Inadimplente</span>}
                  </td>
                  <td className="px-4 py-4 text-slate-300">{client.company || '—'}</td>
                  <td className="px-4 py-4 text-slate-300">{client.segment || '—'}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-md px-2 py-1 text-xs ${
                      client.origin === 'lead' ? 'bg-cyan-500/15 text-cyan-300' :
                      client.origin === 'prospeccao' ? 'bg-amber-500/15 text-amber-300' :
                      'bg-violet-500/15 text-violet-300'
                    }`}>
                      {client.origin === 'prospeccao' ? 'Prospecção' : client.origin === 'indicacao' ? 'Indicação' : 'Lead'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {(() => {
                      const status = lost ? 'Perdido' : getClientStatus(client.id, purchases);
                      const style = status === 'Novo' ? 'border-blue-400/25 bg-blue-500/15 text-blue-300' :
                        status === 'Ativo' ? 'border-emerald-400/25 bg-emerald-500/15 text-emerald-300' :
                        status === 'Churn' ? 'border-rose-400/25 bg-rose-500/15 text-rose-300' :
                        status === 'Perdido' ? 'border-orange-400/25 bg-orange-500/15 text-orange-300' :
                        'border-slate-400/20 bg-slate-500/10 text-slate-300';
                      return <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold ${style}`}>{status}</span>;
                    })()}
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-emerald-400">{money(stats.total)}</td>
                  <td className="px-4 py-4 text-slate-300">{stats.lastDate || '—'}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button title="Ver" onClick={() => setDetailClient(client)} className="rounded-lg border border-cyan-400/20 bg-cyan-500/10 p-2 text-cyan-300">
                        <Eye className="h-4 w-4"/>
                      </button>
                      {!lost && (
                        <>
                          <button title="Nova compra" onClick={() => setPurchaseClient(client)} className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 p-2 text-emerald-300">
                            <ShoppingBag className="h-4 w-4"/>
                          </button>
                          <button title="Editar" onClick={() => openEdit(client)} className="rounded-lg border border-amber-400/20 bg-amber-500/10 p-2 text-amber-300">
                            <Pencil className="h-4 w-4"/>
                          </button>
                          <button title="Excluir" onClick={() => confirmDeleteClient(client)} className="rounded-lg border border-rose-400/20 bg-rose-500/10 p-2 text-rose-300">
                            <Trash2 className="h-4 w-4"/>
                          </button>
                        </>
                      )}
                      {lost && (
                        <button onClick={() => onToggleLost(client.id)} className="rounded-lg border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                          Restaurar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr><td colSpan="8" className="px-4 py-10 text-center text-slate-500">Nenhum cliente encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="rounded-xl border border-white/10 bg-white/5 p-2.5 hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative">
              <button type="button" disabled={!selectedProfile} title={selectedProfile ? 'Alterar foto do perfil' : 'Visão Geral'} onClick={() => avatarInputRef.current?.click()} className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-blue-500 to-indigo-600 font-bold disabled:cursor-default">
                {avatarProfile?.avatar ? <img src={avatarProfile.avatar} alt={`Foto de ${selectedProfile.name}`} className="h-full w-full object-cover"/> : (selectedProfile ? selectedProfile.name.charAt(0) : 'G')}
                {selectedProfile && <span className="absolute inset-0 flex items-center justify-center bg-slate-950/70 opacity-0 transition group-hover:opacity-100"><Camera size={17}/></span>}
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" onChange={onAvatarFile} className="hidden" aria-label="Selecionar foto de perfil"/>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{selectedProfile ? selectedProfile.name : 'Visão Geral'}</h1>
              <p className="text-sm text-slate-400">{selectedProfile ? 'CRM Individual' : 'Todos os Perfis'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-400">Total de Clientes</p>
              <p className="text-xl font-bold">{ownedClients.filter(c => !c.perdido).length}</p>
            </div>
            <div className="relative">
              <button type="button" title="Notificações de transferências" aria-label={`Notificações: ${unreadCount} não lidas`} onClick={() => setNotificationsOpen(v => !v)} className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 hover:bg-white/10"><Bell className="h-5 w-5"/>{unreadCount > 0 && <span className="absolute -right-1.5 -top-1.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount > 99 ? '99+' : unreadCount}</span>}</button>
              {notificationsOpen && <div className="absolute right-0 top-14 z-50 w-[min(90vw,390px)] overflow-hidden rounded-2xl border border-white/15 bg-[#172337] shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3"><div><h3 className="font-semibold">Transferências recebidas</h3><p className="text-xs text-slate-400">{unreadCount} não lida(s)</p></div><button type="button" disabled={!unreadCount} title="Marcar todas como lidas" onClick={() => onMarkAllNotificationsRead(selectedProfile?.id)} className="rounded-lg p-2 text-blue-300 hover:bg-white/10 disabled:opacity-30"><CheckCheck size={18}/></button></div>
                <div className="max-h-80 overflow-y-auto">{profileNotifications.length === 0 ? <p className="px-4 py-8 text-center text-sm text-slate-400">Nenhuma transferência recebida.</p> : profileNotifications.map(n => <div key={n.id} className={`border-b border-white/5 px-4 py-3 ${!n.read ? 'bg-blue-500/10' : ''}`}><div className="flex items-start gap-3"><ArrowRightLeft size={17} className="mt-1 shrink-0 text-cyan-300"/><div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{n.client_name}</p><p className="mt-1 text-xs text-slate-300">De {profiles.find(p=>p.id===n.from_profile_id)?.name || 'Perfil anterior'} para {profiles.find(p=>p.id===n.to_profile_id)?.name || 'Perfil atual'}</p><p className="mt-1 text-xs text-slate-500">{new Date(n.transfer_date).toLocaleString('pt-BR')}</p></div>{!n.read && <button type="button" title="Marcar como lida" onClick={() => onMarkNotificationRead(n.id)} className="rounded-lg p-1.5 text-blue-300 hover:bg-white/10"><Check size={16}/></button>}</div></div>)}</div>
              </div>}
            </div>
            <button type="button" onClick={onToggleTheme} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">{theme === 'dark' ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}{theme === 'dark' ? 'Claro' : 'Escuro'}</button>
          </div>
        </div>
        {avatarError && <div className="mx-auto max-w-7xl px-5 pb-2 text-xs text-rose-300">{avatarError}</div>}
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-1">
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => { setTab(id); setSearch(''); }}
              className={`flex min-w-max items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                tab === id ? 'bg-blue-500/25 text-white ring-1 ring-blue-400/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {tab === 'clients' && (
          <section>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar cliente..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 outline-none placeholder:text-slate-500 focus:border-blue-400/40"
                />
              </div>
              <div className="flex gap-2">
                {selectedProfile && (
                  <button onClick={() => setTransferOpen(true)} className="flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 font-semibold text-amber-300">
                    <ArrowRightLeft className="h-4 w-4"/> Transferir Carteira
                  </button>
                )}
                <button onClick={openNew} className="rounded-xl border border-blue-400/30 bg-blue-500/25 px-4 py-3 font-semibold">+ Novo Cliente</button>
              </div>
            </div>
            {renderClientTable(visibleClients)}
          </section>
        )}

        {tab === 'rel' && <RelacionamentoView clients={ownedClients.filter(c=>!c.perdido)} purchases={purchases} profiles={profiles} notes={notes} onAddNote={onAddNote} onEditNote={onEditNote} onDeleteNote={onDeleteNote} onToggleOverdue={onToggleOverdue} />}

        {tab === 'sales' && <SalesProjectionView projections={profileProjections} clients={clients} purchases={profilePurchases} profiles={profiles} selectedProfile={selectedProfile} onSave={onSaveProjection} onDelete={onDeleteProjection} />}

        {tab === 'goals' && <GoalsView goals={goals} purchases={purchases} profiles={profiles} selectedProfile={selectedProfile} onSave={onSaveGoal} onDelete={onDeleteGoal} />}

        {tab === 'leads' && <LeadsView projections={profileProjections} profiles={profiles} selectedProfile={selectedProfile} onSave={onSaveProjection} onDelete={onDeleteProjection} />}

        {tab === 'lost' && (
          <section>
            <div className="mb-4 flex max-w-md items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente perdido..." className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 outline-none" />
              </div>
              <span className="whitespace-nowrap text-sm text-rose-300">{lostClients.length} perdidos</span>
            </div>
            {renderClientTable(lostClients, true)}
          </section>
        )}

        {tab === 'ranking' && <RankingView profiles={profiles} clients={clients} purchases={purchases} goals={goals} selectedProfile={selectedProfile} />}

        {tab === 'analytics' && <AnalyticsView clients={clients} purchases={purchases} profiles={profiles} selectedProfile={selectedProfile} />}

      </main>

      <ClientFormModal
        open={clientFormOpen}
        onClose={() => setClientFormOpen(false)}
        client={editingClient}
        profiles={profiles}
        defaultProfileId={selectedProfile?.id}
        onSave={(data) => onSaveClient(data, editingClient?.id)}
      />

      <ClientDetailModal
        open={!!detailClient}
        onClose={() => setDetailClient(null)}
        client={detailClient}
        purchases={purchases}
        profiles={profiles}
        onAddPurchase={() => { setEditingPurchase(null); setPurchaseClient(detailClient); }}
        onEditPurchase={(purchase) => { setEditingPurchase(purchase); setPurchaseClient(detailClient); }}
        onEditClient={() => { openEdit(detailClient); }}
        onDeletePurchase={onDeletePurchase}
        onMarkLost={() => {
          onToggleLost(detailClient.id);
          setDetailClient(prev => prev ? { ...prev, perdido: !prev.perdido } : prev);
        }}
      />

      <PurchaseFormModal
        open={!!purchaseClient}
        onClose={() => { setPurchaseClient(null); setEditingPurchase(null); }}
        client={purchaseClient}
        purchase={editingPurchase}
        onSave={(data) => editingPurchase ? onEditPurchase(editingPurchase.id, data) : onSavePurchase(purchaseClient, data)}
      />

      <TransferPortfolioModal
        open={transferOpen}
        onClose={() => setTransferOpen(false)}
        sourceProfile={selectedProfile}
        profiles={profiles}
        count={visibleClients.length}
        onTransfer={(targetProfileId) => onTransferPortfolio(selectedProfile.id, targetProfileId)}
      />
    </div>
  );
}
