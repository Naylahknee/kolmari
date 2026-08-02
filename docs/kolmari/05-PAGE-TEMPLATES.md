# Kolmari Page Templates

## Page-by-page specifications

### Dashboard
- Welcome header with user first name
- Move Readiness ring
- Destination summary (top 3 from COUNTRIES)
- Plan progress (Move Timeline)
- Budget snapshot (BudgetDonut)
- Pathways signal (top 3 strong matches)
- Primary CTA: "Enter Flutter Mode" (if profile complete)

### Your World
- Header: "Your World"
- Toggle: Map view / Countries view
- Map: SVG world map with 6 region links (no Mapbox token required)
- Countries view: `CountriesBrowser` with search and filter
- Profile incomplete state: show message, do not fabricate Match Scores

### Destinations (Saved)
- Header: "Destinations"
- Saved destination cards (localStorage)
- Empty state: prompt to explore Your World

### Destination Detail
- Persistent hero with country name and flag
- 16 tabs: Overview, Why You, Economic Profile, Cost of Living, Pathways, Healthcare, Greenbook, Housing, Legal & Taxes, Employment, Transportation, Daily Life, Education, Family & Pets, Resources, Compare

### Pathways
- Header: "Pathways"
- Filter by status: Strong Match / Possible Match / Missing Requirements
- Accordion per pathway
- Always show official source and lastVerified date

### My Plan
- Header: "My Plan"
- Stage selector (Explore → Decide → Prepare → Apply → Move → Settle)
- Destination picker
- Pathway picker
- Checklist (add / complete / delete)
- Budget tab uses the same hybrid line-item model as the Cost Calculator:
  - one-time arrival costs and ongoing monthly costs are separate groups;
  - an available local planning baseline is counted until the user supplies a custom value;
  - benchmark details open in a focused dialog and sync back to the parent category;
  - monthly income is compared with the ongoing monthly run-rate in a persistent outlook card;
  - the assumptions and review date for any baseline remain visible.
- Notes

### Flutter Mode
- Header: "Flutter Mode"
- Execution-focused checklist view
- Priority tasks
- Move Timeline progress
- CTA: complete tasks

### Documents
- Header: "Documents"
- File upload (drag-and-drop)
- Document list
- Delete action
- Note: currently local state; backend storage is a future feature

### Kolmari Klub
- Header: "Kolmari Klub"
- Tabs: Chatter / Discover Klubs / My Klubs
- Honest empty state until community features are built
- Related links: Greenbook, Your World, Destinations

### Cost Calculator
- Header: "Cost Calculator"
- No user-profile identity card in the page header
- Three summary metrics: upfront moving cash, monthly living budget, and user-verified rows
- One-time arrival costs: visa/legal fees, flights, housing deposits, shipping/logistics
- Ongoing monthly costs: housing, food, transportation, healthcare, other
- Local planning baselines appear as input placeholders and count in calculations until overridden
- Custom entries use a visible custom state and replace the baseline for that row
- "View local benchmarks" opens an accessible detail dialog with sub-category values and an aggregate sync action
- Sticky monthly outlook compares ongoing costs with the stored monthly income without claiming certainty
- Assumptions, provenance label, and review date remain visible
- BudgetDonut is limited to the ongoing monthly breakdown
- Save to My Plan and CSV export actions

### Greenbook
- Header: "Greenbook Insights"
- Provenance legend (editorial / verified / community-reported)
- Planning prompt cards
- Community-reported empty state

### Settings
- Header: "Settings"
- Display name, current location, timeline, priority
- Link to Privacy & Account

### Privacy & Account
- Header: "Privacy & Account"
- Data export
- Password change
- Sign out all devices
- Deletion request

### Welcome
- Benefits list
- Primary CTA: "Build My Move Plan"
- Secondary: skip to Your World

### Auth (Signup / Login)
- Wordmark
- Form (email + password)
- Redirect preservation via `?next=`

### Landing Page
- Hero with CTA: "Build My Move Plan"
- Features bar
- How it works
- Stats
- Kolmari Klub community section
- Footer

### Profile Wizard
- One primary question per step
- Steps: name, citizenship, income, work type, household, regions, goals, climate, timeline
- Completion → `/pathways`
