import { useState } from 'react';
import { AppIcon } from '@/components/ui/app-icon';
import { IconButton } from '@/components/ui/icon-button';
import { useNavigate } from 'react-router-dom';

const suggestedPrompts = [
  "What happens if Bharat Forge is 3 weeks late on rotor forgings?",
  "Show me all P1 orders at risk of delay",
  "Can Vadodara absorb 2 more GT-7000 orders in Q3?",
  "What's the impact of pulling in the NTPC order by 4 weeks?",
  "Which orders should I deprioritize to protect the Saudi Aramco delivery?",
];

const cannedResponses: Record<string, string> = {
  "What happens if Bharat Forge is 3 weeks late on rotor forgings?": `**Impact Analysis: Bharat Forge 3-Week Delay**

**Affected Orders:** 6 orders across GT-9500 product line
- PF-2025-0012 (NTPC, ₹164 Cr) — delivery shifts +12 days
- PF-2025-0178 (ADNOC, ₹82 Cr) — delivery shifts +18 days  
- PF-2025-0256 (Tata Power, ₹82 Cr) — delivery shifts +14 days
- PF-2025-0301 (Saudi Aramco, ₹164 Cr) — delivery shifts +8 days
- PF-2025-0112 (Qatar Energy, ₹246 Cr) — no impact (long lead time buffer)

**Revenue at Risk:** ₹492 Cr
**Recommended Action:** Activate alternate supplier Walchandnagar Industries for 2 rotor forgings (quality score 72 vs 91, premium ₹1.2 Cr). This protects the NTPC and ADNOC P1 deliveries.`,

  "Show me all P1 orders at risk of delay": `**P1 Orders at Risk — 5 orders, ₹606 Cr total**

| Order | Customer | Revenue | Risk Factor |
|-------|----------|---------|-------------|
| PF-2025-0078 | Saudi Aramco | ₹42 Cr | Material 74% ready, CBS-14 short |
| PF-2025-0112 | Qatar Energy | ₹246 Cr | Unassigned factory, 58% material |
| PF-2025-0178 | ADNOC | ₹82 Cr | Rotor forging delay (Bharat Forge) |
| PF-2025-0256 | Tata Power | ₹82 Cr | Pune Bay 3 overloaded weeks 22-24 |
| PF-2025-0056 | Saudi Aramco | ₹66 Cr | Critical — procurement delayed |

**Top recommendation:** Assign PF-2025-0112 to Pune Bay 3 (post week 34) and expedite material procurement.`,

  "Can Vadodara absorb 2 more GT-7000 orders in Q3?": `**Vadodara GT-7000 Absorption Analysis**

**Current Vadodara utilization Q3 2026:** 68% average
**GT-7000 requires:** Assembly Bay with gas turbine tooling

⚠️ **Constraint:** Vadodara does not currently have GT-7000 specific tooling. Bay 1 and Bay 3 are configured for steam turbines and generators.

**Options:**
1. **Tooling transfer from Pune** — 3 weeks setup, ₹45L cost. Enables GT-7000 production from Week 28 onwards. Vadodara utilization rises to 82%.
2. **Keep at Pune** — Bay 1 has capacity from Week 36, but Q3 window is tight. Pune utilization hits 93% in weeks 30-34.

**Recommendation:** Option 1 — transfer tooling to Vadodara. The 3-week investment pays off with 14% utilization improvement and reduces Pune overload risk.`,

  "What's the impact of pulling in the NTPC order by 4 weeks?": `**Pull-In Impact: PF-2025-0012 (NTPC) — 4 Weeks Earlier**

**Original delivery:** 22 Sep 2026 → **Requested:** 25 Aug 2026

**Capacity conflict:** Pune Bay 3, Weeks 22-23 already at 92% utilization with GT-9500 orders PF-2025-0178 and PF-2025-0256.

**Cascade effects:**
- PF-2025-0245 (Reliance, P2, ₹66 Cr) pushed back 2 weeks
- PF-2025-0289 (Thermax, P3, ₹35 Cr) pushed back 3 weeks
- Overtime required: 180 hours at Pune Bay 3

**Material readiness:** 91% — all critical components available. IGBT modules for excitation need expediting (current ETA: 25 Apr).

**Recommendation:** Feasible with P2/P3 resequencing. Revenue protection: ₹164 Cr (NTPC P1) vs ₹101 Cr at risk from displaced orders.`,

  "Which orders should I deprioritize to protect the Saudi Aramco delivery?": `**Deprioritization Analysis for Saudi Aramco PF-2025-0078**

To protect the 30 Aug 2026 delivery (CP-2200H, ₹42 Cr, P1):

**Recommended deprioritization (Pune Bay 2):**

1. **PF-2025-0067** (Tata Power, CP-2200, P2, ₹35 Cr) — Push 2 weeks. Low customer impact, Tata has confirmed flexibility.
2. **PF-2025-0128** (Cairn Oil & Gas, CP-2200, P2, ₹21 Cr) — Push 1 week. Material readiness at 79% anyway.

**Do NOT deprioritize:**
- PF-2025-0267 (ADNOC, P1, ₹28 Cr) — contractual penalties apply
- PF-2025-0012 (NTPC, P1, ₹164 Cr) — strategic account

**Net effect:** Saudi Aramco delivery secured. 2 P2 orders shift by 1-2 weeks with ₹0 penalty risk. Total capacity freed: 180 assembly hours.`,
};

