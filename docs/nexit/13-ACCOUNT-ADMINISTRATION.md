# Nexit Account Administration

## Purpose

This document defines the approved behavior for:

- user account controls
- privacy settings
- account deletion
- data export
- session management
- administrator access
- role-based permissions
- account suspension
- audit records
- administrative support workflows

These functions must be implemented with deterministic application logic.

AI may assist with explanation, categorization, and drafting, but AI must not independently perform sensitive account actions.

---

# Core Principle

Account and administrative actions must be:

- secure
- explicit
- reversible where appropriate
- auditable
- limited by role
- understandable to the affected user
- handled by server-side authorization
- based on actual account state

Do not rely only on hidden navigation or client-side checks to protect administrative features.

---

# System Separation

Nexit requires two separate systems:

1. User Account Controls
2. Internal Administration Dashboard

They may share underlying services, but they must not share the same interface or permission model.

---

# Part 1: User Account Controls

## Primary Location

User account controls should be available under:

```text
Settings
└── Privacy & Account
```

The approved initial controls are:

```text
Privacy & Account
├── Download My Data
├── Change Email
├── Change Password
├── Sign Out of All Devices
└── Delete My Account
```

Do not place sensitive account actions inside general profile-editing forms.

---

# Privacy & Account Page

## Purpose

The Privacy & Account page should help users understand and control:

- their account credentials
- active sessions
- stored account data
- data export
- account deletion

The page must clearly distinguish between:

- updating profile information
- changing authentication information
- exporting data
- permanently deleting an account

---

## Page Sections

Recommended structure:

```text
Privacy & Account

Account Information
- Email address
- Password
- Account status

Security
- Active sessions
- Sign out of all devices

Your Data
- Download my data
- Data retention summary

Danger Zone
- Delete my account
```

The Delete My Account control must appear in a clearly separated danger zone.

---

# Change Email

## Requirements

Changing an email address should:

1. Require an authenticated user.
2. Require recent authentication when supported.
3. Validate the new email address.
4. Prevent duplicate account emails.
5. Verify the new email before fully replacing the old one when feasible.
6. Notify the old email address that a change was requested.
7. Revoke or review existing sessions when appropriate.
8. Record the change in an audit log.

Do not change the email address based only on client-side state.

---

# Change Password

## Requirements

Changing a password should:

1. Require an authenticated user.
2. Require the current password or another recent-authentication method.
3. Enforce the existing password requirements.
4. Store only a secure password hash.
5. Revoke other active sessions when appropriate.
6. Notify the account email that the password changed.
7. Record the event in an audit log.

Never store, display, log, or email a plaintext password.

---

# Sign Out of All Devices

## Requirements

This action should:

1. Require authentication.
2. Revoke active sessions and refresh tokens.
3. Preserve only the current session when explicitly approved, or sign out every session including the current one.
4. Clearly tell the user what will happen before confirmation.
5. Show an accurate completion message.
6. Record the action in an audit log.

Recommended confirmation text:

```text
This will sign your account out on every device. You will need to sign in again.
```

---

# Download My Data

## Purpose

Users should be able to request a copy of account-related data associated with their Nexit account.

The first version may create an asynchronous export request instead of generating the file immediately.

## Possible Export Contents

Depending on what exists in the application, the export may include:

- account profile
- household information
- saved Nextinations
- mini-experience or quiz responses
- pathway research
- Nexit Plans
- plan tasks
- budgets
- timelines
- notification settings
- uploaded-document metadata
- community contributions
- account activity records appropriate for user disclosure

Do not include:

- password hashes
- secret tokens
- internal security notes
- information belonging to other users
- unrestricted administrator audit data
- private system credentials

## Export Flow

```text
Request Data Export
→ confirm request
→ create export job
→ prepare export
→ notify user when ready
→ provide time-limited secure download
→ expire download
```

The export should use a documented structured format such as JSON, with optional human-readable files where useful.

---

