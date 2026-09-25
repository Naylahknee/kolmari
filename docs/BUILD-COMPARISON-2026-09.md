# Kolmari build comparison — September 2026

Recommendation: continue with `Naylahknee/kolmari`. Preserve `kolmari-demo` as a read-only reference until the production onboarding/mobile changes have passed a real account walkthrough; archive it afterwards. Do not delete its D1 database or Worker as part of this change.

| Area | Official `kolmari` | `kolmari-demo` |
| --- | --- | --- |
| Application | Next.js 16, React 19, TypeScript, reusable components | Static HTML/JavaScript pages plus Worker API |
| Accounts | Signed sessions, server-side route/API authentication | Client-side access screen; Command Center identity is a per-browser `cc_owner` cookie |
| Persistence | Neon Postgres, user-scoped profiles and planning boards | D1 planning boards scoped to browser cookie; additional localStorage state |
| Account continuity | Account login provides persistent identity | No account recovery or cross-device identity in the board API |
| Planning | Profile, destinations, pathways, board, budget, tracker, documents, community, Energy Portal | Useful interaction prototypes, food filters, quiz and board |
| Deployment | Existing Cloudflare build/deploy workflow and PR build workflow | Worker configured as `steep-limit-80e2` |
| Maintainability | Production foundation to consolidate | Keep as design/reference material, not a second production app |

Evidence inspected: both repositories' default branches, app/auth/profile routes, board implementations, Worker configuration and official GitHub workflows. This is a source/build comparison, not a complete security audit or authenticated production test.

## This implementation

- Owner-supplied HTML designs inform native React onboarding at the existing `/profile-wizard` route; `/onboarding` compatibility routing remains intact.
- Choose up to three priorities in order. Answer each lane question individually; back navigation retains answers. Deselecting a lane excludes its answers from the saved payload.
- Residence/citizenship and household/timing are two distinct handoff screens. Citizenship, household composition and financial figures are not guessed.
- Existing profile fields remain editable and are preserved. Optional financial details are not converted from broad budget choices.
- Setup saves through the existing same-origin, authenticated profile API to an additive `profiles.onboarding` JSONB column. Existing automatic table-initialization convention applies the column without destructive migration.
- Completion saves the user's selected destinations to the existing Command Center. New destinations receive both generic and answer-based research tasks in one transaction. Deterministic setup IDs support retry without duplicate destinations or tasks.
- Existing board progress is preserved. Removing a destination from onboarding never deletes an existing board.
- Priority links appear in the Command Center. Health/astrology answers do not invent medical, safety or visa conclusions, or silently change the existing ranking algorithm.
- The existing Energy Portal is loaded on demand as an optional step. Its existing birth details, Big Three, reading, reset and declaration experience is reused; a separate new birth-only country-line algorithm is not implemented here.
- Mobile navigation provides Home, Your World, My Plan (Command Center) and Menu, with safe-area spacing. Desktop navigation remains intact.

## Verification and release status

- TypeScript: PASS (`npx tsc --noEmit`).
- Next.js production build: PASS (`npm run build`).
- OpenNext Cloudflare Worker build: PASS (`npm run build:worker`).
- Five onboarding tests: PASS. Run with `node --import tsx --test tests/onboarding.test.ts` when tsx is installed in a test environment. Tests cover empty state, exclusive answers, lane removal, rejected malformed inputs and no budget-to-income inference.
- Diff whitespace check: PASS.
- ESLint: BLOCKED before analysis by existing TypeScript 7 / typescript-eslint incompatibility. Dependency versions were not changed.
- Visual browser and authenticated database walkthrough: NOT VERIFIED. Cloud Browser rejects localhost; the local Chromium download was unusable. No live account or production data was used for testing.
- SLD post-change check: BLOCK. `.sld/task-contract.json` still authorizes `demo-access-code`; it does not authorize the current onboarding/mobile files. `AGENTS.md` restricts edits under `.sld/` to SLD maintenance. The engine, contract and workflows are unchanged. This requires an owner-authorized contract update before release; do not bypass it.

## Remaining design-reference gaps

This implements the priority onboarding, shared mobile navigation and Command Center handoff. It does not claim to reproduce every screen in the broader mobile board: email verification, an additional chart-line skip algorithm, Reality Check and promotional screens were not built. Existing login/signup, country, calculator, checklist and dashboard feature implementations remain in place. The anonymous Match Quiz is not automatically copied into an account in this change.

## Before retiring the demo

1. Resolve the SLD contract for this task and the existing lint dependency mismatch.
2. Walk through a real test account on desktop and mobile; verify save/resume, failure/retry, each lane, destination creation, cross-account separation and navigation.
3. Deploy the reviewed production branch and confirm the correct Cloudflare Worker/domain.
4. Preserve any demo-only content and any wanted D1 records. Redirect demo visitors to the official app.
5. Archive `kolmari-demo`. Delete its deployment/database only under separate explicit authorization.
