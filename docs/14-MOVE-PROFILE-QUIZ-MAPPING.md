# Kolmari Move Profile + Quiz Mapping

## Status

**Authoritative product specification.**

This document defines the single source of truth for Kolmari intake behavior: what the public quiz asks, what each answer means, where it is stored, and what downstream behavior it is allowed to affect.

This document supersedes the current split between:

- `/quiz`
- `/profile-wizard`
- demo `quiz.html`

The production implementation may temporarily preserve those routes for compatibility, but they must not remain independent intake systems.

---

# Product Rule

Kolmari has **one Move Profile**.

The public quiz is the first way the Move Profile is built.

After signup, the same Move Profile continues to power:

- Destination matching
- Pathway research
- household-aware cost planning
- Command Center setup
- roadmap generation
- lifestyle-fit research
- personalized prompts and next steps

Users must not be required to answer the same planning question twice because two parts of the application use different schemas.

The Profile Wizard should eventually become **Edit Move Profile**, not a second onboarding quiz.

---

# Question Admission Rule

Every quiz question must satisfy at least one of these conditions:

1. It changes a relocation decision or planning behavior.
2. It changes what Kolmari researches or surfaces.
3. It changes the user's Command Center or roadmap.
4. It is intentionally a Shaunda Head **Fun Question** that improves engagement while still producing a useful lifestyle or personalization signal.
5. It is intentionally a Shaunda Head **Market Research Question** that helps Kolmari understand customer needs.

A question that collects data but changes nothing should not be included.

---

# Allowed Downstream Effects

Every answer must map to one or more of these effect classes.

| Effect | Meaning |
|---|---|
| `ELIGIBILITY` | Changes which immigration/pathway categories Kolmari should investigate. It does **not** establish legal eligibility. |
| `DESTINATION_FIT` | Changes ranking, inclusion, friction, or recommendation strength for destinations. |
| `COST_MODEL` | Changes household cost estimates, housing assumptions, move-fund planning, or affordability analysis. |
| `LIFESTYLE_FIT` | Changes research about day-to-day livability, community, services, climate, accessibility, etc. |
| `ROADMAP` | Changes tasks, sequence, deadlines, research prompts, document prompts, or planning priority. |
| `PERSONALIZATION` | Changes what Kolmari emphasizes, remembers, calls back to, or surfaces first. |
| `MARKET_RESEARCH` | Helps Kolmari understand demand, confusion, pain points, or customer priorities. Must not silently change fit or eligibility. |

A quiz answer may affect several classes.

---

# Shaunda Head Question Mix

Kolmari uses all four question types from the Quiz Booster framework:

1. **Journey Questions** — where the user is in the relocation journey.
2. **Defining Questions** — information required for Kolmari's planning and matching logic.
3. **Fun Questions** — culturally aware, memorable questions that make the quiz feel human and engaging.
4. **Market Research Questions** — information Kolmari needs to understand what users are struggling with and what the product should prioritize.

Do not separate the quiz into four visible sections by type.

A Defining Question may be presented with Fun-question energy. The household question is the clearest example.

---

# Interaction Rules

The quiz should feel like a guided experience, not a form.

Approved interaction principles:

- one meaningful decision at a time
- visual cards where images genuinely improve comprehension
- multi-select where real-life answers can coexist
- conditional follow-ups instead of asking every user every question
- immediate micro-insights where useful
- no duplicate classification steps
- do not ask the user to know immigration terminology
- do not ask for information earlier than needed merely because the database has a field for it

Auntie voice is a layer of response and guidance. The interface remains the primary experience; the quiz must not become an endless chatbot.

---

# Canonical Quiz

## Q1 — Household

### User-facing question

**Who's coming with you?**

Primary visual choices:

- Just me
- Me + partner
- Family
- I'm only exploring

If `Family` is selected, reveal a compact household builder on the same interaction:

- Adults: count
- Kids/dependents: count
- Pets: count

