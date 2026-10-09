import { useState } from 'react';
import Modal from './Modal';

export default function TransferPortfolioModal({ open, onClose, sourceProfile, profiles, count, onTransfer }) {
  const options = profiles.filter(p => p.id !== sourceProfile?.id && p.active !== false);
  const [target, setTarget] = useState(options[0]?.id || '');

  const submit = () => {
    if (!target) return;
    onTransfer(target);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Transferir carteira">
      <p className="text-sm text-slate-400">
        Serão transferidos <strong className="text-white">{count}</strong> clientes. As compras já registradas continuam no histórico do vendedor original.
      </p>

      <label className="mt-5 block">
        <span className="mb-1.5 block text-sm text-slate-400">Novo responsável</span>
        <select value={target} onChange={e => setTarget(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5">
          {options.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>

      <div className="mt-5 flex justify-end gap-3">
        <button onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2">Cancelar</button>
        <button onClick={submit} className="rounded-xl bg-amber-600 px-4 py-2 font-semibold hover:bg-amber-500">Transferir</button>
      </div>
    </Modal>
  );
}
