# Task Management Application — Business Analysis Requirements

**Document Date:** 07 September 2026
**Status:** Draft — Pending Stakeholder Review
**Version:** 1.0

---

## 1. Executive Summary

Individuals currently lack a structured, reliable mechanism to manage their personal tasks, leading to missed deadlines, duplicated effort, and cognitive overload. This document defines the requirements for a web-based Task Management Application that allows a single authenticated user to create, organise, prioritise, and track tasks (including sub-tasks) through to completion — delivering measurable improvements in personal productivity and task completion rates.

**Target release:** within 4 weeks of requirements sign-off.

---

## 2. Business Problem

Without a dedicated tool, individuals typically resort to fragmented methods — sticky notes, email inboxes used as to-do lists, spreadsheets, or memory. These approaches fail in three consistent ways:

- **Fragmentation:** Tasks live across multiple disconnected surfaces with no single source of truth.
- **No Priority Signal:** Ad-hoc lists treat all tasks equally, burying important items.
- **No Deadline Enforcement:** No mechanism reminds users of approaching deadlines; completed tasks leave no record.

---

## 3. Business Objective

Deliver a web-based personal task management application (desktop browser) that:

- Provides a **single place** to capture all tasks, eliminating fragmentation.
- Enables users to **prioritise and categorise** tasks to focus effort on what matters.
- Supports **sub-tasks** so complex tasks can be broken into trackable steps.
- Surfaces **deadline awareness** proactively via dashboard indicators and in-app notifications.
- Tracks task state through a defined **lifecycle** (Pending → In Progress → Done) to provide a measurable record of output.

### Success Metrics

| Metric | Target |
|---|---|
| Daily task completion rate | Increase by 25% within 30 days of adoption |
| Missed deadlines | Reduce to near zero for tasks entered in the system |
| Time to capture a basic task | Under 10 seconds |
| User session frequency | At least once daily active use |

---

## 4. Stakeholders

| Stakeholder | Role | Interest | Influence | Concerns |
|---|---|---|---|---|
| End User | Primary user | Manage personal tasks efficiently | High | Ease of use, speed, data safety |
| Product Owner | Defines scope and priorities | Product meets user needs within budget | High | Feature creep, 4-week timeline |
| Development Team | Builds and maintains the app | Clear, unambiguous requirements | Medium | Ambiguous scope, changing requirements |
| QA Team | Tests and validates | Testable acceptance criteria | Medium | Incomplete scenarios, edge cases |

---

## 5. Current State (AS-IS)

Users manage tasks through informal, fragmented methods:

1. Task thought of or received
2. Written on paper / email flagged / noted somewhere ad-hoc
3. Manually reviewed when remembered
4. Task worked on (if not forgotten)
5. Struck off or discarded — no record kept

There is no status tracking, no prioritisation, no sub-task breakdown, and no deadline notification. Completed tasks leave no audit trail.

---

## 6. Pain Points

- 🔴 **Tasks forgotten or lost** — relying on memory or physical notes that can be misplaced.
- 🔴 **No visibility of priorities** — urgent tasks are indistinguishable from low-importance ones.
- 🔴 **No deadline tracking** — no proactive alert when a deadline is near or missed.
- 🟠 **No progress record** — done tasks disappear with no way to reflect on output over time.
- 🟠 **Cognitive overhead** — mentally holding an unstructured list of open tasks reduces focus.
- 🟡 **No sub-task breakdown** — complex tasks cannot be split into manageable steps.
- 🟡 **No categorisation** — tasks from different areas are mixed, making context-switching harder.

---

## 7. Gap Analysis

