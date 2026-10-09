import { useEffect, useState } from 'react';
import ProfileSelector from './components/ProfileSelector';
import Dashboard from './components/Dashboard';
import {
  seedProfiles, seedClients, seedPurchases, seedProjections, seedGoals
} from './data/mockData';
import { loadLocal, saveLocal, newId } from './lib/storage';

export default function App() {
  const [selectedProfile, setSelectedProfile] = useState(undefined);
  const [theme, setTheme] = useState(() => loadLocal('pulse_theme', 'dark'));
  const [profiles, setProfiles] = useState(() => loadLocal('pulse_profiles', seedProfiles));
  const [clients, setClients] = useState(() => loadLocal('pulse_clients', seedClients));
  const [notes, setNotes] = useState(() => loadLocal('pulse_client_notes', []));
  const [purchases, setPurchases] = useState(() => loadLocal('pulse_purchases', seedPurchases));
  const [projections, setProjections] = useState(() => loadLocal('pulse_projections', seedProjections).map(p => ({ ...p, probability: 100 })));
  const [goals, setGoals] = useState(() => loadLocal('pulse_goals', seedGoals));
  const [transferNotifications, setTransferNotifications] = useState(() => loadLocal('pulse_transfer_notifications', []));

  useEffect(() => { document.documentElement.dataset.theme = theme; saveLocal('pulse_theme', theme); }, [theme]);
  useEffect(() => saveLocal('pulse_profiles', profiles), [profiles]);
  useEffect(() => saveLocal('pulse_clients', clients), [clients]);
  useEffect(() => saveLocal('pulse_client_notes', notes), [notes]);
  useEffect(() => saveLocal('pulse_purchases', purchases), [purchases]);
  useEffect(() => saveLocal('pulse_projections', projections), [projections]);
  useEffect(() => saveLocal('pulse_goals', goals), [goals]);
  useEffect(() => saveLocal('pulse_transfer_notifications', transferNotifications), [transferNotifications]);

  const renameProfile = (profileId, name) => {
    const cleaned = name.trim();
    if (!cleaned) return false;
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, name: cleaned } : p));
    setSelectedProfile(prev => prev?.id === profileId ? { ...prev, name: cleaned } : prev);
    return true;
  };
  const setProfileActive = (profileId, active) => {
    setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, active } : p));
    if (!active) setSelectedProfile(prev => prev?.id === profileId ? undefined : prev);
  };
  const deleteProfile = profileId => {
    // Never delete a profile with any historical or current relationship.
    const hasHistory = clients.some(c => c.profile_id === profileId) ||
      purchases.some(p => p.profile_id === profileId) ||
      goals.some(g => g.profile_id === profileId) ||
      projections.some(p => p.profile_id === profileId) ||
      notes.some(n => n.profile_id === profileId) ||
      transferNotifications.some(n => n.from_profile_id === profileId || n.to_profile_id === profileId);
    if (hasHistory) return false;
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    setSelectedProfile(prev => prev?.id === profileId ? undefined : prev);
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
    if (confirm('Excluir esta compra?')) {
      setPurchases(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleLost = (clientId) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, perdido: !c.perdido } : c));
  };

  const transferPortfolio = (sourceProfileId, targetProfileId) => {
    const transferred = clients.filter(c => c.profile_id === sourceProfileId && !c.perdido);
    recordTransfers(transferred, sourceProfileId, targetProfileId);
    setClients(prev => prev.map(c =>
      c.profile_id === sourceProfileId && !c.perdido
        ? { ...c, profile_id: targetProfileId }
        : c
    ));
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

  if (selectedProfile === undefined) {
    return <ProfileSelector profiles={profiles} onSelect={setSelectedProfile} theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />;
  }

  return (
    <Dashboard
      theme={theme}
      onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      selectedProfile={selectedProfile}
      onBack={() => setSelectedProfile(undefined)}
      profiles={profiles}
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
