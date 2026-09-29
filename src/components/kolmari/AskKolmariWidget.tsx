'use client'

import { useEffect, useRef, useState } from 'react'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const MAX_MESSAGE_CHARS = 1000

/**
 * Floating "Ask Kolmari" chat panel. Talks to POST /api/chat.
 * AI output is rendered as plain text (React default escaping), never as HTML.
 */
export function AskKolmariWidget() {
  const [open, setOpen] = useState(false)
  const [greeted, setGreeted] = useState(false)
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [log, setLog] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true)
      setLog([{ role: 'assistant', content: "Hi! I'm the Kolmari Guide. Ask me anything about where to move." }])
    }
  }, [open, greeted])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [log, open])

  async function send(event: React.FormEvent) {
    event.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    const trimmed = text.slice(0, MAX_MESSAGE_CHARS)
    const nextHistory = [...history, { role: 'user' as const, content: trimmed }].slice(-10)
    setHistory(nextHistory)
    setInput('')
    setLog((prev) => [...prev, { role: 'user', content: trimmed }, { role: 'assistant', content: 'Thinking…' }])
    setSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextHistory }),
      })
      const data = await res.json().catch(() => ({} as Record<string, unknown>))
      const reply =
        res.status === 401
          ? 'Please sign in to use the Kolmari Guide.'
          : typeof data.reply === 'string'
            ? data.reply
            : typeof data.error === 'string'
              ? data.error
              : 'Sorry, something went wrong.'
      setLog((prev) => [...prev.slice(0, -1), { role: 'assistant', content: reply }])
      if (res.ok && typeof data.reply === 'string') {
        setHistory((prev) => [...prev, { role: 'assistant', content: data.reply as string }])
      }
    } catch {
      setLog((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: "Couldn't reach Kolmari. Check your connection and try again." },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close the Kolmari Guide chat' : 'Open the Kolmari Guide chat'}
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.5rem,env(safe-area-inset-right))] z-[9999] rounded-full bg-navy-deep px-5 py-3 text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] ring-2 ring-gold hover:bg-navy-card focus-visible:outline-2 focus-visible:outline-gold"
      >
        Ask Kolmari
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Kolmari Guide chat"
          className="fixed bottom-[max(5.75rem,calc(env(safe-area-inset-bottom)+4.25rem))] right-[max(1.5rem,env(safe-area-inset-right))] z-[9999] flex h-[min(520px,calc(100vh-110px))] w-[min(370px,calc(100vw-48px))] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
        >
          <div className="bg-navy-deep px-4 py-3 text-white">
            <p className="text-[15px] font-bold text-gold">Kolmari Guide (AI)</p>
            <p className="text-xs opacity-80">Ask anything about your move</p>
          </div>
          <div ref={logRef} aria-live="polite" className="flex flex-1 flex-col gap-2 overflow-y-auto bg-canvas p-3">
            {log.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === 'user'
                    ? 'max-w-[85%] self-end whitespace-pre-wrap rounded-xl bg-navy px-3 py-2 text-sm leading-snug text-white'
                    : 'max-w-[85%] self-start whitespace-pre-wrap rounded-xl border border-line-strong bg-white px-3 py-2 text-sm leading-snug text-ink'
                }
              >
                {message.content}
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-line p-2.5">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={MAX_MESSAGE_CHARS}
              placeholder="e.g. Which of my cities is cheapest?"
              autoComplete="off"
              disabled={sending}
              aria-label="Type your message"
              className="flex-1 rounded-xl border border-line-strong bg-white px-3 py-2 text-base text-ink placeholder:text-muted-soft focus-visible:outline-2 focus-visible:outline-gold disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={sending}
              className="rounded-xl bg-gold px-4 text-sm font-extrabold text-navy-deep hover:bg-gold-deep disabled:opacity-60"
            >
              {sending ? 'Sending' : 'Send'}
            </button>
          </form>
          <p className="px-3 pb-2 text-[11px] leading-4 text-muted">
            AI answers can be wrong. Your messages are processed by an AI provider. Never share SSNs or bank details.
          </p>
        </div>
      )}
    </>
  )
}