# Delete My Account

## Purpose

Account deletion must be a deliberate, protected process.

It must not be a single-click action.

## Recommended User Flow

```text
Delete My Account
→ explain what will be deleted
→ explain what may be anonymized or temporarily retained
→ require recent authentication
→ require explicit confirmation
→ create deletion request
→ revoke sessions
→ delete or anonymize account data
→ complete related file deletion
→ send confirmation
```

## Confirmation

Require the user to type:

```text
DELETE MY NEXIT ACCOUNT
```

The confirmation text must match exactly before the final action becomes available.

A checkbox alone is not sufficient for the final destructive action.

---

## Deletion Explanation

Before confirmation, explain:

- that the action is permanent
- which Nexit data will be deleted
- whether uploaded files will be deleted
- whether community contributions will be deleted or anonymized
- whether some minimal records may be retained for documented legal, fraud-prevention, security, or accounting reasons
- how long processing may take
- whether the user can cancel before processing begins

Do not promise immediate destruction of every record unless the actual system guarantees it.

The final retention policy should be reviewed for legal and operational accuracy before launch.

---

# Deletion Request Route

Prefer a reviewable request workflow for the first version.

Recommended protected route:

```text
POST /api/account/deletion-request
```

Possible later route for immediate self-service deletion:

```text
DELETE /api/account
```

Do not permit account deletion through an unprotected client-side function.

---

# Deletion Request Status

Recommended statuses:

```ts
type AccountDeletionStatus =
  | "requested"
  | "verified"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled"
```

The user should see an accurate status when the workflow is not immediate.

---

# Data Deletion Inventory

The deletion service must identify all user-linked data before deleting the account.

Potential data includes:

- user account
- profile
- household members
- saved Nextinations
- mini-experience answers
- quiz responses
- pathway results
- country comparisons
- Nexit Plans
- plan tasks
- budgets
- uploaded documents
- generated files
- community posts
- community reviews
- notification preferences
- session tokens
- refresh tokens
- API tokens associated with the user
- externally stored files
- analytics identifiers tied directly to the account

Do not delete only the primary user record while leaving identifiable related data behind.

---

# Delete, Anonymize, or Retain

Every user-linked data category should be assigned one approved treatment:

```text
Delete
Anonymize
Retain temporarily for a documented reason
```

## Delete

Use when the record is no longer required and can be safely removed.

Examples may include:

- profile details
- saved Nextinations
- private plans
- private tasks
- personal preferences
- uploaded personal documents

## Anonymize

Use when content may remain useful but should no longer identify the user.

Examples may include:

- community posts
- public reviews
- aggregated research feedback

Anonymization must remove direct and reasonably linkable identifiers.

## Retain Temporarily

Use only when a documented reason exists, such as:

- security investigations
- fraud prevention
- legal obligations
- financial recordkeeping
- dispute handling
- enforcing prior account restrictions

Retention periods must be documented.

Do not retain data indefinitely without a defined reason.

---

# Uploaded Documents

Uploaded documents require special handling.

The deletion workflow must identify:

- database records
- object-storage files
- generated previews
- extracted text
- thumbnails
- cached copies
- processing-job artifacts

Deleting only the database reference is not sufficient if the file still exists in storage.

---

# Account Deletion Audit Record

Keep a minimal operational record of the deletion process.

Recommended shape:

```ts
type AccountDeletionAudit = {
  requestId: string
  userReferenceHash: string
  requestedAt: Date
  verifiedAt: Date | null
  processingStartedAt: Date | null
  completedAt: Date | null
  status:
    | "requested"
    | "verified"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
  failureCode?: string
}
```

The audit record must not preserve the deleted user's full profile.

Do not store:

- full name
- full email address
- uploaded-document contents
- quiz answers
- passwords
- authentication tokens

unless a separately documented requirement makes it necessary.

---

# Deletion Failure Handling

If deletion fails:

