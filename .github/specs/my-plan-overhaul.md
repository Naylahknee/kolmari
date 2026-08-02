# CLAUDE CODE EXECUTION PLAN: "My Plan" 5-Tab Workspace Overhaul

## 🎯 High-Level Objective
Transform the static, empty-state "My Plan" workspace canvas into an integrated, data-assisted relocation tracker for expats moving to Portugal (Household of 5). This plan links all 5 navigation tabs (Overview, Checklist, Documents, Budget, Notes) to a shared global location state, replacing blank states with country-specific templates while maintaining local manual overrides, cache persistence, and document exporters.

---

## 🏗️ Phase 1: Database Layer Schema Expansion
**Directory to Modify:** `db/` (or your existing database model route)

### 📋 Objective
Extend your database tracking layer to handle dynamic location states, track manual input overrides, and record baseline vs. custom configuration statuses across all features using your project's native database tools.

### 💻 Required Data Properties Matrix
Your data store must track these structural object definitions per item:
*   **Workspace Profile**: `destinationCountry` (String), `destinationCity` (String), `householdSize` (Int), `currentMoveStage` (Enum: EXPLORE, ASSESS, SHORTLIST, DECIDE, PREPARE, APPLY, MOVE, SETTLE_IN).
*   **Budget Schema**: `category` (String), `label` (String), `chronologicalStage` ("ONE_TIME" or "MONTHLY_RECURRING"), `systemBaseline` (Float), `userOverride` (Float/Null), `isCustom` (Boolean).
*   **Checklist Schema**: `id` (String), `title` (String), `stageAssociated` (Enum), `isCompleted` (Boolean), `isSystemTemplate` (Boolean).
*   **Document Schema**: `id` (String), `name` (String), `status` (Enum: MISSING, UPLOADED, TRANSLATED, APOSTILLED, APPROVED), `expirationDate` (DateTime/Null).

---

## 🔄 Phase 2: Local Auto-Save Cache Engine (localStorage Hook)
**File to Create:** `src/hooks/useLocalStorageWorkspace.ts` (or apply directly to the layout parent state)

### 🛠️ Execution Instructions
1. Implement a safe environment validation check (`typeof window !== 'undefined'`) to prevent server-side compilation crashes during Next.js builds.
2. Initialize separate cache scopes for `country`, `city`, `user_overrides`, `custom_tasks`, and `document_metadata`.
3. Set up atomic `useEffect` state observers that automatically commit overrides to disk upon user keystrokes or toggle changes.

---

## 🏠 Phase 3: Tab 1 — The Overview Dashboard Overhaul
**File to Modify:** `src/components/MyPlan/OverviewTab.tsx`

### 📋 Objective
Redesign the core landing view into an actionable command hub that updates based on real-time task and budget progression.

### 🛠️ Layout & Logic Requirements
1.  **Top Rail Split Grid (2-Column Grid, 70/30)**:
    *   *Left Card (Next Best Action)*: Dynamically pulls the oldest incomplete task from the Checklist database that matches the user's active `currentMoveStage`. Displays a bold descriptive headline and a high-contrast yellow CTA button (`Continue task →`). Clicking the button programmatically shifts the workspace tab state index to the Checklist view.
    *   *Right Card (Readiness Progress)*: Displays a dynamic ratio text block (`X of Y milestones complete`), a percentage readout, and a progressive horizontal linear gauge bar.
2.  **Interactive Move Pipeline Tracker**: Renders a non-wrapping, scroll-locked horizontal rail mapping the 8 chronological move stages. Uses the global state `currentMoveStage` to highlight the active node, style completed items with checkmarks, and lock future nodes from being clicked out of sequence.
3.  **Bottom Summary Cards Grid (3-Column Layout)**:
    *   *Card 1 (Plan Essentials)*: Displays target destination metrics (Portugal, Family of 5) and selected visa pathway with an `Edit details` trigger.
    *   *Card 2 (Document Readiness)*: Renders real-time file upload completion metrics (e.g., `"2 of 8 files uploaded"`).
    *   *Card 3 (Budget Summary)*: Displays a side-by-side snapshot comparison of Total Upfront Logistics Capital needed versus Ongoing Monthly Run-Rate.