| Gap | Current State | Required State | Business Impact |
|---|---|---|---|
| Task Capture & Storage | Ad-hoc, non-digital | Structured digital record with title, description, due date, priority, category | Tasks cannot be reliably retrieved without this |
| Priority & Status Lifecycle | None | Defined states (Pending / In Progress / Done / Cancelled) | Users cannot see what is active vs. completed |
| Sub-tasks | None | Child tasks under a parent, individually trackable | Complex tasks cannot be broken into steps |
| Deadline Awareness | None | Dashboard indicators + in-app notifications | Deadlines missed silently |
| Filtering & Search | None | Filter by status, priority, category, due date; full-text search | Finding a task in a long list is impractical |
| Completion History | None | Done tasks remain accessible with completion timestamp | Cannot reflect on or report on work completed |

---

## 8. Future State (TO-BE)

A user logs in and is presented with a dashboard showing all open tasks, sorted by priority and grouped by status. Tasks due today or overdue are visually highlighted. The user can:

- **Add a new task** (under 10 seconds for a minimal entry) with title, description, due date, priority, and category.
- **Break a task into sub-tasks**, tracking each child step independently.
- **Change a task's status** with a single interaction.
- **Filter and search** their task list by priority, status, category, or keyword.
- **Receive in-app notifications** when a deadline is within 24 hours.
- **Edit or delete** any task, with soft-delete and 30-day recovery.
- **Review a Completed view** showing all Done tasks with completion timestamps.

---

## 9. Requirements

### 9a. Business Requirements

| ID | Requirement | Priority |
|---|---|---|
| BR-01 | The application must provide a single, persistent store for all of a user's tasks, accessible via a desktop web browser after login. | Must Have |
| BR-02 | The application must allow users to prioritise tasks (High / Medium / Low) so that the most important work is always visible. | Must Have |
| BR-03 | The application must surface deadline information proactively so overdue and due-today tasks are visible without manual scanning. | Must Have |
| BR-04 | The application must allow tasks to be broken into sub-tasks, each with its own status, so complex work can be tracked at a step level. | Must Have |
| BR-05 | The application must track task completion, retaining a history of done tasks. | Should Have |
| BR-06 | The application should allow tasks to be grouped by category to support context separation. | Should Have |

### 9b. Functional Requirements

#### Task Management

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | The system shall allow a user to **create a task** with a title (required, max 200 chars), description (optional, max 2,000 chars), due date (optional), priority (High / Medium / Low, default Medium), and category (optional). | Must Have |
| FR-02 | The system shall allow a user to **add sub-tasks** to any task. Each sub-task has a title (required) and a Done / Not Done status. A parent task with all sub-tasks marked Done does not automatically change its own status. | Must Have |
| FR-03 | The system shall allow a user to **edit** any field of a task or sub-task at any time. | Must Have |
| FR-04 | The system shall allow a user to **delete a task**, moving it to a soft-deleted state. Deleted tasks remain recoverable for 30 days before permanent removal. Deleting a parent task deletes all its sub-tasks. | Must Have |
| FR-05 | The system shall allow a user to **change task status** between: Pending, In Progress, Done, Cancelled. The system records a timestamp when a task moves to Done. | Must Have |

#### Visibility & Organisation

| ID | Requirement | Priority |
|---|---|---|
| FR-06 | The system shall display a **dashboard** as the default view, showing all non-done, non-cancelled tasks ordered by: (1) overdue, (2) due today, (3) remaining — sub-sorted High → Medium → Low priority, then by due date ascending. | Must Have |
| FR-07 | The system shall visually distinguish **overdue tasks** (red indicator) and **due-today tasks** (amber indicator) on the task card without requiring the user to open the task. | Must Have |
| FR-08 | The system shall allow the user to **filter tasks** by status, priority, category, and due-date range. Filters are combinable with AND logic. | Must Have |
| FR-09 | The system shall provide **full-text search** across task titles and descriptions, returning results in real time as the user types. | Should Have |
| FR-10 | The system shall display a **Completed view** listing Done tasks with title, category, and completion date, ordered most-recently-completed first. | Should Have |

#### Categories

