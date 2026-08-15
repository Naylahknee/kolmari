# Product Requirements Document: SLD Engine 0.3.1 — Change Governance Core

## 1. Product Name

Seven Layer Dip™ Engine 0.3.1
Working product layer: SLD Change Governance Core
Parent system: SLD Control Plane

## 2. Product Summary

Seven Layer Dip™ is a preservation and change-governance system for AI-assisted
software and digital product development.

The engine establishes a canonical representation of a project, maps project
artifacts to Seven Layer Dip preservation layers, analyzes proposed and actual
changes, calculates direct and indirect impact, applies governance policies, and
returns a structured decision.

The engine must answer:

- What is this project supposed to remain?
- What is changing?
- What else could that change affect?
- Is that change authorized?
- What evidence or approval is required?
- Did the final implementation remain within the authorized scope?
- Can the engine see enough to answer any of the above?

The engine does not replace human judgment. Human authority remains final.

## 3. Core Product Thesis

AI development tools optimize for generation. They do not inherently preserve
product identity, architecture, visual intentionality, behavior, workflow logic,
content consistency, or operational continuity.

Repeated AI-assisted changes create AI Drift™. SLD reduces uncontrolled drift by
creating explicit continuity authority around a project.

```text
Human Authority
      ↓
Canonical SLD Baseline
      ↓
Governance Policy
      ↓
AI Agent / Builder
      ↓
Change
      ↓
SLD Verification
```

Preservation requirements must be machine-readable and enforceable.

## 4. Problem

AI-assisted builders commonly experience:

- small requests producing large code changes
- unrelated files being modified
- shared components refactored unnecessarily
- navigation changing unexpectedly
- visual identity becoming generic
- copy rewritten without permission
- working flows broken
- architectural patterns changed
- one model undoing decisions made by another
- files that keep their path while losing their contents
- inability to determine the true blast radius of a change
- inability to distinguish intended evolution from accidental drift

Existing code review tools evaluate syntax, security, formatting, quality and bugs.
SLD evaluates a different question:

**Did this change preserve what the project was explicitly supposed to preserve?**

## 5. Product Goal

A platform-neutral engine capable of governing changes across AI-assisted
development environments. The engine must:

1. establish a canonical project baseline
2. classify project artifacts
3. map artifacts to SLD preservation layers
4. map artifacts to technical domains
5. identify artifact relationships and dependencies
6. accept a proposed change
7. create an authorized Change Contract
8. calculate likely blast radius
9. inspect an implemented change
10. compare actual changes against authorized scope
11. apply governance policies
12. return a machine-readable decision
13. produce a human-readable explanation
14. record approvals, overrides, and decisions
15. allow controlled baseline evolution
16. verify the integrity of its own inputs before deciding

## 6. Product Principles

**6.1 AI Generates. Humans Preserve.** AI may propose and implement changes. It is
not the final continuity authority.

**6.2 Canonical Authority Is Required.** Every governed project must have a
baseline representing the approved state.

**6.3 Unknown Is Not Safe.** When SLD lacks sufficient evidence it returns
`INSUFFICIENT_EVIDENCE`. It must not silently infer safety.

**6.4 The Engine Must Verify Its Own Sight.** Uncertainty about the *analysis* is
governed as strictly as uncertainty about the *change*. An engine that cannot see a
change reports no violations, and no violations is not the same as no problem.

**6.5 Drift Is Not Automatically Bad.** SLD distinguishes authorized evolution,
adjacent impact, unapproved drift, prohibited change, and unknown impact.

**6.6 Deterministic Evidence Comes Before LLM Interpretation.** Use diffs, paths,
dependency analysis, imports, routes, schemas, permissions, configuration, tests
and version history before probabilistic interpretation.

**6.7 LLMs Interpret. Policies Decide.** An LLM may classify unfamiliar artifacts,
explain likely impact, identify architectural intent and suggest missing checks. An
LLM must not independently make final enforcement decisions.

**6.8 Preservation Must Be Portable.** Governance must survive changes in AI model,
editor, application builder, repository host and deployment environment.

**6.9 A Wrong Finding Costs More Than a Missing One.** Governance output has a
trust budget. Once spent, correct findings are skimmed alongside incorrect ones and
the engine's value is lost while it continues to appear operational.

## 7. System Architecture

