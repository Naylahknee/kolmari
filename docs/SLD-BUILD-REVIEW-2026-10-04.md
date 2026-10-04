# SLD build review — 2026-10-04

The current main revision is `046cced966f89131e06a427d481bef91e09e3827`. Its active TaskContract still names only the earlier brand icon repair. Engine changes outside that contract correctly fail scope verification; successful deployment is separate from governance approval.

The current owner request to fix projects authorizes this narrow maintenance task. Contract `sld-039-governance-build-review` covers the active contract, the unchanged archive of the icon contract, this record, and the workflow report-output paths. The approval timestamp records the current instruction, not an earlier engine approval. This maintenance does not retroactively authorize the engine changes or erase the historical failed check.

No application code, engine logic, scope rules, manifest, baseline, dependencies, or design was changed. The next implementation task must replace the active contract with its actual authorized scope before editing files. A separate owner-reviewed engine contract and comparison against the pre-engine revision are needed to resolve historical authorization of `046cced`.

CI identified a separate workflow defect: redirecting the report to the repository root creates an untracked file before the scanner runs, so the output itself is blocked as unauthorized. Both report and comment artifacts now use `RUNNER_TEMP`, outside the scanned worktree. Scope verification, change analysis, failure handling and all engine policies remain unchanged.

Validation: 72 existing SLD tests passed. Post-change scope verification is run against this maintenance diff; archive content is compared byte-for-byte with the original active contract. Application builds were not rerun because this repair changes only governance input and documentation.
