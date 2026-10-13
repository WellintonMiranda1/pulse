import { Plus, Users, Sun, Moon, ArrowUpRight, ShieldCheck, Activity } from 'lucide-react';

export default function ProfileSelector({ profiles, onSelect, theme, onToggleTheme }) {
  const activeProfiles = profiles.filter(p => p.active !== false);
  return (
    <main className="pulse-entry">
      <div className="pulse-entry-ambient" aria-hidden="true" />
      <div className="pulse-entry-shell">
        <header className="pulse-entry-top">
          <div className="pulse-entry-brand">
            <img src="/orkrux-official-name.png" alt="ORKRUX" className="pulse-entry-wordmark" />
            <span className="pulse-entry-brand-rule" aria-hidden="true" />
            <span className="pulse-entry-brand-label">DIGITAL SOLUTIONS</span>
          </div>
          <button type="button" onClick={onToggleTheme} className="pulse-entry-theme">
            {theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}
            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </button>
        </header>

        <div className="pulse-entry-hero">
          <div className="pulse-entry-intro">
            <div className="pulse-entry-kicker"><Activity size={14}/> CRM COM INTELIGÊNCIA COMERCIAL</div>
            <h1>PULSE<span className="pulse-entry-period">.</span></h1>
            <div className="pulse-entry-underline" aria-hidden="true" />
            <h2>Bem-vindo <span>de volta.</span></h2>
            <p>Selecione seu perfil para continuar no Pulse.</p>
          </div>
          <div className="pulse-entry-art" aria-hidden="true">
            <img src="/orkrux-emblem.png" alt="" />
          </div>
        </div>

        <section className="pulse-entry-profiles" aria-label="Selecionar perfil">
          <div className="pulse-entry-section-label"><span>ACESSAR WORKSPACE</span><span>{activeProfiles.length} {activeProfiles.length === 1 ? 'PERFIL' : 'PERFIS'} DISPONÍVEIS</span></div>
          <div className="pulse-entry-grid">
            <button type="button" onClick={() => onSelect(null)} className="pulse-entry-card pulse-entry-general">
              <div className="pulse-entry-avatar"><Users size={29}/></div>
              <div className="pulse-entry-card-copy"><strong>Geral</strong><small>Todos os perfis</small></div>
              <ArrowUpRight className="pulse-entry-card-arrow" size={17}/>
            </button>
            {activeProfiles.map(profile => (
              <button type="button" key={profile.id} onClick={() => onSelect(profile)} className={`pulse-entry-card ${profile.avatar ? 'has-photo' : ''}`}>
                {profile.avatar ? <img className="pulse-entry-photo" src={profile.avatar} alt=""/> : <div className="pulse-entry-initial" style={{background: 'linear-gradient(145deg,#123c66,#0874e6)'}}>{profile.name?.charAt(0)?.toUpperCase()}</div>}
                <div className="pulse-entry-card-copy"><strong>{profile.name}</strong><small>Entrar no perfil</small></div>
                <ArrowUpRight className="pulse-entry-card-arrow" size={17}/>
              </button>
            ))}
            <div className="pulse-entry-card pulse-entry-new" title="O cadastro de novos perfis será configurado nas próximas versões">
              <div className="pulse-entry-avatar"><Plus size={29}/></div>
              <div className="pulse-entry-card-copy"><strong>Novo perfil</strong><small>Em preparação</small></div>
            </div>
          </div>
        </section>

        <footer className="pulse-entry-footer">
          <div className="pulse-entry-footer-brand"><img src="/orkrux-official-name.png" alt="ORKRUX"/><span>TECNOLOGIA PARA IMPULSIONAR RESULTADOS.</span></div>
          <div className="pulse-entry-footer-note"><ShieldCheck size={15}/> PULSE CRM · ORKRUX DIGITAL SOLUTIONS</div>
        </footer>
      </div>
    </main>
  );
}