```text
PROJECT SOURCE
     ↓
INGESTION / ADAPTER
     ↓
CANONICAL PROJECT SNAPSHOT
     ↓
ARTIFACT CLASSIFICATION
     ↓
SLD LAYER MAPPING
     ↓
TECHNICAL DOMAIN MAPPING
     ↓
DEPENDENCY / IMPACT GRAPH
     ↓
CANONICAL BASELINE
     ↓
PROPOSED CHANGE
     ↓
CHANGE ANALYSIS
     ↓
CHANGE CONTRACT
     ↓
BLAST RADIUS
     ↓
POLICY ENGINE
     ↓
GOVERNANCE DECISION
     ↓
IMPLEMENTATION
     ↓
INPUT INTEGRITY VALIDATION
     ↓
ACTUAL DIFF
     ↓
AUTHORIZED VS ACTUAL COMPARISON
     ↓
DRIFT ANALYSIS
     ↓
POLICY ENGINE
     ↓
FINAL GOVERNANCE DECISION
     ↓
AUDIT LEDGER
```

## 8. Seven Layer Dip Operational Preservation Model

The operational preservation model is the governance ontology.

**Layer 1 — Identity Preservation.** Protects purpose, mission, audience, founder
intent, strategic coherence, ethical boundaries, emotional identity. Detects
mission drift, audience drift, brand dilution, identity destabilization.

**Layer 2 — Design & Aesthetic Preservation.** Protects typography, color, spacing,
visual rhythm, hierarchy, responsive design, authored aesthetics, design tokens.
Detects visual drift, aesthetic averaging, responsive regressions, unauthorized
redesign.

**Layer 3 — Behavioral Preservation.** Protects interaction patterns, cognitive
pacing, onboarding rhythm, user confidence, feedback behavior, emotional
sequencing. Detects interaction mutations, broken expectations, workflow friction,
trust erosion.

**Layer 4 — System Preservation.** Protects architecture, navigation, components,
routes, organizational structure, canonical authority, persistent state, system
relationships. Detects architectural fragmentation, duplicate systems,
shared-component mutation, navigation drift.

**Layer 5 — Logic Preservation.** Protects rules, calculations, permissions,
conditions, workflows, sequencing, dependencies, scoring, validation. Detects
broken logic, condition drift, permission changes, workflow mutation.

**Layer 6 — Content Preservation.** Protects copy, labels, records, narrative,
tone, data, links, messaging. Detects unauthorized rewriting, tonal mutation, data
mutation, content inconsistency.

**Layer 7 — Execution Preservation.** Protects approved scope, deployment
integrity, update integrity, validation, stop conditions, controlled iteration,
rollback capability. Detects scope expansion, unrelated refactoring, unauthorized
deployment changes, uncontrolled generation.

### 8.1 Layer conformance

An implementation must emit exactly these seven canonical layer identifiers. A
conformance test must assert that the set of layer identifiers the engine can emit
equals the canonical set.

An implementation can diverge from the ontology while appearing healthy — still
producing findings, still returning decisions, still passing its own tests. Every
concern belonging to a layer the implementation does not carry becomes structurally
undetectable rather than under-enforced. The conformance test is the only
inexpensive way to detect this class of divergence.

### 8.2 Layer applicability

A project may declare which layers apply to it. A layer the project has not
activated produces no findings and is not reported as unknown or insufficient.
Absence of applicability is not absence of evidence.

## 9. SLD V2 Relationship

SLD V2 remains the experiential architecture model:

```text
Foundation   = Why it exists
Skeleton     = What exists
Skin         = What it looks like
Motion       = How it moves
Voice        = How it speaks
Emotion      = How it feels
Intelligence = How it behaves and adapts
```

V2 supports baseline creation, product design, completeness analysis and
architecture discovery. V1 operational preservation governs changes against that
baseline. **V2 defines the intended product. V1 preserves it while it evolves.**

## 10. Technical Domains

Technical domains describe where an artifact exists technically. They do not
replace the Seven Layers.

```text
presentation
application
data
integration
security
infrastructure
governance
```

```json
{
  "artifact": "src/components/AccountForm.tsx",
  "technicalDomains": ["presentation", "application"],
  "sldLayers": ["design", "behavior", "content"]
}
```

An artifact may belong to multiple technical domains and multiple SLD layers.

## 11. Core Entity: Project

```json
{
  "projectId": "project_123",
  "name": "Example Product",
  "source": { "type": "github", "repository": "owner/repository" },
  "defaultBranch": "main",
  "currentBaselineId": "baseline_456",
  "createdAt": "",
  "updatedAt": ""
}
```

## 12. Core Entity: Project Snapshot

```json
{
  "snapshotId": "snapshot_123",
  "projectId": "project_123",
  "revisionId": "git_sha",
  "source": "github",
  "capturedAt": "",
  "artifactCount": 312,
  "hash": ""
}
```

