import { useEffect, useState } from 'react';
import Modal from './Modal';

const blank = {
  name: '',
  company: '',
  email: '',
  phone: '',
  segment: '',
  estado: '',
  origin: 'lead',
  notes: '',
  inadimplente: false
};

export default function ClientFormModal({ open, onClose, client, onSave, defaultProfileId, profiles }) {
  const [form, setForm] = useState(blank);

  useEffect(() => {
    if (open) {
      setForm(client ? { ...blank, ...client } : { ...blank, profile_id: defaultProfileId || profiles[0]?.id || '' });
    }
  }, [open, client, defaultProfileId, profiles]);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={client ? 'Editar Cliente' : 'Novo Cliente'}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Cliente *">
            <input value={form.name} onChange={e => set('name', e.target.value)} className={inputCls} required />
          </Field>
          <Field label="Empresa">
            <input value={form.company} onChange={e => set('company', e.target.value)} className={inputCls} />
          </Field>
          <Field label="E-mail">
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Telefone">
            <input value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Segmento">
            <input value={form.segment} onChange={e => set('segment', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Estado">
            <input maxLength={2} placeholder="RS" value={form.estado} onChange={e => set('estado', e.target.value.toUpperCase())} className={inputCls} />
          </Field>
          <Field label="Origem">
            <select value={form.origin} onChange={e => set('origin', e.target.value)} className={inputCls}>
              <option value="lead">Lead</option>
              <option value="indicacao">Indicação</option>
              <option value="prospeccao">Prospecção</option>
            </select>
          </Field>
          <Field label="Responsável">
            <select value={form.profile_id || ''} onChange={e => set('profile_id', e.target.value)} className={inputCls}>
              {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Observações">
          <textarea rows="4" value={form.notes} onChange={e => set('notes', e.target.value)} className={inputCls} />
        </Field>

        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <input type="checkbox" checked={!!form.inadimplente} onChange={e => set('inadimplente', e.target.checked)} />
          <span className="text-sm">Marcar como inadimplente</span>
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/10 px-4 py-2 text-slate-300">Cancelar</button>
          <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500">Salvar</button>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, children }) {
  return <label className="block"><span className="mb-1.5 block text-sm text-slate-400">{label}</span>{children}</label>;
}

const inputCls = "w-full rounded-xl border border-white/10 bg-slate-800 px-3 py-2.5 text-white outline-none focus:border-blue-400/50";
