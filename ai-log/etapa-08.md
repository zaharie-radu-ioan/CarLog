# Stage 8: AI log

## Tools

- Claude (claude.ai)

## Conversations

- Claude

## Key requests

### 1. Splitting the app into pages

- Asked: how to adapt the stage 8 guide (React Router, list page, detail page, about page, 404) to CarLog.
- Got: `main.jsx` wrapped in `BrowserRouter`, `App.jsx` reduced to the route map, the stage 7 logic moved unchanged into `pages/RemindersPage.jsx`, a `Layout` component with the header, the theme switch and the bottom bar, and `AboutPage` and `NotFoundPage`. The detail route is `/reminders/:id`, because `resource` in `tw.json` is `reminders`.
- Changed or rejected: I kept the navigation in the bottom bar, like in a mobile app, instead of moving it into the header as in the guide. The "Add" link from the bottom bar was removed, because it was an anchor (`#add`) and would not work well with the router; the form is still the first thing on the main page. The counter moved from the header into the list section, since the header is now the same on every page.

### 2. The detail page

- Asked: what the detail page should show so it is more than the card, and how to load one deadline.
- Got: `fetchReminder(id)` and `fetchCar(id)` in `api.js`. The page reads the id with `useParams`, loads the deadline and then its car, and shows the title, type, days left, status, expiry date, the car with plate, year, fuel and mileage, the notes and the id, in a `dl` list. The effect depends on `[id]`, so it runs again when the address changes. For `/reminders/999` it shows an error with a link back to the list.
- Changed or rejected: I did not add `setLoading(true)` at the start of the effect, as the guide explains, because `npm run lint` reports it (`react-hooks/set-state-in-effect`) and the state already starts with `loading = true`.

### 3. Moving the styles to CSS Modules

- Asked: how to split my big `App.css` (over 1000 lines, with sections added in every stage) into module files.
- Got: `App.css` renamed to `index.css`, keeping only the variables, the themes, `body` and the shared classes; one `.module.css` next to every component and page, with shorter class names (`styles.card`, `styles.title`, `styles.daysNumber`). The card status class comes from the data: `styles[status(reminder)]`. The duplicated rules from older stages (the header grid written twice, the focus rules repeated in three places) were merged into one.
- Changed or rejected: nothing.

## What I learned / what did not work

`<Link>` changes only the address and React draws the matching page, so the Network tab shows only the fetch requests to the API, no new HTML document. `NavLink` needs `end` on the link to `/`, otherwise it stays active on every page, since every address starts with `/`. `useParams` gives the id as text, but json-server accepts it in the URL as it is.
What did not work at first: the card title was inside a `<label>` with the checkbox, so a click on the title would also toggle the deadline; the label became a `div` and the checkbox got an `aria-label`. In a module, a global class such as `.badge` has to be written as `:global(.badge)`, otherwise the rule gets a generated name and does not apply. The loading spinner was on `.info`, so it also appeared on the 404 text; it now sits on `[data-testid="loading"]` only.