Snapshots are immutable.

## 13. Core Entity: Artifact

Supported artifact types: file, component, route, page, API endpoint, database
table, schema, migration, permission, prompt, agent, workflow, configuration,
design token, content block, environment dependency, deployment configuration,
test.

```json
{
  "artifactId": "artifact_123",
  "projectId": "project_123",
  "snapshotId": "snapshot_456",
  "type": "component",
  "path": "src/components/AccountForm.tsx",
  "technicalDomains": ["presentation", "application"],
  "sldLayers": ["design", "behavior", "content"],
  "canonical": false,
  "protected": false,
  "excluded": false,
  "lineCount": 412,
  "confidence": 0.94,
  "classificationSource": "deterministic"
}
```

Classification source values: `deterministic`, `manifest`, `user`, `llm`,
`inferred`.

`lineCount` is retained so change magnitude (§26) is computable against the
baseline. `excluded` marks artifact classes exempt from magnitude and corruption
analysis (§16.3).

## 14. Core Entity: Dependency Edge

Relationship types:

```text
imports · renders · calls · reads · writes · routes-to · authenticates
authorizes · styles · deploys · depends-on · controls · personalizes · governs
```

Experiential relationships:

```text
establishes-trust · controls-voice · defines-navigation · sets-visual-authority
governs-user-flow · preserves-identity · affects-emotional-state
```

```json
{
  "fromArtifactId": "artifact_A",
  "toArtifactId": "artifact_B",
  "relationship": "imports",
  "strength": "direct",
  "confidence": 1
}
```

## 15. Core Entity: Canonical Baseline

```json
{
  "baselineId": "baseline_123",
  "projectId": "project_123",
  "snapshotId": "snapshot_456",
  "revisionId": "abc123",
  "status": "approved",
  "canonicalAuthorities": {},
  "protectedLayers": [],
  "protectedArtifacts": [],
  "policies": [],
  "health": { "unresolvedProtectedReferences": [] },
  "approvedBy": "",
  "approvedAt": ""
}
```

Statuses: `draft`, `awaiting_review`, `approved`, `superseded`, `archived`. Only an
approved baseline may be used for enforcement.

### 15.1 Protected-reference resolvability

Every protected artifact reference — in the baseline, the manifest, or a Change
Contract — must resolve to an artifact present in the snapshot.

- Resolvability is validated at baseline approval and at every evaluation.
- An unresolvable protected reference yields `INSUFFICIENT_EVIDENCE` for the rules
  depending on it, and is raised as a baseline-health violation.
- An unresolvable reference is never treated as satisfied.

Protection expressed as a literal path fails silently when an artifact is moved or
renamed: the rule remains configured, matches nothing, and reports success
indefinitely. This is the most dangerous failure class in the system because it is
indistinguishable from correct operation — the protection appears present and is
inert. Directory reorganizations are routine, and are exactly when protection
matters most.

## 16. SLD Manifest

A governed repository may contain:

```text
/sld/project.yaml
/sld/layers.yaml
/sld/policies.yaml
/sld/baseline.json
/sld/owners.yaml
```

```yaml
sld:
  schema_version: "1.1"
  project_id: "example"

  baseline:
    revision: "abc123"

  canonical_authority:
    navigation:    "src/config/navigation.ts"
    page_template: "src/components/PageTemplate.tsx"
    design_tokens: "src/styles/tokens.css"
    design_source: "design/reference/authored-design.html"
    design_spec:   "DESIGN.md"

  protected_layers: [identity, behavior, logic, system]

  protected_artifacts:
    - path: "src/config/navigation.ts"
      reason: "Canonical navigation authority"
      approval: "owner"
```

The manifest is portable. Governance must not require a dashboard.

### 16.1 Design canonical authority

Layer 2 cannot enforce without a machine-readable design record.

```yaml
  design_invariants:
    content_width:
      min: 1180
      max: 1236
      unit: "px"
      source: "DESIGN.md:266"
      selectors: [".main", ".content-column"]
```

- Every invariant carries `source` identifying the document and line it derives
  from, so the invariant is traceable rather than a second source of truth.
- An invariant with no stated value in the design record is absent. The engine does
  not infer a default.
- An absent invariant produces silence, not a finding.
- Where a project holds more than one design record, the manifest declares
  precedence. The engine does not resolve design conflicts on its own authority.

Design intent that exists only as prose, or only inside a design tool, cannot be
enforced deterministically. Numeric invariants carrying provenance are the smallest
representation that makes Layer 2 enforceable.

