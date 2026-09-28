import assert from 'node:assert/strict'
import { test } from 'node:test'
import { activeAnswers, chooseAnswer, emptyOnboarding, LANES, onboardingTasks } from '../src/lib/onboarding'
import { onboardingSchema, profileUpdateSchema } from '../src/lib/schemas'

test('new setup has no fabricated destinations, answers or priority', () => {
  assert.deepEqual(emptyOnboarding(), { version: 1, lanes: [], answers: {}, destinations: [], step: 0 })
})
test('None and individual allergens are mutually exclusive in both directions', () => {
  const q = LANES.health.qs[1]
  assert.deepEqual(chooseAnswer(q, ['Shellfish', 'Eggs'], 'None'), ['None'])
  assert.deepEqual(chooseAnswer(q, ['None'], 'Eggs'), ['Eggs'])
  assert.deepEqual(chooseAnswer(q, ['Eggs'], 'Eggs'), [])
})
test('changing priorities discards inactive lane answers from the saved payload', () => {
  const state = { ...emptyOnboarding(), lanes: ['money' as const], answers: { h2: ['Eggs'], m1: 'Under $1,200' } }
  assert.deepEqual(activeAnswers(state), { m1: 'Under $1,200' })
})
test('server rejects forged choices, inactive answers, contradictory selections and duplicate priorities', () => {
  const state = { ...emptyOnboarding(), lanes: ['health'] }
  assert.equal(onboardingSchema.safeParse({ ...state, answers: { h2: ['None', 'Eggs'] } }).success, false)
  assert.equal(onboardingSchema.safeParse({ ...state, answers: { h2: ['invented'] } }).success, false)
  assert.equal(onboardingSchema.safeParse({ ...state, answers: { h2: 'Eggs' } }).success, false)
  assert.equal(onboardingSchema.safeParse({ ...state, answers: { m1: 'Under $1,200' } }).success, false)
  assert.equal(onboardingSchema.safeParse({ ...state, lanes: ['health', 'health'] }).success, false)
  assert.equal(onboardingSchema.safeParse({ ...state, answers: { h2: ['Eggs'] } }).success, true)
})
test('budget answers do not invent income, and astrology does not generate practical conclusions', () => {
  const state = { ...emptyOnboarding(), lanes: ['money' as const, 'energy' as const], answers: { m1: 'Under $1,200', e3: 'A tiebreaker only' } }
  const payload = profileUpdateSchema.parse({ onboarding: state })
  assert.equal(payload.monthly_income, undefined)
  assert.equal(onboardingTasks(state).length, 1)
  assert.match(onboardingTasks(state)[0].text, /^Research cost and runway:/)
})
