import { useEffect, useMemo, useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import {
  seedProfiles, seedClients, seedPurchases, seedProjections, seedGoals
} from './data/mockData';
import { loadLocal, saveLocal, newId } from './lib/storage';
import { DEFAULT_DEMO_PASSWORD, hashPassword, normalizeUsername } from './lib/auth';

const DEFAULT_ADMIN_AUTH = {
  username: 'Geral',
  passwordHash: hashPassword(DEFAULT_DEMO_PASSWORD)
};

const DEMO_DATA_VERSION = 'pulse-demo-v2.6-completo';

function ensureCompleteDemoData() {
  try {
    if (localStorage.getItem('pulse_demo_seed_version') === DEMO_DATA_VERSION) return;

    localStorage.setItem('pulse_profiles', JSON.stringify(seedProfiles));
    localStorage.setItem('pulse_clients', JSON.stringify(seedClients));
    localStorage.setItem('pulse_client_notes', JSON.stringify([]));
    localStorage.setItem('pulse_purchases', JSON.stringify(seedPurchases));
    localStorage.setItem('pulse_projections', JSON.stringify(seedProjections));
    localStorage.setItem('pulse_goals', JSON.stringify(seedGoals));
    localStorage.setItem('pulse_transfer_notifications', JSON.stringify([]));
    localStorage.setItem('pulse_admin_auth', JSON.stringify(DEFAULT_ADMIN_AUTH));
    localStorage.setItem('pulse_demo_seed_version', DEMO_DATA_VERSION);
    sessionStorage.removeItem('pulse_session');
  } catch {
    // Se o armazenamento do navegador estiver indisponível, o app usa os seeds em memória.
  }
}

const normalizeProfiles = (items = []) => items.map(profile => ({
  ...profile,
  username: profile.username || profile.name || '',
  passwordHash: profile.passwordHash || hashPassword(DEFAULT_DEMO_PASSWORD),
  active: profile.active !== false
}));

function loadSession() {
  try {
    const raw = sessionStorage.getItem('pulse_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function App() {
  ensureCompleteDemoData();

  const [session, setSession] = useState(loadSession);
  const [theme, setTheme] = useState(() => loadLocal('pulse_theme', 'dark'));
  const [adminAuth, setAdminAuth] = useState(() => loadLocal('pulse_admin_auth', DEFAULT_ADMIN_AUTH));
  const [profiles, setProfiles] = useState(() => normalizeProfiles(loadLocal('pulse_profiles', seedProfiles)));
  const [clients, setClients] = useState(() => loadLocal('pulse_clients', seedClients));
  const [notes, setNotes] = useState(() => loadLocal('pulse_client_notes', []));
  const [purchases, setPurchases] = useState(() => loadLocal('pulse_purchases', seedPurchases));
  const [projections, setProjections] = useState(() => loadLocal('pulse_projections', seedProjections).map(p => ({ ...p, probability: 100 })));
  const [goals, setGoals] = useState(() => loadLocal('pulse_goals', seedGoals));
  const [transferNotifications, setTransferNotifications] = useState(() => loadLocal('pulse_transfer_notifications', []));

  useEffect(() => { document.documentElement.dataset.theme = theme; saveLocal('pulse_theme', theme); }, [theme]);
  useEffect(() => saveLocal('pulse_admin_auth', adminAuth), [adminAuth]);
  useEffect(() => saveLocal('pulse_profiles', profiles), [profiles]);
  useEffect(() => saveLocal('pulse_clients', clients), [clients]);
  useEffect(() => saveLocal('pulse_client_notes', notes), [notes]);
  useEffect(() => saveLocal('pulse_purchases', purchases), [purchases]);
  useEffect(() => saveLocal('pulse_projections', projections), [projections]);
  useEffect(() => saveLocal('pulse_goals', goals), [goals]);
  useEffect(() => saveLocal('pulse_transfer_notifications', transferNotifications), [transferNotifications]);

  const selectedProfile = useMemo(() => {
    if (!session) return undefined;
    if (session.type === 'admin') return null;
    return profiles.find(profile => profile.id === session.profileId && profile.active !== false);
  }, [session, profiles]);

  useEffect(() => {
    if (session?.type === 'profile' && !selectedProfile) {
      sessionStorage.removeItem('pulse_session');
      setSession(null);
    }
  }, [session, selectedProfile]);

  const usernameExists = (username, exceptProfileId = null, includeAdmin = true) => {
    const normalized = normalizeUsername(username);
    if (!normalized) return false;
    if (includeAdmin && normalizeUsername(adminAuth.username) === normalized) return true;
    return profiles.some(profile => profile.id !== exceptProfileId && normalizeUsername(profile.username) === normalized);
  };

  const login = async (username, password) => {
    const normalized = normalizeUsername(username);
    const passwordHash = hashPassword(password);

    if (normalizeUsername(adminAuth.username) === normalized && adminAuth.passwordHash === passwordHash) {
      const next = { type: 'admin' };
      sessionStorage.setItem('pulse_session', JSON.stringify(next));
      setSession(next);
      return { ok: true };
    }

    const profile = profiles.find(item => normalizeUsername(item.username) === normalized);
    if (!profile || profile.passwordHash !== passwordHash) return { ok: false, message: 'Usuário ou senha inválidos.' };
    if (profile.active === false) return { ok: false, message: 'Este usuário está inativo. Fale com o administrador.' };

    const next = { type: 'profile', profileId: profile.id };
    sessionStorage.setItem('pulse_session', JSON.stringify(next));
    setSession(next);
    return { ok: true };
  };

  const logout = () => {
    sessionStorage.removeItem('pulse_session');
    setSession(null);
  };

  const updateAdminAccess = ({ username, password }) => {
    const cleaned = String(username || '').trim();
    if (!cleaned) return { ok: false, message: 'Informe o usuário do administrador.' };
    if (usernameExists(cleaned, null, false)) return { ok: false, message: 'Este usuário já está sendo usado por um vendedor.' };
    setAdminAuth(previous => ({
      username: cleaned,
      passwordHash: password ? hashPassword(password) : previous.passwordHash
    }));
    return { ok: true, message: 'Acesso do administrador atualizado.' };
  };

  const createProfile = ({ name, username, password }) => {
    const cleanedName = String(name || '').trim();
    const cleanedUsername = String(username || '').trim();
    if (!cleanedName || !cleanedUsername || !password) return { ok: false, message: 'Preencha nome, usuário e senha.' };
    if (password.length < 4) return { ok: false, message: 'A senha deve ter pelo menos 4 caracteres.' };
    if (usernameExists(cleanedUsername)) return { ok: false, message: 'Este usuário já existe.' };

    setProfiles(previous => [{
      id: newId('profile'),
      name: cleanedName,
      username: cleanedUsername,
      passwordHash: hashPassword(password),
      active: true,
      avatar: ''
    }, ...previous]);
    return { ok: true, message: 'Usuário criado com sucesso.' };
  };

  const updateProfileAccess = (profileId, { username, password }) => {
    const cleanedUsername = String(username || '').trim();
    if (!cleanedUsername) return { ok: false, message: 'Informe o usuário de acesso.' };
    if (usernameExists(cleanedUsername, profileId)) return { ok: false, message: 'Este usuário já existe.' };
    if (password && password.length < 4) return { ok: false, message: 'A senha deve ter pelo menos 4 caracteres.' };

    setProfiles(previous => previous.map(profile => profile.id === profileId ? {
      ...profile,
      username: cleanedUsername,
      ...(password ? { passwordHash: hashPassword(password) } : {})
    } : profile));
    return { ok: true, message: 'Acesso atualizado.' };
  };

  const renameProfile = (profileId, name) => {
    const cleaned = name.trim();
    if (!cleaned) return false;
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, name: cleaned } : p));
    return true;
  };

  const setProfileActive = (profileId, active) => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, active } : p));
    if (!active && session?.type === 'profile' && session.profileId === profileId) logout();
  };

  const deleteProfile = profileId => {
    const hasHistory = clients.some(c => c.profile_id === profileId) ||
      purchases.some(p => p.profile_id === profileId) ||
      goals.some(g => g.profile_id === profileId) ||
      projections.some(p => p.profile_id === profileId) ||
      notes.some(n => n.profile_id === profileId) ||
      transferNotifications.some(n => n.from_profile_id === profileId || n.to_profile_id === profileId);
    if (hasHistory) return false;
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    return true;
  };

  const saveAvatar = (profileId, avatar) => setProfiles(prev => prev.map(p => p.id === profileId ? {...p, avatar} : p));
  const markNotificationRead = id => setTransferNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  const markAllNotificationsRead = (profileId) => setTransferNotifications(prev => prev.map(n => (!profileId || n.to_profile_id === profileId) ? {...n, read: true} : n));
  const recordTransfers = (transferred, fromId, toId) => {
    if (!transferred.length || !fromId || !toId || fromId === toId) return;
    const now = new Date().toISOString();
    setTransferNotifications(prev => [...transferred.map(c => ({
      id: newId('transfer'), client_id: c.id, client_name: c.name,
      from_profile_id: fromId, to_profile_id: toId, transfer_date: now, read: false
    })), ...prev]);
  };

  const saveClient = (data, id) => {
    if (id) {
      const previous = clients.find(c => c.id === id);
      if (previous && data.profile_id && previous.profile_id !== data.profile_id) recordTransfers([previous], previous.profile_id, data.profile_id);
      setClients(prev => prev.map(c => c.id === id ? { ...c, ...data, id } : c));
      return;
    }

    const now = new Date().toISOString().slice(0, 10);
    const newClient = {
      ...data,
      id: newId('client'),
      perdido: false,
      motivo_perda: '',
      registration_date: now
    };
    setClients(prev => [newClient, ...prev]);
  };

  const deleteClient = (id) => {
    setClients(prev => prev.filter(c => c.id !== id));
    setPurchases(prev => prev.filter(p => p.client_id !== id));
    setNotes(prev => prev.filter(n => n.client_id !== id));
  };

  const savePurchase = (client, data) => {
    const purchase = {
      id: newId('purchase'),
      profile_id: client.profile_id,
      client_id: client.id,
      amount: Number(data.amount),
      date: data.date,
      description: data.description || ''
    };
    setPurchases(prev => [purchase, ...prev]);
  };

  const editPurchase = (id, data) => {
    setPurchases(prev => prev.map(p => p.id === id
      ? { ...p, amount: Number(data.amount), date: data.date, description: data.description || '' }
      : p
    ));
  };

  const deletePurchase = (id) => {
    if (confirm('Excluir esta compra?')) setPurchases(prev => prev.filter(p => p.id !== id));
  };

  const toggleLost = (clientId) => setClients(prev => prev.map(c => c.id === clientId ? { ...c, perdido: !c.perdido } : c));

  const transferPortfolio = (sourceProfileId, targetProfileId) => {
    const transferred = clients.filter(c => c.profile_id === sourceProfileId && !c.perdido);
    recordTransfers(transferred, sourceProfileId, targetProfileId);
    setClients(prev => prev.map(c => c.profile_id === sourceProfileId && !c.perdido ? { ...c, profile_id: targetProfileId } : c));
  };

  const addNote = data => setNotes(prev => [{ ...data, id: newId('note') }, ...prev]);
  const editNote = (id, data) => setNotes(prev => prev.map(n => n.id === id ? { ...n, ...data } : n));
  const deleteNote = id => setNotes(prev => prev.filter(n => n.id !== id));
  const toggleOverdue = id => setClients(prev => prev.map(c => c.id === id ? { ...c, inadimplente: !c.inadimplente } : c));

  const saveProjection = (data, id) => {
    data = { ...data, probability: 100 };
    setProjections(prev => id
      ? prev.map(p => p.id === id ? { ...p, ...data, id } : p)
      : [{ ...data, id: newId('projection'), profile_id: selectedProfile?.id || data.profile_id || null }, ...prev]);
  };
  const deleteProjection = id => setProjections(prev => prev.filter(p => p.id !== id));

  const saveGoal = (data, id) => setGoals(prev => {
    const existing = prev.find(g => g.profile_id === data.profile_id && g.month === data.month);
    const targetId = id || existing?.id;
    return targetId ? prev.map(g => g.id === targetId ? { ...g, ...data, id: targetId } : g)
      : [{ ...data, id: newId('goal') }, ...prev];
  });
  const deleteGoal = id => setGoals(prev => prev.filter(g => g.id !== id));

  if (!session) return <LoginScreen onLogin={login} />;
  if (session.type === 'profile' && !selectedProfile) return <LoginScreen onLogin={login} />;

  return (
    <Dashboard
      theme={theme}
      onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      selectedProfile={selectedProfile}
      isAdmin={session.type === 'admin'}
      onBack={logout}
      profiles={profiles}
      adminAuth={adminAuth}
      onUpdateAdminAccess={updateAdminAccess}
      onCreateProfile={createProfile}
      onUpdateProfileAccess={updateProfileAccess}
      onSaveAvatar={saveAvatar}
      onRenameProfile={renameProfile}
      onSetProfileActive={setProfileActive}
      onDeleteProfile={deleteProfile}
      transferNotifications={transferNotifications}
      onMarkNotificationRead={markNotificationRead}
      onMarkAllNotificationsRead={markAllNotificationsRead}
      clients={clients}
      purchases={purchases}
      notes={notes}
      onAddNote={addNote}
      onEditNote={editNote}
      onDeleteNote={deleteNote}
      onToggleOverdue={toggleOverdue}
      projections={projections}
      onSaveProjection={saveProjection}
      onDeleteProjection={deleteProjection}
      goals={goals}
      onSaveGoal={saveGoal}
      onDeleteGoal={deleteGoal}
      onSaveClient={saveClient}
      onDeleteClient={deleteClient}
      onSavePurchase={savePurchase}
      onEditPurchase={editPurchase}
      onDeletePurchase={deletePurchase}
      onToggleLost={toggleLost}
      onTransferPortfolio={transferPortfolio}
    />
  );
}