### 16.2 Thresholds and marker sets

Magnitude thresholds (§26.1) and the elision marker set (§33.2) are manifest
fields, not engine constants, so each project tunes them to its language and
tolerance.

### 16.3 Excluded artifact classes

The manifest declares artifact classes exempt from magnitude and content-corruption
analysis: generated code, vendored dependencies, lockfiles, minified bundles,
snapshots, fixtures. These change wholesale for legitimate reasons; without
exclusions the engine fires on every dependency update and is switched off.

## 17. Core Entity: Proposed Change

```json
{
  "changeId": "change_123",
  "projectId": "project_123",
  "baselineId": "baseline_456",
  "request": "Replace the hero image on one product page",
  "source": "browser_extension",
  "requestedBy": "",
  "createdAt": ""
}
```

## 18. Change Analysis

The analyzer identifies likely target artifacts, directly and indirectly affected
layers, affected technical domains, shared dependencies, protected artifacts in the
likely blast radius, unknown dependencies, recommended validation checks and
required approvals. It returns confidence for inferred relationships.

## 19. Core Entity: Change Contract

```json
{
  "changeContractId": "contract_123",
  "changeId": "change_123",
  "baselineId": "baseline_456",

  "intent": {
    "request": "Replace the hero image on one product page",
    "successCondition": "New image appears with current layout and behavior preserved"
  },

  "authorized": {
    "layers": ["design", "execution"],
    "artifacts": ["public/images/pages/example/*"]
  },

  "protected": {
    "layers": ["identity", "behavior", "logic", "system"],
    "artifacts": [
      "src/components/PageTemplate.tsx",
      "src/config/navigation.ts",
      "src/lib/scoring.ts"
    ]
  },

  "requiredChanges": [
    { "artifact": "public/images/pages/example/hero.webp", "mustExist": true }
  ],

  "requiredChecks": ["desktop_visual", "mobile_visual"],

  "stopConditions": [
    "shared page template requires modification",
    "navigation requires modification"
  ],

  "status": "approved",
  "draftedBy": "agent_x",
  "approvedBy": "user_y"
}
```

This is one of the most important SLD entities.

### 19.1 Contract approval authority

- `approvedBy` identifies a human principal.
- `approvedBy` must not be the actor that implements the change.
- A contract in any status other than `approved` yields `INSUFFICIENT_EVIDENCE`.
- An implementing agent may draft a contract. **Drafting is not approving.**

Without separation, an implementing agent authors its own authorization and every
downstream check measures the change against a scope its author chose. The contract
is then a self-issued permission slip that passes verification by construction.

## 20. Blast Radius Analysis

SLD distinguishes direct change, adjacent impact, indirect impact, protected impact
and unknown impact, calculated from changed artifacts, dependency edges, layer
relationships, canonical status, artifact protection, policy sensitivity and
confidence.

```text
Artifact importance
× Dependency reach
× SLD layer sensitivity
× Technical-domain sensitivity
× Change magnitude
× Protection status
× Uncertainty
```

MVP does not require a validated numerical formula. Output may classify blast
radius as `isolated`, `local`, `shared`, `cross-system`, `unknown`.

## 21. Governance Policy

```json
{
  "ruleId": "SLD-SYSTEM-001",
  "description": "Shared navigation changes require owner approval.",
  "when": { "layer": "system", "artifact": "src/config/navigation.ts" },
  "require": ["navigation_regression_test", "owner_approval"],
  "decision": "review_required"
}
```

Policy sources: built-in defaults, project manifest, organization policy,
user-defined rules. Project overrides are explicitly versioned.

## 22. Governance Decisions

**ALLOW** — within authorized scope, required checks passed.
**ALLOW_WITH_WARNING** — may continue, nonblocking concerns exist.
**REVIEW_REQUIRED** — human approval or additional evidence required.
**BLOCK** — violates an explicit governance rule or protected authority.
**INSUFFICIENT_EVIDENCE** — impact cannot be safely determined.

### 22.1 Evidence precondition

The engine does not return `ALLOW` or `ALLOW_WITH_WARNING` when its own inputs are
absent, unresolvable, or self-referential. Such conditions yield
`INSUFFICIENT_EVIDENCE`. Uncertainty is never silently converted into ALLOW.

## 23. Governance Decision Schema

