/**
 * Illustrated 3D "marks" (src/assets/marks/*.png) — used beside page titles
 * and in the top-right of KPI cards, mirroring the Chronos layout. Line icons
 * (AppIcon) remain the choice for nav, buttons and inline UI.
 */
import { cn } from '@/lib/utils';

const files = import.meta.glob('@/assets/marks/*.png', { eager: true, import: 'default' }) as Record<string, string>;

const marks: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.split('/').pop()!.replace('.png', ''), url]),
);

export type MarkName = string;

interface MarkProps {
  name: MarkName;
  /** Rendered px size. Chronos uses 44 for page titles, 36 for KPI cards. */
  size?: number;
  className?: string;
}

export function Mark({ name, size = 36, className }: MarkProps) {
  const src = marks[name];
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      width={size}
      height={size}
      draggable={false}
      className={cn('pointer-events-none shrink-0 select-none object-contain', className)}
      style={{ width: size, height: size }}
    />
  );
}
