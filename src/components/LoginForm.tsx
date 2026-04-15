import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Props {
  onLogin: () => void;
}

export default function LoginForm({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Credenciales incorrectas.');
    } else {
      onLogin();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-mirage flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 bg-white/5 rounded-2xl p-8"
      >
        <div className="flex flex-col gap-1 mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            La Tinta Cafebrería
          </p>
          <h1 className="text-2xl font-semibold text-white">Administrar</h1>
        </div>

        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Correo"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="bg-white/10 text-white placeholder-white/30 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-white/30"
          />
          <input
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="bg-white/10 text-white placeholder-white/30 text-sm rounded-lg px-3 py-2.5 outline-none focus:ring-1 focus:ring-white/30"
          />
        </div>

        {error && (
          <p className="text-red-400 text-xs">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-white/15 hover:bg-white/25 disabled:opacity-30 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
