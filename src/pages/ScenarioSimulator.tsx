import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { MetricCard } from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import { CheckCircle, ChevronDown, ChevronUp, ArrowRight, Clock, Factory, Truck, AlertTriangle, FileText, Users, X, Info } from 'lucide-react';
import type { ScenarioPreload } from '@/types/signals';

type DisruptionType = 'supplier' | 'demand' | 'capacity' | 'material' | 'rush' | 'custom';

const disruptionLabels: Record<DisruptionType, string> = {
  supplier: 'Supplier Delay',
  demand: 'Demand Change',
  capacity: 'Capacity Loss',
  material: 'Material Shortage',
  rush: 'Rush Order',
  custom: 'Custom',
};

const supplierOptions = ['Bharat Forge Ltd.', 'Precision Castparts India', 'ABB India', 'Allegheny Technologies', 'Sandvik India'];
const materialMap: Record<string, string> = {
  'Bharat Forge Ltd.': 'GT-9500 Rotor Forgings',
  'Precision Castparts India': 'Combustion Liners / Turbine Blades',
  'ABB India': 'IGBT Excitation Modules',
  'Allegheny Technologies': 'Specialty Alloy SA-718',
  'Sandvik India': 'Compressor Blade Sets',
};

interface OptionData {
  label: string;
  title: string;
  desc: string;
  details: string[];
  confidence: number;
  color: string;
}

const optionsData: OptionData[] = [
  { label: 'Option A', title: 'Minimize Customer Impact', desc: 'Resequence 6 lower-priority orders to protect P1 deliveries', details: ['3 P3 orders delayed 2-3 weeks', 'All P1 orders on time', 'Revenue at risk: ₹12 Cr', 'Overtime: 120 hrs at Pune'], confidence: 94, color: 'border-status-on-track' },
  { label: 'Option B', title: 'Balance Load Across Factories', desc: 'Shift 4 orders from Pune to Vadodara', details: ['Vadodara extended shifts 3 weeks', '2 P2 orders delayed 1 week', 'Revenue at risk: ₹8 Cr', 'Logistics cost: ₹34L'], confidence: 87, color: 'border-primary' },
  { label: 'Option C', title: 'Expedite Alternate Supplier', desc: 'Source from Walchandnagar Industries', details: ['Premium cost: ₹1.2 Cr', 'No order delays', 'Revenue at risk: ₹0', 'Quality risk: 72/100 vs 91/100'], confidence: 79, color: 'border-status-at-risk' },
];

