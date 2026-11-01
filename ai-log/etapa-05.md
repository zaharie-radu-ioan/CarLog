# Stage 5: AI log

## Tools

- GitHub Copilot (Copilot Chat in VS Code)

## Conversations

- Copilot Chat in VS Code, no share link (local state, events and a light/dark theme for CarLog)

## Key requests

### 1. Mark as done and delete from the page

- Asked: to make each deadline toggleable and deletable from the list, with the list kept in `useState` in `App`.
- Got: `handleToggle` with `map` and `handleDelete` with `filter`, passed down as `onToggle` and `onDelete` through `ReminderList` to `ReminderCard`. The card has a checkbox wrapped in a label (a click anywhere on the card text toggles it) and a **Delete** button with `aria-label="Delete <title>"`.
- Changed or rejected: I kept the label around the whole card text instead of a small separate checkbox.

### 2. Counters that follow the list

- Asked: for the header to show how many items there are and how many are still active.
- Got: `active` computed with `filter` on every render, next to `reminders.length`, instead of a separate state variable.
- Changed or rejected: Copilot also changed `handleSubmit` to use `setReminders((prev) => ...)`, so the new id is computed from the latest list. I kept it.

### 3. Light and dark mode

- Asked: for a button in the header that switches between light and dark mode.
- Got: a `theme` state that starts from the system setting (`prefers-color-scheme`), a toggle that sets `data-theme` on `<html>`, and CSS where `:root[data-theme="dark"]` and `:root[data-theme="light"]` win over the system theme. The button shows a sun or a moon and has `aria-pressed` and `aria-label`.
- Changed or rejected: I kept the existing dark palette from the stage 1 CSS and reused it for `data-theme="dark"`.

## What I learned / what did not work

State must be updated with a new array and a new object (`map`, `filter`, spread), never with `push` or direct assignment, otherwise React does not see the change. A value that can be computed from the list, like the active count, should not be stored in state. The functional form `setX((prev) => ...)` always works on the latest value.
What did not work at first: with only the system media query, choosing light mode on a dark system did nothing, so the media query needed `:root:not([data-theme="light"])`. The theme and the changes to the list are still lost on refresh.