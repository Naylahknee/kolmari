# Nexit Data Model, Trust, and Verification

This document defines the contracts needed to support trustworthy personalization, country research, Pathways, Greenbook, documents, and planning.

## 25. Data Trust and Verification

Every time-sensitive country fact must support:

```text
source_name
source_url
source_type
source_period
last_verified_at
reviewed_by
status
```

Content status values:

```ts
type ContentStatus =
  | "draft"
  | "placeholder"
  | "editorially_reviewed"
  | "official_source_verified"
  | "stale";
```

Do not display placeholder content as verified fact.

Use this empty state:

> Research in progress
>
> We are still verifying this section for [Country]. You can review the official resources below in the meantime.

---
### Source and freshness disclosure

All changing facts support:

```ts
export type SourceDisclosure = {
  sourceName: string;
  sourceUrl: string;
  sourceType:
    | "official_government"
    | "national_statistics"
    | "international_organization"
    | "editorial"
    | "community";
  reportingPeriod: string | null;
  lastVerifiedAt: string | null;
  contentStatus:
    | "draft"
    | "placeholder"
    | "editorially_reviewed"
    | "official_source_verified"
    | "stale";
};
```

Never display placeholder or stale information as current verified fact.
# 26. Data Types

Create:

```ts
export type ContentVisibility =
  | "always_visible"
  | "accordion"
  | "conditional"
  | "hidden_when_empty";

export type ContentSectionDefinition = {
  id: string;
  title: string;
  summary?: string;
  visibility: ContentVisibility;
  defaultOpen?: boolean;
  priority: number;
  requiresProfileFields?: string[];
  requiresCountryData?: string[];
};

export type PageLayoutDefinition = {
  template: NexitPageTemplate;
  persistentHero: boolean;
  accordionBehavior?: AccordionBehavior;
  visibleSections: ContentSectionDefinition[];
  accordionSections: ContentSectionDefinition[];
};
```

Create a registry so each page defines:

* what remains visible
* what may collapse
* default open section
* accordion mode
* empty-state behavior

---
# 28. Source and Verification Rules

Every time-sensitive fact must support:

```ts
type SourceDisclosure = {
  sourceName: string;
  sourceUrl: string;
  sourceType:
    | "official_government"
    | "national_statistics"
    | "international_organization"
    | "editorial"
    | "community";
  reportingPeriod: string | null;
  lastVerifiedAt: string | null;
  contentStatus:
    | "draft"
    | "placeholder"
    | "editorially_reviewed"
    | "official_source_verified"
    | "stale";
};
```

Display:

```text
Source
Reporting period
Last verified
```

Do not present stale or placeholder content as current.

---

## Data separation rules

- Raw sourced facts, editorial interpretation, personalized interpretation, and community reports are separate fields and separate visual labels.
- Match Score, Nexit Readiness, and Pathway Match are derived outputs with versioned methodology.
- Unknown profile values stay `null`; they are not replaced with demographic assumptions.
- Public quiz data may be stored as temporary session context until the user chooses to create an account.
- Legal and immigration information is planning support, not a legal eligibility determination.
- Community reports require moderation metadata and must never be presented as universal fact.

## Recommended core entities

```text
User
NexitProfile
QuizSession
Nextination
CountrySection
CountryMetric
SourceDisclosure
VerificationRecord
Pathway
PathwayRequirement
PathwayMatch
SavedNextination
NexitPlan
PlanPhase
PlanTask
DocumentRequirement
UserDocument
GreenbookResource
CommunityReport
CostEstimate
```