```json
{
  "decisionId": "decision_123",
  "changeId": "change_123",
  "status": "review_required",
  "risk": "high",
  "changedLayers": ["design"],
  "affectedLayers": ["behavior", "system"],
  "technicalDomains": ["presentation"],
  "violations": [
    {
      "ruleId": "SLD-SYSTEM-001",
      "artifact": "src/components/PageTemplate.tsx",
      "message": "Protected shared template is within the proposed blast radius."
    }
  ],
  "requiredChecks": ["desktop_visual", "mobile_visual"],
  "requiredApprovals": ["project_owner"],
  "evidenceIntegrity": { "baseResolved": true, "changesetEmpty": false },
  "confidence": 0.88
}
```

## 24. Implementation Verification

SLD compares authorized artifacts against actual changed artifacts, and authorized
layers against actual affected layers. Each actual change is classified as
`expected`, `adjacent`, `unauthorized`, `protected_violation` or `unknown`.

### 24.1 Content-level verification

Verification compares at content level, not path level.

- A contract may express a requirement as `{ artifact, mustContain | mustMatch }`.
- The condition is evaluated against the added diff text for that artifact.
- An unmet requirement is a violation, not an advisory observation.
- Requirements expressed as free prose are never matched against artifact
  identifiers.

Path-level comparison confirms the right file was touched, never that the right
thing was done to it. A requirement compared against the wrong domain can never be
satisfied, reports failure on every change, and is therefore ignored on every
change — a check that always fires is equivalent to no check while appearing to be
one.

## 25. Drift Definition

Drift is an implemented change that exceeds, contradicts, mutates, or cannot be
reconciled with an approved canonical baseline or authorized Change Contract. Not
every difference is drift. Authorized evolution is not drift.

## 26. Drift Analysis

```text
Actual Change − Authorized Change = Potential Drift
```

Weighted by artifact protection, dependency reach, SLD layer, technical domain,
magnitude, policy and uncertainty.

### 26.1 Change magnitude

Per artifact:

```text
magnitude = removedLines / baselineLines        (and absolute removedLines)
```

- Exceeding the manifest threshold → at minimum `REVIEW_REQUIRED`.
- Exceeding it on a protected or canonical artifact → `BLOCK`.
- Passing requires a contract explicitly authorizing deletion for that artifact.
- Artifact classes under §16.3 are exempt.

A change type of "deleted" describes an artifact that is gone. An artifact that
remains at its path while losing most of its contents is classified as a
modification and inherits none of the scrutiny deletion attracts. Content volume is
measured directly.

## 27. Drift Severity

**Level 0 — Authorized.** Expected change.
**Level 1 — Cosmetic Drift.** Minor unapproved presentation variance.
**Level 2 — Behavioral Drift.** Interaction or user-experience behavior changed.
**Level 3 — Workflow Disruption.** Operational or product workflow changed.
**Level 4 — Identity Destabilization.** Mission, audience, positioning, voice or
fundamental user experience changed.
**Level 5 — Systemic Corruption.** Architecture, permissions, shared systems, data
integrity, deployment or core logic materially compromised. Mass removal of a
canonical artifact's contents is Level 5.

## 28. Recovery

SLD retains enough revision information to identify the last approved baseline.
Options: review, approve override, generate correction instruction, restore
protected artifact, restore baseline, create new baseline. Automated rollback is
not required for 0.3.1; identifying the recovery point is.

## 29. Controlled Evolution

```text
Approved Baseline A → Authorized Change → Verification Passes
→ Human Approval → Snapshot B → Baseline B
```

Historical baselines are retained. History is never overwritten.

## 30. Audit Ledger

Records baseline creation, baseline approval, proposed change, Change Contract,
governance decision, implementation result, violations, approvals, overrides,
recovery action, baseline promotion.

```json
{
  "eventId": "event_123",
  "projectId": "project_123",
  "type": "override_approved",
  "actor": "",
  "changeId": "change_123",
  "previousDecision": "block",
  "reason": "Intentional navigation redesign",
  "timestamp": ""
}
```

Audit records are append-only.

## 31. SLD Stability Score

The official Stability Score remains separate from Change Impact. Known
specification: 28 questions, 0–100 output, across Identity, Design, Behavior,
Logic, Content, System, Cross-model. The official questions and weights are not
available in the current source record. **Engine 0.3.1 must not fabricate or
replace them.**

## 32. Three Separate Measurements

**Stability Score** — how well-defined and continuity-ready is the existing project?
**Change Impact** — how much potential impact does this proposed change have?
**Drift Result** — did the actual implementation exceed authorized scope?

These are not collapsed into one score.

## 33. Deterministic Analysis Requirements

