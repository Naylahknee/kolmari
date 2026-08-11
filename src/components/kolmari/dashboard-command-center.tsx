import Link from 'next/link'
import { ScoreRing } from './rings'
import { destinationProgress, householdProgress } from '@/lib/command-center'
import type { CCBoard } from '@/lib/command-center-model'

function pct({ done, total }: { done: number; total: number }): number {
  return total > 0 ? Math.round((done / total) * 100) : 0
}

/**
 * Dashboard read-view of the Command Center: overall household progress plus a
 * per-destination summary. Makes the Command Center the editable backend the
 * dashboard reflects (mirrors the demo's dashboard ↔ command-center link).
 * Server component — reads the already-fetched board, no client state.
 */
export function DashboardCommandCenterCard({ board }: { board: CCBoard }) {
  const hasDestinations = board.destinations.length > 0
  const overall = pct(householdProgress(board.items))

  return (
    <section
      id="dashboard-command-center"
      className="rounded-[var(--radius-card)] border border-line bg-white px-[17px] pb-[17px] pt-[15px] shadow-tile"
      aria-labelledby="command-center-heading"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="command-center-heading" className="text-[15px] font-bold text-navy">Command Center</h2>
        <Link href="/command-center" className="text-xs font-bold text-info hover:text-navy">
          {hasDestinations ? 'Open' : 'Set up'}
        </Link>
      </div>

      {hasDestinations ? (
        <>
          <div className="flex items-center gap-[13px]">
            <ScoreRing value={overall} size={72} stroke={8} />
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-navy">Overall progress</p>
              <p className="mt-0.5 text-[11px] text-muted">
                Across {board.destinations.length} {board.destinations.length === 1 ? 'destination' : 'destinations'}
                {board.members.length > 0 ? ` · ${board.members.length} in your household` : ''}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {board.destinations.slice(0, 3).map((dest) => {
              const p = pct(destinationProgress(board.items, dest.id))
              return (
                <Link
                  key={dest.id}
                  href="/command-center"
                  className="flex items-center gap-[11px] rounded-[10px] border border-line p-[10px_11px] transition-[background-color,border-color] duration-150 hover:border-gold hover:bg-[#fdfbf3]"
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-navy">{dest.name}</span>
                  <span className="flex-none text-[12px] font-bold text-ok">{p}%</span>
                </Link>
              )
            })}
            {board.destinations.length > 3 && (
              <p className="text-[10.5px] text-muted-soft">+{board.destinations.length - 3} more in the Command Center</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-[12.5px] leading-6 text-muted">
          The Command Center is where you plan each destination — checklists, notes, and who&apos;s moving.{' '}
          <Link href="/command-center" className="font-bold text-info hover:text-navy">Set one up</Link> to track your move.
        </p>
      )}
    </section>
  )
}
