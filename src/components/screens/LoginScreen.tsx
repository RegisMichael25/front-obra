import { useState } from 'react';
import { HardHat } from 'lucide-react';
import { api } from '../../services/api';

interface LoginScreenProps {
  onLogin: (token: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [chave, setChave] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegistering) {
        // Fluxo de Registro
        await api.post('/auth/register', { chave, senha });
        setSuccess('Usuário registrado com sucesso! Você já pode fazer o login.');
        setIsRegistering(false);
        setSenha('');
      } else {
        // Fluxo de Login
        const response = await api.post<{ token: string, type: string }>('/auth/login', {
          chave,
          senha
        });
        onLogin(response.token);
      }
    } catch (err: any) {
      setError(err.message || (isRegistering ? 'Erro ao registrar usuário' : 'Credenciais inválidas'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-brand-green">
          <HardHat size={48} />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Gestão de Obras
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {isRegistering ? 'Crie uma nova conta' : 'Faça login para acessar o sistema'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-brand-card-dark py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-100 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Chave de Acesso
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={chave}
                  onChange={(e) => setChave(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm bg-transparent dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Senha
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm bg-transparent dark:text-white"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="text-emerald-500 text-sm font-medium bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                {success}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-green-dark bg-brand-green hover:bg-brand-green-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green disabled:opacity-50"
              >
                {loading ? 'Aguarde...' : isRegistering ? 'Cadastrar' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
              }}
              className="text-sm font-medium text-slate-500 hover:text-brand-green transition-colors"
            >
              {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem conta? Registre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
