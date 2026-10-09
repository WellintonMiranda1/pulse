export const seedProfiles = [
  { id: 'p1', name: 'Marina', avatar_color: 'from-blue-500 to-indigo-600', active: true },
  { id: 'p2', name: 'Lucas', avatar_color: 'from-cyan-500 to-blue-600', active: true },
  { id: 'p3', name: 'Rafael', avatar_color: 'from-amber-500 to-orange-600', active: true }
];

export const seedClients = [
  {
    id: 'c1',
    profile_id: 'p1',
    name: 'Alpha Sono',
    company: 'Alpha Sono Ltda',
    email: 'contato@alphasono.demo',
    phone: '(51) 99999-1111',
    segment: 'Bem-estar',
    estado: 'RS',
    origin: 'lead',
    notes: 'Cliente fictício para demonstração.',
    inadimplente: false,
    perdido: false,
    motivo_perda: '',
    registration_date: '2026-08-10'
  },
  {
    id: 'c2',
    profile_id: 'p1',
    name: 'Clínica Horizonte',
    company: 'Horizonte Saúde',
    email: 'comercial@horizonte.demo',
    phone: '(51) 99999-2222',
    segment: 'Clínica',
    estado: 'SC',
    origin: 'prospeccao',
    notes: '',
    inadimplente: false,
    perdido: false,
    motivo_perda: '',
    registration_date: '2026-06-12'
  },
  {
    id: 'c3',
    profile_id: 'p2',
    name: 'Casa Serena',
    company: 'Casa Serena Comércio',
    email: 'compras@casaserena.demo',
    phone: '(41) 99999-3333',
    segment: 'Varejo',
    estado: 'PR',
    origin: 'indicacao',
    notes: '',
    inadimplente: false,
    perdido: false,
    motivo_perda: '',
    registration_date: '2026-09-01'
  },
  {
    id: 'c4',
    profile_id: 'p3',
    name: 'Nova Vida',
    company: 'Nova Vida Produtos',
    email: 'financeiro@novavida.demo',
    phone: '(11) 99999-4444',
    segment: 'Saúde',
    estado: 'SP',
    origin: 'lead',
    notes: '',
    inadimplente: true,
    perdido: false,
    motivo_perda: '',
    registration_date: '2026-09-18'
  },
  {
    id: 'c5',
    profile_id: 'p2',
    name: 'Equilíbrio Center',
    company: 'Equilíbrio Center Ltda',
    email: 'oi@equilibrio.demo',
    phone: '(31) 99999-5555',
    segment: 'Fisioterapia',
    estado: 'MG',
    origin: 'prospeccao',
    notes: '',
    inadimplente: false,
    perdido: true,
    motivo_perda: 'Sem retorno após várias tentativas.',
    registration_date: '2026-01-15'
  }
];

export const seedPurchases = [
  { id: 'v1', profile_id: 'p1', client_id: 'c1', amount: 1732.60, date: '2026-10-08', description: 'Pedido demonstrativo' },
  { id: 'v2', profile_id: 'p1', client_id: 'c2', amount: 2400.00, date: '2026-06-12', description: 'Pedido demonstrativo' },
  { id: 'v3', profile_id: 'p2', client_id: 'c3', amount: 2048.00, date: '2026-10-03', description: 'Pedido demonstrativo' },
  { id: 'v4', profile_id: 'p3', client_id: 'c4', amount: 2624.70, date: '2026-10-04', description: 'Pedido demonstrativo' }
];

export const seedProjections = [
  { id: 's1', profile_id: 'p1', client_id: 'c1', client_name: 'Alpha Sono', expected_amount: 6000, expected_date: '2026-10-22', probability: 100, status: 'negotiation', is_lead: false },
  { id: 's2', profile_id: 'p1', client_id: null, client_name: 'Prospect Beta', expected_amount: 3500, expected_date: '2026-10-28', probability: 70, status: 'proposal', is_lead: false },
  { id: 's3', profile_id: 'p2', client_id: null, client_name: 'Lead Solaris', expected_amount: 8500, expected_date: '2026-10-25', probability: 80, status: 'negotiation', is_lead: true }
];

export const seedGoals = [
  { id: 'g1', profile_id: 'p1', month: '2026-10', goal_amount: 75000 },
  { id: 'g2', profile_id: 'p2', month: '2026-10', goal_amount: 75000 },
  { id: 'g3', profile_id: 'p3', month: '2026-10', goal_amount: 75000 }
];
