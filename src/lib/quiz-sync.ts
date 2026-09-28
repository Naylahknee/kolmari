// Syncs an anonymous Match Quiz result (saved in localStorage by the marketing
// quiz page) into the authenticated user's profile, so the quiz -> signup/login ->
// profile-wizard spine stays connected. Never throws: any failure keeps the
// localStorage entry so a later attempt can retry.

const QUIZ_KEY = 'kolmari-quiz-result'

export type StoredQuiz = {
  answers: Record<string, string>
  stage: string
  completedAt: string
}

function readStoredQuiz(): StoredQuiz | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(QUIZ_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { answers?: unknown; stage?: unknown; completedAt?: unknown }
    if (!parsed || typeof parsed.answers !== 'object' || parsed.answers === null || Array.isArray(parsed.answers)) {
      window.localStorage.removeItem(QUIZ_KEY)
      return null
    }
    const answers: Record<string, string> = {}
    for (const [key, value] of Object.entries(parsed.answers as Record<string, unknown>)) {
      if (typeof value === 'string' && value.trim()) answers[key.slice(0, 24)] = value.slice(0, 160)
    }
    if (Object.keys(answers).length === 0) {
      window.localStorage.removeItem(QUIZ_KEY)
      return null
    }
    const completedAt =
      typeof parsed.completedAt === 'string' && !Number.isNaN(Date.parse(parsed.completedAt))
        ? parsed.completedAt
        : new Date().toISOString()
    const stage =
      typeof parsed.stage === 'string' && parsed.stage.trim() ? parsed.stage.slice(0, 40) : 'Discovery'
    return { answers, stage, completedAt }
  } catch {
    return null
  }
}

export async function syncQuizResultToProfile(options?: { displayName?: string }): Promise<void> {
  const quiz = readStoredQuiz()
  const displayName = options?.displayName?.trim() ? options.displayName.trim().slice(0, 80) : ''
  if (!quiz && !displayName) return
  try {
    const currentRes = await fetch('/api/profile')
    if (!currentRes.ok) return // Not authenticated (or profile unavailable); keep the entry for later.
    const profile = (await currentRes.json()) as { display_name?: unknown; onboarding?: Record<string, unknown> | null }
    const body: Record<string, unknown> = {}
    if (quiz) {
      const existing =
        profile?.onboarding && typeof profile.onboarding === 'object'
          ? (profile.onboarding as Record<string, unknown>)
          : null
      const existingQuiz = existing?.quiz as { completedAt?: unknown } | undefined
      if (
        existingQuiz &&
        typeof existingQuiz.completedAt === 'string' &&
        Date.parse(existingQuiz.completedAt) >= Date.parse(quiz.completedAt)
      ) {
        // A newer (or equal) quiz snapshot is already saved; just clear the stale entry.
        window.localStorage.removeItem(QUIZ_KEY)
      } else {
        const base = existing ?? { version: 1, lanes: [], answers: {}, destinations: [], step: 0 }
        body.onboarding = { ...base, quiz }
      }
    }
    // The signup form collects the full name; save it alongside the quiz sync so
    // account creation needs only one profile write. Never overwrites a set name.
    if (displayName && !profile.display_name) body.display_name = displayName
    if (Object.keys(body).length === 0) return
    const putRes = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (putRes.ok && quiz) window.localStorage.removeItem(QUIZ_KEY)
  } catch {
    // Never block the auth flow; the entry stays in localStorage for a later retry.
  }
}