Analyzers inspect changed files, path conventions, imports, exports, API routes,
database schemas, migration files, auth files, permissions, environment references,
configuration, deployment files, package dependencies, prompts, agent definitions
and tests. Where deterministic inspection is possible, LLM classification is not
substituted.

### 33.1 Comparison base integrity

Before analysis the engine validates its comparison base:

- the base revision must resolve;
- the base must not be the revision under analysis;
- for post-merge or direct-push evaluation the base is the pre-change revision, not
  the current branch tip;
- an empty changeset where a change was asserted yields `INSUFFICIENT_EVIDENCE`.

**The engine never reports ALLOW on an empty diff.** Comparing a revision against
itself produces an empty changeset, zero findings and a passing result. The failure
is silent and total: the engine reports success precisely because it examined
nothing. This is most likely on the evaluation path with the least other
protection — changes reaching the default branch without review.

### 33.2 Generation-artifact corruption detection

A generative agent that summarizes a file while rewriting it emits placeholder text
into source in place of content it elided: `[...]`, `... rest of`,
`rest of file unchanged`, `// unchanged`, and similar. The artifact remains at its
path, its diff is small and plausible, and its contents are destroyed.

- The engine detects elision markers introduced into non-comment source positions.
  The marker set is manifest-extensible (§16.2).
- **Corroboration:** an elision marker together with a §26.1 magnitude breach on the
  same artifact → `BLOCK`. Either signal alone → `REVIEW_REQUIRED`.
- Reported as its own violation class, distinct from ordinary deletion.
- Artifact classes under §16.3 are exempt; documentation and test fixtures are
  exempt by default.

Conventional review tooling inspects syntax, security, formatting and quality. None
detect an agent silently summarizing a file it was instructed to edit, because the
result is syntactically valid and small in diff terms. Corroboration is required
because elision markers occur legitimately in documentation, regular expressions,
localization strings and sample output; a marker together with substantial content
loss does not.

## 34. LLM Interpretation Requirements

LLM interpretation may assist with unknown artifact classification, SLD-layer
classification, architectural intent, impact explanations, suggested tests,
natural-language policy drafting and plain-language reports. Every inferred result
carries source, confidence and reason.

```json
{
  "classification": "behavior",
  "source": "llm",
  "confidence": 0.72,
  "reason": "The component controls step progression during onboarding."
}
```

## 35. Human Authority

Humans can correct artifact classification, correct layer mapping, approve
baseline, modify policy, approve Change Contract, override decision, approve
intentional drift and promote a new baseline. An override never erases the original
decision.

## 36. Integration Architecture

All integrations convert into the same internal contract.

```ts
interface BuildAdapter {
  detect(input: unknown): Promise<boolean>;
  importProject(input: unknown): Promise<ProjectSnapshot>;
  importChange(input: unknown): Promise<ProposedChange>;
  publishDecision(decision: GovernanceDecision): Promise<void>;
}
```

## 37. Initial Adapter: GitHub

Capabilities: connect repository, identify branch, identify baseline SHA, inspect
pull request, retrieve changed files, retrieve patches, classify artifacts, compare
against Change Contract, generate governance report.

Engine 0.3.1 begins in advisory mode. Merges are not blocked by default.

### 37.1 Governance coverage reporting

While in advisory mode the engine records, for each revision reaching the default
branch, whether that revision was governed. `governedCommitRatio` is a §46 metric.
An engine that can be bypassed reports when it was; ungoverned changes are
otherwise invisible in a metrics set that counts only evaluations performed.

## 38. Browser Extension Relationship

SLD Protect is the before-change interface: identify the project, retrieve the
current baseline, capture the proposed request, call the Change Analyzer, display
blast radius and governance requirements, create a Change Contract, generate a
governed AI instruction. The extension is a client of the Control Plane, not a
permanent home for the engine.

## 39. Plainly Relationship

Plainly is the human translation layer. Raw output:

```text
SLD-SYSTEM-004
Protected dependency mutation.
```

Plainly may present: *This change reached farther than you asked. You asked for a
hero image update. The implementation also modified the shared page component,
which affects additional pages. SLD recommends reviewing the shared component
before merging.*

Plainly does not replace SLD governance.

## 40. API Contract

```text
POST /v1/projects
POST /v1/projects/{id}/snapshots
POST /v1/projects/{id}/baselines

POST /v1/changes
POST /v1/changes/{id}/analyze
POST /v1/changes/{id}/contract

POST /v1/reviews
GET  /v1/reviews/{id}

POST /v1/decisions/{id}/approve
POST /v1/decisions/{id}/override

GET /v1/projects/{id}/audit
```