// Detailed execution plan data per option
const executionPlans: Record<string, {
  summary: string;
  kpiBefore: Record<string, string>;
  kpiAfter: Record<string, string>;
  actions: { category: string; icon: React.ReactNode; steps: { action: string; detail: string; owner: string; deadline: string; status: string }[] }[];
  orderInstructions: { orderId: string; customer: string; instruction: string; newDelivery: string; bay: string; change: string }[];
  notifications: { to: string; subject: string; channel: string }[];
  risks: { risk: string; mitigation: string; probability: string }[];
}> = {
  'Option A': {
    summary: 'Resequence production schedule at Pune to protect all P1 customer deliveries. Three P3 orders will be pushed back 2-3 weeks. Overtime authorized for Pune Bays 2 and 3 during weeks 20-23.',
    kpiBefore: { 'On-Time Delivery': '86.7%', 'Revenue at Risk': '₹87 Cr', 'P1 Orders Delayed': '4', 'Overtime Hours': '0' },
    kpiAfter: { 'On-Time Delivery': '85.9%', 'Revenue at Risk': '₹12 Cr', 'P1 Orders Delayed': '0', 'Overtime Hours': '120' },
    actions: [
      {
        category: 'Production Resequencing',
        icon: <Factory className="w-4 h-4" />,
        steps: [
          { action: 'Hold PF-2025-0289 (Thermax) fabrication start', detail: 'Delay fabrication entry by 18 days. Current slot at Vadodara Bay 1 released for ONGC order pull-forward.', owner: 'V. Patel', deadline: '25 Mar 2026', status: 'Pending' },
          { action: 'Reschedule PF-2025-0312 (BHEL) assembly window', detail: 'Shift assembly start from 01 Dec to 15 Dec 2026 at Vadodara Bay 2. No downstream impact — delivery buffer absorbs delay.', owner: 'S. Kulkarni', deadline: '26 Mar 2026', status: 'Pending' },
          { action: 'Resequence PF-2025-0223 (L&T EPC) engineering phase', detail: 'Push engineering start by 14 days. Order is unassigned — no factory conflict. Notify L&T project manager.', owner: 'R. Krishnamurthy', deadline: '27 Mar 2026', status: 'Pending' },
          { action: 'Lock PF-2025-0012 (NTPC) production window', detail: 'Confirm Pune Bay 3, weeks 20-25 blocked exclusively for GT-9500E assembly. No changes permitted without Director approval.', owner: 'R. Krishnamurthy', deadline: '24 Mar 2026', status: 'Urgent' },
        ],
      },
      {
        category: 'Overtime Authorization',
        icon: <Users className="w-4 h-4" />,
        steps: [
          { action: 'Authorize Pune Bay 2 overtime — Weeks 20-22', detail: '40 hours/week additional. Requires 8 additional technicians from float pool. Shift pattern: 6am-10pm (2 shifts).', owner: 'HR — Pune', deadline: '28 Mar 2026', status: 'Pending' },
          { action: 'Authorize Pune Bay 3 overtime — Weeks 21-23', detail: '40 hours/week additional. GT-9500 specialist crew required. Cost: ₹8.4L estimated.', owner: 'HR — Pune', deadline: '28 Mar 2026', status: 'Pending' },
        ],
      },
      {
        category: 'Material Reallocation',
        icon: <Truck className="w-4 h-4" />,
        steps: [
          { action: 'Redirect rotor forging inventory to P1 orders', detail: 'Available stock (3 units) allocated to PF-2025-0012 (NTPC, 2 units) and PF-2025-0178 (ADNOC, 1 unit). Remaining P2/P3 orders wait for Bharat Forge resupply.', owner: 'Procurement', deadline: '24 Mar 2026', status: 'Urgent' },
          { action: 'Reserve combustion liner stock for NTPC', detail: '4 units of CL-7000 earmarked from current inventory. Update ERP reservation.', owner: 'Warehouse — Pune', deadline: '25 Mar 2026', status: 'Pending' },
        ],
      },
      {
        category: 'Customer Communication',
        icon: <FileText className="w-4 h-4" />,
        steps: [
          { action: 'Notify Thermax — delivery revision', detail: 'PF-2025-0289: New forecast delivery 18 Dec 2026 (was 30 Nov). Draft letter with revised milestone schedule. No penalty clause triggered (within 30-day window).', owner: 'Account Manager', deadline: '26 Mar 2026', status: 'Pending' },
          { action: 'Notify L&T EPC — timeline update', detail: 'PF-2025-0223: Engineering start pushed to mid-Aug. Delivery date unchanged (sufficient buffer). Informational notice only.', owner: 'Account Manager', deadline: '27 Mar 2026', status: 'Pending' },
          { action: 'Confirm NTPC delivery commitment', detail: 'PF-2025-0012: Reconfirm 22 Sep 2026 delivery. Send updated production schedule as confidence-building measure.', owner: 'Account Manager', deadline: '25 Mar 2026', status: 'Pending' },
        ],
      },
    ],
    orderInstructions: [
      { orderId: 'PF-2025-0012', customer: 'NTPC Ltd.', instruction: 'Protected — production window locked at Pune Bay 3', newDelivery: '22 Sep 2026', bay: 'Pune Bay 3', change: 'No change' },
      { orderId: 'PF-2025-0178', customer: 'ADNOC Offshore', instruction: 'Protected — rotor forging allocated from existing stock', newDelivery: '15 Nov 2026', bay: 'Pune Bay 3', change: 'No change' },
      { orderId: 'PF-2025-0256', customer: 'Tata Power', instruction: 'Protected — assembly window confirmed', newDelivery: '30 Oct 2026', bay: 'Pune Bay 3', change: 'No change' },
      { orderId: 'PF-2025-0289', customer: 'Thermax', instruction: 'Delayed — fabrication start held 18 days', newDelivery: '18 Dec 2026', bay: 'Vadodara Bay 1', change: '+18 days' },
      { orderId: 'PF-2025-0312', customer: 'BHEL', instruction: 'Delayed — assembly window shifted 14 days', newDelivery: '29 Mar 2027', bay: 'Vadodara Bay 2', change: '+14 days' },
      { orderId: 'PF-2025-0223', customer: 'L&T EPC', instruction: 'Delayed — engineering phase pushed 14 days', newDelivery: '01 Mar 2027', bay: 'Unassigned', change: '+14 days' },
    ],
    notifications: [
      { to: 'R. Krishnamurthy (Production Planner)', subject: 'Action Required: 4 production schedule changes for Bharat Forge delay mitigation', channel: 'Email + Dashboard' },
      { to: 'V. Patel (Vadodara Plant Manager)', subject: 'Schedule Hold: PF-2025-0289 fabrication delayed 18 days', channel: 'Email' },
      { to: 'HR — Pune', subject: 'Overtime Authorization Request: Bays 2 & 3, Weeks 20-23 (120 hours)', channel: 'Email + Workday' },
      { to: 'Thermax Account Manager', subject: 'Delivery Revision Notice: PF-2025-0289 — new forecast 18 Dec 2026', channel: 'Email' },
      { to: 'Operations Director', subject: 'Scenario Applied: Bharat Forge Delay — Option A (Minimize Customer Impact)', channel: 'Dashboard' },
    ],
    risks: [
      { risk: 'Overtime fatigue at Pune may affect quality', mitigation: 'Schedule mandatory QC hold points at 50% and 90% completion', probability: 'Medium' },
      { risk: 'Thermax may escalate delay commercially', mitigation: 'Pre-emptive call with project sponsor; delay is within contractual buffer', probability: 'Low' },
      { risk: 'Bharat Forge delay extends beyond 3 weeks', mitigation: 'Trigger alternate supplier qualification for Walchandnagar (Option C fallback)', probability: 'Medium' },
    ],
  },
  'Option B': {
    summary: 'Redistribute 4 orders from Pune to Vadodara to balance factory load. Vadodara runs extended shifts for 3 weeks. Two P2 orders see minor 1-week delays.',
    kpiBefore: { 'On-Time Delivery': '86.7%', 'Revenue at Risk': '₹87 Cr', 'Pune Utilization': '87%', 'Vadodara Utilization': '68%' },
    kpiAfter: { 'On-Time Delivery': '85.2%', 'Revenue at Risk': '₹8 Cr', 'Pune Utilization': '78%', 'Vadodara Utilization': '82%' },
    actions: [
      {
        category: 'Cross-Factory Transfer',
        icon: <Truck className="w-4 h-4" />,
        steps: [
          { action: 'Transfer PF-2025-0245 (Reliance) to Vadodara Bay 1', detail: 'GT-7000F assembly. Vadodara Bay 1 has compatible tooling. Transfer WIP materials via inter-plant logistics (est. 3 days transit).', owner: 'Logistics Coord.', deadline: '27 Mar 2026', status: 'Pending' },
          { action: 'Transfer PF-2025-0267 (ADNOC) to Vadodara Bay 3', detail: 'CP-2200H compressor. Vadodara test cell upgrade enables this. Material kit already at Pune — ship to Vadodara.', owner: 'Logistics Coord.', deadline: '28 Mar 2026', status: 'Pending' },
          { action: 'Reassign PF-2025-0167 (GAIL) to Vadodara Bay 2', detail: 'CP-2200H compressor package. Long lead time allows smooth transition. Update ERP work center assignment.', owner: 'R. Krishnamurthy', deadline: '29 Mar 2026', status: 'Pending' },
          { action: 'Move PF-2025-0301 fabrication to Vadodara', detail: 'Pre-fabrication phase only. Final assembly remains at Pune Bay 3 for GT-9500 specialized tooling.', owner: 'V. Patel', deadline: '30 Mar 2026', status: 'Pending' },
        ],
      },
      {
        category: 'Vadodara Capacity Expansion',
        icon: <Factory className="w-4 h-4" />,
        steps: [
          { action: 'Activate extended shifts at Vadodara — Weeks 20-22', detail: 'All 3 bays run 6am-10pm dual shift. Additional crew from training pool. Cost: ₹12L for 3 weeks.', owner: 'V. Patel', deadline: '28 Mar 2026', status: 'Pending' },
          { action: 'Expedite Vadodara Bay 3 test cell calibration', detail: 'Bring forward scheduled calibration from Week 22 to Week 19. Enables GT-7000 testing on-site.', owner: 'QC Lead — Vadodara', deadline: '01 Apr 2026', status: 'Pending' },
        ],
      },
      {
        category: 'Logistics & Material Movement',
        icon: <Truck className="w-4 h-4" />,
        steps: [
          { action: 'Arrange inter-plant material transfer', detail: '2 trucks required. Escort for oversized rotor components. Route: Pune → Vadodara (NH48, ~420 km, 8 hours). Insurance coverage required.', owner: 'Logistics', deadline: '27 Mar 2026', status: 'Pending' },
          { action: 'Update inventory locations in Oracle ERP', detail: 'Batch transfer of material reservations from Pune to Vadodara warehouse codes. 142 line items across 4 orders.', owner: 'ERP Admin', deadline: '28 Mar 2026', status: 'Pending' },
        ],
      },
    ],
    orderInstructions: [
      { orderId: 'PF-2025-0012', customer: 'NTPC Ltd.', instruction: 'Remains at Pune Bay 3 — no change', newDelivery: '22 Sep 2026', bay: 'Pune Bay 3', change: 'No change' },
      { orderId: 'PF-2025-0245', customer: 'Reliance Energy', instruction: 'Transferred to Vadodara Bay 1', newDelivery: '06 Nov 2026', bay: 'Vadodara Bay 1', change: '+7 days' },
      { orderId: 'PF-2025-0267', customer: 'ADNOC Offshore', instruction: 'Transferred to Vadodara Bay 3', newDelivery: '10 Sep 2026', bay: 'Vadodara Bay 3', change: 'No change' },
      { orderId: 'PF-2025-0167', customer: 'GAIL Gas', instruction: 'Transferred to Vadodara Bay 2', newDelivery: '22 Dec 2026', bay: 'Vadodara Bay 2', change: '+7 days' },
      { orderId: 'PF-2025-0289', customer: 'Thermax', instruction: 'Remains at Vadodara — schedule unchanged', newDelivery: '07 Dec 2026', bay: 'Vadodara Bay 1', change: '+7 days' },
    ],
    notifications: [
      { to: 'V. Patel (Vadodara Plant Manager)', subject: 'Incoming: 4 orders transferring from Pune — capacity plan attached', channel: 'Email + Dashboard' },
      { to: 'Logistics Department', subject: 'Inter-plant transfer required: 2 trucks, Pune→Vadodara, by 28 Mar', channel: 'Email' },
      { to: 'ERP Admin', subject: 'Batch inventory transfer: 142 line items, 4 orders', channel: 'Email + ServiceNow' },
      { to: 'Operations Director', subject: 'Scenario Applied: Bharat Forge Delay — Option B (Balance Load)', channel: 'Dashboard' },
    ],
    risks: [
      { risk: 'Material damage during inter-plant transit', mitigation: 'Dedicated escort vehicle; insurance coverage activated; QC inspection on arrival', probability: 'Low' },
      { risk: 'Vadodara crew unfamiliar with GT-7000 assembly', mitigation: 'Deploy 2 Pune specialists to Vadodara for first 2 weeks as technical advisors', probability: 'Medium' },
      { risk: 'Extended shifts impact worker morale', mitigation: 'Incentive pay (1.5x) approved for extended shift hours; rotate crews weekly', probability: 'Low' },
    ],
  },
  'Option C': {
    summary: 'Source rotor forgings from qualified alternate supplier Walchandnagar Industries at premium pricing. No orders delayed. Higher procurement cost offset by zero revenue risk.',
    kpiBefore: { 'On-Time Delivery': '86.7%', 'Revenue at Risk': '₹87 Cr', 'Procurement Cost': 'Standard', 'Quality Score': '91/100' },
    kpiAfter: { 'On-Time Delivery': '86.7%', 'Revenue at Risk': '₹0', 'Procurement Cost': '+₹1.2 Cr', 'Quality Score': '72/100 (alt.)' },
    actions: [
      {
        category: 'Alternate Supplier Activation',
        icon: <Truck className="w-4 h-4" />,
        steps: [
          { action: 'Issue emergency PO to Walchandnagar Industries', detail: 'PO for 4 GT-9500 rotor forgings. Expedited pricing: ₹30L/unit (vs. ₹22L standard from Bharat Forge). Total: ₹1.2 Cr. Payment terms: 50% advance.', owner: 'Procurement Head', deadline: '24 Mar 2026', status: 'Urgent' },
          { action: 'Confirm Walchandnagar production slot', detail: 'Walchandnagar has confirmed Week 16-20 production window. Delivery to Pune by Week 21. Expedited shipping included in pricing.', owner: 'Procurement', deadline: '25 Mar 2026', status: 'Pending' },
          { action: 'Activate incoming quality inspection protocol', detail: 'Walchandnagar quality score is 72/100 (vs. Bharat Forge 91/100). Enhanced inspection: 100% dimensional check, ultrasonic testing, metallurgical sampling on first 2 units.', owner: 'QC Lead — Pune', deadline: '25 Mar 2026', status: 'Pending' },
        ],
      },
      {
        category: 'Quality Assurance',
        icon: <AlertTriangle className="w-4 h-4" />,
        steps: [
          { action: 'Deploy enhanced receiving inspection', detail: 'First article inspection (FAI) on initial delivery. Hold production until FAI approval. Estimated 48-hour hold per batch.', owner: 'QC Lead — Pune', deadline: 'On receipt', status: 'Planned' },
          { action: 'Assign Bharat Forge technical liaison', detail: 'Request Bharat Forge engineering team review Walchandnagar specs for compatibility. Formal sign-off required before assembly.', owner: 'Engineering', deadline: '28 Mar 2026', status: 'Pending' },
          { action: 'Set up quality monitoring dashboard', detail: 'Track all Walchandnagar deliveries with enhanced metrics. Alert if any dimensional variance exceeds 0.02mm tolerance.', owner: 'QC Systems', deadline: '30 Mar 2026', status: 'Pending' },
        ],
      },
      {
        category: 'Financial & Commercial',
        icon: <FileText className="w-4 h-4" />,
        steps: [
          { action: 'Process budget variance approval', detail: 'Premium cost of ₹1.2 Cr requires Director-level approval. Cost justified against ₹87 Cr revenue protection. ROI: 72.5x.', owner: 'Finance', deadline: '25 Mar 2026', status: 'Pending' },
          { action: 'Update Bharat Forge contract terms', detail: 'Issue formal delay notification to Bharat Forge. Activate penalty clause (2% per week beyond committed date). Negotiate credit for future orders.', owner: 'Procurement', deadline: '26 Mar 2026', status: 'Pending' },
        ],
      },
    ],
    orderInstructions: [
      { orderId: 'PF-2025-0012', customer: 'NTPC Ltd.', instruction: 'No change — rotor sourced from Walchandnagar', newDelivery: '22 Sep 2026', bay: 'Pune Bay 3', change: 'No change' },
      { orderId: 'PF-2025-0178', customer: 'ADNOC Offshore', instruction: 'No change — alternate supply secured', newDelivery: '15 Nov 2026', bay: 'Pune Bay 3', change: 'No change' },
      { orderId: 'PF-2025-0256', customer: 'Tata Power', instruction: 'No change — schedule maintained', newDelivery: '30 Oct 2026', bay: 'Pune Bay 3', change: 'No change' },
      { orderId: 'PF-2025-0301', customer: 'Saudi Aramco', instruction: 'No change — alternate supply covers requirement', newDelivery: '30 Jan 2027', bay: 'Pune Bay 4', change: 'No change' },
      { orderId: 'PF-2025-0112', customer: 'Qatar Energy', instruction: 'No change — long lead time absorbs any risk', newDelivery: '30 Nov 2026', bay: 'TBD', change: 'No change' },
    ],
    notifications: [
      { to: 'Procurement Head', subject: 'URGENT: Emergency PO for Walchandnagar Industries — 4x GT-9500 rotor forgings', channel: 'Email + SMS' },
      { to: 'Finance Director', subject: 'Budget Variance Approval: ₹1.2 Cr premium procurement (ROI: 72.5x)', channel: 'Email' },
      { to: 'QC Lead — Pune', subject: 'Enhanced Inspection Protocol: Walchandnagar rotor forgings — FAI required', channel: 'Email + Dashboard' },
      { to: 'Bharat Forge Account Manager', subject: 'Formal Delay Notification & Penalty Clause Activation', channel: 'Email (Legal copy)' },
      { to: 'Operations Director', subject: 'Scenario Applied: Bharat Forge Delay — Option C (Alternate Supplier)', channel: 'Dashboard' },
    ],
    risks: [
      { risk: 'Walchandnagar quality below spec', mitigation: '100% inspection; reject & reorder from Bharat Forge if FAI fails (adds 4 weeks)', probability: 'Medium' },
      { risk: 'Bharat Forge relationship damaged', mitigation: 'Frame as temporary measure; maintain volume commitment; negotiate goodwill credit', probability: 'Low' },
      { risk: 'Budget overrun scrutiny from finance', mitigation: 'Present clear ROI analysis: ₹1.2 Cr spend protects ₹87 Cr revenue', probability: 'Low' },
    ],
  },
};

