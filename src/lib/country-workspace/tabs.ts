// Adaptive Country Workspace — tab registry + deterministic ranking engine.
// Pure and serializable-friendly: the server ranks tabs and passes plain
// TabMeta[] to the client. Score functions never cross the client boundary.
import type { RelocationProfile } from '../profile'

export type CountryTabId =
  | 'overview'
  | 'why-you'
  | 'economic-profile'
  | 'cost-of-living'
  | 'housing'
  | 'pathways'
  | 'employment'
  | 'healthcare'
  | 'education'
  | 'transportation'
  | 'legal-taxes'
  | 'daily-life'
  | 'family-pets'
  | 'greenbook'
  | 'resources'
  | 'compare'

export type TabGroup = 'Reality' | 'Entry & Work' | 'Life & Services' | 'Belonging & Support'

export type TabRankingContext = {
  hasDependents: boolean
  familyHousehold: boolean
  moveWithin6mo: boolean
  moveWithin12mo: boolean
  remote: boolean
  localEmployment: boolean
  businessInterest: boolean
  selfEmployed: boolean
  studyInterest: boolean
  passiveIncome: boolean
  affordabilityPriority: boolean
  safetyPriority: boolean
  careerPriority: boolean
}

export type TabMeta = { id: CountryTabId; label: string; shortLabel: string; group: TabGroup; alwaysVisible: boolean }

type TabDef = TabMeta & { base: number; hideWhenIrrelevant: boolean; adjust: (c: TabRankingContext) => number }

const b = (v: boolean, n: number) => (v ? n : 0)

const TAB_DEFS: TabDef[] = [
  { id: 'overview', label: 'Overview', shortLabel: 'Overview', group: 'Reality', base: 100, alwaysVisible: true, hideWhenIrrelevant: false, adjust: () => 0 },
  { id: 'why-you', label: 'Why This Matches You', shortLabel: 'Why You', group: 'Reality', base: 98, alwaysVisible: true, hideWhenIrrelevant: false, adjust: () => 0 },
  { id: 'economic-profile', label: 'Economic Profile', shortLabel: 'Economy', group: 'Reality', base: 95, alwaysVisible: true, hideWhenIrrelevant: false,
    adjust: (c) => b(c.careerPriority, 10) + b(c.localEmployment, 10) + b(c.businessInterest, 10) + b(c.selfEmployed, 8) + b(c.passiveIncome, 5) },
  { id: 'cost-of-living', label: 'Cost of Living', shortLabel: 'Cost', group: 'Reality', base: 90, alwaysVisible: true, hideWhenIrrelevant: false,
    adjust: (c) => b(c.affordabilityPriority, 20) + b(c.familyHousehold, 5) + b(c.passiveIncome, 5) },
  { id: 'pathways', label: 'Pathways', shortLabel: 'Pathways', group: 'Entry & Work', base: 90, alwaysVisible: true, hideWhenIrrelevant: false,
    adjust: (c) => b(c.moveWithin12mo, 15) + b(c.remote, 10) + b(c.localEmployment, 10) + b(c.studyInterest, 10) + b(c.businessInterest, 10) + b(c.passiveIncome, 10) },
  { id: 'healthcare', label: 'Healthcare', shortLabel: 'Health', group: 'Life & Services', base: 75, alwaysVisible: true, hideWhenIrrelevant: false,
    adjust: (c) => b(c.passiveIncome, 10) + b(c.familyHousehold, 8) },
  { id: 'greenbook', label: 'Greenbook', shortLabel: 'Greenbook', group: 'Belonging & Support', base: 75, alwaysVisible: true, hideWhenIrrelevant: false,
    adjust: (c) => b(c.safetyPriority, 10) + b(c.familyHousehold, 5) },
  { id: 'housing', label: 'Housing', shortLabel: 'Housing', group: 'Reality', base: 70, alwaysVisible: false, hideWhenIrrelevant: false,
    adjust: (c) => b(c.affordabilityPriority, 10) + b(c.familyHousehold, 8) + b(c.moveWithin12mo, 10) },
  { id: 'legal-taxes', label: 'Legal & Taxes', shortLabel: 'Legal', group: 'Entry & Work', base: 70, alwaysVisible: true, hideWhenIrrelevant: false,
    adjust: (c) => b(c.businessInterest, 15) + b(c.selfEmployed, 12) + b(c.remote, 10) + b(c.passiveIncome, 10) + b(c.moveWithin12mo, 10) },
  { id: 'employment', label: 'Employment', shortLabel: 'Work', group: 'Entry & Work', base: 60, alwaysVisible: false, hideWhenIrrelevant: false,
    adjust: (c) => b(c.localEmployment, 25) + b(c.careerPriority, 20) + b(c.selfEmployed, 10) + b(c.businessInterest, 8) + b(c.remote, 5) },
  { id: 'transportation', label: 'Transportation', shortLabel: 'Transit', group: 'Life & Services', base: 60, alwaysVisible: false, hideWhenIrrelevant: false, adjust: () => 0 },
  { id: 'daily-life', label: 'Daily Life', shortLabel: 'Daily Life', group: 'Life & Services', base: 55, alwaysVisible: true, hideWhenIrrelevant: false, adjust: () => 0 },
  { id: 'education', label: 'Education', shortLabel: 'Education', group: 'Life & Services', base: 40, alwaysVisible: false, hideWhenIrrelevant: true,
    adjust: (c) => b(c.familyHousehold, 35) + b(c.studyInterest, 30) - b(!c.familyHousehold && !c.studyInterest, 25) },
  { id: 'family-pets', label: 'Family & Pets', shortLabel: 'Family', group: 'Life & Services', base: 35, alwaysVisible: false, hideWhenIrrelevant: true,
    adjust: (c) => b(c.familyHousehold, 30) + b(c.hasDependents, 20) - b(!c.familyHousehold && !c.hasDependents, 20) },
  { id: 'resources', label: 'Resources', shortLabel: 'Resources', group: 'Belonging & Support', base: 30, alwaysVisible: true, hideWhenIrrelevant: false,
    adjust: (c) => b(c.moveWithin6mo, 20) + b(c.moveWithin12mo && !c.moveWithin6mo, 10) },
]

