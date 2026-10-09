import { differenceInDays, startOfMonth, endOfMonth } from 'date-fns';

export const pd = (d) => d ? new Date(`${d}T00:00:00`) : null;

export function getClientStatus(clientId, purchases) {
  const cp = purchases.filter(p => p.client_id === clientId);
  if (!cp.length) return 'Sem compras';

  const sorted = [...cp].sort((a, b) => pd(a.date) - pd(b.date));
  const first = pd(sorted[0].date);
  const last = pd(sorted[sorted.length - 1].date);
  const now = new Date();

  if (differenceInDays(now, last) > 90) return 'Churn';

  const start = startOfMonth(now);
  const end = endOfMonth(now);
  if (first >= start && first <= end) return 'Novo';

  return 'Ativo';
}

export function getClientPurchaseStats(clientId, purchases) {
  const cp = purchases.filter(p => p.client_id === clientId);
  const sorted = [...cp].sort((a,b) => pd(b.date) - pd(a.date));
  return {
    count: cp.length,
    total: cp.reduce((sum, p) => sum + Number(p.amount || 0), 0),
    lastDate: sorted[0]?.date || null
  };
}

export function totalSalesByProfile(profileId, purchases) {
  return purchases
    .filter(p => !profileId || p.profile_id === profileId)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
}

export function totalPipeline(projections) {
  return projections
    .filter(p => p.status !== 'closed_won' && p.status !== 'closed_lost')
    .reduce((sum, p) => sum + Number(p.expected_amount || 0), 0);
}