export default function ScenarioSimulator() {
  const location = useLocation();
  const navigateTo = useNavigate();
  const preload = location.state?.scenarioPreload as ScenarioPreload | undefined;

  // Map signal types to internal DisruptionType
  const mapPreloadTypes = (p: ScenarioPreload): Set<DisruptionType> => {
    const map: Record<string, DisruptionType> = { supplier_delay: 'supplier', demand_change: 'demand', capacity_loss: 'capacity', material_shortage: 'material' };
    const types = p.disruptionTypes.map(t => map[t]).filter(Boolean);
    return new Set(types.length > 0 ? types : ['supplier']);
  };

  const [selectedTypes, setSelectedTypes] = useState<Set<DisruptionType>>(preload ? mapPreloadTypes(preload) : new Set(['supplier']));
  const [supplier, setSupplier] = useState(supplierOptions[0]);
  const [delayWeeks, setDelayWeeks] = useState(3);
  const [materialShortage, setMaterialShortage] = useState('Combustion Liner CL-7000');
  const [shortageUnits, setShortageUnits] = useState(18);
  const [demandOrder, setDemandOrder] = useState('PF-2025-0012 — NTPC Ltd.');
  const [demandDirection, setDemandDirection] = useState<'pull-in' | 'push-out'>('pull-in');
  const [demandWeeks, setDemandWeeks] = useState(4);
  const [capacityFactory, setCapacityFactory] = useState(preload?.factory === 'vadodara' ? 'Vadodara' : 'Pune');
  const [capacityBay, setCapacityBay] = useState('Bay 3');
  const [rushProduct, setRushProduct] = useState('GT-7000');
  const [rushQty, setRushQty] = useState(2);
  const [simulated, setSimulated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appliedOption, setAppliedOption] = useState<string | null>(null);
  const [exploringOption, setExploringOption] = useState<string | null>(null);
  const [applyingProgress, setApplyingProgress] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [preloadDismissed, setPreloadDismissed] = useState(false);

  const toggleType = (type: DisruptionType) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type); // keep at least one
      } else {
        next.add(type);
      }
      return next;
    });
    setSimulated(false);
    setAppliedOption(null);
    setExploringOption(null);
  };

  const isCompound = selectedTypes.size > 1;

  const runSimulation = () => {
    setLoading(true);
    setSimulated(false);
    setAppliedOption(null);
    setExploringOption(null);
    const delay = isCompound ? 3500 : 2500;
    setTimeout(() => { setLoading(false); setSimulated(true); }, delay);
  };

  const handleApply = (optionLabel: string) => {
    setApplyingProgress(true);
    setTimeout(() => {
      setApplyingProgress(false);
      setAppliedOption(optionLabel);
      setExploringOption(null);
      toast.success(`${optionLabel} applied to production plan`, {
        description: 'All actions have been queued for execution. Notifications sent.',
      });
    }, 2000);
  };

  const handleExplore = (optionLabel: string) => {
    setExploringOption(exploringOption === optionLabel ? null : optionLabel);
    setAppliedOption(null);
  };

  const toggleCategory = (key: string) => {
    setExpandedCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Compound scenario adjusts impact numbers
  const impactMultiplier = isCompound ? 1 + (selectedTypes.size - 1) * 0.4 : 1;
  const compoundOrdersAffected = Math.round(14 * impactMultiplier);
  const compoundRevenue = Math.round(87 * impactMultiplier);
  const compoundDeliveries = Math.round(9 * impactMultiplier);

  const compoundOptionsData: OptionData[] = isCompound ? [
    { label: 'Option A', title: 'Minimize Customer Impact (Compound)', desc: `Address ${selectedTypes.size} simultaneous disruptions: resequence orders, reallocate materials, protect P1 deliveries`, details: [`${Math.round(5 * impactMultiplier)} P3/P2 orders delayed 2-4 weeks`, 'All P1 orders protected', `Revenue at risk: ₹${Math.round(12 * impactMultiplier)} Cr`, `Overtime: ${Math.round(120 * impactMultiplier)} hrs across both plants`], confidence: Math.max(72, Math.round(94 - (selectedTypes.size - 1) * 8)), color: 'border-status-on-track' },
    { label: 'Option B', title: 'Cross-Plant Redistribution (Compound)', desc: `Redistribute ${Math.round(6 * impactMultiplier)} orders across factories to absorb compound disruptions`, details: ['Vadodara absorbs overflow from Pune', `${Math.round(4 * impactMultiplier)} orders transferred`, `Revenue at risk: ₹${Math.round(8 * impactMultiplier)} Cr`, `Logistics + overtime: ₹${Math.round(48 * impactMultiplier)}L`], confidence: Math.max(65, Math.round(87 - (selectedTypes.size - 1) * 10)), color: 'border-primary' },
    { label: 'Option C', title: 'Aggressive Mitigation (Compound)', desc: 'Activate alternate suppliers + overtime + material substitution to prevent any delays', details: [`Premium cost: ₹${(1.2 * impactMultiplier).toFixed(1)} Cr`, 'No order delays (target)', `Revenue at risk: ₹${Math.round(3 * (selectedTypes.size - 1))} Cr`, `Quality monitoring: ${selectedTypes.size} enhanced protocols`], confidence: Math.max(58, Math.round(79 - (selectedTypes.size - 1) * 12)), color: 'border-status-at-risk' },
  ] : optionsData;

  const affectedOrders = [
    { id: 'PF-2025-0012', customer: 'NTPC Ltd.', currentDelivery: '22 Sep 2026', optA: 'No change', optB: 'No change', optC: 'No change', revenue: 164 },
    { id: 'PF-2025-0178', customer: 'ADNOC Offshore', currentDelivery: '15 Nov 2026', optA: isCompound ? '+12 days' : '+8 days', optB: 'No change', optC: 'No change', revenue: 82 },
    { id: 'PF-2025-0256', customer: 'Tata Power', currentDelivery: '30 Oct 2026', optA: isCompound ? '+21 days' : '+14 days', optB: isCompound ? '+14 days' : '+7 days', optC: 'No change', revenue: 82 },
    { id: 'PF-2025-0301', customer: 'Saudi Aramco', currentDelivery: '30 Jan 2027', optA: isCompound ? '+14 days' : '+8 days', optB: 'No change', optC: 'No change', revenue: 164 },
    { id: 'PF-2025-0112', customer: 'Qatar Energy', currentDelivery: '30 Nov 2026', optA: isCompound ? '+7 days' : 'No change', optB: 'No change', optC: 'No change', revenue: 246 },
    { id: 'PF-2025-0289', customer: 'Thermax', currentDelivery: '30 Nov 2026', optA: isCompound ? '+24 days' : '+18 days', optB: isCompound ? '+14 days' : '+7 days', optC: isCompound ? '+5 days' : 'No change', revenue: 35 },
    ...(isCompound ? [
      { id: 'PF-2025-0167', customer: 'GAIL Gas', currentDelivery: '15 Dec 2026', optA: '+14 days', optB: '+7 days', optC: 'No change', revenue: 56 },
      { id: 'PF-2025-0245', customer: 'Reliance Energy', currentDelivery: '30 Oct 2026', optA: '+10 days', optB: '+5 days', optC: 'No change', revenue: 66 },
      { id: 'PF-2025-0091', customer: 'Cairn Oil & Gas', currentDelivery: '12 Jun 2026', optA: '+7 days', optB: 'No change', optC: 'No change', revenue: 21 },
    ] : []),
  ];

  const getDeltaClass = (val: string) => val === 'No change' ? 'text-status-on-track' : 'text-status-critical';

  const activeDetail = appliedOption || exploringOption;
  const plan = activeDetail ? executionPlans[activeDetail] : null;
  const isApplied = !!appliedOption;

  const scenarioLabel = Array.from(selectedTypes).map(t => disruptionLabels[t]).join(' + ');

  const materialShortageOptions = ['Combustion Liner CL-7000', 'GT-9500 Rotor Forging', 'IGBT Module EX-400', 'Compressor Blade Set CBS-14', 'Hot Gas Path TP-9500'];

  return (
    <AppLayout>
      <div className="p-5">
        {/* Preload banner */}
        {preload && !preloadDismissed && (
          <div className="flex items-center justify-between bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded p-3 mb-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[hsl(var(--primary))]" />
              <span className="text-xs text-foreground">
                Pre-loaded from Scenario Intelligence — <strong>{preload.sourceSignals.length} signals</strong> active.{' '}
                <button onClick={() => navigateTo('/scenario-intelligence')} className="text-[hsl(var(--primary))] hover:underline font-medium">View sources →</button>
              </span>
            </div>
            <button onClick={() => setPreloadDismissed(true)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          </div>
        )}
        <h2 className="text-lg font-bold text-foreground mb-4">Scenario Simulator</h2>

        <div className="flex gap-4">
          {/* Setup panel */}
          <div className="w-[340px] flex-shrink-0 space-y-4">
            <div className="metric-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-foreground">Disruption Types</h3>
                <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{selectedTypes.size} selected</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">Select one or more disruptions to simulate simultaneously</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.entries(disruptionLabels) as [DisruptionType, string][]).map(([type, label]) => (
                  <button key={type} onClick={() => toggleType(type)}
                    className={`text-[11px] py-2 rounded font-medium transition-colors relative ${selectedTypes.has(type) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                    {label}
                    {selectedTypes.has(type) && selectedTypes.size > 1 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary-foreground text-primary rounded-full text-[8px] font-bold flex items-center justify-center border border-primary">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Active scenario chips */}
            {isCompound && (
              <div className="metric-card !py-2 !px-3">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1.5">Compound Scenario</p>
                <div className="flex flex-wrap gap-1">
                  {Array.from(selectedTypes).map(t => (
                    <span key={t} className="inline-flex items-center gap-1 text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {disruptionLabels[t]}
                      <button onClick={() => toggleType(t)} className="hover:text-status-critical">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Config forms - one per selected type */}
            <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto">
              {selectedTypes.has('supplier') && (
                <div className="metric-card space-y-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <h4 className="text-[10px] font-semibold text-primary uppercase tracking-wider">Supplier Delay</h4>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Supplier</label>
                    <select value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full text-xs px-2 py-1.5 border rounded bg-background text-foreground">
                      {supplierOptions.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Affected Material</label>
                    <p className="text-xs text-foreground bg-muted px-2 py-1.5 rounded">{materialMap[supplier]}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Delay Duration: {delayWeeks} weeks</label>
                    <input type="range" min={1} max={8} value={delayWeeks} onChange={e => setDelayWeeks(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
                    <div className="flex justify-between text-[9px] text-muted-foreground"><span>1 week</span><span>8 weeks</span></div>
                  </div>
                </div>
              )}

              {selectedTypes.has('material') && (
                <div className="metric-card space-y-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-at-risk" />
                    <h4 className="text-[10px] font-semibold text-status-at-risk uppercase tracking-wider">Material Shortage</h4>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Component</label>
                    <select value={materialShortage} onChange={e => setMaterialShortage(e.target.value)} className="w-full text-xs px-2 py-1.5 border rounded bg-background text-foreground">
                      {materialShortageOptions.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Shortage Qty: {shortageUnits} units</label>
                    <input type="range" min={2} max={40} value={shortageUnits} onChange={e => setShortageUnits(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-status-at-risk" />
                    <div className="flex justify-between text-[9px] text-muted-foreground"><span>2 units</span><span>40 units</span></div>
                  </div>
                </div>
              )}

              {selectedTypes.has('demand') && (
                <div className="metric-card space-y-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-critical" />
                    <h4 className="text-[10px] font-semibold text-status-critical uppercase tracking-wider">Demand Change</h4>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Order</label>
                    <select value={demandOrder} onChange={e => setDemandOrder(e.target.value)} className="w-full text-xs px-2 py-1.5 border rounded bg-background text-foreground">
                      <option>PF-2025-0012 — NTPC Ltd.</option>
                      <option>PF-2025-0078 — Saudi Aramco</option>
                      <option>PF-2025-0112 — Qatar Energy</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Change Type</label>
                    <div className="flex gap-2">
                      <button onClick={() => setDemandDirection('pull-in')} className={`flex-1 text-xs py-1.5 rounded ${demandDirection === 'pull-in' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>Pull-In</button>
                      <button onClick={() => setDemandDirection('push-out')} className={`flex-1 text-xs py-1.5 rounded ${demandDirection === 'push-out' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>Push-Out</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Shift: {demandWeeks} weeks</label>
                    <input type="range" min={1} max={12} value={demandWeeks} onChange={e => setDemandWeeks(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
                  </div>
                </div>
              )}

              {selectedTypes.has('capacity') && (
                <div className="metric-card space-y-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-delayed" />
                    <h4 className="text-[10px] font-semibold text-status-delayed uppercase tracking-wider">Capacity Loss</h4>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Factory</label>
                    <select value={capacityFactory} onChange={e => setCapacityFactory(e.target.value)} className="w-full text-xs px-2 py-1.5 border rounded bg-background text-foreground">
                      <option>Pune</option><option>Vadodara</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Bay / Line</label>
                    <select value={capacityBay} onChange={e => setCapacityBay(e.target.value)} className="w-full text-xs px-2 py-1.5 border rounded bg-background text-foreground">
                      <option>Bay 1</option><option>Bay 2</option><option>Bay 3</option><option>Bay 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Downtime Window</label>
                    <div className="flex gap-2">
                      <input type="date" className="flex-1 text-xs px-2 py-1.5 border rounded bg-background text-foreground" />
                      <input type="date" className="flex-1 text-xs px-2 py-1.5 border rounded bg-background text-foreground" />
                    </div>
                  </div>
                </div>
              )}

              {selectedTypes.has('rush') && (
                <div className="metric-card space-y-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-critical" />
                    <h4 className="text-[10px] font-semibold text-status-critical uppercase tracking-wider">Rush Order</h4>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Product Line</label>
                    <select value={rushProduct} onChange={e => setRushProduct(e.target.value)} className="w-full text-xs px-2 py-1.5 border rounded bg-background text-foreground">
                      <option>GT-7000</option><option>GT-9500</option><option>ST-4000</option><option>CP-2200</option><option>GP-6000</option><option>GP-8500</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Quantity: {rushQty} units</label>
                    <input type="range" min={1} max={6} value={rushQty} onChange={e => setRushQty(Number(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-status-critical" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Required Delivery</label>
                    <input type="date" className="w-full text-xs px-2 py-1.5 border rounded bg-background text-foreground" />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Priority</label>
                    <div className="flex gap-1.5">
                      {['P1', 'P2', 'P3'].map(p => (
                        <button key={p} className={`flex-1 text-[10px] py-1 rounded font-medium ${p === 'P1' ? 'bg-status-critical/15 text-status-critical' : 'bg-muted text-muted-foreground'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTypes.has('custom') && (
                <div className="metric-card space-y-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Custom Scenario</h4>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block mb-1">Description</label>
                    <textarea className="w-full text-xs px-2 py-1.5 border rounded bg-background text-foreground h-16 resize-none" placeholder="Describe the scenario..." />
                  </div>
                </div>
              )}
            </div>

            <button onClick={runSimulation} className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded hover:opacity-90 transition-opacity">
              {loading ? 'Simulating...' : isCompound ? `Simulate ${selectedTypes.size} Disruptions` : 'Simulate Impact'}
            </button>
          </div>

          {/* Results */}
          <div className="flex-1 space-y-4 min-w-0">
            {loading && (
              <div className="metric-card flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-foreground font-medium">{isCompound ? 'Running compound simulation...' : 'Running simulation...'}</p>
                  <p className="text-xs text-muted-foreground">
                    {isCompound
                      ? `Analyzing ${selectedTypes.size} simultaneous disruptions across 1,183 orders`
                      : `Analyzing ${supplier} delay impact across 1,183 orders`
                    }
                  </p>
                  {isCompound && (
                    <div className="flex flex-wrap gap-1 justify-center mt-3">
                      {Array.from(selectedTypes).map(t => (
                        <span key={t} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{disruptionLabels[t]}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Applying overlay */}
            {applyingProgress && (
              <div className="metric-card flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-status-on-track border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-foreground font-medium">Applying to production plan...</p>
                  <p className="text-xs text-muted-foreground">Updating schedules, sending notifications, reserving materials</p>
                </div>
              </div>
            )}

            {simulated && !loading && !applyingProgress && !activeDetail && (
              <>
                {/* Compound scenario banner */}
                {isCompound && (
                  <div className="metric-card border-l-4 border-status-at-risk !py-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-status-at-risk flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">Compound Scenario: {scenarioLabel}</p>
                        <p className="text-[10px] text-muted-foreground">Simultaneous disruptions amplify impact — cascading effects detected across supply chain and production schedule</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Impact summary */}
                <div className="grid grid-cols-4 gap-3">
                  <MetricCard title="Orders Affected" value={String(compoundOrdersAffected)} subtitle={isCompound ? `↑ from 14 (single)` : undefined} />
                  <MetricCard title="Revenue at Risk" value={`₹${compoundRevenue} Cr`} deltaType="negative" subtitle={isCompound ? `Compound: ${selectedTypes.size} disruptions` : undefined} />
                  <MetricCard title="Deliveries Impacted" value={`${compoundDeliveries} orders`} subtitle={`avg. ${isCompound ? Math.round(11 * impactMultiplier) : 11} days delayed`} />
                  <MetricCard title="Utilization Change" value="Pune Bay 3" subtitle={isCompound ? '87% → 54% (W20-24)' : '87% → 62% (W20-22)'} />
                </div>

                {/* Replanning options */}
                <div className="grid grid-cols-3 gap-3">
                  {compoundOptionsData.map((opt, i) => (
                    <div key={i} className={`metric-card border-l-4 ${opt.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold text-primary uppercase">{opt.label}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{opt.confidence}% confidence</span>
                      </div>
                      <h4 className="text-xs font-bold text-foreground mb-1">{opt.title}</h4>
                      <p className="text-[10px] text-muted-foreground mb-2">{opt.desc}</p>
                      <ul className="space-y-0.5 mb-3">
                        {opt.details.map((d, j) => <li key={j} className="text-[10px] text-foreground">• {d}</li>)}
                      </ul>
                      <div className="flex gap-2">
                        <button onClick={() => handleApply(opt.label)} className="flex-1 text-[10px] py-1.5 bg-primary text-primary-foreground rounded font-medium hover:opacity-90">Select & Apply</button>
                        <button onClick={() => handleExplore(opt.label)} className="text-[10px] py-1.5 px-2 border rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">Explore</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Affected orders table */}
                <div className="metric-card">
                  <h3 className="text-xs font-semibold text-foreground mb-3">Affected Orders Detail</h3>
                  <table className="data-table">
                    <thead><tr><th>Order ID</th><th>Customer</th><th>Current Delivery</th><th>Option A</th><th>Option B</th><th>Option C</th><th className="text-right">Revenue</th></tr></thead>
                    <tbody>
                      {affectedOrders.map(o => (
                        <tr key={o.id}>
                          <td className="font-mono text-xs text-primary">{o.id}</td>
                          <td className="text-xs">{o.customer}</td>
                          <td className="text-xs font-mono">{o.currentDelivery}</td>
                          <td className={`text-xs font-medium ${getDeltaClass(o.optA)}`}>{o.optA}</td>
                          <td className={`text-xs font-medium ${getDeltaClass(o.optB)}`}>{o.optB}</td>
                          <td className={`text-xs font-medium ${getDeltaClass(o.optC)}`}>{o.optC}</td>
                          <td className="text-xs font-mono text-right">₹{o.revenue} Cr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action bar */}
                <div className="flex gap-2 justify-end">
                  <button onClick={() => toast.success('All scenarios saved')} className="text-xs px-4 py-2 border rounded text-foreground hover:bg-muted/50">Save All Scenarios</button>
                  <button onClick={() => toast.success('Export initiated')} className="text-xs px-4 py-2 border rounded text-foreground hover:bg-muted/50">Export Comparison</button>
                </div>
              </>
            )}

            {/* ========== DETAILED VIEW (Explore or Applied) ========== */}
            {simulated && !loading && !applyingProgress && activeDetail && plan && (
              <div className="space-y-4">
                {/* Header */}
                <div className={`metric-card border-l-4 ${isApplied ? 'border-status-on-track bg-status-on-track/5' : 'border-primary'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {isApplied && <CheckCircle className="w-4 h-4 text-status-on-track" />}
                        <span className="text-[10px] font-semibold text-primary uppercase">{activeDetail}</span>
                        {isApplied && <span className="text-[10px] font-semibold text-status-on-track bg-status-on-track/10 px-2 py-0.5 rounded-full">APPLIED TO PLAN</span>}
                        {!isApplied && <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">EXPLORING</span>}
                      </div>
                      <h3 className="text-sm font-bold text-foreground">{optionsData.find(o => o.label === activeDetail)?.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 max-w-2xl">{plan.summary}</p>
                    </div>
                    <button onClick={() => { setAppliedOption(null); setExploringOption(null); }} className="p-1 hover:bg-muted rounded transition-colors">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* KPI Before/After */}
                <div className="metric-card">
                  <h4 className="text-xs font-semibold text-foreground mb-3">KPI Impact — Before vs. After</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.keys(plan.kpiBefore).map(key => (
                      <div key={key} className="bg-muted/30 rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{key}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground line-through">{plan.kpiBefore[key]}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs font-mono font-bold text-foreground">{plan.kpiAfter[key]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Actions */}
                <div className="metric-card">
                  <h4 className="text-xs font-semibold text-foreground mb-3">
                    {isApplied ? '✓ Execution Plan — Actions Queued' : 'Execution Plan — Preview'}
                  </h4>
                  <div className="space-y-2">
                    {plan.actions.map((cat, ci) => {
                      const catKey = `${activeDetail}-${ci}`;
                      const isExpanded = expandedCategories[catKey] !== false; // default open
                      return (
                        <div key={ci} className="border rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleCategory(catKey)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                          >
                            <span className="text-primary">{cat.icon}</span>
                            <span className="text-xs font-semibold text-foreground flex-1">{cat.category}</span>
                            <span className="text-[10px] text-muted-foreground">{cat.steps.length} actions</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>
                          {isExpanded && (
                            <div className="divide-y">
                              {cat.steps.map((step, si) => (
                                <div key={si} className="px-4 py-3">
                                  <div className="flex items-start gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                      isApplied ? 'bg-status-on-track/15' : step.status === 'Urgent' ? 'bg-status-critical/15' : 'bg-muted'
                                    }`}>
                                      {isApplied ? (
                                        <CheckCircle className="w-3 h-3 text-status-on-track" />
                                      ) : step.status === 'Urgent' ? (
                                        <AlertTriangle className="w-3 h-3 text-status-critical" />
                                      ) : (
                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-xs font-medium text-foreground">{step.action}</p>
                                        {step.status === 'Urgent' && !isApplied && (
                                          <span className="text-[9px] font-bold text-status-critical bg-status-critical/10 px-1.5 py-0.5 rounded">URGENT</span>
                                        )}
                                        {isApplied && (
                                          <span className="text-[9px] font-bold text-status-on-track bg-status-on-track/10 px-1.5 py-0.5 rounded">QUEUED</span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-muted-foreground leading-relaxed">{step.detail}</p>
                                      <div className="flex items-center gap-4 mt-1.5 text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{step.owner}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{step.deadline}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order-Level Instructions */}
                <div className="metric-card">
                  <h4 className="text-xs font-semibold text-foreground mb-3">Order-Level Instructions</h4>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Instruction</th>
                        <th>New Delivery</th>
                        <th>Bay</th>
                        <th className="text-center">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.orderInstructions.map(o => (
                        <tr key={o.orderId}>
                          <td className="font-mono text-xs text-primary">{o.orderId}</td>
                          <td className="text-xs">{o.customer}</td>
                          <td className="text-xs text-foreground max-w-[250px]">{o.instruction}</td>
                          <td className="text-xs font-mono">{o.newDelivery}</td>
                          <td className="text-xs">{o.bay}</td>
                          <td className="text-xs text-center">
                            <span className={`font-semibold ${o.change === 'No change' ? 'text-status-on-track' : 'text-status-critical'}`}>
                              {o.change}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Notifications */}
                {isApplied && (
                  <div className="metric-card">
                    <h4 className="text-xs font-semibold text-foreground mb-3">📨 Notifications Sent</h4>
                    <div className="space-y-2">
                      {plan.notifications.map((n, i) => (
                        <div key={i} className="flex items-start gap-3 py-2 border-b last:border-0">
                          <CheckCircle className="w-3.5 h-3.5 text-status-on-track mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground">{n.to}</p>
                            <p className="text-[11px] text-muted-foreground">{n.subject}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded flex-shrink-0">{n.channel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risks */}
                <div className="metric-card">
                  <h4 className="text-xs font-semibold text-foreground mb-3">⚠ Residual Risks & Mitigations</h4>
                  <div className="space-y-2">
                    {plan.risks.map((r, i) => (
                      <div key={i} className="bg-muted/30 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-xs font-medium text-foreground">{r.risk}</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                            r.probability === 'Medium' ? 'bg-status-at-risk/10 text-status-at-risk' : 'bg-status-on-track/10 text-status-on-track'
                          }`}>{r.probability}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">Mitigation: {r.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="flex gap-2 justify-between items-center">
                  <button
                    onClick={() => { setAppliedOption(null); setExploringOption(null); }}
                    className="text-xs px-4 py-2 border rounded text-foreground hover:bg-muted/50"
                  >
                    ← Back to Options
                  </button>
                  <div className="flex gap-2">
                    {!isApplied && (
                      <button
                        onClick={() => handleApply(activeDetail)}
                        className="text-xs px-4 py-2 bg-primary text-primary-foreground rounded font-medium hover:opacity-90"
                      >
                        Select & Apply This Option
                      </button>
                    )}
                    <button onClick={() => toast.success('Exported to PDF')} className="text-xs px-4 py-2 border rounded text-foreground hover:bg-muted/50">Export Report</button>
                  </div>
                </div>
              </div>
            )}

            {!simulated && !loading && !applyingProgress && (
              <div className="metric-card flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Configure one or more disruption scenarios and click "Simulate Impact"</p>
                  <p className="text-xs text-muted-foreground mt-1">Select multiple disruption types to run compound simulations</p>
                  <p className="text-[10px] text-muted-foreground mt-2">The AI engine will analyze cascading impact across all 1,183 orders</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
