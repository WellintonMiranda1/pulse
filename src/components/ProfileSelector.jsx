import { Plus, Users, Sun, Moon } from 'lucide-react';

export default function ProfileSelector({ profiles, onSelect, theme, onToggleTheme }) {
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center">
        <div className="w-full">
          <div className="mb-4 flex justify-end"><button type="button" onClick={onToggleTheme} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">{theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>} {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</button></div>
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold">Pulse</h1>
            <p className="mt-3 text-lg text-slate-400">Selecione um perfil para continuar</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <button
              onClick={() => onSelect(null)}
              className="group h-48 rounded-2xl border border-white/10 bg-slate-700/60 p-4 transition hover:-translate-y-1 hover:border-white/20"
            >
              <div className="flex h-full flex-col items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10">
                  <Users className="h-8 w-8" />
                </div>
                <span className="mt-3 font-semibold">Geral</span>
                <span className="text-xs text-slate-400">Todos os perfis</span>
              </div>
            </button>

            {profiles.filter(p => p.active !== false).map(profile => (
              <button
                key={profile.id}
                onClick={() => onSelect(profile)}
                className={`group relative h-48 overflow-hidden rounded-2xl border border-white/10 transition hover:-translate-y-1 hover:border-blue-400/50 ${profile.avatar ? 'bg-slate-800' : `bg-gradient-to-br ${profile.avatar_color}`}`}
              >
                {profile.avatar && <img src={profile.avatar} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />}
                {profile.avatar && <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />}
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-white">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-white/20 text-2xl font-bold shadow-lg backdrop-blur-sm">{profile.name.charAt(0).toUpperCase()}</div>
                  <span className="mt-3 font-semibold text-white drop-shadow-md">{profile.name}</span>
                </div>
              </button>
            ))}

            <button className="h-48 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.03] p-4 text-slate-400">
              <div className="flex h-full flex-col items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <Plus className="h-8 w-8" />
                </div>
                <span className="mt-3 font-medium">Novo Perfil</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
