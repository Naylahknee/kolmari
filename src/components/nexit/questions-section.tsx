import Image from 'next/image'
import Link from 'next/link'

const questions = [
  {
    question: 'Could my family actually afford this?',
    icon: '/icons/questions/family-affordability.png?v=20260725',
  },
  {
    question: 'Where would we feel safe and welcomed?',
    icon: '/icons/questions/safety-welcome.png?v=20260725',
  },
  {
    question: 'Are there visas I already qualify for?',
    icon: '/icons/questions/visa-pathways.png?v=20260725',
  },
  {
    question: 'What happens to healthcare and schools?',
    icon: '/icons/questions/healthcare-schools.png?v=20260725',
  },
  {
    question: 'Can I move without being rich?',
    icon: '/icons/questions/moving-budget.png?v=20260725',
  },
  {
    question: 'How do I turn “someday” into an actual plan?',
    icon: '/icons/questions/action-plan.png?v=20260725',
  },
]

export function QuestionsSection() {
  return (
    <section
      aria-labelledby="questions-heading"
      className="relative overflow-hidden bg-[#0D1B39] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(23,48,91,0.75),_transparent_55%)]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-4xl text-center lg:mb-16">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-[#F3C516]">
            The questions behind the move
          </p>

          <h2
            id="questions-heading"
            className="font-display text-4xl tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            You are not the only one asking.
          </h2>

          <div
            aria-hidden="true"
            className="mx-auto mt-7 h-0.5 w-20 bg-[#F3C516]"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {questions.map(({ question, icon }) => (
            <article
              key={question}
              className="group relative min-h-[230px] overflow-hidden rounded-2xl border border-white/60 bg-[#F8F8F6] px-7 py-8 text-[#17305B] transition duration-300 hover:-translate-y-1 hover:border-[#F3C516] hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
            >
              <div className="flex h-full flex-col">
                <div className="mb-8">
                  <div className="relative h-20 w-20 shrink-0">
                    <Image
                      src={icon}
                      alt=""
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <h3 className="max-w-[19rem] font-display text-2xl leading-snug tracking-tight sm:text-[1.7rem]">
                  {question}
                </h3>

                <div aria-hidden="true" className="mt-auto pt-8">
                  <div className="h-0.5 w-10 bg-[#F3C516] transition-all duration-300 group-hover:w-20" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-4xl text-center lg:mt-16">
          <div className="mb-7 flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-[#F3C516]/60 sm:w-40" />
            <Image
              src="/brand/nexit-butterfly.png"
              alt=""
              width={30}
              height={30}
              aria-hidden="true"
              className="h-[30px] w-[30px] object-contain"
            />
            <div className="h-px w-24 bg-[#F3C516]/60 sm:w-40" />
          </div>

          <p className="text-lg leading-8 text-white/80 sm:text-xl">
            Nexit brings the scattered answers into one place—so you can{' '}
            <span className="font-medium text-[#F3C516]">
              research, compare and plan
            </span>{' '}
            your next move with your eyes open.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/starter-plan"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F3C516] px-7 py-3 font-medium text-[#0D1B39] transition hover:bg-[#FFD52E]"
            >
              Create my free Starter Plan
            </Link>

            <span className="text-sm text-white/55">
              About 3 minutes · No relocation knowledge required
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