Suggested response copy may include: **Okay, we're moving a crew.**

### Shaunda type

`DEFINING` with `FUN` presentation.

### Canonical Move Profile fields

```ts
household: {
  status: 'solo' | 'partner' | 'family' | 'exploring'
  adults: number | null
  dependents: number | null
  pets: number | null
}
```

### Compatibility mapping to current `profiles`

```text
household.status -> household_type
household.adults + household.dependents -> family_size
household.dependents -> dependents
household.status partner/family with 2+ adults -> spouse=true when partner is explicitly included
```

`pets` is a new field and requires additive persistence.

### Effects

`ELIGIBILITY`, `COST_MODEL`, `ROADMAP`, `PERSONALIZATION`

### Behavior

Household composition may change:

- dependent/spouse pathway research
- housing assumptions
- food estimates
- insurance assumptions
- school research
- dependent documentation prompts
- flight/moving estimates
- pet import research

Do not invent ages, medical needs, or school requirements from household count alone.

---

## Q2 — Journey Stage

### User-facing question

**Where are you in this thing?**

Visual choices:

- I'm dreaming
- I'm seriously researching
- I'm narrowing down places
- I'm getting ready to move

### Shaunda type

`JOURNEY`

### Canonical field

```ts
planning_stage:
  | 'dreaming'
  | 'researching'
  | 'shortlisting'
  | 'preparing'
```

### Effects

`ROADMAP`, `PERSONALIZATION`

### Behavior

The user states their journey stage directly. Do not infer the entire stage solely from timeline + obstacle.

Examples:

- `dreaming`: discovery, feasibility, pathway education, high-level cost
- `researching`: compare destinations, pathways, lifestyle needs
- `shortlisting`: compare friction, feasibility, cost, tradeoffs
- `preparing`: documents, deadlines, applications, housing, schools, departure tasks

The Command Center should use this field to determine its initial emphasis.

---

## Q3 — What Makes the Move Worth It

### User-facing question

**What would make moving abroad worth it?**

Visual cards may include:

- Lower cost of living
- Safety
- Black community / belonging
- Healthcare
- Education
- Work opportunity
- Climate / lifestyle
- Path to residency
- Walkability / daily life

The user may select multiple priorities.

After selection, ask them to identify a maximum of **two non-negotiables** from their selected priorities.

### Shaunda type

`DEFINING`

### Canonical fields

```ts
priorities: PriorityKey[]
must_haves: PriorityKey[]
```

Recommended initial `PriorityKey` values:

```ts
type PriorityKey =
  | 'affordability'
  | 'safety'
  | 'belonging'
  | 'healthcare'
  | 'education'
  | 'work'
  | 'climate_lifestyle'
  | 'residency_path'
  | 'walkability'
```

### Compatibility mapping

The current `profiles.priority` may temporarily hold the first non-negotiable or first selected priority for compatibility with existing ranking code.

This compatibility value must not become the canonical representation; `priorities[]` and `must_haves[]` are canonical.

### Effects

`DESTINATION_FIT`, `LIFESTYLE_FIT`, `ROADMAP`, `PERSONALIZATION`

### Behavior

A non-negotiable is not merely extra match-score points.

When supported by reliable data, a non-negotiable may generate:

- a friction warning
- a dealbreaker warning
- a comparison priority
- a roadmap research task

Do not fabricate fit for categories that Kolmari does not yet have trustworthy data to evaluate.

---

## Q4 — Region Curiosity

### User-facing question

**Where are you curious about?**

Choices:

- Europe
- Latin America + Caribbean
- Africa
- Asia + Pacific
- Surprise me / open to anywhere

Allow multi-select.

### Shaunda type

`DEFINING`

### Canonical fields

```ts
preferred_regions: RegionKey[]
region_requirement: boolean
```

`region_requirement` defaults to `false` unless the user explicitly says they only want those regions.

### Compatibility mapping

Maps to existing `profiles.preferred_regions` and `profiles.preferred_region`.

