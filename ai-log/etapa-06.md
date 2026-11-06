# Stage 6: AI log

## Tools

- Claude (claude.ai)

## Conversations

- Claude

## Key requests


### 1. Loading, error and success states

- Asked: how to handle the three states from the guide.
- Got: `api.js` with a shared `getJson` that checks `res.ok`, plus `fetchCars` and `fetchReminders`. In `App`, a `useEffect` loads both lists with `Promise.all`, with `try / catch / finally` and the `ignore` cleanup.
- Changed or rejected: I added a **Try again** button to the error message. Because of it, the effect depends on `reloadKey` instead of `[]`. It still runs once on mount, and again only when the button is pressed.

### 2. Making the list useful

- Asked: for features that make sense for a car owner, without going past this stage.
- Got: sorting by urgency, three counters (overdue, due in 30 days, up to date) that filter the list, a garage row with each car and its next deadline that filters by car, and notes on service items. The date helpers moved to `src/utils/dates.js` so all components use the same code.
- Changed or rejected: I asked whether each component should have its own CSS file. I kept all the styles in `App.css`, as the guide asks, because plain CSS imports are global anyway. Adding, checking and deleting stay local until stage 7.

### 3. Blank page after the changes

- Asked: why the page was completely white.
- Got: the console error `Importing binding name 'status' is not found` meant `utils/dates.js` was incomplete and did not export `status`.
- Changed or rejected: I replaced the file with the complete version, and the page loaded.

## What I learned / what did not work

`fetch` only fails when it cannot reach the server; a 404 or a 500 still "succeeds", so `res.ok` has to be checked by hand. The function given to `useEffect` cannot be `async`, so the async work goes in an inner `load` function. In development React mounts the component twice on purpose, so the Network tab shows two requests per route, and the `ignore` flag stops the first one from setting state.
What did not work at first: a white page with no message. An error while React renders stops the whole page, and the browser console (F12) was the only place that showed which import was missing.