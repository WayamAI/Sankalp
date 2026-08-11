import React, { useState, useEffect } from 'react';
import logoImg from '@/assets/brand/logo-light.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, FileText, Grid3X3,
  Calendar, GitCompareArrows, BarChart3, Radio,
  Factory, Building2, ArrowLeftRight,
  Package, Users, AlertTriangle,
  TrendingUp, FileBarChart, ArrowUpDown,
  Link2, RefreshCw,
  Settings, SlidersHorizontal, Bell,
  ChevronDown, ChevronRight, Menu,
  LogOut, User
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const navSections: NavSection[] = [
  {
    title: '',
    defaultOpen: true,
    items: [
      { label: 'Command Center', path: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Order Book',
    defaultOpen: true,
    items: [
      { label: 'Active Orders', path: '/orders', icon: <ClipboardList className="w-4 h-4" /> },
      { label: 'Order Detail', path: '/orders/PF-2025-0012', icon: <FileText className="w-4 h-4" /> },
      { label: 'Priority Matrix', path: '/priority-matrix', icon: <Grid3X3 className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Plan & Simulate',
    defaultOpen: true,
    items: [
      { label: 'Production Plan', path: '/production-plan', icon: <Calendar className="w-4 h-4" /> },
      { label: 'Scenario Intelligence', path: '/scenario-intelligence', icon: <Radio className="w-4 h-4" /> },
      { label: 'Scenario Simulator', path: '/simulate', icon: <GitCompareArrows className="w-4 h-4" /> },
      { label: 'Plan Comparison', path: '/plan-comparison', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Factory Operations',
    defaultOpen: false,
    items: [
      { label: 'Pune Plant', path: '/factory/pune', icon: <Factory className="w-4 h-4" /> },
      { label: 'Vadodara Plant', path: '/factory/vadodara', icon: <Building2 className="w-4 h-4" /> },
      { label: 'Multi-Plant Allocation', path: '/allocation', icon: <ArrowLeftRight className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Supply Chain',
    defaultOpen: false,
    items: [
      { label: 'Material Availability', path: '/materials', icon: <Package className="w-4 h-4" /> },
      { label: 'Supplier Performance', path: '/suppliers', icon: <Users className="w-4 h-4" /> },
      { label: 'Disruption Tracker', path: '/disruptions', icon: <AlertTriangle className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Demand Intelligence',
    defaultOpen: false,
    items: [
      { label: 'Demand Forecast', path: '/demand-forecast', icon: <TrendingUp className="w-4 h-4" /> },
      { label: 'Demand Change Log', path: '/demand-changes', icon: <FileBarChart className="w-4 h-4" /> },
      { label: 'Pull-In / Push-Out', path: '/pull-in-push-out', icon: <ArrowUpDown className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Integrations',
    defaultOpen: false,
    items: [
      { label: 'Connected Systems', path: '/integrations', icon: <Link2 className="w-4 h-4" /> },
      { label: 'Data Sync Status', path: '/integrations', icon: <RefreshCw className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Settings',
    defaultOpen: false,
    items: [
      { label: 'Planning Parameters', path: '/settings', icon: <Settings className="w-4 h-4" /> },
      { label: 'Constraint Config', path: '/settings', icon: <SlidersHorizontal className="w-4 h-4" /> },
      { label: 'Alert Rules', path: '/settings', icon: <Bell className="w-4 h-4" /> },
    ],
  },
];

const alertCounts: Record<string, number> = {
  'Active Orders': 3,
  'Disruption Tracker': 6,
  'Material Availability': 4,
};

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Auto-open any section that contains the active route
  const getInitialOpen = () => {
    const result: Record<string, boolean> = {};
    for (const section of navSections) {
      const hasActiveItem = section.items.some(item => isActive(item.path));
      result[section.title] = hasActiveItem || (section.defaultOpen ?? false);
    }
    return result;
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(getInitialOpen);

  // Keep sections open when route changes
  React.useEffect(() => {
    setOpenSections(prev => {
      const next = { ...prev };
      for (const section of navSections) {
        if (section.items.some(item => isActive(item.path))) {
          next[section.title] = true;
        }
      }
      return next;
    });
  }, [location.pathname]);

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  if (collapsed) {
    return (
      <div className="w-14 bg-sidebar flex flex-col items-center py-3 border-r border-sidebar-border flex-shrink-0">
        <button onClick={() => setCollapsed(false)} className="text-sidebar-foreground hover:text-sidebar-accent-foreground mb-4">
          <Menu className="w-5 h-5" />
        </button>
        {navSections.flatMap(s => s.items).slice(0, 10).map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`w-9 h-9 rounded flex items-center justify-center mb-1 transition-colors ${
              isActive(item.path) ? 'bg-sidebar-accent text-sidebar-primary' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-56 bg-sidebar flex flex-col border-r border-sidebar-border flex-shrink-0 h-screen overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <img src={logoImg} alt="Wayam AI" className="w-14 h-14 object-contain object-left" />
            <h1 className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">PlanMaster AI</h1>
            <p className="text-[9px] text-sidebar-muted tracking-widest uppercase">Wayam AI</p>
          </div>
          <button onClick={() => setCollapsed(true)} className="text-sidebar-muted hover:text-sidebar-foreground self-start mt-1">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navSections.map((section, si) => (
          <div key={si} className="mb-1">
            {section.title && (
              <button
                onClick={() => toggleSection(section.title)}
                className="sidebar-section-label w-full flex items-center justify-between hover:text-sidebar-foreground"
              >
                {section.title}
                {openSections[section.title] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            )}
            {(openSections[section.title] || !section.title) && (
              <div className="space-y-0.5 px-2">
                {section.items.map((item, ii) => (
                  <button
                    key={ii}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition-colors ${
                      isActive(item.path)
                        ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.label}</span>
                    {alertCounts[item.label] && (
                      <span className="w-4 h-4 rounded-full bg-status-critical text-[9px] font-bold flex items-center justify-center text-primary-foreground">
                        {alertCounts[item.label]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-sidebar-accent-foreground truncate">R. Krishnamurthy</p>
            <p className="text-[9px] text-sidebar-muted">Production Planner</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-sidebar-muted hover:text-sidebar-foreground"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