### Effects

`DESTINATION_FIT`, `PERSONALIZATION`

### Behavior

Region curiosity is a preference, not automatically an exclusion rule.

If Europe is selected and `region_requirement=false`, Kolmari should prioritize European results but may surface a substantially stronger fit elsewhere.

Do not interpret regional curiosity as immigration feasibility.

---

## Q5 — Income / Move Path Signals

### User-facing question

**What might fund your life abroad?**

Multi-select choices:

- Keep my remote job
- Find a job there
- Run or start a business
- Study
- Savings / investments
- Pension / retirement
- I'm figuring that out

### Shaunda type

`DEFINING`

### Canonical fields

```ts
funding_sources: FundingSource[]
remote_work_intent: boolean | null
pathway_interests: PathwayInterest[]
```

Recommended values:

```ts
type FundingSource =
  | 'remote_employment'
  | 'local_employment'
  | 'business'
  | 'study'
  | 'savings_investments'
  | 'pension_retirement'
  | 'unknown'
```

### Compatibility mapping

Where possible:

```text
remote employment -> goals += Remote Work; remote=true
local employment -> goals += Employment
business -> goals += Entrepreneurship
study -> goals += Education
pension/retirement -> goals += Passive Income / Retirement
savings/investments -> goals += Investment when appropriate
```

The existing singular `income_type` may remain for compatibility but must not force a multi-source household into a single category.

### Effects

`ELIGIBILITY`, `DESTINATION_FIT`, `ROADMAP`, `PERSONALIZATION`

### Behavior

This answer determines which pathway categories Kolmari investigates.

It does **not** mean the user qualifies for a visa.

Approved wording is informational, for example:

> Based on what you told Kolmari, remote-work pathways are worth investigating.

Do not say:

> You qualify for a digital nomad visa.

without actual route-specific evidence and required verification logic.

---

## Q6 — Citizenship / Ancestry / Family Connections

### User-facing question

**Any of these belong to your story?**

Multi-select choices:

- I have another citizenship/passport
- Parent/grandparent ancestry abroad
- My partner/spouse has another citizenship
- Close family abroad
- Maybe — I need to investigate
- None that I know of

### Shaunda type

`DEFINING`

### Canonical fields

```ts
citizenships: string[]
ancestry_connections: Array<{
  country: string | null
  relationship: string | null
}>
partner_citizenships: string[]
family_connections: Array<{
  country: string | null
  relationship: string | null
}>
connection_status: 'known' | 'possible' | 'none'
```

The quiz may initially store only the selected signal. Country/relationship detail can be collected later through progressive profiling.

### Compatibility mapping

Existing `citizenship` and `ancestry_connections` remain compatibility fields.

### Effects

`ELIGIBILITY`, `ROADMAP`, `PERSONALIZATION`

### Behavior

Citizenship, ancestry, partner citizenship, and close family are different legal concepts. They must not be collapsed into one yes/no legal conclusion.

The answer changes research priority only until supporting details are collected.

---

## Q7 — Housing Comfort

### User-facing question

**What monthly housing cost feels realistic?**

Recommended ranges:

- Under $1,000
- $1,000–$2,000
- $2,000–$3,500
- More than $3,500
- I don't know yet

### Shaunda type

`DEFINING`

### Canonical field

```ts
housing_budget_band:
  | 'under_1000'
  | '1000_2000'
  | '2000_3500'
  | 'over_3500'
  | 'unknown'
```

### Effects

`DESTINATION_FIT`, `COST_MODEL`, `PERSONALIZATION`

### Behavior

Housing budget is a comfort/preference signal, not proof of total relocation affordability.

Do not compare housing budget directly to an immigration income threshold as though they are the same concept.

---

## Q8 — Move-Fund Reality

### User-facing question

**How are we looking on move money?**

Choices:

- Haven't started saving
- Under $5,000
- $5,000–$15,000
- $15,000–$30,000
- $30,000+
- I have no idea what I'll need

