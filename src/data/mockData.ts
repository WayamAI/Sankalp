export type OrderStatus = 'On Track' | 'At Risk' | 'Critical' | 'Delayed' | 'Completed';
export type Priority = 'P1' | 'P2' | 'P3' | 'P4';
export type Factory = 'Pune' | 'Vadodara' | 'Unassigned';

export interface Order {
  id: string;
  customer: string;
  productLine: string;
  product: string;
  quantity: number;
  priority: Priority;
  factory: Factory;
  assemblyBay?: string;
  plannedStart: string;
  deliveryDate: string;
  daysToDelivery: number;
  materialStatus: number;
  status: OrderStatus;
  revenue: number; // in Cr
  orderDate: string;
  contractRef: string;
  unitPrice: number;
  currentForecast?: string;
  stages: OrderStage[];
}

export interface OrderStage {
  name: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'delayed';
}

export interface Supplier {
  id: string;
  name: string;
  components: string;
  activeOrders: number;
  dependentOrders: number;
  onTimeRate: number;
  qualityScore: number;
  avgLeadTime: string;
  leadTimeTrend: string;
  riskScore: number;
  status: OrderStatus;
}

export interface Material {
  id: string;
  component: string;
  requiredNext90: number;
  available: number;
  shortfall: number;
  ordersAffected: number;
  revenueAffected: number;
  primarySupplier: string;
  expectedResupply: string;
  status: 'Critical' | 'Warning' | 'OK';
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  ordersAffected?: number;
  revenueImpact?: string;
}

export interface Disruption {
  id: string;
  type: string;
  source: string;
  description: string;
  ordersAffected: number;
  revenueImpact: string;
  detected: string;
  status: string;
  owner: string;
}

export interface DemandChange {
  changeId: string;
  orderId: string;
  customer: string;
  originalDelivery: string;
  requestedDelivery: string;
  shiftDays: number;
  direction: 'Pull-In' | 'Push-Out';
  impactAssessment: string;
  status: string;
}

export interface Integration {
  name: string;
  description: string;
  lastSync: string;
  status: 'Green' | 'Amber' | 'Red';
  records24h: number;
  dataQuality: number;
  connectorType: string;
}