---

## 📋 Phase 4: Tab 2 — Move Checklist Component Upgrade
**File to Modify:** `src/components/MyPlan/ChecklistTab.tsx`

### 📋 Objective
Upgrade the checklist from an empty input field to an automated, pre-populated project planner.

### 🛠️ Layout & Logic Requirements
1.  **Automated Initial Injection**: If a user selects "Portugal" and the database task list length is 0, fetch and auto-populate the table with default template tasks (e.g., `"Confirm passport validity"`, `"Apply for Portugal NIF"`, `"Open Portuguese bank account"`, `"Research housing areas"`).
2.  **Inline Action Drawer**: Create a focused accent box featuring a single-line text entry field (`Add a move task...`), a structured dropdown menu to assign the task to one of the 8 stages, and an `+ Add task` button.
3.  **Quick-Filter Menu Chips**: Position a horizontal row of button chips across the top (`All` followed by the 8 stages). Clicking a stage chip filters the main list view dynamically to show only tasks assigned to that relocation step.
4.  **Task Row Mechanics**: Each list row must contain a leading checkbox input, primary title text, an explicit stage badge, and a right-aligned trash icon. Toggling the checkbox triggers a state reducer that updates the global progress engine metrics.

---

## 📄 Phase 5: Tab 3 — Document Workspace & Meta Overlay
**File to Modify:** `src/components/MyPlan/DocumentsTab.tsx`

### 📋 Objective
Build a dynamic record tracking sheet that automatically flags upcoming expiration constraints based on the user's move date.

### 🛠️ Layout & Logic Requirements
1.  **Control Toolbar**: Group a text search filtering input string element alongside a structured dropdown status menu (`All statuses`, `Missing`, `Uploaded`, `Translated`, `Apostilled`, `Approved`).
2.  **File Matrix Rows**: Render rows containing: Document Name, Custom Tag Badges, and Actionable Slots.
3.  **Radix Detail Slide-Over Overlay**: Clicking a document row launches a right-aligned details sheet. Inside the sheet, provide a status dropdown, an input field to store document expiration dates, and a native file-drag target dropzone.
4.  **Expiration Warning Engine**: Write a date-parsing watcher. If a document row has an expiration date within 90 days of the global `targetMoveDate` (e.g., April 2028), apply a high-visibility warning border style to the row and float an alert icon stating: *"This document expires before your move window."*

---

## 💰 Phase 6: Tab 4 — Move Budget Hybrid Engine Overhaul
**File to Modify:** `src/components/MyPlan/BudgetTab.tsx`

### 📋 Objective
Overhaul the budget interface from a single flat list into a dual-layered, chronological layout mapping the actual expat moving path.

### 🛠️ Layout & Logic Requirements
1.  **Top Summary Metrics Row (3-Column Grid Layout)**:
    *   *Card 1 (Upfront Move Capital Requirement)*: Sums items where `chronologicalStage === 'ONE_TIME'`.
    *   *Card 2 (Monthly Target Living Expenses)*: Sums items where `chronologicalStage === 'MONTHLY_RECURRING'`.
    *   *Card 3 (Verification Status Metric)*: Tracks user interaction ratios (e.g., `"2 of 7 categories customized"`).
2.  **Chronological Grid Splitting**: Render two distinct cards:
    *   *Table 1*: "One-Time Upfront Arrival Costs" (Visas, Flights, Logistics, Deposits).
    *   *Table 2*: "Ongoing Monthly Destination Run-Rate" (Rent, Food, Transport, Utilities).