### Shaunda type

`DEFINING`

### Canonical field

```ts
relocation_savings_band:
  | 'none'
  | 'under_5000'
  | '5000_15000'
  | '15000_30000'
  | '30000_plus'
  | 'unknown_need'
```

### Compatibility mapping

Existing `profiles.savings` stores an exact numeric amount and should not be populated with a fabricated midpoint.

A new band field is required unless the user later provides an exact value.

### Effects

`COST_MODEL`, `ROADMAP`, `PERSONALIZATION`

### Behavior

This supports eventual move-fund gap calculations.

A band must never be silently converted to an exact savings balance.

---

## Q9 — Timeline

### User-facing question

**When would you ideally like to move?**

Recommended choices:

- 0–6 months
- 6–12 months
- 1–2 years
- 2+ years
- No date yet

### Shaunda type

`DEFINING` + `JOURNEY` signal

### Canonical field

```ts
timeline:
  | '0_6_months'
  | '6_12_months'
  | '1_2_years'
  | '2_plus_years'
  | 'no_date'
```

### Compatibility mapping

Maps to existing `profiles.timeline` through an explicit compatibility translation.

### Effects

`ROADMAP`, `PERSONALIZATION`, and where route timing is supported, `ELIGIBILITY` research urgency.

### Behavior

Timeline controls sequence and urgency.

Examples:

- near-term moves may surface passport/document/application tasks earlier
- long-range moves should suppress prematurely time-sensitive tasks
- documents with expiration/freshness requirements should not be ordered merely because the user expressed interest in a country

---

## Q10 — Hair-Care Ecosystem

### User-facing question

**Who's touching your hair?**

Use visual images of hair-care environments rather than asking race or hairstyle.

Suggested visual choices:

- Quick/basic salon or chain
- Specialist salon/barber
- Braids / wigs / weaves ecosystem
- Full-service salon
- I handle my own hair
- Not important to me

### Shaunda type

`FUN`

### Canonical field

```ts
lifestyle_needs: {
  haircare:
    | 'basic'
    | 'specialist'
    | 'braids_wigs_weaves'
    | 'full_service'
    | 'self_service'
    | 'not_important'
}
```

### Effects

`LIFESTYLE_FIT`, `PERSONALIZATION`

### Behavior

This answer must never be used to infer race.

It may be used to research and surface:

- relevant salons
- barbers
- braiders
- textured-hair specialists
- beauty-supply availability
- product availability

It does not alter visa feasibility.

It should carry low or zero weight in general destination ranking unless the user later explicitly marks hair-care access as a non-negotiable.

---

## Q11 — Biggest Obstacle

### User-facing question

**What's making this feel hardest right now?**

Choices:

- I don't know where to go
- Visas confuse me
- I don't know what this costs
- Work / income
- Paperwork
- I don't know where to start

### Shaunda type

`MARKET_RESEARCH`

### Canonical field

```ts
primary_obstacle:
  | 'choosing_destination'
  | 'visas'
  | 'money'
  | 'work_income'
  | 'paperwork'
  | 'starting'
```

### Effects

`ROADMAP`, `PERSONALIZATION`, `MARKET_RESEARCH`

### Behavior

For the user, this determines the first problem Kolmari helps address.

For Kolmari, aggregate responses may inform product prioritization.

This answer must not change legal/pathway eligibility or country fit merely because the user is confused about a topic.

---

# Quiz Result Contract

The quiz result is **not** a personality label and should not be a disposable summary.

The quiz must generate a useful starting state from the Move Profile.

Minimum result should contain:

```ts
type QuizStartingPoint = {
  planningStage: string
  householdSummary: string
  strongestPriorities: string[]
  pathwayResearchCategories: string[]
  regionFocus: string[]
  primaryObstacle: string
  firstActions: string[]
  profileCompleteness: {
    known: string[]
    stillNeededLater: string[]
  }
}
```

The result may also surface candidate destinations only where Kolmari has enough real data to rank them responsibly.