- do not claim the account was deleted
- record the failure
- prevent partial state from being presented as complete
- retry safely when appropriate
- alert an authorized administrator
- provide the user with a truthful status
- avoid exposing internal stack traces

Partial deletion must be tracked and resolved.

---

# Account Deletion Confirmation

After successful completion:

- revoke all sessions
- prevent future login
- send a confirmation when an appropriate verified contact method still exists
- remove access to private account content
- show a neutral completed state

Do not send detailed private data in the confirmation message.

---

# Part 2: Internal Administration Dashboard

## Primary Route

Create a protected administrative route:

```text
/admin
```

The route must require:

- authentication
- an approved administrative role
- server-side authorization

Do not rely only on hiding the navigation link.

---

# Initial Admin Scope

Version one should be limited to:

- find users by email or user ID
- view account status
- view signup date
- view last-login date when available
- view role
- suspend an account
- reactivate an account
- review account-deletion requests
- review deletion status
- retry failed deletion jobs when safe
- confirm deletion completion
- view relevant audit records
- review reported community content
- manage country-content publication status
- review failed background jobs

Do not begin with dozens of administrative controls.

---

# Administrative Roles

Use explicit role values.

Recommended initial roles:

```text
user
support
content_admin
admin
owner
```

Each role must have a documented permission set.

Do not infer permissions from job titles or email domains.

---

# Recommended Permission Model

## User

May:

- manage their own profile
- manage their own saved data
- request their own data export
- request deletion of their own account

May not:

- access `/admin`
- inspect other accounts
- change roles
- perform administrative actions

---

## Support

May:

- search for an account
- view limited account status
- view support-relevant metadata
- view deletion-request status
- add internal support notes where approved

May not:

- delete accounts
- change roles
- access private uploaded documents
- view password hashes
- alter authentication records
- impersonate users
- publish country content

---

## Content Admin

May:

- manage country-content publication status
- review content drafts
- manage approved resource information
- review reported community content
- moderate content according to policy

May not automatically:

- delete accounts
- change account roles
- inspect private plans
- access private documents
- modify authentication

---

## Admin

May:

- suspend accounts
- reactivate accounts
- review deletion requests
- manage approved administrative workflows
- review operational audit records
- review failed processing jobs

Sensitive actions should require explicit confirmation.

---

## Owner

May:

- manage administrator roles
- configure high-level administrative permissions
- approve sensitive operational actions
- access owner-only system controls

Owner access must still be logged and protected.

---

# Permission Matrix

Maintain a permission matrix in code or configuration.

Example:

```ts
type Permission =
  | "users.read_limited"
  | "users.suspend"
  | "users.reactivate"
  | "users.roles.manage"
  | "deletion_requests.read"
  | "deletion_requests.process"
  | "exports.read"
  | "content.review"
  | "content.publish"
  | "reports.review"
  | "audit.read"
  | "jobs.retry"
```

Check permissions on the server for every protected action.

Do not rely only on a broad condition such as:

```ts
user.role === "admin"
```

when a more precise permission is available.

---

# User Search

Administrative user search may support:

- exact email
- user ID
- account status
- deletion-request ID

Search results should show only the minimum information needed.

Do not expose:

- passwords
- password hashes
- secret tokens
- full private plans
- uploaded document contents
- private household details

without a separately approved operational requirement.

---

# Account Status

Recommended account statuses:

```ts
type AccountStatus =
  | "active"
  | "suspended"
  | "deletion_requested"
  | "deletion_processing"
  | "deleted"
```

Do not represent deleted accounts as active.

---

# Suspension

## Purpose

Suspension temporarily prevents account access without deleting account data.

## Suspension Flow

```text
Find account
→ review status
→ select Suspend
→ enter reason
→ confirm action
→ revoke sessions
→ update account status
→ record audit event
```

Suspension should:

- require an authorized role
- require a reason
- revoke active sessions
- prevent new authentication
- preserve account data
- record who performed the action
- record when it occurred