## 41. MVP 0.3.1 Scope

Canonical manifest schema · project model · immutable snapshot model · artifact
schema · deterministic artifact classifier · SLD layer mapping with conformance
test · technical-domain mapping · basic dependency relationships · manually
approved baseline · protected-reference resolvability · Proposed Change model ·
Change Contract with approval separation · diff ingestion · comparison base
integrity · authorized vs actual comparison at content level · change magnitude ·
generation-artifact corruption detection · design invariants · basic blast-radius
analysis · policy engine · five governance decisions · human-readable report · JSON
output · append-only audit record · GitHub advisory integration with coverage
reporting.

## 42. Out of Scope for 0.3.1

Automated rollback · production merge blocking · enterprise organization hierarchy ·
billing · marketplace listings · complete third-party builder adapters · editor
hooks · MCP server · broad REST platform · deep visual regression service · full
semantic dependency graph across every language · proprietary formulas not yet
reviewed · public multi-tenant dashboard · automatic baseline approval.

## 43. Core MVP User Flow

```text
CONNECT REPOSITORY → SCAN PROJECT → CREATE DRAFT BASELINE
→ HUMAN REVIEWS → APPROVE BASELINE → DECLARE CHANGE
→ ANALYZE LIKELY IMPACT → CREATE CHANGE CONTRACT → HUMAN APPROVES CONTRACT
→ AI / DEVELOPER IMPLEMENTS → VALIDATE COMPARISON BASE → READ DIFF
→ COMPARE ACTUAL VS AUTHORIZED → APPLY POLICY → RETURN DECISION
→ HUMAN DECIDES → WRITE AUDIT RECORD
```

## 44. Reference Test Scenarios

Each scenario must pass before 0.3.1 is expanded.

**Scenario A — Scope expansion.** Request: replace one page's hero image.
Authorized: that page's image assets. Protected: navigation, shared page template,
scoring logic, routes, other pages. Implementation touches the image, the page
data, the shared template and navigation.
Expected: `REVIEW_REQUIRED` — 2 expected changes, 1 shared component modification,
1 protected navigation modification. Requires owner approval plus navigation and
shared-template regression checks.

**Scenario B — Empty comparison base.** Evaluation runs with a base equal to the
revision under analysis. Expected: `INSUFFICIENT_EVIDENCE`. Must not return ALLOW.

**Scenario C — Self-approved contract.** A contract whose `approvedBy` equals the
implementing actor. Expected: `INSUFFICIENT_EVIDENCE`.

**Scenario D — Silent content loss.** An artifact retains its path while losing a
majority of its lines, with no deletion grant. Expected: `BLOCK`.

**Scenario E — Generation artifact.** An artifact gains an elision marker and
breaches the magnitude threshold. Expected: `BLOCK`. Marker alone in a documentation
file: no finding.

**Scenario F — Inert protection.** A protected artifact is renamed so its rule no
longer resolves. Expected: baseline-health violation and
`INSUFFICIENT_EVIDENCE` for the dependent rules — never silent success.

**Scenario G — Design invariant.** A layout value outside a declared invariant.
Expected: violation citing the invariant's `source`.

## 45. Acceptance Criteria

Engine 0.3.1 is successful when:

- A repository can be represented as an SLD Project.
- An immutable Snapshot can be created.
- Files can be represented as Artifacts with technical domains and one or more SLD
  layers, retaining classification source and confidence.
- Emitted layer identifiers equal the canonical seven; an inactive layer produces
  no findings.
- A user can approve a canonical Baseline.
- Every protected reference resolves, or surfaces as a baseline-health violation.
- A user can define a proposed change; SLD identifies likely target artifacts and
  protected artifacts in the likely blast radius.
- A Change Contract can be generated, and approved by a human who is not the
  implementing actor.
- A diff can be ingested only after the comparison base is validated.
- Actual changes are compared against authorized scope at content level, and
  classified as expected, adjacent, unauthorized, protected violation or unknown.
- Policies can produce ALLOW, ALLOW_WITH_WARNING, REVIEW_REQUIRED and BLOCK.
- SLD can return INSUFFICIENT_EVIDENCE, and does so on an absent, self-referential
  or empty comparison base.
- An unmet content requirement is a violation.
- Removing more than the configured share of an artifact without a deletion grant
  is caught; an excluded artifact class is not.
- An elision marker plus a magnitude breach BLOCKs; either alone is REVIEW.
- A value violating a design invariant is caught and cites the invariant's source.
- A human-readable explanation accompanies every machine-readable decision.
- A human can override a decision; overrides are recorded without deleting the
  original.