Do not fabricate a Match Score to make the result feel complete.

---

# Signup Handoff Contract

## Before signup

Quiz answers may be stored temporarily client-side.

Use one canonical key and versioned payload, for example:

```ts
localStorage['kolmari:move-profile-draft']
```

Recommended shape:

```ts
{
  version: 1,
  source: 'marketing_quiz',
  completedAt: string | null,
  profile: MoveProfileDraft
}
```

Do not create separate authoritative keys for marketing quiz, demo quiz, and profile wizard.

## After signup

The server must explicitly claim/import the temporary draft into the authenticated user's persistent Move Profile.

After successful import:

- mark the draft claimed
- preserve compatibility fields as needed
- do not make the user retake the same questions
- route into a populated starting experience

---

# Command Center Contract

The Command Center must consume the Move Profile.

Current production behavior seeds destinations and generic household member rows from the completed profile. The new design must preserve that useful linkage while becoming more intentional.

The Move Profile should determine:

- household summary
- household-related checklist categories
- initial research emphasis
- suggested destinations when evidence supports them
- pathway research prompts
- lifestyle research prompts
- cost-planning prompts

A new user should not finish the quiz and land on a generic `0 destinations / 0 items` screen unless Kolmari genuinely lacks enough information to offer a next step.

When no destination can responsibly be recommended yet, the Command Center should still display the user's known Move Profile and the next action required to narrow the plan.

---

# Canonical Move Profile Shape

This is the target product representation. Existing production fields remain compatible during migration; do not casually rename database fields covered by `07-DATA-MODEL.md`.

```ts
type MoveProfile = {
  household: {
    status: 'solo' | 'partner' | 'family' | 'exploring'
    adults: number | null
    dependents: number | null
    pets: number | null
  }

  journey: {
    planning_stage: 'dreaming' | 'researching' | 'shortlisting' | 'preparing'
    timeline: '0_6_months' | '6_12_months' | '1_2_years' | '2_plus_years' | 'no_date'
    primary_obstacle: 'choosing_destination' | 'visas' | 'money' | 'work_income' | 'paperwork' | 'starting'
  }

  priorities: {
    selected: PriorityKey[]
    must_haves: PriorityKey[]
  }

  geography: {
    preferred_regions: RegionKey[]
    region_requirement: boolean
  }

  pathway_signals: {
    funding_sources: FundingSource[]
    remote_work_intent: boolean | null
    citizenships: string[]
    ancestry_connections: Array<{ country: string | null; relationship: string | null }>
    partner_citizenships: string[]
    family_connections: Array<{ country: string | null; relationship: string | null }>
  }

  money: {
    housing_budget_band: string | null
    relocation_savings_band: string | null
    monthly_income_exact: number | null
    annual_income_exact: number | null
    savings_exact: number | null
  }

  lifestyle_needs: {
    haircare: string | null
  }
}
```

This shape is a product contract, not necessarily a mandate to create one JSON column. Persistence may use existing columns plus additive fields/tables as long as all consumers read and write one canonical model.

---

# Current Schema Gap Audit

The existing `profiles` model already supports several useful concepts:

- citizenship
- current country
- monthly/annual income
- income type
- remote work
- occupation
- credentials
- education
- savings
- household type
- family size
- spouse
- dependents
- ancestry connections
- preferred regions
- timeline
- priority
- goals

The new canonical quiz requires additional concepts that do not currently have first-class fields:

- `planning_stage`
- `adult_count`
- `pet_count`
- `priorities[]`
- `must_haves[]`
- `region_requirement`
- `funding_sources[]`
- structured citizenship/ancestry/family connections
- `housing_budget_band`
- `relocation_savings_band`
- `primary_obstacle`
- `lifestyle_needs.haircare`

These should be added without breaking existing fields or routes.

---

# Known Production Logic That Must Be Corrected

## Marketing quiz

