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
- Budget fields
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
- Budget fields (housing, food, transport, healthcare, other)
- BudgetDonut preview
- Save to My Plan action

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