Do not silently suspend users through an AI recommendation.

---

# Reactivation

Reactivation should:

- require an authorized role
- require review of the suspension reason
- restore login only when appropriate
- record who reactivated the account
- record when it occurred
- avoid restoring deleted data

A deleted account cannot be reactivated unless a separately designed recovery system exists.

---

# Account Impersonation

Do not implement account impersonation in the first version.

Impersonation creates significant privacy and security risks.

Support staff should not be able to enter a user's private account view as though they were that user.

Use support-safe diagnostics instead.

---

# Administrative Audit Log

Sensitive actions must generate audit records.

Audit events may include:

- account suspended
- account reactivated
- deletion request reviewed
- deletion processing started
- deletion processing completed
- failed deletion retried
- role changed
- content published
- content unpublished
- report resolved
- export job reviewed
- background job retried

Recommended shape:

```ts
type AdminAuditEvent = {
  id: string
  actorUserId: string
  action: string
  targetType: string
  targetId: string
  reason?: string
  metadata?: Record<string, string | number | boolean | null>
  createdAt: Date
}
```

Do not place passwords, tokens, document contents, or unnecessary personal data inside audit metadata.

---

# Administrative Confirmation

High-impact actions should require a confirmation step.

Examples:

- suspend account
- reactivate account
- process deletion
- retry destructive job
- change role
- publish or unpublish critical content

Confirmation text must identify:

- the action
- the target
- the consequence

Avoid generic confirmations such as:

```text
Are you sure?
```

Prefer:

```text
Suspend this account and revoke all active sessions?
```

---

# Internal Notes

If internal administrative notes are implemented:

- separate them from user-visible content
- restrict them by role
- log edits
- avoid unsupported personal judgments
- avoid storing sensitive data unnecessarily
- never expose them in a user data export unless required by approved policy

---

# Background Jobs

Long-running operations may use background jobs.

Examples:

- data export generation
- deletion processing
- external file removal
- anonymization
- email confirmation
- cleanup of sessions and tokens

Recommended job statuses:

```text
queued
processing
completed
failed
cancelled
```

Administrative users should only retry jobs when the operation is idempotent or otherwise safe.

---

# Notifications

Users should receive accurate notifications for:

- email changes
- password changes
- sign-out-all-devices actions
- export readiness
- deletion requests
- deletion completion
- account suspension when appropriate
- account reactivation when appropriate

Do not include sensitive account data in notification messages.

---

# Security Requirements

Administrative and account functions must include:

- server-side authorization
- authenticated requests
- CSRF protection where applicable
- recent-authentication checks for sensitive user actions
- secure session revocation
- rate limiting for sensitive routes
- input validation
- structured error handling
- audit logging
- protection against user enumeration
- protection against privilege escalation
- least-privilege access

Never trust a role or user ID supplied only by the client.

---

# Data Visibility Rules

Administrative interfaces should display the minimum data required for the task.

Support and content staff should not automatically see:

- private uploaded documents
- household member details
- private budgets
- detailed Nexit Plans
- sensitive profile answers
- authentication secrets

Access to sensitive data must have a documented reason and permission.

---

# AI-Assisted Administration

AI may assist with:

- summarizing support requests
- categorizing issues
- drafting responses
- explaining administrative procedures
- identifying relevant documentation
- summarizing non-sensitive audit events
- suggesting which approved workflow may apply

AI must not:

- approve account deletion
- independently delete an account
- suspend or reactivate accounts
- change roles
- access private documents without an approved purpose
- make retention decisions
- override authorization
- bypass confirmation
- mark an incomplete deletion as complete
- impersonate a user
- make final moderation decisions without approved policy and human review

The approved model is:

```text
AI recommends or explains
→ deterministic code validates
→ authorized user confirms
→ server performs the action
→ audit log records it
```

---

# Error Handling

Administrative errors must:

