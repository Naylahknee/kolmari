import { getSql } from '@/lib/db'

export type ClubPost = {
  id: number
  country_slug: string
  author: string
  body: string
  created_at: string
}

let clubTableReady: Promise<void> | null = null

async function ensureClubTable() {
  if (!clubTableReady) {
    clubTableReady = (async () => {
      await getSql()`
        CREATE TABLE IF NOT EXISTS club_posts (
          id SERIAL PRIMARY KEY,
          country_slug TEXT NOT NULL,
          user_id INT REFERENCES users(id) ON DELETE SET NULL,
          author TEXT NOT NULL,
          body TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      await getSql()`CREATE INDEX IF NOT EXISTS club_posts_country_idx ON club_posts (country_slug, created_at DESC)`
    })().catch((error) => {
      clubTableReady = null
      throw error
    })
  }
  await clubTableReady
}

/** Most recent posts for a destination group. */
export async function listClubPosts(countrySlug: string, limit = 50): Promise<ClubPost[]> {
  await ensureClubTable()
  const rows = await getSql()`
    SELECT id, country_slug, author, body, created_at
    FROM club_posts
    WHERE country_slug = ${countrySlug}
    ORDER BY created_at DESC
    LIMIT ${limit}
  ` as ClubPost[]
  return rows
}

export async function createClubPost(input: { countrySlug: string; userId: number; author: string; body: string }) {
  await ensureClubTable()
  const rows = await getSql()`
    INSERT INTO club_posts (country_slug, user_id, author, body)
    VALUES (${input.countrySlug}, ${input.userId}, ${input.author}, ${input.body})
    RETURNING id, country_slug, author, body, created_at
  ` as ClubPost[]
  return rows[0]
}
