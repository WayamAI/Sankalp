import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge, PriorityTag, MaterialBar } from '@/components/shared/StatusBadge';
import { orders, type OrderStatus, type Priority, type Factory, formatRevenue } from '@/data/mockData';
import { Search, Download, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

type SortKey = 'id' | 'customer' | 'productLine' | 'priority' | 'deliveryDate' | 'daysToDelivery' | 'materialStatus' | 'status' | 'revenue';

export default function ActiveOrders() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [factoryFilter, setFactoryFilter] = useState<Factory | 'All'>('All');
  const [productFilter, setProductFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('daysToDelivery');
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== 'All') list = list.filter(o => o.status === statusFilter);
    if (factoryFilter !== 'All') list = list.filter(o => o.factory === factoryFilter);
    if (productFilter !== 'All') list = list.filter(o => o.productLine === productFilter);
    if (priorityFilter !== 'All') list = list.filter(o => o.priority === priorityFilter);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(o => o.id.toLowerCase().includes(s) || o.customer.toLowerCase().includes(s) || o.product.toLowerCase().includes(s));
    }
    list.sort((a, b) => {
      let va: any = a[sortKey], vb: any = b[sortKey];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb as string).toLowerCase(); }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [statusFilter, factoryFilter, productFilter, priorityFilter, search, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const totalRevenue = filtered.reduce((sum, o) => sum + o.revenue, 0);
  const avgDays = Math.round(filtered.reduce((sum, o) => sum + o.daysToDelivery, 0) / (filtered.length || 1));

  const productLines = ['All', 'GT-7000', 'GT-9500', 'ST-4000', 'CP-2200', 'GP-6000', 'GP-8500'];

  return (
    <AppLayout>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-display-xl text-foreground">Active Orders</h2>
          <button onClick={() => toast.success('Export initiated')} className="flex items-center gap-1.5 text-xs px-3 py-1.5 border rounded text-muted-foreground hover:text-foreground hover:bg-muted/50">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="text-xs px-2 py-1.5 border rounded bg-background text-foreground">
            <option value="All">All Status</option>
            <option>On Track</option><option>At Risk</option><option>Critical</option><option>Delayed</option>
          </select>
          <select value={factoryFilter} onChange={e => setFactoryFilter(e.target.value as any)} className="text-xs px-2 py-1.5 border rounded bg-background text-foreground">
            <option value="All">All Factories</option>
            <option>Pune</option><option>Vadodara</option><option>Unassigned</option>
          </select>
          <select value={productFilter} onChange={e => setProductFilter(e.target.value)} className="text-xs px-2 py-1.5 border rounded bg-background text-foreground">
            {productLines.map(p => <option key={p} value={p}>{p === 'All' ? 'All Products' : p}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as any)} className="text-xs px-2 py-1.5 border rounded bg-background text-foreground">
            <option value="All">All Priority</option>
            <option>P1</option><option>P2</option><option>P3</option><option>P4</option>
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Batch actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 p-2 bg-primary/5 border border-primary/20 rounded mb-3">
            <span className="text-xs font-medium text-primary">{selected.size} selected</span>
            <button onClick={() => toast.success('Orders assigned')} className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded">Assign to Factory</button>
            <button onClick={() => toast.success('Priority updated')} className="text-xs px-2 py-1 border rounded text-foreground">Change Priority</button>
            <button onClick={() => navigate('/simulate')} className="text-xs px-2 py-1 border rounded text-foreground">Run Simulation</button>
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded border overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-8"><input type="checkbox" className="rounded" onChange={e => {
                  if (e.target.checked) setSelected(new Set(filtered.map(o => o.id)));
                  else setSelected(new Set());
                }} /></th>
                <th onClick={() => toggleSort('id')} className="cursor-pointer">Order ID <ArrowUpDown className="inline w-3 h-3" /></th>
                <th onClick={() => toggleSort('customer')}>Customer <ArrowUpDown className="inline w-3 h-3" /></th>
                <th>Product</th>
                <th>Qty</th>
                <th onClick={() => toggleSort('priority')}>Priority <ArrowUpDown className="inline w-3 h-3" /></th>
                <th>Factory</th>
                <th>Planned Start</th>
                <th onClick={() => toggleSort('deliveryDate')}>Delivery <ArrowUpDown className="inline w-3 h-3" /></th>
                <th onClick={() => toggleSort('daysToDelivery')}>Days <ArrowUpDown className="inline w-3 h-3" /></th>
                <th onClick={() => toggleSort('materialStatus')}>Material <ArrowUpDown className="inline w-3 h-3" /></th>
                <th onClick={() => toggleSort('status')}>Status <ArrowUpDown className="inline w-3 h-3" /></th>
                <th onClick={() => toggleSort('revenue')} className="text-right">Revenue <ArrowUpDown className="inline w-3 h-3" /></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} onClick={() => navigate(`/orders/${o.id}`)}>
                  <td onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleSelect(o.id)} className="rounded" />
                  </td>
                  <td className="font-mono text-xs text-primary font-medium">{o.id}</td>
                  <td className="text-xs max-w-[120px] truncate">{o.customer}</td>
                  <td className="text-[11px] text-muted-foreground max-w-[140px] truncate">{o.product}</td>
                  <td className="text-xs font-mono text-center">{o.quantity}</td>
                  <td><PriorityTag priority={o.priority} /></td>
                  <td className="text-xs">{o.factory}</td>
                  <td className="text-xs text-muted-foreground font-mono">{o.plannedStart}</td>
                  <td className="text-xs font-mono">{o.deliveryDate}</td>
                  <td className="text-xs font-mono text-center">{o.daysToDelivery}</td>
                  <td><MaterialBar percentage={o.materialStatus} /></td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-xs font-mono text-right font-medium">{formatRevenue(o.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
          <span>Showing {filtered.length} of {orders.length} orders</span>
          <span>Total revenue: ₹{totalRevenue} Cr • Avg. days to delivery: {avgDays}</span>
        </div>
      </div>
    </AppLayout>
  );
}