| ID | Requirement | Priority |
|---|---|---|
| FR-11 | The system shall allow the user to **create, rename, and delete custom categories**. Deleting a category must not delete associated tasks — those tasks become uncategorised. | Should Have |

#### Notifications

| ID | Requirement | Priority |
|---|---|---|
| FR-12 | The system shall display an **in-app notification** when a task's due date is within 24 hours and the task is not Done or Cancelled. The user can dismiss or snooze the notification. Configurable on/off per user. | Should Have |

#### Authentication

| ID | Requirement | Priority |
|---|---|---|
| FR-13 | The system shall require **user registration and login** (email + password) before accessing any task data. Sessions must expire after a configurable idle period. | Must Have |

### 9c. Non-Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| NFR-01 | **Performance:** Task creation, status update, and filter operations must complete and reflect in the UI within 500 ms under normal network conditions. | Must Have |
| NFR-02 | **Availability:** 99.5% uptime target. Planned maintenance must be communicated in advance. | Must Have |
| NFR-03 | **Security:** User data encrypted at rest. Sessions use secure, expiring tokens. One user's tasks must never be visible to another user. | Must Have |
| NFR-04 | **Usability:** A new user should be able to create and categorise their first task within 2 minutes of first login, with no onboarding guide. | Must Have |
| NFR-05 | **Platform:** Desktop web browser (Chrome, Firefox, Edge — latest two major versions). Mobile responsiveness is not required for v1. | Must Have |
| NFR-06 | **Scalability:** System must support up to 10,000 tasks per user without degradation in filter or search performance. | Should Have |
| NFR-07 | **Data retention:** Soft-deleted tasks purged automatically after 30 days. Done tasks retained indefinitely unless explicitly deleted by the user. | Must Have |

### 9d. Business Rules

| ID | Rule | Priority |
|---|---|---|
| BR-R1 | A task title is mandatory. A task cannot be saved without a title. Maximum title length: 200 characters. | Must Have |
| BR-R2 | A task's due date may not be set to a past date at time of **creation**. Editing an existing task's due date to a past date is permitted. | Must Have |
| BR-R3 | A task in Done or Cancelled status cannot be moved back to Pending or In Progress without explicit user confirmation (to prevent accidental state changes). | Should Have |
| BR-R4 | A task is overdue if its due date is before the current calendar date and its status is not Done or Cancelled. | Must Have |
| BR-R5 | Deleting a category requires user confirmation. Deletion removes the category label from all associated tasks; the tasks themselves are not deleted. | Should Have |
| BR-R6 | Default dashboard sort order: (1) overdue tasks first, (2) due-today tasks, (3) remaining — all sub-sorted High → Medium → Low priority, then by due date ascending. | Must Have |
| BR-R7 | A sub-task belongs to exactly one parent task and cannot be moved to a different parent. | Must Have |
| BR-R8 | Deleting a parent task deletes all of its sub-tasks. The user must be warned of this before confirming deletion. | Must Have |

---

## 10. User Stories

### US-01 — Create a Task

> As a user, I want to quickly create a task with a title and optional due date, so that I can capture what needs to be done before I forget it.

**Priority:** Must Have

**Acceptance Criteria:**

```
GIVEN I am on the dashboard
WHEN I click "Add Task", enter a title, and submit
THEN the task appears in my task list with status Pending and default priority Medium

GIVEN I attempt to submit a task with no title
WHEN I click submit
THEN the system shows an inline validation error and does not save the task

GIVEN I add a task title and optional due date
WHEN I submit
THEN the task is saved and visible in under 500ms without refreshing the page
```

---

### US-02 — Add Sub-tasks

> As a user, I want to break a task into sub-tasks, so that I can track the individual steps needed to complete complex work.

**Priority:** Must Have

**Acceptance Criteria:**