export function buildTabContext(profile: RelocationProfile): TabRankingContext {
  const within6 = ['0-3 months', '3-6 months'].includes(profile.timeline ?? '')
  const within12 = within6 || profile.timeline === '6-12 months'
  const goals = profile.goals
  return {
    hasDependents: (profile.dependents ?? 0) > 0,
    familyHousehold: profile.household_type === 'Family',
    moveWithin6mo: within6,
    moveWithin12mo: within12,
    remote: profile.remote === true,
    localEmployment: goals.includes('Employment'),
    businessInterest: goals.includes('Entrepreneurship') || goals.includes('Investment'),
    selfEmployed: profile.income_type === 'Self-employment' || profile.income_type === 'Mixed',
    studyInterest: goals.includes('Education'),
    passiveIncome: goals.includes('Passive Income / Retirement'),
    affordabilityPriority: profile.priority === 'Affordability',
    safetyPriority: profile.priority === 'Safety',
    careerPriority: profile.priority === 'Career options',
  }
}

// Deterministic ranking. Overview pinned first, Resources kept last; everything
// else sorts by base + adjustments. Optional tabs with a negative adjustment and
// no relevance are dropped from the personalized view (still in All Sections).
export function rankTabs(context: TabRankingContext, personalized = true): TabMeta[] {
  const scored = TAB_DEFS.map((tab) => ({ tab, score: tab.base + tab.adjust(context) }))
  const visible = personalized
    ? scored.filter(({ tab, score }) => tab.alwaysVisible || !(tab.hideWhenIrrelevant && score < tab.base))
    : scored
  return visible
    .sort((a, b2) => {
      if (a.tab.id === 'overview') return -1
      if (b2.tab.id === 'overview') return 1
      if (a.tab.id === 'resources') return 1
      if (b2.tab.id === 'resources') return -1
      return b2.score - a.score
    })
    .map(({ tab }) => ({ id: tab.id, label: tab.label, shortLabel: tab.shortLabel, group: tab.group, alwaysVisible: tab.alwaysVisible }))
}

export const ALL_TABS_ORDERED: TabMeta[] = TAB_DEFS.map((t) => ({ id: t.id, label: t.label, shortLabel: t.shortLabel, group: t.group, alwaysVisible: t.alwaysVisible }))

// All tabs have real content components.
export const IMPLEMENTED_TABS: CountryTabId[] = [
  'overview', 'why-you', 'economic-profile', 'cost-of-living', 'pathways',
  'housing', 'employment', 'healthcare', 'education', 'transportation',
  'legal-taxes', 'daily-life', 'family-pets', 'greenbook', 'resources', 'compare',
]
