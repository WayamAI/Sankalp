import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppIcon } from '@/components/ui/app-icon';
import type { IconName } from '@/lib/icons';
import { validateLoginInput } from '@/lib/loginValidation';
import logoImg from '@/assets/brand/logo-dark.svg';

const roles: { id: string; label: string; desc: string; icon: IconName }[] = [
  { id: 'planner', label: 'Production Planner', desc: 'Full access to order management, simulation, replanning', icon: 'factory' },
  { id: 'supply', label: 'Supply Chain Manager', desc: 'Supplier views, material availability, disruption tracking', icon: 'user' },
  { id: 'director', label: 'Operations Director', desc: 'Dashboards, multi-factory views, financial impact', icon: 'shield' },
  { id: 'executive', label: 'Executive', desc: 'Full access with summary dashboard', icon: 'shield' },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState('planner');
  const [email, setEmail] = useState('r.krishnamurthy@planmaster.ai');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateLoginInput(email, password);
    if (!result.valid) {
      setError(result.error);
      return;
    }
    setError(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoImg} alt="Wayam AI" className="w-16 h-16 mx-auto mb-4" />
          <h1 className="font-display text-display-2xl text-foreground">Sankalp</h1>
          <p className="text-caption text-tertiary tracking-widest uppercase mt-2">Intelligent Order Simulation & Replanning</p>
        </div>

        <form onSubmit={handleLogin} noValidate className="bg-container rounded-xl border p-6 space-y-5">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(null); }}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-raised text-foreground transition-colors duration-150 focus:outline-none focus:border-active focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(null); }}
              placeholder="Enter password"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-raised text-foreground transition-colors duration-150 placeholder:text-tertiary focus:outline-none focus:border-active focus:ring-1 focus:ring-ring"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-error -mt-2">{error}</p>
          )}

          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(role => (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3 rounded-lg border text-left transition-colors duration-150 ${
                    selectedRole === role.id
                      ? 'border-active bg-raised-2'
                      : 'border-border hover:bg-raised'
                  }`}
                >
                  <div className={`mb-1.5 ${selectedRole === role.id ? 'text-icon-primary' : 'text-icon-tertiary'}`}><AppIcon name={role.icon} size="xl" /></div>
                  <p className="text-xs font-medium text-foreground">{role.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{role.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-action-primary text-on-color text-label-md rounded-lg hover:bg-action-primary-hover transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Sign In
          </button>

          <p className="text-center text-caption text-tertiary">
            Connected to Oracle ERP • MES Pune & Vadodara • Salesforce CRM
          </p>
        </form>
      </div>
    </div>
  );
}