```
GIVEN I open an existing task
WHEN I click "Add sub-task" and enter a title
THEN the sub-task appears under the parent task with a Not Done status

GIVEN a task has sub-tasks
WHEN I view the task on the dashboard
THEN I can see a count of sub-tasks (e.g. "2 / 5 done") without opening the task

GIVEN I mark all sub-tasks as Done
WHEN the last sub-task is checked
THEN the parent task status does NOT automatically change — the user must update it manually
```

---

### US-03 — Mark a Task as Done

> As a user, I want to mark a task as Done, so that I can track my progress and keep my active list clear.

**Priority:** Must Have

**Acceptance Criteria:**

```
GIVEN a task exists with status Pending or In Progress
WHEN I mark it as Done
THEN the task is removed from the active dashboard and moved to the Completed view, with a completion timestamp recorded

GIVEN a task is marked Done
WHEN I view the Completed list
THEN the task appears with its title, category (if any), and the date and time it was completed
```

---

### US-04 — Deadline Visibility

> As a user, I want overdue tasks highlighted on my dashboard, so that I can immediately see what has passed its deadline.

**Priority:** Must Have

**Acceptance Criteria:**

```
GIVEN a task's due date is before today and the task is not Done or Cancelled
WHEN the dashboard loads
THEN the task displays a red overdue indicator and appears at the top of the list, above non-overdue tasks

GIVEN a task's due date is today
WHEN the dashboard loads
THEN the task displays an amber "due today" indicator
```

---

### US-05 — Filter Tasks

> As a user, I want to filter my task list by priority, status, and category, so that I can focus on what is relevant to my current context.

**Priority:** Must Have

**Acceptance Criteria:**

```
GIVEN I select "High Priority" as a filter
WHEN the filter is applied
THEN only tasks with priority High are shown

GIVEN I combine a Priority filter with a Category filter
WHEN both filters are active
THEN only tasks matching both criteria are shown (AND logic)

GIVEN active filters return zero results
WHEN the list renders
THEN an empty state message is shown explaining no tasks match, with a one-click option to clear all filters
```

---

### US-06 — Delete with Recovery

> As a user, I want to delete a task with the ability to undo, so that I can remove tasks without risk of permanent, accidental loss.

**Priority:** Must Have

**Acceptance Criteria:**

```
GIVEN I delete a task
WHEN the deletion is confirmed
THEN the task is removed from all active views and a toast with an Undo option appears for at least 5 seconds

GIVEN a task was deleted within the last 30 days
WHEN I access the Trash view and click Restore
THEN the task (and its sub-tasks) are restored to their previous status and category

GIVEN I delete a task with sub-tasks
WHEN I click delete
THEN the system warns me that all sub-tasks will also be deleted before I confirm
```

---

### US-07 — In-App Deadline Notification

> As a user, I want an in-app notification when a task is due within 24 hours, so that I am alerted before missing the deadline.

**Priority:** Should Have

**Acceptance Criteria:**

```
GIVEN a task's due date is within 24 hours and the task is not Done or Cancelled
WHEN I am using the application
THEN an in-app notification appears identifying the task and its due date/time

GIVEN I receive a deadline notification
WHEN I dismiss it
THEN it does not reappear for the same task during that session

GIVEN I have turned off notifications in settings
WHEN a task becomes due within 24 hours
THEN no notification is shown
```

---

## 11. Assumptions

| ID | Assumption |
|---|---|
| A1 | Single-user application. Multi-user collaboration (task assignment, shared lists) is out of scope for v1. |
| A2 | Authentication is email + password for v1. OAuth (Google/Microsoft) is a v2 consideration. |
| A3 | Desktop web browser only (Chrome, Firefox, Edge). Mobile responsiveness is not required for v1. |
| A4 | No existing system to migrate data from. This is a greenfield implementation. |
| A5 | Priority levels are fixed as High, Medium, Low. Custom priority scales are not in scope. |
| A6 | In-app notifications are browser-based. Email notifications are not in scope for v1. |
| A7 | A sub-task has a title and a binary Done / Not Done status only. Sub-tasks do not have their own due dates, priorities, or sub-tasks. |

