import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, Shield, User } from 'lucide-react';
import { validateLoginInput } from '@/lib/loginValidation';
import logoImg from '@/assets/brand/logo-light.svg';

const roles = [
  { id: 'planner', label: 'Production Planner', desc: 'Full access to order management, simulation, replanning', icon: <Factory className="w-5 h-5" /> },
  { id: 'supply', label: 'Supply Chain Manager', desc: 'Supplier views, material availability, disruption tracking', icon: <User className="w-5 h-5" /> },
  { id: 'director', label: 'Operations Director', desc: 'Dashboards, multi-factory views, financial impact', icon: <Shield className="w-5 h-5" /> },
  { id: 'executive', label: 'Executive', desc: 'Full access with summary dashboard', icon: <Shield className="w-5 h-5" /> },
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
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoImg} alt="Wayam AI" className="w-20 h-20 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-sidebar-accent-foreground tracking-tight">PlanMaster AI</h1>
          <p className="text-xs text-sidebar-muted tracking-widest uppercase mt-1">Intelligent Order Simulation & Replanning</p>
        </div>

        <form onSubmit={handleLogin} noValidate className="bg-card rounded-lg border p-6 shadow-xl space-y-5">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(null); }}
              className="w-full px-3 py-2 text-sm border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(null); }}
              placeholder="Enter password"
              className="w-full px-3 py-2 text-sm border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive -mt-2">{error}</p>
          )}

          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block mb-2">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(role => (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3 rounded border text-left transition-colors ${
                    selectedRole === role.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className={`mb-1 ${selectedRole === role.id ? 'text-primary' : 'text-muted-foreground'}`}>{role.icon}</div>
                  <p className="text-xs font-medium text-foreground">{role.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{role.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>

          <p className="text-center text-[10px] text-muted-foreground">
            Connected to Oracle ERP • MES Pune & Vadodara • Salesforce CRM
          </p>
        </form>
      </div>
    </div>
  );
}
