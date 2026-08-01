# CLAUDE CODE EXECUTION PLAN: "My Plan" Expat Workspace Overhaul

## 🎯 High-Level Objective
Transform the static, empty-state "My Plan" workspace tabs into an intelligent, data-assisted relocation machine for expats moving to Portugal (Household of 5). The target implementation replaces blank `$0` initial states with dynamic, country-specific baseline benchmarks while maintaining full local manual override persistence and reality-check guardrails.

---

## 🏗️ Phase 1: Database Schema Expansion (Prisma Migration)
**File to Modify / Create:** `prisma/schema.prisma` (or your existing database model route)

### 📋 Objective
Extend the database layer to handle dynamic location states, track manual input overrides, and record baseline vs. custom configuration statuses.

### 🛠️ Execution Instructions
1. Ensure the `ExpatPlanWorkspace` model tracks `destinationCountry`, `destinationCity`, `householdSize`, and `monthlyNetIncome`.
2. Add a `BudgetItem` model with a strict relational constraint mapping back to the primary workspace.
3. Incorporate an `ExpenseStage` Enum to isolate setup capital from recurring upkeep costs.

### 💻 Reference Schema Structure
```prisma
model ExpatPlanWorkspace {
  id                 String          @id @default(uuid())
  userId             String          @unique
  destinationCountry String          // e.g., "Portugal"
  destinationCity    String          // e.g., "Lisbon" or "Porto"
  householdSize      Int             // e.g., 5
  pathwayVisa        String          // e.g., "Remote-work residence visa"
  targetMoveDate     DateTime
  currentMoveStage   MoveStage       @default(EXPLORE)
  monthlyNetIncome   Float           @default(0.0)
  currencyPreference String          @default("USD")
  locationMethod     LocationSource  @default(WIZARD)
  
  budgetItems        BudgetItem[]
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt
}

model BudgetItem {
  id                 String             @id @default(uuid())
  workspaceId        String
  workspace          ExpatPlanWorkspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  category           String             // "HOUSING", "FOOD", "VISAS", "SHIPPING"
  label              String             // "Monthly Rent"
  chronologicalStage ExpenseStage       // ONE_TIME or MONTHLY_RECURRING
  systemBaseline     Float              // The country-track fallback average
  userOverride       Float?             // Null if untouched; Float if edited
  isCustom           Boolean            @default(false)
}

enum MoveStage { EXPLORE, ASSESS, SHORTLIST, DECIDE, PREPARE, APPLY, MOVE, SETTLE_IN }
enum ExpenseStage { ONE_TIME, MONTHLY_RECURRING }
enum LocationSource { WIZARD, MANUAL_DROPDOWN }
```

---

## 🔄 Phase 2: Local Auto-Save Cache Engine (localStorage Hook)
**File to Create:** `src/hooks/useLocalStorageWorkspace.ts` (or apply directly to the layout parent state)

### 📋 Objective
Prevent client data loss on page refreshes or connection drops by serializing state changes directly to browser local storage, protected with Next.js SSR hydration shields.

### 🛠️ Execution Instructions
1. Implement a safe environment validation check (`typeof window !== 'undefined'`) to prevent server-side compilation crashes.
2. Initialize separate cache scopes for `country`, `city`, and `user_overrides`.
3. Set up atomic `useEffect` state observers that automatically commit overrides to disk upon user keystrokes.

---

## 💰 Phase 3: The Move Budget Tab Rewrite
**File to Modify:** Your primary Budget component (e.g., `src/components/MyPlan/BudgetTab.tsx`)

### 📋 Objective
Overhaul the budget interface from a single flat list into a dual-layered, chronological layout mapping the actual expat moving path.

### 🛠️ Execution Instructions
1. **Top Metrics Metrics Transformation**: Replace generic metric blocks with three data modules:
   * **Total Upfront Moving Cash**: Direct sum of all `ONE_TIME` rows.
   * **Monthly Living Budget**: Direct sum of all `MONTHLY_RECURRING` rows.
   * **Data Confidence Meter**: Tracks user verification metrics (e.g., `"2 of 7 categories verified"`).