---

## 12. Dependencies

- Authentication service (email/password) must be in place before any task data can be accessed.
- In-app notification (FR-12) depends on browser Notifications API support — user must grant permission.
- Sub-task completion count display (US-02) depends on FR-02 being delivered first.

---

## 13. Risks

| Risk | Probability | Impact | Severity | Mitigation |
|---|---|---|---|---|
| 4-week timeline insufficient for sub-tasks + notifications | High | High | Critical | Confirm sub-tasks and notifications as Should Have (not Must Have) so they can be deferred to v1.1 if needed — **awaiting Product Owner decision** |
| Scope creep post sign-off | High | High | Critical | Lock scope via signed-off requirements doc; all additions go through change control |
| Poor adoption due to overly complex UI | Medium | High | High | Usability testing with 3–5 users before release; enforce 2-minute first-task NFR |
| Data loss due to missing soft-delete or backup | Low | High | High | Enforce FR-04 (soft-delete) and daily database backup |
| Security breach exposing task data | Low | High | High | Enforce NFR-03; pre-launch security review; encrypt at rest and in transit |

---

## 14. Edge Cases

- **Task with no due date:** Must not appear in overdue or due-today groupings regardless of creation date.
- **Duplicate task titles:** Allowed — duplicates are valid (same name, different task). No deduplication logic.
- **All sub-tasks done, parent not done:** Parent remains in its current status. No auto-promotion.
- **Deleting a parent task:** System warns user that all sub-tasks will also be deleted before confirming.
- **Empty task list:** Dashboard shows a helpful empty state with a prompt to create the first task.
- **Filters return zero results:** Distinguish "no matching tasks" from "no tasks at all"; offer one-click clear filters.
- **Network loss during task save:** Show clear error, retain form data, allow retry without re-entry.
- **Very long title:** Enforce 200-character cap with a live character counter visible during input.
- **Editing a Done task's due date:** Permitted to correct historical data. Task must not re-enter the active dashboard.
- **Category deleted while tasks are assigned:** Tasks become uncategorised; they are not deleted.
- **Concurrent sessions (same user, two browser tabs):** Changes in one tab should reflect in the other within 30 seconds or on tab focus.

---

## 15. Open Questions

| ID | Question | Owner |
|---|---|---|
| OQ-01 | **Sub-tasks and in-app notifications — Must Have or Should Have for the 4-week release?** This is the most critical scoping decision given the tight timeline. | Product Owner |
| OQ-02 | What is the maximum number of sub-tasks allowed per parent task? Is there a practical cap? | Product Owner |
| OQ-03 | What is the maximum number of categories a user can create? Unlimited, or capped? | Product Owner |
| OQ-04 | Should there be a data export feature (e.g. CSV of completed tasks)? Not currently scoped. | Product Owner |
| OQ-05 | Are there any default categories pre-populated on account creation, or does the user start with a blank list? | Product Owner |
| OQ-06 | What is the session idle-timeout duration for authentication (FR-13)? | Product Owner / Security |

---

## 16. Next Steps

1. **Resolve OQ-01 immediately** — the Must Have vs Should Have decision for sub-tasks and notifications determines whether the 4-week timeline is achievable.
2. **Stakeholder sign-off** — circulate this document for review with a 3-working-day turnaround given the tight timeline.
3. **Close remaining open questions** (OQ-02 through OQ-06) in a focused 30-minute call.
4. **UX wireframing** — dashboard, task creation form (with sub-task section), filter panel, and completed view.
5. **Technical architecture review** — confirm data model for parent/sub-task relationship and authentication stack.
6. **Sprint planning** — estimate Must Have requirements and confirm what fits in 4 weeks.
7. **QA test case development** — derive test cases from acceptance criteria in Section 10, covering edge cases from Section 14.
