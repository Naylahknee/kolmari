import type { EducationContent } from '@/lib/country-workspace/country-content'

type EducationTabProps = {
  content: EducationContent | null
  countryName: string
  hasChildren: boolean
  studyInterest: boolean
}

export function EducationTab({ content, countryName, hasChildren, studyInterest }: EducationTabProps) {
  if (!content) return <ResearchInProgress countryName={countryName} />
  const showFamilySection = hasChildren || !studyInterest
  const showStudentSection = studyInterest || !hasChildren

  return (
    <div className="space-y-5">
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Education in {countryName}</h2>
        <p className="mt-2 text-sm text-muted">
          {hasChildren ? 'Schooling options for your children and family.' : ''}
          {studyInterest ? ' University, vocational, and study pathway options.' : ''}
          {!hasChildren && !studyInterest ? 'School and university options — available for reference even if not your current focus.' : ''}
        </p>
      </section>

      {showFamilySection && (
        <section className="card-surface p-6">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">For families</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <DetailCard title="Childcare (ages 0–3)" body={content.childcare} />
            <DetailCard title="Public schools" body={content.publicSchools} />
            <DetailCard title="Private schools" body={content.privateSchools} />
            <DetailCard title="International schools" body={content.internationalSchools} />
            <DetailCard title="Language of instruction" body={content.languageOfInstruction} />
            <DetailCard title="Enrollment" body={content.enrollment} />
            <DetailCard title="Special education support" body={content.specialEducation} />
          </div>
        </section>
      )}

      {showStudentSection && (
        <section className="card-surface p-6">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-gold-deep">For students</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <DetailCard title="Universities" body={content.universities} />
            <DetailCard title="Study pathways" body={content.studyPathways} />
            <DetailCard title="Tuition range" body={content.tuitionRange} />
          </div>
        </section>
      )}

      <p className="rounded-xl border border-line bg-canvas px-4 py-3 text-xs text-muted">{content.disclaimer}</p>
    </div>
  )
}

function DetailCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-canvas p-4">
      <p className="text-xs font-bold text-navy">{title}</p>
      <p className="mt-1.5 text-sm leading-5 text-muted">{body}</p>
    </div>
  )
}

function ResearchInProgress({ countryName }: { countryName: string }) {
  return (
    <section className="card-surface p-8 text-center">
      <p className="font-extrabold text-navy">Research in progress</p>
      <p className="mt-1 text-sm text-muted">Education details for {countryName} are being verified. Check the Resources tab for official links.</p>
    </section>
  )
}