- explain what failed
- avoid revealing sensitive infrastructure details
- preserve accurate status
- avoid partial success claims
- create an operational record when appropriate
- offer a safe retry when available

Do not expose raw database errors, tokens, stack traces, or private record contents to users.

---

# Accessibility

User and administrative interfaces must support:

- keyboard navigation
- visible focus
- semantic forms
- clear labels
- understandable confirmation text
- screen-reader announcements for status changes
- sufficient contrast
- large enough touch targets
- error messages connected to relevant fields

Destructive actions must not rely only on color.

---

# Responsive Behavior

## User Account Controls

Must work on:

- desktop
- tablet
- mobile

The danger zone must remain clearly separated on small screens.

## Internal Admin Dashboard

The first version should prioritize desktop use but remain readable on tablet.

Large tables should adapt through:

- reduced columns
- detail drawers
- responsive rows
- focused record pages

Do not compress every administrative field into an unreadable mobile table.

---

# Prohibited Patterns

Do not implement:

- one-click permanent deletion
- AI-controlled deletion
- client-only authorization
- hidden admin routes without server protection
- plaintext passwords
- exposed password hashes
- unrestricted account impersonation
- irreversible actions without confirmation
- broad admin access for support roles
- silent role changes
- deletion of only the primary user row
- deletion claims before storage cleanup completes
- indefinite retention without a documented reason
- fabricated audit completion
- fake account statuses

---

# Recommended Implementation Phases

## Phase 1: User Privacy & Account Page

Implement:

- account information display
- change email entry point
- change password entry point
- sign out of all devices
- delete-account explanation
- deletion-request submission

Do not build the full admin dashboard in this phase.

---

## Phase 2: Deletion Processing

Implement:

- deletion request records
- recent-authentication requirement
- typed confirmation
- session revocation
- related-data inventory
- deletion and anonymization service
- external-file cleanup
- minimal deletion audit record
- completion and failure statuses

---

## Phase 3: Role-Based Authorization

Implement:

- role storage
- explicit permissions
- protected `/admin` route
- server-side permission checks
- audit logging

---

## Phase 4: Initial Admin Dashboard

Implement:

- user search
- account-status view
- suspend
- reactivate
- deletion-request review
- failed-job review
- relevant audit events

---

## Phase 5: Data Export

Implement:

- export requests
- export jobs
- secure download
- expiration
- completion notifications

---

## Phase 6: Content Administration

Implement where needed:

- reported content review
- community moderation
- country-content publication status
- source-review workflows

---

## Phase 7: AI-Assisted Support

Only after the deterministic administrative system is working, consider:

- support-request summaries
- suggested response drafts
- workflow recommendations
- administrative knowledge retrieval

AI must remain advisory.

---

# Validation

Before account administration is considered complete, verify:

- users can access only their own account controls
- admin routes reject unauthorized users
- role checks occur on the server
- deletion requires explicit confirmation
- recent authentication is enforced where required
- all sessions are revoked when expected
- linked data is deleted or anonymized according to policy
- uploaded files are removed from storage
- deletion failures remain visible
- audit records are created
- audit records do not contain prohibited sensitive data
- support users cannot delete accounts
- content administrators cannot change roles
- deleted users cannot sign in
- suspended users cannot sign in
- reactivated users can sign in when permitted
- data exports exclude secrets
- no private user data is exposed across accounts
- TypeScript validation passes
- linting passes
- production build passes
- Cloudflare compatibility is preserved

---

# Documentation Rule

Before implementing account or administrative functions:

1. Read `/AGENTS.md`.
2. Read `/DESIGN.md`.
3. Read this file.
4. Inspect the current authentication and database implementation.
5. Identify all user-linked data.
6. Document the intended permission model.
7. Implement one phase at a time.
8. Test unauthorized access.
9. Test failure and partial-completion states.
10. Update `/docs/nexit/CURRENT-STATE.md`.

Do not implement sensitive administrative actions based only on assumptions about the existing authentication or database structure.
