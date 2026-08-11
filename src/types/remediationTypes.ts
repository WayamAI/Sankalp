export interface RemediationOption {
  id: 'a' | 'b' | 'c'
  label: string
  posture: string
  title: string
  description: string
  metrics: Array<{
    label: string
    value: string
    direction: 'positive' | 'warning' | 'negative' | 'neutral'
  }>
  impactCategories: string[]
  projectedImpact: Array<{
    label: string
    value: string
    delta: string
    direction: 'positive' | 'warning' | 'negative' | 'neutral'
  }>
  actionPlan: Array<{
    title: string
    detail: string
    urgency: 'today' | 'this_week' | 'this_month' | 'ongoing'
    dueDate: string
  }>
  commitMessage: string
}

export interface RiskRemediation {
  riskId: string
  options: [RemediationOption, RemediationOption, RemediationOption]
}
