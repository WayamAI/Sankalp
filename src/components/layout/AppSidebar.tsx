import React, { useState, useEffect } from 'react';
import logoDark from '@/assets/brand/logo-dark.svg';
import logoLight from '@/assets/brand/logo-light.svg';
import { useTheme } from 'next-themes';
import { useNavigate, useLocation } from 'react-router-dom';
import type { IconName } from '@/lib/icons';
import { AppIcon } from '@/components/ui/app-icon';
import { IconButton } from '@/components/ui/icon-button';
import { SidebarItem } from './SidebarItem';

interface NavItem {
  label: string;
  path: string;
  icon: IconName;
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
      { label: 'Command Center', path: '/', icon: 'dashboard' },
    ],
  },
  {
    title: 'Order Book',
    defaultOpen: true,
    items: [
      { label: 'Active Orders', path: '/orders', icon: 'orders' },
      { label: 'Order Detail', path: '/orders/PF-2025-0012', icon: 'document' },
      { label: 'Priority Matrix', path: '/priority-matrix', icon: 'matrix' },
    ],
  },
  {
    title: 'Plan & Simulate',
    defaultOpen: true,
    items: [
      { label: 'Production Plan', path: '/production-plan', icon: 'calendar' },
      { label: 'Scenario Intelligence', path: '/scenario-intelligence', icon: 'signals' },
      { label: 'Scenario Simulator', path: '/simulate', icon: 'compare' },
      { label: 'Plan Comparison', path: '/plan-comparison', icon: 'chart' },
    ],
  },
  {
    title: 'Factory Operations',
    defaultOpen: false,
    items: [
      { label: 'Pune Plant', path: '/factory/pune', icon: 'factory' },
      { label: 'Vadodara Plant', path: '/factory/vadodara', icon: 'plant' },
      { label: 'Multi-Plant Allocation', path: '/allocation', icon: 'allocation' },
    ],
  },
  {
    title: 'Supply Chain',
    defaultOpen: false,
    items: [
      { label: 'Material Availability', path: '/materials', icon: 'materials' },
      { label: 'Supplier Performance', path: '/suppliers', icon: 'suppliers' },
      { label: 'Disruption Tracker', path: '/disruptions', icon: 'warning' },
    ],
  },
  {
    title: 'Demand Intelligence',
    defaultOpen: false,
    items: [
      { label: 'Demand Forecast', path: '/demand-forecast', icon: 'trend' },
      { label: 'Demand Change Log', path: '/demand-changes', icon: 'report' },
      { label: 'Pull-In / Push-Out', path: '/pull-in-push-out', icon: 'sort' },
    ],
  },
  {
    title: 'Integrations',
    defaultOpen: false,
    items: [
      { label: 'Connected Systems', path: '/integrations', icon: 'link' },
      { label: 'Data Sync Status', path: '/integrations', icon: 'refresh' },
    ],
  },
  {
    title: 'Settings',
    defaultOpen: false,
    items: [
      { label: 'Planning Parameters', path: '/settings', icon: 'settings' },
      { label: 'Constraint Config', path: '/settings', icon: 'sliders' },
      { label: 'Alert Rules', path: '/settings', icon: 'notification' },
    ],
  },
];

const alertCounts: Record<string, number> = {
  'Active Orders': 3,
  'Disruption Tracker': 6,
  'Material Availability': 4,
};

// Start collapsed on narrow viewports; the user can still expand it.
const prefersCollapsed = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(max-width: 1023px)').matches;

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(prefersCollapsed);
  const { resolvedTheme, setTheme } = useTheme();
  const isLight = resolvedTheme === 'light';
  const toggleTheme = () => setTheme(isLight ? 'dark' : 'light');
  const themeLabel = isLight ? 'Switch to dark mode' : 'Switch to light mode';
  const themeIcon = isLight ? 'themeDark' : 'themeLight';

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

  // Brand bar: 56px, mark + wordmark on one line; mark only when collapsed.
  const brand = (
    <div className={`flex h-14 shrink-0 items-center border-b border-sidebar-border ${collapsed ? 'justify-center' : 'gap-2.5 px-4'}`}>
      <img src={isLight ? logoLight : logoDark} alt="Wayam AI" className="w-8 h-8 shrink-0 object-contain" />
      {!collapsed && (
        <h1 className="font-display text-display-lg uppercase tracking-[0.14em] text-foreground whitespace-nowrap">Sankalp</h1>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <div className="w-[68px] bg-sidebar flex flex-col border-r border-sidebar-border flex-shrink-0 h-screen">
        {brand}
        <nav aria-label="Primary" className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center gap-1.5 py-3">
          {navSections.flatMap(s => s.items).map((item, i) => (
            <SidebarItem
              key={i}
              compact
              icon={item.icon}
              label={item.label}
              active={isActive(item.path)}
              onClick={() => navigate(item.path)}
            />
          ))}
        </nav>
        <div className="flex shrink-0 flex-col items-center gap-1.5 border-t border-sidebar-border py-3">
          <SidebarItem compact icon={themeIcon} label={themeLabel} onClick={toggleTheme} />
          <SidebarItem compact icon="sidebarExpand" label="Expand sidebar" onClick={() => setCollapsed(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[252px] bg-sidebar flex flex-col border-r border-sidebar-border flex-shrink-0 h-screen overflow-hidden">
      {brand}

      {/* Nav */}
      <nav aria-label="Primary" className="flex-1 overflow-y-auto py-3">
        {navSections.map((section, si) => (
          <div key={si} className="mb-1.5">
            {section.title && (
              <button
                onClick={() => toggleSection(section.title)}
                aria-expanded={!!openSections[section.title]}
                className="sidebar-section-label w-full flex items-center justify-between transition-colors hover:text-secondary"
              >
                {section.title}
                <AppIcon name={openSections[section.title] ? 'chevronDown' : 'chevronRight'} size="xs" />
              </button>
            )}
            {(openSections[section.title] || !section.title) && (
              <div className="flex flex-col gap-1.5 px-3">
                {section.items.map((item, ii) => (
                  <SidebarItem
                    key={ii}
                    icon={item.icon}
                    label={item.label}
                    active={isActive(item.path)}
                    badge={alertCounts[item.label]}
                    onClick={() => navigate(item.path)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer: collapse control + user */}
      <div className="flex flex-col gap-3 px-3 py-3 border-t border-sidebar-border">
        <SidebarItem icon={themeIcon} label={isLight ? 'Dark mode' : 'Light mode'} onClick={toggleTheme} />
        <SidebarItem icon="sidebarCollapse" label="Collapse sidebar" onClick={() => setCollapsed(true)} />
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-action flex items-center justify-center flex-shrink-0">
            <AppIcon name="user" size="sm" className="text-icon-tertiary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-label-sm text-foreground truncate">R. Krishnamurthy</p>
            <p className="text-caption text-tertiary">Production Planner</p>
          </div>
          <IconButton icon="logout" label="Sign out" size="sm" onClick={() => navigate('/login')} />
        </div>
      </div>
    </div>
  );
}
