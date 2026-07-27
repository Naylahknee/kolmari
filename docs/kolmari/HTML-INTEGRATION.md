# HTML Design Integration

## Purpose

Use owner-approved HTML builds as high-fidelity design references for the existing Next.js application.

## Integration method

1. Keep HTML references outside production routes.
2. Extract shared design tokens and layout patterns before migrating individual pages.
3. Convert markup to typed React and TypeScript components.
4. Replace hardcoded mock values with real data, honest empty states, or unavailable states.
5. Reuse the protected app shell, authentication, server queries, APIs, and route protection.
6. Keep interactive behavior in the smallest necessary client components.
7. Verify accessibility, responsive behavior, and Cloudflare compatibility.

## Prohibited approaches

- Do not serve static HTML as production pages.
- Do not use iframes for application pages.
- Do not duplicate the sidebar and top bar in every page.
- Do not copy inline JavaScript into React.
- Do not replace backend behavior with visual mock behavior.
- Do not leave fabricated user, score, destination, budget, or completion data in production.

## Page migration record

Each migrated page must document:

- HTML reference file
- existing route
- existing implementation
- logic and data preserved
- presentation replaced
- new components introduced
- user actions connected
- responsive and accessibility checks
- build and test results
