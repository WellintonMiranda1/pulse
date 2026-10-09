import { BadgeDollarSign, Mail, Phone, Building2, UserRoundCheck } from 'lucide-react';
import Modal from './Modal';
import { getClientPurchaseStats, getClientStatus } from '../lib/metrics';

const money = n => Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ClientDetailModal({
  open, onClose, client, purchases, profiles, onAddPurchase, onEditPurchase, onEditClient, onDeletePurchase, onMarkLost
}) {
  if (!client) return null;

  const stats = getClientPurchaseStats(client.id, purchases);
  const cp = purchases
    .filter(p => p.client_id === client.id)
    .sort((a,b) => new Date(b.date) - new Date(a.date));
  const profile = profiles.find(p => p.id === client.profile_id);

  return (
    <Modal open={open} onClose={onClose} title={client.name} maxWidth="max-w-4xl">
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard title="Status" value={getClientStatus(client.id, purchases)} />
        <InfoCard title="Total em compras" value={money(stats.total)} />
        <InfoCard title="Responsável" value={profile?.name || 'Sem responsável'} />
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-2">
        <Line icon={Building2} label="Empresa" value={client.company || '—'} />
        <Line icon={UserRoundCheck} label="Segmento" value={client.segment || '—'} />
        <Line icon={Mail} label="E-mail" value={client.email || '—'} />
        <Line icon={Phone} label="Telefone" value={client.phone || '—'} />
      </div>

      {client.notes && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Observações</p>
          <p className="mt-2 text-sm text-slate-300">{client.notes}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={onAddPurchase} className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500">
          + Nova compra
        </button>
        <button onClick={onEditClient} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">
          Editar cliente
        </button>
        <button onClick={onMarkLost} className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-amber-300">
          {client.perdido ? 'Restaurar cliente' : 'Marcar como perdido'}
        </button>
      </div>

      <div className="mt-7">
        <div className="mb-3 flex items-center gap-2">
          <BadgeDollarSign className="h-5 w-5 text-emerald-400" />
          <h3 className="font-semibold">Histórico de compras</h3>
        </div>

        {cp.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-slate-500">Nenhuma compra registrada.</div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            {cp.map(p => (
              <div key={p.id} className="flex items-center justify-between gap-4 border-b border-white/5 p-4 last:border-b-0">
                <div>
                  <p className="font-semibold text-emerald-400">{money(p.amount)}</p>
                  <p className="text-sm text-slate-400">{p.date}{p.description ? ` · ${p.description}` : ''}</p>
                </div>
                <div className="flex gap-2">
                <button onClick={() => onEditPurchase(p)} className="rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300">Editar</button>
                <button onClick={() => onDeletePurchase(p.id)} className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-1.5 text-sm text-rose-300">
                  Excluir
                </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

function InfoCard({ title, value }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase text-slate-500">{title}</p><p className="mt-2 font-semibold">{value}</p></div>;
}

function Line({ icon: Icon, label, value }) {
  return <div className="flex items-center gap-3"><Icon className="h-4 w-4 text-slate-500"/><div><p className="text-xs text-slate-500">{label}</p><p className="text-sm text-slate-200">{value}</p></div></div>;
}
