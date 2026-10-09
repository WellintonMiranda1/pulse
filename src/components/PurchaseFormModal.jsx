import { useEffect, useState } from 'react';
import Modal from './Modal';
import { parseBRL } from '../lib/currency';

export default function PurchaseFormModal({ open, onClose, client, purchase, onSave }) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!open) return;
    setAmount(purchase ? Number(purchase.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '');
    setDate(purchase?.date || new Date().toLocaleDateString('en-CA'));
    setDescription(purchase?.description || '');
  }, [open, purchase]);

  const submit = (e) => {
    e.preventDefault();
    const n = parseBRL(amount);
    if (!n || n <= 0) return;
    onSave({ amount: n, date, description });
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`${purchase ? 'Editar compra' : 'Nova compra'} · ${client?.name || ''}`}>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm text-slate-400">Valor *</span>
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Ex.: 2.000,00" inputMode="decimal" className={inputCls} required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-slate-400">Data *</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} required />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-slate-400">Descrição</span>
          <input value={description} onChange={e => setDescription(e.target.value)} className={inputCls} />
        </label>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-slate-300">Cancelar</button>
          <button type="submit" className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold hover:bg-emerald-500">{purchase ? 'Salvar alterações' : 'Registrar compra'}</button>
        </div>
      </form>
    </Modal>
  );
}

const inputCls = "w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-white outline-none focus:border-blue-400/50";
