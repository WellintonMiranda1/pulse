import { useState } from 'react';
import { Activity, Eye, EyeOff, LockKeyhole, UserRound, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Informe usuário e senha.');
      return;
    }
    setLoading(true);
    try {
      const result = await onLogin(username, password);
      if (!result?.ok) setError(result?.message || 'Usuário ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pulse-login-screen">
      <div className="pulse-login-shade" aria-hidden="true" />
      <section className="pulse-login-panel" aria-label="Acesso ao Pulse">
        <div className="pulse-login-kicker"><Activity size={14}/> PULSE CRM</div>
        <h1>Acesse sua operação comercial.</h1>
        <p className="pulse-login-copy">Entre com o usuário e a senha definidos pelo administrador da sua empresa.</p>

        <form onSubmit={submit} className="pulse-login-form">
          <label>
            <span>Usuário</span>
            <div className="pulse-login-field">
              <UserRound size={18}/>
              <input
                autoFocus
                autoComplete="username"
                value={username}
                onChange={event => setUsername(event.target.value)}
                placeholder="Digite seu usuário"
              />
            </div>
          </label>

          <label>
            <span>Senha</span>
            <div className="pulse-login-field">
              <LockKeyhole size={18}/>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder="Digite sua senha"
              />
              <button type="button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} onClick={() => setShowPassword(value => !value)}>
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>} 
              </button>
            </div>
          </label>

          {error && <div className="pulse-login-error" role="alert">{error}</div>}

          <button className="pulse-login-submit" type="submit" disabled={loading}>
            <span>{loading ? 'Entrando...' : 'Entrar no Pulse'}</span>
            <ArrowRight size={18}/>
          </button>
        </form>

        <div className="pulse-login-security"><ShieldCheck size={15}/> Acesso individual por usuário e senha</div>
        <div className="pulse-login-brandline">PULSE · ORKRUX DIGITAL SOLUTIONS</div>
      </section>
    </main>
  );
}