3.  **Muted Placeholders Integration**: Bind inputs to render country baseline integers (e.g., `1650` for housing) in a gray, italicized style if the field is unedited. If overridden, flag as `isCustom: true`, switch font to high-contrast bold slate, and append a toggle badge `[Custom]`.
4.  **Sub-Category Selection Overlay Modal**: Position text link buttons `[📊 View Local Benchmarks]` next to every row label. Clicking the link triggers an overlay Dialog window. Selecting "Housing" surfaces nested local line variables: *Long-term Rent: €1,650, Utilities: €220, Fiber Net Bundle: €60, Insurance: €50*. Saving updates the root calculation row automatically.
5.  **The Reality Check Anomaly Warning Engine**:
    *   Implement real-time variance calculating logic:
        $$\text{Variance \%} = \left( \frac{\text{System Baseline} - \text{User Input}}{\text{System Baseline}} \right) \times 100$$
    *   If any custom entry drops **50% or more** below the baseline (e.g., manual housing typed as €400), instantly shift the right-hand **Reality Check Alert Card** to an active amber hue (`#F59E0B`) with target warning copy.

---

## 📍 Phase 7: Tab 5 — Notes & Decisions Workspace
**File to Modify:** `src/components/MyPlan/NotesTab.tsx`

### 📋 Objective
Build an auto-saving notation scratchpad that shifts its visual prompt anchors based on the user's active move stage.

### 🛠️ Layout & Logic Requirements
1.  **Filtering Header**: Top element contains four quick-add notation action chips: `+ Decision`, `+ Question`, `+ Follow-up`, and `+ Research finding`. Clicking a chip automatically appends a pre-formatted bracket header (e.g., `[DECISION]: `) into the canvas space.
2.  **Rich Notepad Canvas**: Sprawling, responsive full-height textarea container running a 1-second debounced background auto-save loop to `localStorage`. Displays a small text marker at the footer showing: *"Autosaved at HH:MM:SS"*.
3.  **Right-Side Stage Prompts Column**: A vertical sidebar stack populated with dynamic questions that change based on the active `currentMoveStage` enum to guide the user's research:
    *   *If EXPLORE*: Render `"What timeline risks could delay this move?"`, `"Which neighborhood matches our budget floor?"`
    *   *If APPLY*: Render `"Have we compiled legalized criminal record background checks?"`, `"Are translation timelines accounted for?"`

---

## 🖨️ Phase 8: Location Engine Switcher & Document Exporters
**File to Modify:** Toolbar elements wrapper & Global CSS configurations.

### 🛠️ Layout & Logic Requirements
1.  **Dual Location Controller**: Place an active location select box and a `⚡ Run Setup Wizard` button in the top banner bar. The wizard must step through a country/city selector and a lifestyle tier profile choice (`Budget`, `Standard`, `Premium`) to load the correct baseline array data.
2.  **Spreadsheet CSV Blob Handler**: Construct a standard data URI string compiler parsing your live arrays. Trigger automated anchor asset actions to prompt a browser file download labeled `Expat_Relocation_Report_[City].csv`.
3.  **Fidelity PDF Exporter & Media Styles**: Bind the PDF report action button to invoke `window.print()`. Append explicit print formatting rules inside your stylesheet to hide UI layout controls, collapse background fills, and condense text tracking boundaries cleanly onto standard A4 paper dimensions.

```css
@media print {
  /* Hide interactive web components on paper layout */
  select, 
  button, 
  nav, 
  .fixed, 
  .action-buttons-bar, 
  .reset-link-button { 
    display: none !important; 
  }
  
  /* Flatten presentation layers to solid ink-saving white canvas */
  body, 
  .bg-slate-50, 
  .bg-slate-50\/30, 
  .bg-white { 
    background: #ffffff !important; 
    color: #000000 !important; 
  }
  
  /* Force columns to fit within a standard printable A4 layout view */
  .max-w-6xl, 
  .main-dashboard-grid { 
    max-width: 100% !important; 
    width: 100% !important; 
    margin: 0 !important; 
    padding: 0 !important; 
    box-shadow: none !important; 
    display: block !important; 
  }
}
```