2. **Chronological Grid Splitting**: Split the single categories list into two horizontal cards:
   * **Section A**: One-Time Moving Capital Costs (Visas, Flights, Logistics Broker / Lease Deposits).
   * **Section B**: Ongoing Monthly Destination Run-Rate (Housing Base Rent, Food, Transport, Utilities).
3. **Muted Placeholders Integration**: Bind inputs to render country baseline integers (e.g., `1650` for housing) in a gray, italicized style if the database field is unedited. If the user overrides it, flag the line item dynamically as `isCustom` and shift styling to dark high-contrast fonts.

---

## 🛡️ Phase 4: Radix Overlay Modals & Context Actions
**File to Modify:** Inside the Budget component and sub-category sheets.

### 📋 Objective
Introduce contextual detailed estimation matrices via modals and activate real-time anomaly check guardrails.

### 🛠️ Execution Instructions
1. **Contextual Action Anchors**: Inject a small textual link button `[📊 View Local Benchmarks]` next to every primary row label text.
2. **The Overlay Matrix Modal**: Clicking the link pops up a clean Dialog window. Clicking "Housing" surfaces nested local line variables: *Long-term Rent: €1,650, Utilities: €220, Fiber Net Bundle: €60, Insurance: €50*. Saving updates the root dashboard calculation row automatically.
3. **The Reality Check Anomaly Warning Engine**:
   * Implement real-time variance calculating logic:
     $$\text{Variance \%} = \left( \frac{\text{System Baseline} - \text{User Input}}{\text{System Baseline}} \right) \times 100$$
   * If any custom user entry drops **50% or more** below the regional database baseline (e.g., manual housing typed as €400), instantly shift the right-hand **Reality Check Alert Card** to an active amber hue (`#F59E0B`) with target warning copy.

---

## 📍 Phase 5: Location Engine Switcher & Onboarding Wizard
**File to Modify:** Top toolbar workspace banner layout container.

### 📋 Objective
Give users the ability to change destination data nodes manually or via a structured step-by-step picker wizard.

### 🛠️ Execution Instructions
1. Mount a secondary select box header interface tracking available regional baseline tracks (e.g., `Lisbon, Portugal`, `Porto, Portugal`, `Mexico City, Mexico`).
2. Add a `⚡ Run Setup Wizard` button launching a dedicated 2-step setup overlay:
   * **Step 1**: Dynamic geography picker (Selecting a country filters available target hub city lists).
   * **Step 2**: Lifestyle tier profile filters (`Budget Minimalist`, `Standard Balanced`, `Premium Full Expat`).
3. Upon finalizing the wizard, wipe legacy custom input states to avoid mathematical overlap and refresh baseline references cleanly.

---

## 🖨️ Phase 6: Document Exporters (Native CSV & Print PDF Styles)
**File to Modify:** Toolbar element wrapper & Global CSS configurations.

### 📋 Objective
Enable instantaneous offline report retrieval for users without bloating the system build footprint with massive tracking libraries.

### 🛠️ Execution Instructions
1. **Spreadsheet CSV Blob Handler**: Construct a standard data URI string compiler parsing your live arrays. Trigger automated anchor asset actions to prompt a browser file download labeled `Expat_Relocation_Report_[City].csv`.
2. **Fidelity PDF Exporter**: Bind the PDF report action button to invoke the native window layout print command handler: `window.print()`.
3. **Print Layout CSS Media Queries**: Append explicit print formatting rules inside your stylesheet to hide UI layout controls, collapse background fills, and condense text tracking boundaries cleanly onto standard A4 paper dimensions.

```css
@media print {
  select, button, nav, .fixed, .action-buttons-bar, .reset-link-button { 
    display: none !important; 
  }
  body, .bg-slate-50, .bg-slate-50\/30, .bg-white {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .max-w-6xl, .main-dashboard-grid {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: none !important;
    display: block !important;
  }
}
```

