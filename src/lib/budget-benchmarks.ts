import type { BudgetLine, BudgetStage } from './plan-types'

export type BudgetBenchmarkDetail = {
  id: string
  label: string
  amount: number
  note: string
}

export type BudgetCategoryBenchmark = {
  category: string
  label: string
  stage: BudgetStage
  details: BudgetBenchmarkDetail[]
}

export type BudgetBenchmark = {
  key: string
  destination: string
  householdMembers: number
  currency: 'USD'
  sourceLabel: string
  lastReviewed: string
  assumptions: string[]
  categories: BudgetCategoryBenchmark[]
}

// The only approved benchmark set in this phase is the owner-provided Portugal
// household-of-five planning reference. It is intentionally labelled as a
// planning baseline rather than verified local pricing.
const PORTUGAL_FAMILY_FIVE: BudgetBenchmark = {
  key: 'portugal:household-5:2026-08',
  destination: 'Portugal',
  householdMembers: 5,
  currency: 'USD',
  sourceLabel: 'Kolmari Portugal planning reference',
  lastReviewed: 'August 2026',
  assumptions: [
    'Household of five planning for a long-term move to Portugal.',
    'Housing assumes a three-bedroom home at a mid-market planning level.',
    'One-time figures are planning allowances, not quotes or visa requirements.',
    'Replace any baseline with current local research before making a commitment.',
  ],
  categories: [
    {
      category: 'visa', label: 'Visa and legal fees', stage: 'ONE_TIME', details: [
        { id: 'application-fees', label: 'Application and appointment fees', amount: 350, note: 'Planning allowance for the household.' },
        { id: 'documents', label: 'Apostilles and document copies', amount: 200, note: 'Varies by document count and issuing state.' },
        { id: 'translations', label: 'Certified translations', amount: 300, note: 'Confirm the required language and translator standard.' },
      ],
    },
    {
      category: 'flights', label: 'Flights and travel', stage: 'ONE_TIME', details: [
        { id: 'tickets', label: 'One-way airfare for five people', amount: 2400, note: 'Planning allowance; season and departure city matter.' },
        { id: 'baggage', label: 'Checked baggage and seat fees', amount: 400, note: 'Confirm the fare rules before booking.' },
      ],
    },
    {
      category: 'deposits', label: 'Housing deposits', stage: 'ONE_TIME', details: [
        { id: 'lease-deposit', label: 'Lease security deposit allowance', amount: 750, note: 'Landlord requirements vary; verify before paying.' },
      ],
    },
    {
      category: 'logistics', label: 'Shipping and logistics', stage: 'ONE_TIME', details: [
        { id: 'shipping', label: 'Shipping or additional baggage', amount: 1800, note: 'Compare shipping with replacing items after arrival.' },
        { id: 'arrival-setup', label: 'Arrival setup and local transport', amount: 600, note: 'Short-term logistics before the household is settled.' },
      ],
    },
    {
      category: 'housing', label: 'Housing', stage: 'MONTHLY_RECURRING', details: [
        { id: 'rent', label: 'Three-bedroom rent', amount: 1650, note: 'Mid-market planning baseline for a household of five.' },
        { id: 'utilities', label: 'Electricity, water, and gas', amount: 220, note: 'Season and building efficiency can change this.' },
        { id: 'internet', label: 'Home internet and communications', amount: 60, note: 'Planning allowance for home connectivity.' },
        { id: 'insurance', label: 'Home and liability insurance', amount: 50, note: 'Confirm coverage and exclusions locally.' },
        { id: 'housing-other', label: 'Other recurring housing costs', amount: 170, note: 'Maintenance, building, or household buffer.' },
      ],
    },
    {
      category: 'food', label: 'Food and groceries', stage: 'MONTHLY_RECURRING', details: [
        { id: 'groceries', label: 'Groceries and household staples', amount: 800, note: 'Planning allowance for five people.' },
        { id: 'dining', label: 'Dining and prepared food', amount: 200, note: 'Adjust to match your actual routine.' },
        { id: 'school-meals', label: 'School or workday meals', amount: 100, note: 'Remove if this does not apply.' },
      ],
    },
    {
      category: 'transport', label: 'Transportation', stage: 'MONTHLY_RECURRING', details: [
        { id: 'public-transit', label: 'Public transit passes', amount: 180, note: 'Household planning allowance.' },
        { id: 'rideshare', label: 'Rideshare and taxis', amount: 160, note: 'Adjust for city and frequency.' },
        { id: 'vehicle', label: 'Vehicle, fuel, parking, and tolls', amount: 500, note: 'Set to zero for a car-free household.' },
        { id: 'intercity', label: 'Intercity travel', amount: 80, note: 'Planning allowance for regional trips.' },
      ],
    },
    {
      category: 'healthcare', label: 'Healthcare', stage: 'MONTHLY_RECURRING', details: [
        { id: 'coverage', label: 'Household health coverage', amount: 300, note: 'Confirm policy eligibility, limits, and exclusions.' },
        { id: 'care', label: 'Medication, copays, and routine care', amount: 110, note: 'Replace with the household’s actual needs.' },
      ],
    },
    {
      category: 'other', label: 'Other recurring costs', stage: 'MONTHLY_RECURRING', details: [
        { id: 'mobile', label: 'Mobile service', amount: 70, note: 'Planning allowance for household lines.' },
        { id: 'subscriptions', label: 'Subscriptions and memberships', amount: 50, note: 'Review services that will continue after the move.' },
        { id: 'flexible', label: 'Flexible monthly buffer', amount: 50, note: 'A small allowance for uncategorized recurring costs.' },
      ],
    },
  ],
}

export function benchmarkCategoryTotal(category: BudgetCategoryBenchmark): number {
  return category.details.reduce((sum, detail) => sum + detail.amount, 0)
}

export function getBudgetBenchmark(destination: string | null, householdMembers: number | null): BudgetBenchmark | null {
  if (destination?.trim().toLowerCase() !== 'portugal' || householdMembers !== 5) return null
  return PORTUGAL_FAMILY_FIVE
}

export function applyBudgetBenchmark(lines: BudgetLine[], benchmark: BudgetBenchmark | null): BudgetLine[] {
  if (!benchmark) return lines.map((line) => line.systemBaselineKey ? {
    ...line,
    systemBaseline: null,
    systemBaselineKey: null,
  } : line)
  const categories = new Map(benchmark.categories.map((category) => [category.category, category]))
  return lines.map((line) => {
    const category = categories.get(line.category)
    return category ? {
      ...line,
      systemBaseline: benchmarkCategoryTotal(category),
      systemBaselineKey: benchmark.key,
    } : line
  })
}

export function effectiveDetailValues(line: BudgetLine, category: BudgetCategoryBenchmark): Record<string, number> {
  return Object.fromEntries(category.details.map((detail) => [
    detail.id,
    line.detailOverrides?.[detail.id] ?? detail.amount,
  ]))
}
