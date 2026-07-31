import { getSql } from '@/lib/db'

let supportTableReady: Promise<void> | null = null

async function ensureSupportTable() {
  if (!supportTableReady) {
    supportTableReady = (async () => {
      await getSql()`
        CREATE TABLE IF NOT EXISTS support_messages (
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE SET NULL,
          email TEXT NOT NULL,
          subject TEXT,
          message TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
    })().catch((error) => {
      supportTableReady = null
      throw error
    })
  }
  await supportTableReady
}

/**
 * Persist a support/contact message so the owner can retrieve it. This is the
 * app's only real contact channel until an email service is wired up — messages
 * are stored, not emailed.
 */
export async function createSupportMessage(input: {
  userId: number | null
  email: string
  subject: string | null
  message: string
}) {
  await ensureSupportTable()
  await getSql()`
    INSERT INTO support_messages (user_id, email, subject, message)
    VALUES (${input.userId}, ${input.email}, ${input.subject}, ${input.message})
  `
}
