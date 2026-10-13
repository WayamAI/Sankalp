import { cn } from '@/lib/utils';
import type { IconName } from '@/lib/icons';
import { AppIcon } from '@/components/ui/app-icon';

interface SidebarItemProps {
  icon: IconName;
  label: string;
  active?: boolean;
  badge?: number;
  /** Icon-only circular control used by the collapsed rail. */
  compact?: boolean;
  onClick: () => void;
}

/**
 * Navigation item. Inactive: surface.action chip + icon.tertiary.
 * Hover: surface.raised + icon.secondary. Active: inverse chip
 * (action-surface.primary + icon.on-color).
 */
export function SidebarItem({ icon, label, active, badge, compact, onClick }: SidebarItemProps) {
  const chip = cn(
    'flex items-center justify-center rounded-full flex-shrink-0 transition-colors duration-150',
    active
      ? 'bg-action-primary text-icon-on-color'
      : 'bg-action text-icon-tertiary group-hover:bg-raised-2 group-hover:text-icon-secondary',
  );

  if (compact) {
    return (
      <button
        onClick={onClick}
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        title={label}
        className={cn('group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-full', chip, 'w-9 h-9')}
      >
        <AppIcon name={icon} size="md" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group w-full flex items-center gap-3 rounded-full pr-3 text-label-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        active ? 'text-foreground' : 'text-tertiary hover:text-secondary',
      )}
    >
      <span className={cn(chip, 'w-9 h-9')}>
        <AppIcon name={icon} size="md" />
      </span>
      <span className="flex-1 text-left truncate">{label}</span>
      {badge ? (
        <span className="min-w-4 h-4 px-1 rounded-full bg-status-critical text-[10px] font-semibold tabular-nums flex items-center justify-center text-on-color">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
