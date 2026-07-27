# Kolmari Adaptive Workspace

## Country / Destination workspace

The adaptive country workspace at `/nextinations/[slug]/[section]` provides:
- 16 tabbed sections per destination
- Personalized tab ordering when profile is complete (ranked by relevance)
- Persistent sidebar country tree showing saved destinations
- Section-level URLs for deep-linking

## Personalization rules

- Tab order is re-ranked when profile is complete
- Do not hide tabs — only re-order them
- Never fabricate a Match Score when profile is incomplete
- Show "Complete your profile to see personalized data" in all score positions

## Saved destinations

- Stored in localStorage under key `kolmari-saves` (new)
- Compatibility read from `nexit-saves` (old) with migration shim
- Displayed in sidebar country tree when saved
- Maximum display: no hard limit, but sidebar truncates at practical length

## Relevance scoring

Existing logic in `src/lib/userProfile.ts`:
- `calculateRegionMatches()` — region-level scores
- `calculateReadiness()` — person-level readiness
- `rankNextinations()` — country ranking

These functions must not be changed during visual migration.
