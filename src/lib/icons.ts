/**
 * Central icon registry — the single place that maps semantic icon names to
 * source glyphs. Components render icons through <AppIcon name="…" /> so the
 * underlying library can be swapped here without touching call sites.
 *
 * Source: lucide-react (already the project's icon dependency and the library
 * used by every shadcn/ui primitive). Outline style; stroke weight is unified
 * globally in index.css. Named imports keep the bundle tree-shaken.
 */
import {
  AlertTriangle, ArrowDown, ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUp,
  ArrowUpDown, ArrowUpRight, BarChart3, Bell, Building2, Calendar, Check,
  CheckCircle, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ClipboardList,
  Clock, Database, Download, ExternalLink, Factory, FileBarChart, FileText,
  GitCompareArrows, Grid3X3, Info, LayoutDashboard, Link2, LogOut, Menu,
  MessageSquare, Moon, Package, PanelLeftClose, PanelLeftOpen, Radio, RefreshCw, Search, Send, Settings, Shield,
  ShieldAlert, SlidersHorizontal, Sun, TrendingDown, TrendingUp, Truck, User, Users,
  Wifi, X, XCircle,
} from 'lucide-react';

export const icons = {
  // Navigation
  dashboard: LayoutDashboard,
  orders: ClipboardList,
  document: FileText,
  matrix: Grid3X3,
  calendar: Calendar,
  signals: Radio,
  compare: GitCompareArrows,
  chart: BarChart3,
  factory: Factory,
  plant: Building2,
  allocation: ArrowLeftRight,
  materials: Package,
  suppliers: Users,
  trend: TrendingUp,
  trendDown: TrendingDown,
  report: FileBarChart,
  link: Link2,
  settings: Settings,
  sliders: SlidersHorizontal,
  notification: Bell,

  // Actions
  search: Search,
  download: Download,
  externalLink: ExternalLink,
  refresh: RefreshCw,
  send: Send,
  chat: MessageSquare,
  menu: Menu,
  sidebarCollapse: PanelLeftClose,
  sidebarExpand: PanelLeftOpen,
  themeLight: Sun,
  themeDark: Moon,
  logout: LogOut,
  close: X,
  check: Check,

  // Direction
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  arrowUpRight: ArrowUpRight,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  sort: ArrowUpDown,

  // System / status
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
  shield: Shield,
  risk: ShieldAlert,
  clock: Clock,
  user: User,
  database: Database,
  connection: Wifi,
  logistics: Truck,
} as const;

export type IconName = keyof typeof icons;
