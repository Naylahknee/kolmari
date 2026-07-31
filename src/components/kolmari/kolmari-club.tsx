'use client'

import { useCallback, useEffect, useState } from 'react'
import { LoaderCircle, MessageCircle, Send } from 'lucide-react'

type Post = { id: number; author: string; body: string; created_at: string }
type Group = { slug: string; name: string }

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000))
  if (secs < 60) return 'just now'
  const mins = Math.round(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(iso).toLocaleDateString()
}

export function KolmariClub({ groups, initialCountry }: { groups: Group[]; initialCountry: string }) {
  const [country, setCountry] = useState(initialCountry)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (slug: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/club?country=${encodeURIComponent(slug)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Unable to load this group.')
      setPosts(data.posts)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to load this group.')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch the selected group's posts on mount and whenever the group changes.
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    load(country)
  }, [country, load])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const text = body.trim()
    if (text.length < 2) return
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/club', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, body: text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Unable to post.')
      setPosts((prev) => [data.post, ...prev])
      setBody('')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to post.')
    } finally {
      setSending(false)
    }
  }

  const groupName = groups.find((g) => g.slug === country)?.name ?? country

  return (
    <section className="mt-6" aria-label="Kolmari Club destination groups">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-navy">Destination groups</p>
          <p className="text-xs text-muted">Talk with others heading to {groupName}. Rooms fill in as people post — the community writes its own FAQ.</p>
        </div>
        <label className="text-xs font-bold text-navy">
          <span className="sr-only">Choose a destination group</span>
          <select className="field w-auto" value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Destination group">
            {groups.map((g) => <option key={g.slug} value={g.slug}>{g.name}</option>)}
          </select>
        </label>
      </div>

      <form onSubmit={submit} className="card-surface mt-4 p-4">
        <textarea
          className="field min-h-20"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Ask a question or share something about ${groupName}…`}
          maxLength={2000}
        />
        {error && <p role="alert" className="mt-2 text-sm font-semibold text-danger">{error}</p>}
        <div className="mt-3 flex justify-end">
          <button type="submit" disabled={sending || body.trim().length < 2} className="gold-button disabled:opacity-50">
            {sending ? <LoaderCircle size={15} className="animate-spin" /> : <Send size={15} />} Post
          </button>
        </div>
      </form>

      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="flex items-center gap-2 p-4 text-sm text-muted"><LoaderCircle size={15} className="animate-spin" /> Loading {groupName}…</p>
        ) : posts.length === 0 ? (
          <div className="card-surface flex flex-col items-center gap-2 p-8 text-center">
            <MessageCircle size={22} className="text-gold-deep" aria-hidden="true" />
            <p className="text-sm font-semibold text-navy">No posts in {groupName} yet</p>
            <p className="text-sm text-muted">Be the first — ask what you actually want to know about moving there.</p>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="card-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-navy">{post.author}</p>
                <span className="text-xs text-muted">{timeAgo(post.created_at)}</span>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-6 text-navy/85">{post.body}</p>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