export const orders: Order[] = [
  { id: 'PF-2025-0012', customer: 'NTPC Ltd.', productLine: 'GT-9500', product: 'GT-9500E Gas Turbine Package', quantity: 2, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 3', plannedStart: '14 Apr 2026', deliveryDate: '22 Sep 2026', daysToDelivery: 183, materialStatus: 91, status: 'On Track', revenue: 164, orderDate: '12 Aug 2025', contractRef: 'NTPC/GT/2025/0312', unitPrice: 82, stages: [
    { name: 'Engineering', plannedStart: '14 Apr 2026', plannedEnd: '12 May 2026', actualStart: '14 Apr 2026', status: 'completed' },
    { name: 'Procurement', plannedStart: '20 Apr 2026', plannedEnd: '15 Jun 2026', actualStart: '22 Apr 2026', status: 'in-progress' },
    { name: 'Fabrication', plannedStart: '01 Jun 2026', plannedEnd: '20 Jul 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '21 Jul 2026', plannedEnd: '25 Aug 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '26 Aug 2026', plannedEnd: '12 Sep 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '13 Sep 2026', plannedEnd: '22 Sep 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0034', customer: 'Adani Power Ltd.', productLine: 'GT-7000', product: 'GT-7000F Gas Turbine', quantity: 4, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 1', plannedStart: '28 Mar 2026', deliveryDate: '18 Jul 2026', daysToDelivery: 117, materialStatus: 100, status: 'On Track', revenue: 88, orderDate: '05 Jun 2025', contractRef: 'ADANI/GT7/2025/088', unitPrice: 22, stages: [
    { name: 'Engineering', plannedStart: '28 Mar 2026', plannedEnd: '18 Apr 2026', actualStart: '28 Mar 2026', actualEnd: '16 Apr 2026', status: 'completed' },
    { name: 'Procurement', plannedStart: '01 Apr 2026', plannedEnd: '20 May 2026', actualStart: '02 Apr 2026', status: 'in-progress' },
    { name: 'Fabrication', plannedStart: '15 May 2026', plannedEnd: '18 Jun 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '19 Jun 2026', plannedEnd: '05 Jul 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '06 Jul 2026', plannedEnd: '14 Jul 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '15 Jul 2026', plannedEnd: '18 Jul 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0078', customer: 'Saudi Aramco — Jafurah Gas', productLine: 'CP-2200', product: 'CP-2200H Compressor Package', quantity: 6, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 2', plannedStart: '21 Apr 2026', deliveryDate: '30 Aug 2026', daysToDelivery: 160, materialStatus: 74, status: 'At Risk', revenue: 42, orderDate: '20 Sep 2025', contractRef: 'ARAMCO/CP/2025/JG-078', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '21 Apr 2026', plannedEnd: '15 May 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '28 Apr 2026', plannedEnd: '30 Jun 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '15 Jun 2026', plannedEnd: '25 Jul 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '26 Jul 2026', plannedEnd: '18 Aug 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '19 Aug 2026', plannedEnd: '27 Aug 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '28 Aug 2026', plannedEnd: '30 Aug 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0091', customer: 'Cairn Oil & Gas (Vedanta)', productLine: 'GP-6000', product: 'GP-6000A Generator Package', quantity: 3, priority: 'P2', factory: 'Vadodara', assemblyBay: 'Bay 1', plannedStart: '07 Apr 2026', deliveryDate: '12 Jun 2026', daysToDelivery: 81, materialStatus: 96, status: 'On Track', revenue: 21, orderDate: '18 Jul 2025', contractRef: 'CAIRN/GP/2025/V-091', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '07 Apr 2026', plannedEnd: '22 Apr 2026', actualStart: '07 Apr 2026', actualEnd: '20 Apr 2026', status: 'completed' },
    { name: 'Procurement', plannedStart: '10 Apr 2026', plannedEnd: '15 May 2026', actualStart: '12 Apr 2026', status: 'in-progress' },
    { name: 'Fabrication', plannedStart: '10 May 2026', plannedEnd: '28 May 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '29 May 2026', plannedEnd: '07 Jun 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '08 Jun 2026', plannedEnd: '11 Jun 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '11 Jun 2026', plannedEnd: '12 Jun 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0112', customer: 'Qatar Energy LNG', productLine: 'GT-9500', product: 'GT-9500E Gas Turbine Package', quantity: 3, priority: 'P1', factory: 'Unassigned', plannedStart: '—', deliveryDate: '30 Nov 2026', daysToDelivery: 252, materialStatus: 58, status: 'At Risk', revenue: 246, orderDate: '10 Oct 2025', contractRef: 'QE/LNG/2025/GT-112', unitPrice: 82, stages: [
    { name: 'Engineering', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Procurement', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Assembly', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0134', customer: 'JSW Energy', productLine: 'ST-4000', product: 'ST-4000C Steam Turbine', quantity: 2, priority: 'P2', factory: 'Vadodara', assemblyBay: 'Bay 2', plannedStart: '05 May 2026', deliveryDate: '28 Oct 2026', daysToDelivery: 219, materialStatus: 82, status: 'On Track', revenue: 36, orderDate: '22 Aug 2025', contractRef: 'JSW/ST/2025/E-134', unitPrice: 18, stages: [
    { name: 'Engineering', plannedStart: '05 May 2026', plannedEnd: '28 May 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '12 May 2026', plannedEnd: '10 Jul 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Jul 2026', plannedEnd: '15 Aug 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '16 Aug 2026', plannedEnd: '05 Oct 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '06 Oct 2026', plannedEnd: '22 Oct 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '23 Oct 2026', plannedEnd: '28 Oct 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0167', customer: 'GAIL Gas Processing', productLine: 'CP-2200', product: 'CP-2200H Compressor Package', quantity: 8, priority: 'P2', factory: 'Pune', assemblyBay: 'Bay 4', plannedStart: '12 May 2026', deliveryDate: '15 Dec 2026', daysToDelivery: 267, materialStatus: 69, status: 'At Risk', revenue: 56, orderDate: '15 Nov 2025', contractRef: 'GAIL/CP/2025/GP-167', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '12 May 2026', plannedEnd: '05 Jun 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '20 May 2026', plannedEnd: '30 Jul 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '15 Jul 2026', plannedEnd: '10 Sep 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '11 Sep 2026', plannedEnd: '20 Nov 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '21 Nov 2026', plannedEnd: '08 Dec 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '09 Dec 2026', plannedEnd: '15 Dec 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0189', customer: 'ONGC Offshore', productLine: 'GP-8500', product: 'GP-8500B Generator Package', quantity: 2, priority: 'P1', factory: 'Vadodara', assemblyBay: 'Bay 3', plannedStart: '01 Apr 2026', deliveryDate: '20 Jul 2026', daysToDelivery: 119, materialStatus: 88, status: 'On Track', revenue: 48, orderDate: '28 Jul 2025', contractRef: 'ONGC/GP85/2025/OFF-189', unitPrice: 24, stages: [
    { name: 'Engineering', plannedStart: '01 Apr 2026', plannedEnd: '20 Apr 2026', actualStart: '01 Apr 2026', actualEnd: '18 Apr 2026', status: 'completed' },
    { name: 'Procurement', plannedStart: '08 Apr 2026', plannedEnd: '25 May 2026', actualStart: '10 Apr 2026', status: 'in-progress' },
    { name: 'Fabrication', plannedStart: '20 May 2026', plannedEnd: '20 Jun 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '21 Jun 2026', plannedEnd: '10 Jul 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '11 Jul 2026', plannedEnd: '17 Jul 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '18 Jul 2026', plannedEnd: '20 Jul 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0201', customer: 'Petronas Carigali', productLine: 'GT-7000', product: 'GT-7000F Gas Turbine', quantity: 6, priority: 'P2', factory: 'Pune', assemblyBay: 'Bay 1', plannedStart: '18 May 2026', deliveryDate: '28 Jan 2027', daysToDelivery: 311, materialStatus: 45, status: 'At Risk', revenue: 132, orderDate: '02 Dec 2025', contractRef: 'PETRONAS/GT7/2025/C-201', unitPrice: 22, stages: [
    { name: 'Engineering', plannedStart: '18 May 2026', plannedEnd: '12 Jun 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '25 May 2026', plannedEnd: '15 Aug 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Aug 2026', plannedEnd: '15 Oct 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '16 Oct 2026', plannedEnd: '20 Dec 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '21 Dec 2026', plannedEnd: '15 Jan 2027', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '16 Jan 2027', plannedEnd: '28 Jan 2027', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0223', customer: 'Larsen & Toubro EPC', productLine: 'ST-4000', product: 'ST-4000C Steam Turbine', quantity: 4, priority: 'P3', factory: 'Unassigned', plannedStart: '—', deliveryDate: '15 Feb 2027', daysToDelivery: 329, materialStatus: 32, status: 'On Track', revenue: 72, orderDate: '18 Jan 2026', contractRef: 'LT/ST/2026/EPC-223', unitPrice: 18, stages: [
    { name: 'Engineering', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Procurement', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Assembly', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0245', customer: 'Reliance Energy Projects', productLine: 'GT-7000', product: 'GT-7000F Gas Turbine', quantity: 3, priority: 'P2', factory: 'Pune', assemblyBay: 'Bay 2', plannedStart: '02 Jun 2026', deliveryDate: '30 Oct 2026', daysToDelivery: 221, materialStatus: 77, status: 'On Track', revenue: 66, orderDate: '10 Nov 2025', contractRef: 'REL/GT7/2025/EP-245', unitPrice: 22, stages: [
    { name: 'Engineering', plannedStart: '02 Jun 2026', plannedEnd: '25 Jun 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '10 Jun 2026', plannedEnd: '05 Aug 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '20 Jul 2026', plannedEnd: '05 Sep 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '06 Sep 2026', plannedEnd: '12 Oct 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '13 Oct 2026', plannedEnd: '25 Oct 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '26 Oct 2026', plannedEnd: '30 Oct 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0267', customer: 'ADNOC Offshore Operations', productLine: 'CP-2200', product: 'CP-2200H Compressor Package', quantity: 4, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 4', plannedStart: '15 Apr 2026', deliveryDate: '10 Sep 2026', daysToDelivery: 171, materialStatus: 81, status: 'On Track', revenue: 28, orderDate: '01 Sep 2025', contractRef: 'ADNOC/CP/2025/OFF-267', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '15 Apr 2026', plannedEnd: '05 May 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '22 Apr 2026', plannedEnd: '25 Jun 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '10 Jun 2026', plannedEnd: '25 Jul 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '26 Jul 2026', plannedEnd: '25 Aug 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '26 Aug 2026', plannedEnd: '05 Sep 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '06 Sep 2026', plannedEnd: '10 Sep 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0289', customer: 'Thermax Process Equipment', productLine: 'GP-6000', product: 'GP-6000A Generator Package', quantity: 5, priority: 'P3', factory: 'Vadodara', assemblyBay: 'Bay 1', plannedStart: '22 Jun 2026', deliveryDate: '30 Nov 2026', daysToDelivery: 252, materialStatus: 62, status: 'At Risk', revenue: 35, orderDate: '05 Dec 2025', contractRef: 'THERMAX/GP/2025/PE-289', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '22 Jun 2026', plannedEnd: '15 Jul 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '01 Jul 2026', plannedEnd: '30 Aug 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '15 Aug 2026', plannedEnd: '30 Sep 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '01 Oct 2026', plannedEnd: '10 Nov 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '11 Nov 2026', plannedEnd: '25 Nov 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '26 Nov 2026', plannedEnd: '30 Nov 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0312', customer: 'BHEL (sub-contract)', productLine: 'ST-4000', product: 'ST-4000C Turbine Rotor Only', quantity: 8, priority: 'P3', factory: 'Vadodara', assemblyBay: 'Bay 2', plannedStart: '10 Jul 2026', deliveryDate: '15 Mar 2027', daysToDelivery: 357, materialStatus: 28, status: 'On Track', revenue: 44, orderDate: '20 Jan 2026', contractRef: 'BHEL/SUB/2026/ST-312', unitPrice: 5.5, stages: [
    { name: 'Engineering', plannedStart: '10 Jul 2026', plannedEnd: '05 Aug 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '20 Jul 2026', plannedEnd: '30 Sep 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '15 Sep 2026', plannedEnd: '30 Nov 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '01 Dec 2026', plannedEnd: '15 Feb 2027', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '16 Feb 2027', plannedEnd: '08 Mar 2027', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '09 Mar 2027', plannedEnd: '15 Mar 2027', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0156', customer: 'Tata Power Generation', productLine: 'GT-7000', product: 'GT-7000F Gas Turbine', quantity: 2, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 3', plannedStart: '10 Apr 2026', deliveryDate: '15 Aug 2026', daysToDelivery: 145, materialStatus: 94, status: 'On Track', revenue: 44, orderDate: '15 Jul 2025', contractRef: 'TATA/GT7/2025/PG-156', unitPrice: 22, stages: [
    { name: 'Engineering', plannedStart: '10 Apr 2026', plannedEnd: '30 Apr 2026', actualStart: '10 Apr 2026', status: 'in-progress' },
    { name: 'Procurement', plannedStart: '15 Apr 2026', plannedEnd: '10 Jun 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Jun 2026', plannedEnd: '10 Jul 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '11 Jul 2026', plannedEnd: '01 Aug 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '02 Aug 2026', plannedEnd: '12 Aug 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '13 Aug 2026', plannedEnd: '15 Aug 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0178', customer: 'ADNOC Offshore Operations', productLine: 'GT-9500', product: 'GT-9500E Gas Turbine Package', quantity: 1, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 3', plannedStart: '01 Jun 2026', deliveryDate: '15 Nov 2026', daysToDelivery: 237, materialStatus: 72, status: 'At Risk', revenue: 82, orderDate: '25 Oct 2025', contractRef: 'ADNOC/GT95/2025/OFF-178', unitPrice: 82, stages: [
    { name: 'Engineering', plannedStart: '01 Jun 2026', plannedEnd: '25 Jun 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '10 Jun 2026', plannedEnd: '15 Aug 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Aug 2026', plannedEnd: '20 Sep 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '21 Sep 2026', plannedEnd: '28 Oct 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '29 Oct 2026', plannedEnd: '10 Nov 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '11 Nov 2026', plannedEnd: '15 Nov 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0198', customer: 'Reliance Energy Projects', productLine: 'ST-4000', product: 'ST-4000C Steam Turbine', quantity: 3, priority: 'P2', factory: 'Vadodara', assemblyBay: 'Bay 2', plannedStart: '15 May 2026', deliveryDate: '20 Nov 2026', daysToDelivery: 242, materialStatus: 71, status: 'On Track', revenue: 54, orderDate: '28 Nov 2025', contractRef: 'REL/ST/2025/EP-198', unitPrice: 18, stages: [
    { name: 'Engineering', plannedStart: '15 May 2026', plannedEnd: '08 Jun 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '22 May 2026', plannedEnd: '20 Jul 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '10 Jul 2026', plannedEnd: '30 Aug 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '01 Sep 2026', plannedEnd: '25 Oct 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '26 Oct 2026', plannedEnd: '14 Nov 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '15 Nov 2026', plannedEnd: '20 Nov 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0215', customer: 'GAIL Gas Processing', productLine: 'GP-6000', product: 'GP-6000A Generator Package', quantity: 4, priority: 'P3', factory: 'Vadodara', assemblyBay: 'Bay 3', plannedStart: '01 Jul 2026', deliveryDate: '30 Dec 2026', daysToDelivery: 282, materialStatus: 55, status: 'At Risk', revenue: 28, orderDate: '12 Dec 2025', contractRef: 'GAIL/GP/2025/GP-215', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '01 Jul 2026', plannedEnd: '22 Jul 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '10 Jul 2026', plannedEnd: '10 Sep 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Sep 2026', plannedEnd: '15 Oct 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '16 Oct 2026', plannedEnd: '10 Dec 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '11 Dec 2026', plannedEnd: '24 Dec 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '25 Dec 2026', plannedEnd: '30 Dec 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0052', customer: 'NTPC Ltd.', productLine: 'ST-4000', product: 'ST-4000C Steam Turbine', quantity: 2, priority: 'P1', factory: 'Vadodara', assemblyBay: 'Bay 1', plannedStart: '20 Mar 2026', deliveryDate: '30 Jul 2026', daysToDelivery: 129, materialStatus: 97, status: 'On Track', revenue: 36, orderDate: '10 Jun 2025', contractRef: 'NTPC/ST/2025/0052', unitPrice: 18, stages: [
    { name: 'Engineering', plannedStart: '20 Mar 2026', plannedEnd: '10 Apr 2026', actualStart: '20 Mar 2026', actualEnd: '08 Apr 2026', status: 'completed' },
    { name: 'Procurement', plannedStart: '25 Mar 2026', plannedEnd: '20 May 2026', actualStart: '26 Mar 2026', status: 'in-progress' },
    { name: 'Fabrication', plannedStart: '10 May 2026', plannedEnd: '15 Jun 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '16 Jun 2026', plannedEnd: '15 Jul 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '16 Jul 2026', plannedEnd: '26 Jul 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '27 Jul 2026', plannedEnd: '30 Jul 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0301', customer: 'Saudi Aramco — Jafurah Gas', productLine: 'GT-9500', product: 'GT-9500E Gas Turbine Package', quantity: 2, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 3', plannedStart: '15 Jul 2026', deliveryDate: '30 Jan 2027', daysToDelivery: 313, materialStatus: 40, status: 'At Risk', revenue: 164, orderDate: '05 Feb 2026', contractRef: 'ARAMCO/GT95/2026/JG-301', unitPrice: 82, stages: [
    { name: 'Engineering', plannedStart: '15 Jul 2026', plannedEnd: '10 Aug 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '25 Jul 2026', plannedEnd: '15 Oct 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Oct 2026', plannedEnd: '20 Nov 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '21 Nov 2026', plannedEnd: '10 Jan 2027', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '11 Jan 2027', plannedEnd: '25 Jan 2027', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '26 Jan 2027', plannedEnd: '30 Jan 2027', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0045', customer: 'Adani Power Ltd.', productLine: 'GP-8500', product: 'GP-8500B Generator Package', quantity: 2, priority: 'P2', factory: 'Vadodara', assemblyBay: 'Bay 3', plannedStart: '25 Mar 2026', deliveryDate: '10 Jul 2026', daysToDelivery: 109, materialStatus: 92, status: 'On Track', revenue: 48, orderDate: '20 Jun 2025', contractRef: 'ADANI/GP85/2025/045', unitPrice: 24, stages: [
    { name: 'Engineering', plannedStart: '25 Mar 2026', plannedEnd: '15 Apr 2026', actualStart: '25 Mar 2026', actualEnd: '14 Apr 2026', status: 'completed' },
    { name: 'Procurement', plannedStart: '01 Apr 2026', plannedEnd: '20 May 2026', actualStart: '02 Apr 2026', status: 'in-progress' },
    { name: 'Fabrication', plannedStart: '15 May 2026', plannedEnd: '10 Jun 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '11 Jun 2026', plannedEnd: '01 Jul 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '02 Jul 2026', plannedEnd: '08 Jul 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '08 Jul 2026', plannedEnd: '10 Jul 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0330', customer: 'Petronas Carigali', productLine: 'CP-2200', product: 'CP-2200H Compressor Package', quantity: 3, priority: 'P2', factory: 'Pune', assemblyBay: 'Bay 4', plannedStart: '01 Aug 2026', deliveryDate: '15 Feb 2027', daysToDelivery: 329, materialStatus: 35, status: 'On Track', revenue: 21, orderDate: '10 Feb 2026', contractRef: 'PETRONAS/CP/2026/C-330', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '01 Aug 2026', plannedEnd: '22 Aug 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '10 Aug 2026', plannedEnd: '15 Oct 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Oct 2026', plannedEnd: '15 Nov 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '16 Nov 2026', plannedEnd: '30 Jan 2027', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '01 Feb 2027', plannedEnd: '10 Feb 2027', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '11 Feb 2027', plannedEnd: '15 Feb 2027', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0067', customer: 'Tata Power Generation', productLine: 'CP-2200', product: 'CP-2200H Compressor Package', quantity: 5, priority: 'P2', factory: 'Pune', assemblyBay: 'Bay 2', plannedStart: '05 Apr 2026', deliveryDate: '25 Aug 2026', daysToDelivery: 155, materialStatus: 85, status: 'On Track', revenue: 35, orderDate: '01 Jul 2025', contractRef: 'TATA/CP/2025/PG-067', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '05 Apr 2026', plannedEnd: '25 Apr 2026', actualStart: '05 Apr 2026', status: 'in-progress' },
    { name: 'Procurement', plannedStart: '12 Apr 2026', plannedEnd: '15 Jun 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Jun 2026', plannedEnd: '15 Jul 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '16 Jul 2026', plannedEnd: '12 Aug 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '13 Aug 2026', plannedEnd: '22 Aug 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '23 Aug 2026', plannedEnd: '25 Aug 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0340', customer: 'JSW Energy', productLine: 'GT-7000', product: 'GT-7000F Gas Turbine', quantity: 2, priority: 'P3', factory: 'Unassigned', plannedStart: '—', deliveryDate: '28 Feb 2027', daysToDelivery: 342, materialStatus: 22, status: 'On Track', revenue: 44, orderDate: '28 Feb 2026', contractRef: 'JSW/GT7/2026/E-340', unitPrice: 22, stages: [
    { name: 'Engineering', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Procurement', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Assembly', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: 'TBD', plannedEnd: 'TBD', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0099', customer: 'ONGC Offshore', productLine: 'GT-7000', product: 'GT-7000F Gas Turbine', quantity: 3, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 1', plannedStart: '01 May 2026', deliveryDate: '15 Sep 2026', daysToDelivery: 176, materialStatus: 88, status: 'On Track', revenue: 66, orderDate: '15 Aug 2025', contractRef: 'ONGC/GT7/2025/OFF-099', unitPrice: 22, stages: [
    { name: 'Engineering', plannedStart: '01 May 2026', plannedEnd: '22 May 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '10 May 2026', plannedEnd: '10 Jul 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '25 Jun 2026', plannedEnd: '05 Aug 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '06 Aug 2026', plannedEnd: '30 Aug 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '01 Sep 2026', plannedEnd: '10 Sep 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '11 Sep 2026', plannedEnd: '15 Sep 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0128', customer: 'Cairn Oil & Gas (Vedanta)', productLine: 'CP-2200', product: 'CP-2200H Compressor Package', quantity: 3, priority: 'P2', factory: 'Pune', assemblyBay: 'Bay 4', plannedStart: '20 Apr 2026', deliveryDate: '05 Sep 2026', daysToDelivery: 166, materialStatus: 79, status: 'On Track', revenue: 21, orderDate: '10 Sep 2025', contractRef: 'CAIRN/CP/2025/V-128', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '20 Apr 2026', plannedEnd: '10 May 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '28 Apr 2026', plannedEnd: '28 Jun 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '15 Jun 2026', plannedEnd: '25 Jul 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '26 Jul 2026', plannedEnd: '22 Aug 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '23 Aug 2026', plannedEnd: '01 Sep 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '02 Sep 2026', plannedEnd: '05 Sep 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0275', customer: 'NTPC Ltd.', productLine: 'GP-8500', product: 'GP-8500B Generator Package', quantity: 4, priority: 'P1', factory: 'Vadodara', assemblyBay: 'Bay 3', plannedStart: '10 Jun 2026', deliveryDate: '20 Oct 2026', daysToDelivery: 211, materialStatus: 68, status: 'At Risk', revenue: 96, orderDate: '15 Dec 2025', contractRef: 'NTPC/GP85/2025/275', unitPrice: 24, stages: [
    { name: 'Engineering', plannedStart: '10 Jun 2026', plannedEnd: '02 Jul 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '18 Jun 2026', plannedEnd: '20 Aug 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '05 Aug 2026', plannedEnd: '15 Sep 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '16 Sep 2026', plannedEnd: '05 Oct 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '06 Oct 2026', plannedEnd: '16 Oct 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '17 Oct 2026', plannedEnd: '20 Oct 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0350', customer: 'Larsen & Toubro EPC', productLine: 'GT-7000', product: 'GT-7000F Gas Turbine', quantity: 5, priority: 'P2', factory: 'Pune', assemblyBay: 'Bay 1', plannedStart: '01 Sep 2026', deliveryDate: '28 Mar 2027', daysToDelivery: 370, materialStatus: 18, status: 'On Track', revenue: 110, orderDate: '10 Mar 2026', contractRef: 'LT/GT7/2026/EPC-350', unitPrice: 22, stages: [
    { name: 'Engineering', plannedStart: '01 Sep 2026', plannedEnd: '25 Sep 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '10 Sep 2026', plannedEnd: '20 Nov 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Nov 2026', plannedEnd: '15 Jan 2027', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '16 Jan 2027', plannedEnd: '05 Mar 2027', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '06 Mar 2027', plannedEnd: '22 Mar 2027', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '23 Mar 2027', plannedEnd: '28 Mar 2027', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0088', customer: 'Adani Power Ltd.', productLine: 'ST-4000', product: 'ST-4000C Steam Turbine', quantity: 1, priority: 'P2', factory: 'Vadodara', assemblyBay: 'Bay 1', plannedStart: '15 Apr 2026', deliveryDate: '30 Aug 2026', daysToDelivery: 160, materialStatus: 90, status: 'On Track', revenue: 18, orderDate: '25 Jul 2025', contractRef: 'ADANI/ST/2025/088', unitPrice: 18, stages: [
    { name: 'Engineering', plannedStart: '15 Apr 2026', plannedEnd: '05 May 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '22 Apr 2026', plannedEnd: '15 Jun 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Jun 2026', plannedEnd: '15 Jul 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '16 Jul 2026', plannedEnd: '15 Aug 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '16 Aug 2026', plannedEnd: '26 Aug 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '27 Aug 2026', plannedEnd: '30 Aug 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0360', customer: 'Qatar Energy LNG', productLine: 'CP-2200', product: 'CP-2200H Compressor Package', quantity: 10, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 2', plannedStart: '15 Jun 2026', deliveryDate: '28 Feb 2027', daysToDelivery: 342, materialStatus: 30, status: 'At Risk', revenue: 70, orderDate: '15 Mar 2026', contractRef: 'QE/CP/2026/LNG-360', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '15 Jun 2026', plannedEnd: '08 Jul 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '25 Jun 2026', plannedEnd: '30 Sep 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '15 Sep 2026', plannedEnd: '15 Nov 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '16 Nov 2026', plannedEnd: '10 Feb 2027', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '11 Feb 2027', plannedEnd: '22 Feb 2027', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '23 Feb 2027', plannedEnd: '28 Feb 2027', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0142', customer: 'Reliance Energy Projects', productLine: 'GP-6000', product: 'GP-6000A Generator Package', quantity: 6, priority: 'P2', factory: 'Vadodara', assemblyBay: 'Bay 1', plannedStart: '01 May 2026', deliveryDate: '30 Sep 2026', daysToDelivery: 191, materialStatus: 76, status: 'On Track', revenue: 42, orderDate: '20 Sep 2025', contractRef: 'REL/GP/2025/EP-142', unitPrice: 7, stages: [
    { name: 'Engineering', plannedStart: '01 May 2026', plannedEnd: '22 May 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '10 May 2026', plannedEnd: '15 Jul 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '01 Jul 2026', plannedEnd: '10 Aug 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '11 Aug 2026', plannedEnd: '15 Sep 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '16 Sep 2026', plannedEnd: '26 Sep 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '27 Sep 2026', plannedEnd: '30 Sep 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0256', customer: 'Tata Power Generation', productLine: 'GT-9500', product: 'GT-9500E Gas Turbine Package', quantity: 1, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 3', plannedStart: '20 May 2026', deliveryDate: '30 Oct 2026', daysToDelivery: 221, materialStatus: 65, status: 'At Risk', revenue: 82, orderDate: '08 Nov 2025', contractRef: 'TATA/GT95/2025/PG-256', unitPrice: 82, stages: [
    { name: 'Engineering', plannedStart: '20 May 2026', plannedEnd: '12 Jun 2026', status: 'upcoming' },
    { name: 'Procurement', plannedStart: '28 May 2026', plannedEnd: '01 Aug 2026', status: 'upcoming' },
    { name: 'Fabrication', plannedStart: '15 Jul 2026', plannedEnd: '28 Aug 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '29 Aug 2026', plannedEnd: '10 Oct 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '11 Oct 2026', plannedEnd: '25 Oct 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '26 Oct 2026', plannedEnd: '30 Oct 2026', status: 'upcoming' },
  ]},
  // Delayed orders
  { id: 'PF-2025-0023', customer: 'BHEL (sub-contract)', productLine: 'GP-6000', product: 'GP-6000A Generator Package', quantity: 2, priority: 'P3', factory: 'Vadodara', assemblyBay: 'Bay 2', plannedStart: '10 Mar 2026', deliveryDate: '15 Jun 2026', daysToDelivery: 84, materialStatus: 100, status: 'Delayed', revenue: 14, orderDate: '01 May 2025', contractRef: 'BHEL/SUB/2025/GP-023', unitPrice: 7, currentForecast: '02 Jul 2026', stages: [
    { name: 'Engineering', plannedStart: '10 Mar 2026', plannedEnd: '28 Mar 2026', actualStart: '10 Mar 2026', actualEnd: '30 Mar 2026', status: 'completed' },
    { name: 'Procurement', plannedStart: '15 Mar 2026', plannedEnd: '28 Apr 2026', actualStart: '18 Mar 2026', actualEnd: '10 May 2026', status: 'completed' },
    { name: 'Fabrication', plannedStart: '20 Apr 2026', plannedEnd: '20 May 2026', actualStart: '12 May 2026', status: 'delayed' },
    { name: 'Assembly', plannedStart: '21 May 2026', plannedEnd: '05 Jun 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '06 Jun 2026', plannedEnd: '12 Jun 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '13 Jun 2026', plannedEnd: '15 Jun 2026', status: 'upcoming' },
  ]},
  { id: 'PF-2025-0038', customer: 'Thermax Process Equipment', productLine: 'CP-2200', product: 'CP-2200H Compressor Package', quantity: 2, priority: 'P3', factory: 'Pune', assemblyBay: 'Bay 4', plannedStart: '05 Mar 2026', deliveryDate: '20 Jun 2026', daysToDelivery: 89, materialStatus: 95, status: 'Delayed', revenue: 14, orderDate: '15 May 2025', contractRef: 'THERMAX/CP/2025/PE-038', unitPrice: 7, currentForecast: '08 Jul 2026', stages: [
    { name: 'Engineering', plannedStart: '05 Mar 2026', plannedEnd: '22 Mar 2026', actualStart: '05 Mar 2026', actualEnd: '24 Mar 2026', status: 'completed' },
    { name: 'Procurement', plannedStart: '10 Mar 2026', plannedEnd: '25 Apr 2026', actualStart: '12 Mar 2026', actualEnd: '05 May 2026', status: 'completed' },
    { name: 'Fabrication', plannedStart: '15 Apr 2026', plannedEnd: '25 May 2026', actualStart: '08 May 2026', status: 'delayed' },
    { name: 'Assembly', plannedStart: '26 May 2026', plannedEnd: '10 Jun 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '11 Jun 2026', plannedEnd: '17 Jun 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '18 Jun 2026', plannedEnd: '20 Jun 2026', status: 'upcoming' },
  ]},
  // Critical orders
  { id: 'PF-2025-0056', customer: 'Saudi Aramco — Jafurah Gas', productLine: 'GT-7000', product: 'GT-7000F Gas Turbine', quantity: 3, priority: 'P1', factory: 'Pune', assemblyBay: 'Bay 1', plannedStart: '15 Mar 2026', deliveryDate: '30 Jun 2026', daysToDelivery: 99, materialStatus: 68, status: 'Critical', revenue: 66, orderDate: '10 Jun 2025', contractRef: 'ARAMCO/GT7/2025/JG-056', unitPrice: 22, currentForecast: '25 Jul 2026', stages: [
    { name: 'Engineering', plannedStart: '15 Mar 2026', plannedEnd: '05 Apr 2026', actualStart: '15 Mar 2026', actualEnd: '08 Apr 2026', status: 'completed' },
    { name: 'Procurement', plannedStart: '20 Mar 2026', plannedEnd: '15 May 2026', actualStart: '22 Mar 2026', status: 'delayed' },
    { name: 'Fabrication', plannedStart: '01 May 2026', plannedEnd: '10 Jun 2026', status: 'upcoming' },
    { name: 'Assembly', plannedStart: '11 Jun 2026', plannedEnd: '24 Jun 2026', status: 'upcoming' },
    { name: 'Testing & QC', plannedStart: '25 Jun 2026', plannedEnd: '28 Jun 2026', status: 'upcoming' },
    { name: 'Packaging & Dispatch', plannedStart: '29 Jun 2026', plannedEnd: '30 Jun 2026', status: 'upcoming' },
  ]},
];

export const alerts: Alert[] = [
  { id: 'ALT-001', severity: 'critical', message: 'Supplier Bharat Forge: Rotor forging shipment for GT-9500 delayed 14 days. 6 orders affected. Revenue impact: ₹87 Cr.', timestamp: '18 Mar 2026, 09:14', ordersAffected: 6, revenueImpact: '₹87 Cr' },
  { id: 'ALT-002', severity: 'warning', message: 'Demand pull-in: NTPC Order #PF-2025-0312 accelerated by 4 weeks. Capacity conflict at Pune Week 22-23.', timestamp: '19 Mar 2026, 14:22', ordersAffected: 3, revenueImpact: '₹48 Cr' },
  { id: 'ALT-003', severity: 'info', message: 'Vadodara Line 2 crane maintenance scheduled Week 24. 5 steam turbine orders need reallocation or rescheduling.', timestamp: '20 Mar 2026, 08:45', ordersAffected: 5 },
  { id: 'ALT-004', severity: 'warning', message: 'Material shortage: Combustion Liner CL-7000 stock drops below safety threshold in 21 days. 18 GT-7000 orders affected.', timestamp: '20 Mar 2026, 11:30', ordersAffected: 18, revenueImpact: '₹396 Cr' },
  { id: 'ALT-005', severity: 'info', message: 'Customer change request: Saudi Aramco Order #PF-2025-0078 specification revision. BOM update required for compressor blade Stage 4.', timestamp: '21 Mar 2026, 10:05' },
  { id: 'ALT-006', severity: 'warning', message: 'Allegheny Technologies export shipment held at customs. Specialty alloy for GT-9500 hot gas path. Est. delay: 8-12 days.', timestamp: '21 Mar 2026, 16:40', ordersAffected: 4, revenueImpact: '₹164 Cr' },
  { id: 'ALT-007', severity: 'critical', message: 'Pune Bay 3 utilization exceeds 95% threshold for weeks 22-24. 3 GT-9500 orders competing for same production window.', timestamp: '22 Mar 2026, 07:15', ordersAffected: 3, revenueImpact: '₹328 Cr' },
  { id: 'ALT-008', severity: 'warning', message: 'Quality hold: Precision Castparts batch #PCB-4472 turbine blades failed dimensional inspection. Rework required, est. 10 days.', timestamp: '22 Mar 2026, 13:55', ordersAffected: 8, revenueImpact: '₹176 Cr' },
  { id: 'ALT-009', severity: 'info', message: 'Vadodara Bay 3 test cell upgrade completed ahead of schedule. Additional 12% capacity available from Week 20.', timestamp: '22 Mar 2026, 15:20' },
  { id: 'ALT-010', severity: 'warning', message: 'Forex alert: INR/USD movement impacting import component costs. Estimated +₹2.8 Cr on outstanding import POs.', timestamp: '23 Mar 2026, 08:00' },
];

export const suppliers: Supplier[] = [
  { id: 'SUP-001', name: 'Bharat Forge Ltd.', components: 'Rotor Forgings', activeOrders: 8, dependentOrders: 14, onTimeRate: 82, qualityScore: 91, avgLeadTime: '16 weeks', leadTimeTrend: '↑ +2 weeks', riskScore: 74, status: 'At Risk' },
  { id: 'SUP-002', name: 'Mahindra Sanyo Special Steel', components: 'Specialty Alloys', activeOrders: 12, dependentOrders: 22, onTimeRate: 88, qualityScore: 87, avgLeadTime: '10 weeks', leadTimeTrend: '→', riskScore: 82, status: 'On Track' },
  { id: 'SUP-003', name: 'Precision Castparts India', components: 'Turbine Blades, Combustion Liners', activeOrders: 15, dependentOrders: 28, onTimeRate: 78, qualityScore: 88, avgLeadTime: '20 weeks', leadTimeTrend: '↑ +3 weeks', riskScore: 68, status: 'At Risk' },
  { id: 'SUP-004', name: 'Triveni Turbine Foundry', components: 'Castings', activeOrders: 6, dependentOrders: 10, onTimeRate: 90, qualityScore: 85, avgLeadTime: '12 weeks', leadTimeTrend: '→', riskScore: 86, status: 'On Track' },
  { id: 'SUP-005', name: 'SKF India', components: 'Bearings (Journal & Thrust)', activeOrders: 20, dependentOrders: 42, onTimeRate: 97, qualityScore: 94, avgLeadTime: '6 weeks', leadTimeTrend: '→', riskScore: 92, status: 'On Track' },
  { id: 'SUP-006', name: 'Siemens Gamesa Components', components: 'Generator Windings', activeOrders: 8, dependentOrders: 16, onTimeRate: 91, qualityScore: 93, avgLeadTime: '14 weeks', leadTimeTrend: '↓ -1 week', riskScore: 90, status: 'On Track' },
  { id: 'SUP-007', name: 'Kirloskar Pneumatic', components: 'Valve Actuators', activeOrders: 10, dependentOrders: 18, onTimeRate: 85, qualityScore: 82, avgLeadTime: '8 weeks', leadTimeTrend: '→', riskScore: 80, status: 'On Track' },
  { id: 'SUP-008', name: 'Thermax Heat Transfer', components: 'Heat Exchangers', activeOrders: 7, dependentOrders: 12, onTimeRate: 92, qualityScore: 89, avgLeadTime: '10 weeks', leadTimeTrend: '→', riskScore: 88, status: 'On Track' },
  { id: 'SUP-009', name: 'Elecon Engineering', components: 'Gearbox Assemblies', activeOrders: 5, dependentOrders: 8, onTimeRate: 88, qualityScore: 86, avgLeadTime: '14 weeks', leadTimeTrend: '↑ +1 week', riskScore: 84, status: 'On Track' },
  { id: 'SUP-010', name: 'ABB India', components: 'Control Panels, Excitation Systems', activeOrders: 14, dependentOrders: 22, onTimeRate: 94, qualityScore: 90, avgLeadTime: '10 weeks', leadTimeTrend: '→', riskScore: 88, status: 'On Track' },
  { id: 'SUP-011', name: 'Honeywell Process Solutions', components: 'DCS/Instrumentation', activeOrders: 11, dependentOrders: 20, onTimeRate: 93, qualityScore: 92, avgLeadTime: '12 weeks', leadTimeTrend: '→', riskScore: 90, status: 'On Track' },
  { id: 'SUP-012', name: 'Sandvik India', components: 'High-Temp Alloys', activeOrders: 9, dependentOrders: 16, onTimeRate: 86, qualityScore: 95, avgLeadTime: '8 weeks', leadTimeTrend: '→', riskScore: 86, status: 'On Track' },
  { id: 'SUP-013', name: 'Kennametal India', components: 'Coatings, Surface Treatment', activeOrders: 6, dependentOrders: 14, onTimeRate: 91, qualityScore: 88, avgLeadTime: '6 weeks', leadTimeTrend: '↓ -1 week', riskScore: 88, status: 'On Track' },
  { id: 'SUP-014', name: 'Godrej Precision Engineering', components: 'Base Frames', activeOrders: 8, dependentOrders: 12, onTimeRate: 89, qualityScore: 84, avgLeadTime: '10 weeks', leadTimeTrend: '→', riskScore: 84, status: 'On Track' },
  { id: 'SUP-015', name: 'Walchandnagar Industries', components: 'Heavy Fabrications', activeOrders: 4, dependentOrders: 6, onTimeRate: 80, qualityScore: 72, avgLeadTime: '18 weeks', leadTimeTrend: '↑ +2 weeks', riskScore: 65, status: 'At Risk' },
  { id: 'SUP-016', name: 'Crompton Greaves', components: 'Electrical Systems', activeOrders: 10, dependentOrders: 18, onTimeRate: 90, qualityScore: 86, avgLeadTime: '8 weeks', leadTimeTrend: '→', riskScore: 86, status: 'On Track' },
  { id: 'SUP-017', name: 'Forbes Marshall', components: 'Steam Accessories', activeOrders: 5, dependentOrders: 8, onTimeRate: 95, qualityScore: 91, avgLeadTime: '6 weeks', leadTimeTrend: '→', riskScore: 92, status: 'On Track' },
  { id: 'SUP-018', name: 'Spirax Sarco India', components: 'Control Valves', activeOrders: 7, dependentOrders: 14, onTimeRate: 92, qualityScore: 90, avgLeadTime: '8 weeks', leadTimeTrend: '→', riskScore: 90, status: 'On Track' },
  { id: 'SUP-019', name: 'Alfa Laval India', components: 'Lube Oil Systems', activeOrders: 6, dependentOrders: 10, onTimeRate: 94, qualityScore: 92, avgLeadTime: '10 weeks', leadTimeTrend: '→', riskScore: 90, status: 'On Track' },
  { id: 'SUP-020', name: 'Voith Turbo India', components: 'Coupling Assemblies', activeOrders: 4, dependentOrders: 8, onTimeRate: 96, qualityScore: 93, avgLeadTime: '8 weeks', leadTimeTrend: '→', riskScore: 94, status: 'On Track' },
  { id: 'SUP-021', name: 'Mitsubishi Heavy Industries — Sagamihara', components: 'Imported Blade Alloys', activeOrders: 3, dependentOrders: 6, onTimeRate: 84, qualityScore: 96, avgLeadTime: '22 weeks', leadTimeTrend: '↑ +2 weeks', riskScore: 72, status: 'At Risk' },
  { id: 'SUP-022', name: 'Allegheny Technologies', components: 'Imported Specialty Metals', activeOrders: 4, dependentOrders: 8, onTimeRate: 76, qualityScore: 94, avgLeadTime: '24 weeks', leadTimeTrend: '↑ +4 weeks', riskScore: 62, status: 'Critical' },
];

export const materials: Material[] = [
  { id: 'MAT-001', component: 'Combustion Liner CL-7000', requiredNext90: 84, available: 66, shortfall: 18, ordersAffected: 18, revenueAffected: 396, primarySupplier: 'Precision Castparts India', expectedResupply: '18 May 2026', status: 'Critical' },
  { id: 'MAT-002', component: 'GT-9500 Rotor Forging', requiredNext90: 7, available: 3, shortfall: 4, ordersAffected: 6, revenueAffected: 574, primarySupplier: 'Bharat Forge Ltd.', expectedResupply: '02 May 2026 (delayed)', status: 'Critical' },
  { id: 'MAT-003', component: 'IGBT Module EX-400', requiredNext90: 38, available: 22, shortfall: 16, ordersAffected: 12, revenueAffected: 218, primarySupplier: 'ABB India', expectedResupply: '25 Apr 2026', status: 'Warning' },
  { id: 'MAT-004', component: 'Compressor Blade Set CBS-14', requiredNext90: 120, available: 94, shortfall: 26, ordersAffected: 8, revenueAffected: 98, primarySupplier: 'Sandvik India', expectedResupply: '12 May 2026', status: 'Warning' },
  { id: 'MAT-005', component: 'Journal Bearing Assembly JB-500', requiredNext90: 42, available: 40, shortfall: 2, ordersAffected: 2, revenueAffected: 48, primarySupplier: 'SKF India', expectedResupply: '05 Apr 2026', status: 'Warning' },
  { id: 'MAT-006', component: 'Hot Gas Path Transition Piece TP-9500', requiredNext90: 14, available: 6, shortfall: 8, ordersAffected: 6, revenueAffected: 492, primarySupplier: 'Precision Castparts India', expectedResupply: '28 May 2026', status: 'Critical' },
  { id: 'MAT-007', component: 'DCS Control Panel CP-200', requiredNext90: 22, available: 18, shortfall: 4, ordersAffected: 4, revenueAffected: 88, primarySupplier: 'Honeywell Process Solutions', expectedResupply: '15 Apr 2026', status: 'Warning' },
  { id: 'MAT-008', component: 'Generator Stator Winding GSW-8500', requiredNext90: 8, available: 4, shortfall: 4, ordersAffected: 4, revenueAffected: 192, primarySupplier: 'Siemens Gamesa Components', expectedResupply: '20 May 2026', status: 'Warning' },
  { id: 'MAT-009', component: 'Gearbox Assembly GA-2200', requiredNext90: 16, available: 14, shortfall: 2, ordersAffected: 2, revenueAffected: 28, primarySupplier: 'Elecon Engineering', expectedResupply: '10 Apr 2026', status: 'Warning' },
  { id: 'MAT-010', component: 'Base Frame Weldment BF-7000', requiredNext90: 30, available: 30, shortfall: 0, ordersAffected: 0, revenueAffected: 0, primarySupplier: 'Godrej Precision Engineering', expectedResupply: '—', status: 'OK' },
  { id: 'MAT-011', component: 'Lube Oil Heat Exchanger LO-300', requiredNext90: 18, available: 18, shortfall: 0, ordersAffected: 0, revenueAffected: 0, primarySupplier: 'Alfa Laval India', expectedResupply: '—', status: 'OK' },
  { id: 'MAT-012', component: 'Coupling Assembly CA-450', requiredNext90: 12, available: 12, shortfall: 0, ordersAffected: 0, revenueAffected: 0, primarySupplier: 'Voith Turbo India', expectedResupply: '—', status: 'OK' },
  { id: 'MAT-013', component: 'Excitation System ES-600', requiredNext90: 10, available: 7, shortfall: 3, ordersAffected: 3, revenueAffected: 72, primarySupplier: 'ABB India', expectedResupply: '22 Apr 2026', status: 'Warning' },
  { id: 'MAT-014', component: 'Inlet Ducting Assembly ID-7000', requiredNext90: 24, available: 24, shortfall: 0, ordersAffected: 0, revenueAffected: 0, primarySupplier: 'Godrej Precision Engineering', expectedResupply: '—', status: 'OK' },
  { id: 'MAT-015', component: 'Specialty Alloy SA-718 (Imported)', requiredNext90: 6, available: 2, shortfall: 4, ordersAffected: 4, revenueAffected: 164, primarySupplier: 'Allegheny Technologies', expectedResupply: '10 May 2026 (customs hold)', status: 'Critical' },
];

export const disruptions: Disruption[] = [
  { id: 'DIS-001', type: 'Supplier Delay', source: 'Bharat Forge Ltd.', description: 'Rotor forging shipment delayed 14 days (quality hold at supplier)', ordersAffected: 6, revenueImpact: '₹574 Cr', detected: '18 Mar 2026', status: 'Investigating', owner: 'R. Mehta' },
  { id: 'DIS-002', type: 'Material Shortage', source: 'Precision Castparts India', description: 'Combustion liner CL-7000 below safety stock in 21 days', ordersAffected: 18, revenueImpact: '₹396 Cr', detected: '20 Mar 2026', status: 'Mitigation in progress', owner: 'S. Kulkarni' },
  { id: 'DIS-003', type: 'Customs Hold', source: 'Allegheny Technologies', description: 'Specialty alloy import held — documentation issue', ordersAffected: 4, revenueImpact: '₹164 Cr', detected: '19 Mar 2026', status: 'Escalated', owner: 'P. Sharma' },
  { id: 'DIS-004', type: 'Quality Issue', source: 'Precision Castparts India', description: 'Turbine blade batch #PCB-4472 failed dimensional inspection', ordersAffected: 8, revenueImpact: '₹176 Cr', detected: '22 Mar 2026', status: 'Under review', owner: 'A. Desai' },
  { id: 'DIS-005', type: 'Equipment Downtime', source: 'Vadodara Plant', description: 'Bay 2 crane hydraulic failure — replacement part on order', ordersAffected: 3, revenueImpact: '₹68 Cr', detected: '21 Mar 2026', status: 'Parts on order', owner: 'V. Patel' },
  { id: 'DIS-006', type: 'Logistics Delay', source: 'Freight & Logistics', description: 'Inbound shipment from Sagamihara delayed due to port congestion', ordersAffected: 2, revenueImpact: '₹82 Cr', detected: '22 Mar 2026', status: 'Monitoring', owner: 'K. Reddy' },
];

export const demandChanges: DemandChange[] = [
  { changeId: 'DC-047', orderId: 'PF-2025-0312', customer: 'NTPC Ltd.', originalDelivery: '15 Mar 2027', requestedDelivery: '15 Feb 2027', shiftDays: -28, direction: 'Pull-In', impactAssessment: '3 orders displaced at Vadodara Bay 2', status: 'Under review' },
  { changeId: 'DC-046', orderId: 'PF-2025-0201', customer: 'Petronas Carigali', originalDelivery: '28 Jan 2027', requestedDelivery: '28 Mar 2027', shiftDays: 59, direction: 'Push-Out', impactAssessment: 'Capacity freed at Pune Week 8-12', status: 'Accepted' },
  { changeId: 'DC-045', orderId: 'PF-2025-0078', customer: 'Saudi Aramco — Jafurah Gas', originalDelivery: '30 Aug 2026', requestedDelivery: '15 Aug 2026', shiftDays: -15, direction: 'Pull-In', impactAssessment: 'Material shortage escalated', status: 'Simulating' },
  { changeId: 'DC-044', orderId: 'PF-2025-0134', customer: 'JSW Energy', originalDelivery: '28 Oct 2026', requestedDelivery: '15 Nov 2026', shiftDays: 18, direction: 'Push-Out', impactAssessment: 'No impact — headroom available', status: 'Accepted' },
  { changeId: 'DC-043', orderId: 'PF-2025-0099', customer: 'ONGC Offshore', originalDelivery: '15 Sep 2026', requestedDelivery: '01 Sep 2026', shiftDays: -14, direction: 'Pull-In', impactAssessment: '2 orders need resequencing at Pune Bay 1', status: 'Under review' },
  { changeId: 'DC-042', orderId: 'PF-2025-0289', customer: 'Thermax Process Equipment', originalDelivery: '30 Nov 2026', requestedDelivery: '15 Jan 2027', shiftDays: 46, direction: 'Push-Out', impactAssessment: 'Frees Vadodara Bay 1 for GP-6000 consolidation', status: 'Accepted' },
  { changeId: 'DC-041', orderId: 'PF-2025-0256', customer: 'Tata Power Generation', originalDelivery: '30 Oct 2026', requestedDelivery: '15 Oct 2026', shiftDays: -15, direction: 'Pull-In', impactAssessment: 'Pune Bay 3 conflict with GT-9500 orders', status: 'Rejected' },
  { changeId: 'DC-040', orderId: 'PF-2025-0045', customer: 'Adani Power Ltd.', originalDelivery: '10 Jul 2026', requestedDelivery: '25 Jun 2026', shiftDays: -15, direction: 'Pull-In', impactAssessment: 'Feasible with overtime at Vadodara', status: 'Accepted' },
];

export const integrations: Integration[] = [
  { name: 'Oracle ERP', description: 'Orders, BOM, Inventory, Procurement', lastSync: '2 min ago', status: 'Green', records24h: 14280, dataQuality: 98.2, connectorType: 'API' },
  { name: 'MES — Pune', description: 'Production status, Bay utilization, Output tracking', lastSync: '5 min ago', status: 'Green', records24h: 8420, dataQuality: 99.1, connectorType: 'CDC' },
  { name: 'MES — Vadodara', description: 'Production status, Bay utilization', lastSync: '8 min ago', status: 'Green', records24h: 5180, dataQuality: 98.7, connectorType: 'CDC' },
  { name: 'Salesforce CRM', description: 'Customer orders, Demand signals, Contract data', lastSync: '15 min ago', status: 'Green', records24h: 3240, dataQuality: 97.5, connectorType: 'API' },
  { name: 'Workday', description: 'Workforce availability, Shift schedules', lastSync: '1 hour ago', status: 'Green', records24h: 890, dataQuality: 96.8, connectorType: 'API' },
  { name: 'Supplier Portal', description: 'Delivery commitments, Shipment tracking', lastSync: '30 min ago', status: 'Green', records24h: 4560, dataQuality: 94.2, connectorType: 'API' },
  { name: 'Quality Management System', description: 'Inspection results, NCRs', lastSync: '45 min ago', status: 'Green', records24h: 1240, dataQuality: 99.4, connectorType: 'File' },
  { name: 'SAP Ariba', description: 'Procurement, PO tracking for import suppliers', lastSync: '2 hours ago', status: 'Amber', records24h: 680, dataQuality: 91.5, connectorType: 'API' },
  { name: 'IoT Gateway — Pune', description: 'Machine utilization, Cycle times', lastSync: 'Real-time', status: 'Green', records24h: 142000, dataQuality: 99.8, connectorType: 'CDC' },
  { name: 'Freight & Logistics Tracker', description: 'Inbound shipment ETAs', lastSync: '3 hours ago', status: 'Amber', records24h: 420, dataQuality: 88.3, connectorType: 'API' },
];

// Helper functions
export const getStatusColor = (status: OrderStatus | string): string => {
  switch (status) {
    case 'On Track': return 'status-on-track';
    case 'At Risk': return 'status-at-risk';
    case 'Critical': return 'status-critical';
    case 'Delayed': return 'status-delayed';
    case 'Completed': return 'status-completed';
    default: return 'status-completed';
  }
};

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'P1': return 'priority-p1';
    case 'P2': return 'priority-p2';
    case 'P3': return 'priority-p3';
    case 'P4': return 'priority-p4';
  }
};

export const orderStatusCounts = {
  onTrack: orders.filter(o => o.status === 'On Track').length,
  atRisk: orders.filter(o => o.status === 'At Risk').length,
  critical: orders.filter(o => o.status === 'Critical').length,
  delayed: orders.filter(o => o.status === 'Delayed').length,
  completed: 24,
};

export const formatRevenue = (cr: number): string => `₹${cr} Cr`;