- Approved evolution can produce a new baseline; historical baselines remain.
- Each governed project maintains a regression corpus of real revisions that must
  return BLOCK, and the corpus runs in CI.
- The engine does not claim the preliminary Change Impact model is the official SLD
  Stability Score.

## 46. Validation Metrics

- percentage of changed files correctly classified
- layer-classification correction rate
- unexpected files detected · protected artifacts detected
- false-positive rate **per layer**
- false-negative discoveries
- human override rate and reasons
- percentage of SLD recommendations accepted
- percentage of Change Contracts matching actual implementation
- regressions discovered after an SLD ALLOW
- `governedCommitRatio`
- contract self-approval attempts rejected
- unresolvable protected references detected
- evaluations halted for insufficient evidence, by cause
- repeat use across multiple changes

Most important early question: **does SLD identify meaningful unintended impact that
the AI builder did not disclose?**

### 46.1 Precision requirement

A layer skips what it cannot classify with confidence rather than guessing. A new
layer ships narrow and widens only on evidence. Per-layer false-positive rate gates
expansion.

## 47. Development Priority

**Priority 0 — Canonical schema.** Project, Snapshot, Artifact, layer
classification, technical domain classification, Baseline, Policy, Change Contract,
Governance Decision. No UI until these are stable enough to test.

**Priority 1 — Input integrity and advisory loop.** Comparison base validation,
contract approval separation, protected-reference resolvability, then the complete
reference scenarios in §44.

**Priority 2 — Baseline generation.** SLD drafts the initial baseline; a human
confirms it.

**Priority 3 — Better impact graph.** Imports, routes, APIs, schemas, shared
components and other deterministic dependencies.

**Priority 4 — Extension integration.** SLD Protect retrieves the baseline and
creates Change Contracts.

**Priority 5 — Enforcement.** After false-positive testing: checks, required
approvals, blocking policies.

## 48. Architecture Rule

Do not create one giant AI prompt called "SLD Engine." SLD is a composition of:

```text
Ingestion + Input Integrity Validation + Deterministic Analysis
+ Artifact Classification + Layer Mapping + Dependency Analysis
+ Optional LLM Interpretation + Policy Evaluation + Decision + Audit
```

Project knowledge enters through the manifest. No engine component contains
project-specific logic.

## 49. IP-Sensitive Development Rule

Technical implementation details representing possible novel invention territory
are versioned, dated, documented, attributable and stored privately when
appropriate: algorithm evolution, graph methodology, Change Contract structure,
drift formulas, decision logic, recovery logic, scoring experiments, human override
mechanics, cross-model behavior.

Two mechanisms in this release warrant review before public disclosure:

1. **Generation-artifact corruption detection** (§33.2) — identifying AI elision
   placeholders written into source, corroborated by content-loss magnitude.
2. **Protected-reference resolvability as a baseline-health invariant** (§15.1) —
   treating a protection rule that no longer matches any artifact as an active
   governance failure rather than a satisfied condition.

Neither appears in conventional code-review tooling, which evaluates properties of
the code that exists rather than the integrity of the governance configuration
itself. Do not assume public disclosure is harmless. Patent counsel should review
potentially novel technical mechanisms before detailed publication.

## 50. Definition of Done

SLD Engine 0.3.1 is done when a real repository can move through this loop:

```text
Baseline → Proposed Change → Change Contract → Implementation
→ Input Integrity Validation → Actual Diff → Impact Analysis
→ Governance Decision → Human Decision → Audit Record → Optional New Baseline
```

without relying on a human to manually inspect every file, without allowing an LLM
alone to determine whether the change is safe, and without the engine reporting
success on an analysis it could not perform.

**AI may propose change. SLD defines what may change. Humans remain the final
authority.**

## Appendix A — Adoption checklist

| Manifest field | Purpose |
|---|---|
| `application`, `identity`, `architecture` | project framing, canonical root, retired terms |
| `entities` (name → artifact globs) | entity-level scope; needs the most thought |
| `policies` | decision per violation class |
| `protected_layers` | which layers apply (§8.2) |
| `canonical_authority.design_source` / `design_spec` | Layer 2 enforcement (§16.1) |
| `design_invariants` with `source` | numeric design rules (§16.1) |
| excluded artifact classes | generated / vendored / minified (§16.3) |
| magnitude thresholds | per-project tolerance (§26.1) |
| elision marker set | language-appropriate additions (§33.2) |
| regression corpus | revisions that must BLOCK (§45) |