export function ConversationalPlanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = cannedResponses[userMsg] || `**Analysis in Progress**\n\nI'm analyzing your query across 1,183 active orders, 7 assembly bays, and 22 suppliers.\n\n⚠️ This query requires a custom simulation. Click "Open in Simulator" to configure the full scenario with all constraint parameters.\n\nIn the meantime, here's what I can tell you:\n- Current order book: ₹3,142 Cr across ${32} active orders\n- Factory utilization: Pune 87%, Vadodara 68%\n- 4 critical material shortages being tracked`;
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const alertCount = 7;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open Sankalp Planner"
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-action-primary text-icon-on-color flex items-center justify-center hover:bg-action-primary-hover transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isOpen ? 'hidden' : ''}`}
      >
        <AppIcon name="chat" size="xl" />
        {alertCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-status-critical text-[10px] font-semibold tabular-nums flex items-center justify-center text-on-color ring-2 ring-background">
            {alertCount}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-container border border-default rounded-xl shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-raised text-foreground">
            <div>
              <p className="text-label-md text-foreground">Sankalp Planner</p>
              <p className="text-caption text-tertiary">Connected to live order book • 1,183 orders</p>
            </div>
            <IconButton icon="close" label="Close planner" size="sm" onClick={() => setIsOpen(false)} />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-3">Ask me about your production plan, orders, or run what-if scenarios:</p>
                <div className="space-y-2">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="w-full text-left text-xs p-2.5 rounded-lg border bg-raised hover:bg-raised-2 hover:border-default transition-colors duration-150 text-secondary hover:text-foreground"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`max-w-[90%] text-xs leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-xl px-3 py-2' : 'text-foreground'}`}>
                  {msg.role === 'assistant' ? (
                    <div className="space-y-1">
                      {msg.content.split('\n').map((line, j) => {
                        if (line.startsWith('**') && line.endsWith('**')) return <p key={j} className="font-bold text-foreground">{line.replace(/\*\*/g, '')}</p>;
                        if (line.startsWith('- ')) return <p key={j} className="ml-2 text-muted-foreground">{line}</p>;
                        if (line.startsWith('|')) return <p key={j} className="font-mono text-[10px] text-muted-foreground">{line}</p>;
                        if (line.startsWith('⚠️')) return <p key={j} className="text-status-at-risk">{line}</p>;
                        return <p key={j} className="text-muted-foreground">{line}</p>;
                      })}
                      <button
                        onClick={() => navigate('/simulate')}
                        className="mt-2 inline-flex items-center gap-1 text-primary text-[11px] font-medium hover:underline"
                      >
                        Open in Simulator <AppIcon name="arrowUpRight" size="xs" />
                      </button>
                    </div>
                  ) : msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" style={{ animationDelay: '0.3s' }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-slow" style={{ animationDelay: '0.6s' }} />
                <span className="text-[10px] ml-1">Analyzing order book...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend(input)}
                placeholder="Ask about orders, capacity, suppliers..."
                className="flex-1 text-xs px-3 py-2 border border-input rounded-lg bg-raised text-foreground placeholder:text-tertiary focus:outline-none focus:border-active focus:ring-1 focus:ring-ring"
              />
              <button
                onClick={() => handleSend(input)}
                aria-label="Send"
                className="px-3 py-2 bg-action-primary text-icon-on-color rounded-lg hover:bg-action-primary-hover transition-colors duration-150"
              >
                <AppIcon name="send" size="sm" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