The current `/quiz` collects answers that do not all affect its result. The replacement must not collect a supposedly meaningful planning answer unless the mapping in this document defines what it changes.

## Profile Wizard

The Profile Wizard currently persists the real profile. During migration it may remain available, but it must become an editor/completion flow over the canonical Move Profile rather than an independent intake model.

## Country matching

Current country matching relies heavily on:

- income
- region
- pathway evaluation
- remote-work signal
- safety
- one top priority

The new model must not immediately wire every new quiz answer into a score. A field should influence destination ranking only when Kolmari has trustworthy destination data that can support the comparison.

## Command Center

Current Command Center categories are:

- Work
- Visa & legal
- Schools
- Safety
- Community

The existing board can remain, but the canonical Move Profile should determine which categories/tasks are emphasized or applicable.

---

# Progressive Profiling

The public quiz does **not** need to collect every field required for a complete international move.

Kolmari should ask for additional data when it becomes relevant.

Examples:

- ancestry selected -> later ask country and relationship
- school needs become relevant -> later ask children's ages/grade levels
- user explores a work visa -> later ask occupation/credentials
- affordability analysis becomes serious -> later ask exact income/savings
- pet count > 0 -> later ask animal type and destination-specific import needs

This prevents the marketing quiz from becoming immigration paperwork.

---

# Data-Integrity Rules

1. Preference is not eligibility.
2. Curiosity is not a requirement.
3. A funding source is not proof of visa qualification.
4. A savings band is not an exact savings balance.
5. Household count is not permission to invent age, health, school, or legal needs.
6. A Fun Question must not secretly create a high-impact eligibility conclusion.
7. Lifestyle answers must not be used to infer race, religion, sexuality, disability, or other sensitive identity attributes.
8. Missing data must remain missing; do not fabricate values to make ranking logic run.
9. Pathway language must distinguish `worth investigating`, `possible based on current information`, and verified eligibility.
10. Every Match, friction, or dealbreaker claim must be traceable to actual user inputs plus actual destination/pathway data.

---

# Migration Sequence

## Phase 1 — Canonical model

Create a client-safe Move Profile type and mapping helpers.

Do not change UI yet.

## Phase 2 — Persistence

Add the new fields/tables required by this specification while preserving the existing `profiles` contract.

Create compatibility translators between existing `RelocationProfile` and the new canonical Move Profile.

## Phase 3 — Replace `/quiz`

Rebuild the production marketing quiz from this specification.

Store a versioned temporary Move Profile draft before signup.

## Phase 4 — Signup claim

Import the draft into the authenticated profile exactly once.

## Phase 5 — Profile Wizard conversion

Convert `/profile-wizard` into **Edit Move Profile / Complete My Profile**.

Pre-fill every answer already known.

Never ask a completed quiz question again unless the user chooses to edit it or the answer lacks required detail.

## Phase 6 — Command Center initialization

Update Command Center initialization so it consumes the canonical Move Profile and provides a meaningful starting state.

## Phase 7 — Matching and roadmap integration

Wire new profile fields into matching/roadmap behavior only where reliable data and deterministic rules exist.

## Phase 8 — Demo convergence

Update demo intake to use the same question IDs, option IDs, and mapping schema as production. Demo copy may differ, but the data contract must not.

---

# Completion Criteria

This migration is complete only when:

- there is one canonical Move Profile model
- `/quiz` writes to that model/draft contract
- signup claims the draft
- `/profile-wizard` no longer acts as a separate intake system
- Command Center consumes the same profile
- demo uses the same question and field identifiers
- every quiz answer has an explicit downstream mapping
- no answer is silently discarded
- the user is not asked the same planning question twice without a justified need for additional detail
- matching does not fabricate unsupported precision
- lifestyle questions remain inclusive and do not infer identity

---

# Locked Product Principle

**Auntie holds the complexity. The user gets the next useful decision.**

The quiz is not a lead-generation form attached to Kolmari. It is the first few minutes of building the user's real Move Plan.