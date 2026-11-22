# CarLog

CarLog keeps track of the deadlines and services of your cars: ITP, RCA insurance, road tax and service work.
It is made for car owners who want one list that shows what expires next and what is already done.

## Data model

| Field    | Type         | Notes                                    |
| -------- | ------------ | ---------------------------------------- |
| title    | text         | required, max 100 chars                  |
| done     | boolean      | toggled from the list, default false     |
| expires  | date         | required, the day the deadline expires   |
| type     | fixed values | itp, rca, rovinieta, revizie             |
| carId    | relation     | id of a car from `cars` (Dacia Logan, Volkswagen Golf) |
| notes    | text         | optional, what was done or what to check |
| user     | relation     | the owner of the item (from week 11)     |

Sample data used across all stages:

1. ITP Dacia Logan, active, itp
2. RCA Dacia Logan, done, rca
3. Rovinietă Dacia Logan, active, rovinieta

Since stage 6 the data lives in `frontend/db.json`: 2 cars and 8 deadlines
(overdue, due soon, ok and done, for every type).

## How to run

```
cd frontend
npm install
npm run api   # terminal 1, http://localhost:3001
npm run dev   # terminal 2, http://localhost:5173
```

Then open the address printed in the terminal (http://localhost:5173).
Pages: `/` (deadlines), `/reminders/:id` (one deadline), `/about`; any other address shows the app's 404 page.
The API address can be changed with `VITE_API_URL` (see `frontend/.env.example`).
The Stage 1 and Stage 2 versions are in `mockup/`: open `mockup/index.html` in a browser, and the console (F12) for the data logic.

## AI usage

| Tool                       | Used for                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| Claude                     | First version of `index.html` and `style.css` (semantic layout, CSS Grid, Flexbox), README, stage 1 |
| Claude                     | `carlog.js` (data array, functions, console tests)                                        |
| GitHub Copilot (VS Code)   | Stage 4: `ReminderList` and `ReminderCard` components                                     |
| GitHub Copilot (VS Code)   | Stage 5: local state, toggle/delete events, light/dark theme                               |
| Claude                     | Stage 6: `db.json`, `api.js`, loading/error states, status summary and car filter          |
| Claude                     | Stage 7: `ReminderForm`, POST/PATCH/DELETE in `api.js`, `tw.json` and `data-testid`        |
| Claude                     | Stage 8: React Router pages, `Layout`, detail page, splitting `App.css` into CSS Modules   |

Details per stage: see the ai-log/ folder.

## Status

- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [x] Stage 3: Vite and React project
- [x] Stage 4: components rendered from data
- [x] Stage 5: local state and events
- [x] Stage 6: data from a mock API
- [x] Stage 7: form and validation
- [x] Stage 8: routing and detail page
- [ ] Stage 9: own backend with Express

## Stage 1: static mockup

The first version of the interface, written only in HTML and CSS: a header with the counter, a two-column
layout with the form for adding a deadline on the left and three cards on the right, and a dark theme.
Later, in the "Restyling" commit, I changed the design a little (a light theme with a dark one that
follows the system, and the cards on two columns). Since stage 3 these files live in `mockup/`.

| ID    | Requirement                                          | Where (permalink)                                                                                                       | How to check                         |
| ----- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| S1-R1 | README: description, fields, sample data, how to run | [`README.md`](./README.md)                                                                                               | read                                 |
| S1-R2 | AI usage section                                     | [`README.md#ai-usage`](./README.md#ai-usage)                                                                              | read                                 |
| S1-R3 | AI log for stage 1                                   | [`etapa-01.md`](./ai-log/etapa-01.md)                                                                                   | read                                 |
| S1-R4 | header, form (text + select), 3 cards with own data  | [`index.html#L11-L15`](https://github.com/zaharie-radu-ioan/CarLog/blob/401a1a2b04f91fb5dd5cb4b95a47a1b8c7c1ba8e/src/index.html#L11-L15), [`index.html#L22-L44`](https://github.com/zaharie-radu-ioan/CarLog/blob/401a1a2b04f91fb5dd5cb4b95a47a1b8c7c1ba8e/src/index.html#L22-L44), [`index.html#L51-L83`](https://github.com/zaharie-radu-ioan/CarLog/blob/401a1a2b04f91fb5dd5cb4b95a47a1b8c7c1ba8e/src/index.html#L51-L83)                        | open the page                        |
| S1-R5 | finished card looks different                        | [`index.html#L63`](https://github.com/zaharie-radu-ioan/CarLog/blob/401a1a2b04f91fb5dd5cb4b95a47a1b8c7c1ba8e/src/index.html#L63), [`style.css#L266-L310`](https://github.com/zaharie-radu-ioan/CarLog/blob/401a1a2b04f91fb5dd5cb4b95a47a1b8c7c1ba8e/src/css/style.css#L266-L310) (`.card-done`)                                         | look at the "Oil change" card        |
| S1-R6 | 2 columns on desktop, 1 under 700px                  | [`style.css#L103-L111`](https://github.com/zaharie-radu-ioan/CarLog/blob/401a1a2b04f91fb5dd5cb4b95a47a1b8c7c1ba8e/src/css/style.css#L103-L111), [`style.css#L443-L450`](https://github.com/zaharie-radu-ioan/CarLog/blob/401a1a2b04f91fb5dd5cb4b95a47a1b8c7c1ba8e/src/css/style.css#L443-L450) (`@media`)                                     | resize the window under 700px        |
| S1-R7 | visible focus, readable dark theme                   | [`style.css#L389-L394`](https://github.com/zaharie-radu-ioan/CarLog/blob/401a1a2b04f91fb5dd5cb4b95a47a1b8c7c1ba8e/src/css/style.css#L389-L394) (`:focus-visible`), [`style.css#L1-L49`](https://github.com/zaharie-radu-ioan/CarLog/blob/401a1a2b04f91fb5dd5cb4b95a47a1b8c7c1ba8e/src/css/style.css#L1-L49) (dark palette, `color-scheme: dark`) | Tab through the form; look at the page |
| S1-R8 | commit "Stage 1" pushed                              | [`401a1a2`](https://github.com/zaharie-radu-ioan/CarLog/commit/401a1a2b04f91fb5dd5cb4b95a47a1b8c7c1ba8e)                                                                                                        | commit history                       |

## Stage 2: data logic

Plain JavaScript, no DOM. `carlog.js` holds the array of reminders and the functions
that read and change it: list titles, count active items, search, add with validation,
toggle and delete. All functions are immutable: they return a new list instead of
changing the one they receive. Results are printed in the browser console (F12).

Extras beyond the required functions: `daysLeft`, `withDaysLeft`, `sortByExpiry`,
`filterByType`, `expiringSoon`, plus automatic checks (including a test with frozen
objects that proves nothing is mutated).

| ID     | Requirement                                          | Where (permalink)                                                                                                         | How to check                                |
| ------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| S2-R1  | JS file linked, logs on page load                    | [src/index.html#L9](https://github.com/zaharie-radu-ioan/CarLog/blob/c70b94edfac9f019be6bac57cc51448048c38cbc/src/index.html#L9) (script)                                    | open page, F12                              |
| S2-R2  | 3+ items with id, name, state, tag                   | [src/carlog.js#L5-L9](https://github.com/zaharie-radu-ioan/CarLog/blob/c70b94edfac9f019be6bac57cc51448048c38cbc/src/carlog.js#L5-L9)                                           | read                                        |
| S2-R3  | list, count, search, add, toggle, delete             | [src/carlog.js#L117-L147](https://github.com/zaharie-radu-ioan/CarLog/blob/c70b94edfac9f019be6bac57cc51448048c38cbc/src/carlog.js#L117-L147)                                   | console output                              |
| S2-R4  | add rejects empty name and invalid tag               | [src/carlog.js#L48-L56](https://github.com/zaharie-radu-ioan/CarLog/blob/c70b94edfac9f019be6bac57cc51448048c38cbc/src/carlog.js#L48-L56)                                       | console, Validare section (3 rejected inputs) |
| S2-R5  | original array unchanged after add                   | [src/carlog.js#L125](https://github.com/zaharie-radu-ioan/CarLog/blob/c70b94edfac9f019be6bac57cc51448048c38cbc/src/carlog.js#L125)                                             | console line "Originalul a rămas cu: 3"     |
| S2-R6  | README Stage 2 section + AI log                      | README.md, ai-log/etapa-02.md                                                                                              | read                                        |
| S2-R7  | commit "Stage 2" pushed                              | [commit](https://github.com/zaharie-radu-ioan/CarLog/commit/c70b94edfac9f019be6bac57cc51448048c38cbc)                                                                          | commit history                              |

## Stage 3: Vite and React project

The app now lives in `frontend/`, built with Vite. The files from stages 1 and 2 moved to `mockup/`.
The data from stage 2 moved into the main component, and the header counter is computed from it.
The stage 1 styles are reused in `App.css`, and the demo files generated by Vite were removed.

| ID    | Requirement                              | Where (permalink)                                                                                                                       | How to check                     |
| ----- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| S3-R1 | `npm run dev` starts without errors      | [`package.json#L6-L11`](https://github.com/zaharie-radu-ioan/CarLog/blob/89da2bd936564558fcc9284cefe3da9dcedb724f/frontend/package.json#L6-L11)                                                                                                 | `npm install`, `npm run dev`     |
| S3-R2 | app name and counter computed from data  | [`App.jsx#L51`](https://github.com/zaharie-radu-ioan/CarLog/blob/89da2bd936564558fcc9284cefe3da9dcedb724f/frontend/src/App.jsx#L51), [`App.jsx#L82-L88`](https://github.com/zaharie-radu-ioan/CarLog/blob/89da2bd936564558fcc9284cefe3da9dcedb724f/frontend/src/App.jsx#L82-L88)                                                           | edit the data, save              |
| S3-R3 | data from README, not from the example   | [`App.jsx#L16-L20`](https://github.com/zaharie-radu-ioan/CarLog/blob/89da2bd936564558fcc9284cefe3da9dcedb724f/frontend/src/App.jsx#L16-L20)                                                                                                 | compare with the sample data     |
| S3-R4 | stage 1 styles reused                    | [`App.css#L1-L53`](https://github.com/zaharie-radu-ioan/CarLog/blob/89da2bd936564558fcc9284cefe3da9dcedb724f/frontend/src/App.css#L1-L53), [`main.jsx#L4`](https://github.com/zaharie-radu-ioan/CarLog/blob/89da2bd936564558fcc9284cefe3da9dcedb724f/frontend/src/main.jsx#L4)                                                            | look at the page                 |
| S3-R5 | `node_modules` ignored, build passes     | [`.gitignore#L10-L11`](https://github.com/zaharie-radu-ioan/CarLog/blob/89da2bd936564558fcc9284cefe3da9dcedb724f/frontend/.gitignore#L10-L11)                                                                                                  | `npm run build`                  |
| S3-R6 | README Stage 3 section + AI log          | [`README.md#stage-3-vite-and-react-project`](./README.md#stage-3-vite-and-react-project), [`etapa-03.md`](./ai-log/etapa-03.md)          | read                             |
| S3-R7 | commit "Stage 3" pushed                  | [`89da2bd`](https://github.com/zaharie-radu-ioan/CarLog/commit/89da2bd936564558fcc9284cefe3da9dcedb724f)                                                                                                                     | commit history                   |

## Stage 4: components

`ReminderList` receives the complete array and renders one `ReminderCard` per deadline. `ReminderCard` receives a single deadline and its car through props and displays its title, type, car, expiry date and the days left. The card's color follows its status: done, overdue, due within 30 days or ok. An empty array displays a message instead of a list.

| ID    | Requirement                                  | Where (permalink)                                                                                                                                                       | How to check                                     |
| ----- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| S4-R1 | At least two components in `src/components/` | [`ReminderCard.jsx#L1-L66`](https://github.com/zaharie-radu-ioan/CarLog/blob/2c5c0046b44744d9555d44012239ad55cda3a169/frontend/src/components/ReminderCard.jsx#L1-L66), [`ReminderList.jsx#L1-L21`](https://github.com/zaharie-radu-ioan/CarLog/blob/2c5c0046b44744d9555d44012239ad55cda3a169/frontend/src/components/ReminderList.jsx#L1-L21) | Open the files                                   |
| S4-R2 | Card receives data through props             | [`ReminderCard.jsx#L36`](https://github.com/zaharie-radu-ioan/CarLog/blob/2c5c0046b44744d9555d44012239ad55cda3a169/frontend/src/components/ReminderCard.jsx#L36)                                                                                          | Read the `reminder` and `car` props              |
| S4-R3 | List uses `map` and `key={id}`               | [`ReminderList.jsx#L12-L18`](https://github.com/zaharie-radu-ioan/CarLog/blob/2c5c0046b44744d9555d44012239ad55cda3a169/frontend/src/components/ReminderList.jsx#L12-L18)                                                                                  | Run the app and check the browser console        |
| S4-R4 | Empty list displays a message                | [`ReminderList.jsx#L6-L8`](https://github.com/zaharie-radu-ioan/CarLog/blob/2c5c0046b44744d9555d44012239ad55cda3a169/frontend/src/components/ReminderList.jsx#L6-L8)                                                                                      | Set `INITIAL_REMINDERS` to `[]`                  |
| S4-R5 | Status changes the card appearance           | [`ReminderCard.jsx#L27-L40`](https://github.com/zaharie-radu-ioan/CarLog/blob/2c5c0046b44744d9555d44012239ad55cda3a169/frontend/src/components/ReminderCard.jsx#L27-L40)                                                                                  | Change the `done` or `expires` value             |
| S4-R6 | README and AI log updated                    | [`README.md#stage-4-components`](./README.md#stage-4-components), [`etapa-04.md`](./ai-log/etapa-04.md)                                                                 | Read these files                                 |
| S4-R7 | Stage 4 commit published on GitHub           | [`2c5c004`](https://github.com/zaharie-radu-ioan/CarLog/commit/2c5c0046b44744d9555d44012239ad55cda3a169)                                                                                                    | Commit `2c5c004` pushed to `main`                |

## Stage 5: local state and events

The list lives in React state. Checking and deleting work from the page,
and the counters in the header follow automatically. A button in the
header switches between light and dark mode. Changes are lost on refresh,
which is what stage 6 and stage 10 fix.

| ID    | Requirement                                         | Where (permalink)                                                                                                                                                                                                          | How to check                                             |
| ----- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| S5-R1 | List of deadlines is kept in `useState` in `App`    | [`App.jsx#L16-L20`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L16-L20), [`App.jsx#L28`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L28)                                                                                                              | Read the initial list and state declaration              |
| S5-R2 | Toggling updates state and the card appearance      | [`App.jsx#L39-L43`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L39-L43), [`ReminderCard.jsx#L25-L45`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/components/ReminderCard.jsx#L25-L45)                                                                          | Toggle a deadline's checkbox                             |
| S5-R3 | Deleting removes a deadline with an accessible button | [`App.jsx#L45-L47`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L45-L47), [`ReminderCard.jsx#L72-L79`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/components/ReminderCard.jsx#L72-L79)                                                                       | Click **Delete**; inspect its accessible name            |
| S5-R4 | Active count is derived, not stored                 | [`App.jsx#L35-L36`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L35-L36), [`App.jsx#L88-L90`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L88-L90)                                                                                                      | Toggle a deadline and watch the count                    |
| S5-R5 | State updates are immutable                         | [`App.jsx#L38-L47`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L38-L47), [`App.jsx#L59-L62`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L59-L62)                                                                                                      | Read the `map`, `filter` and spread state updates        |
| S5-R6 | Light/dark toggle uses state and `data-theme`       | [`App.jsx#L22-L25`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L22-L25), [`App.jsx#L49-L53`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L49-L53), [`App.jsx#L91-L112`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.jsx#L91-L112), [`App.css#L55-L134`](https://github.com/zaharie-radu-ioan/CarLog/blob/c5b091cc38db1c8336c27024e12751453599f3f8/frontend/src/App.css#L55-L134) | Toggle the button with both system color-scheme settings |
| S5-R7 | No console warnings; README and AI log documented   | [`README.md#stage-5-local-state-and-events`](./README.md#stage-5-local-state-and-events), [`etapa-05.md`](./ai-log/etapa-05.md)                                                                                         | Check DevTools Console and read both documents           |
| S5-R8 | "Stage 5" commit pushed                             | [`c5b091c`](https://github.com/zaharie-radu-ioan/CarLog/commit/c5b091cc38db1c8336c27024e12751453599f3f8)                                                                                                                                                       | Check commit history                                     |

## Stage 6: data from a mock API

The cars and the deadlines are no longer written in the React code. They are served by
json-server from `db.json`, on two routes: `/cars` and `/reminders`. All HTTP requests
are in `src/api.js`, and the server address comes from the `VITE_API_URL` environment variable.

On load, `App` asks for both lists at the same time (`useEffect` + `Promise.all`) and shows
one of three states: a loading message, an error message that says what to do (with a
**Try again** button), or the list.

With the data from the server the list became more useful:

- the deadlines are sorted by urgency (overdue first, done items at the end);
- three counters show how many items are overdue, due in 30 days and up to date; a click on a counter filters the list;
- the garage shows each car (plate, year, fuel, km) with its next deadline; a click on a car shows only its deadlines;
- service items can have notes (what was done or what has to be checked).

    npm run api   # terminal 1, http://localhost:3001
    npm run dev   # terminal 2, http://localhost:5173

Checking, deleting and adding still change only the local state and are lost on refresh;
stage 7 saves them on the server.

| ID    | Requirement                            | Where (permalink)                                                                                                    | How to check                                               |
| ----- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| S6-R1 | `npm run api` starts, routes show JSON | [`package.json#L8`](https://github.com/zaharie-radu-ioan/CarLog/blob/61decc2542c6082eddecd2d3045077779c52874d/frontend/package.json#L8), [`db.json`](https://github.com/zaharie-radu-ioan/CarLog/blob/61decc2542c6082eddecd2d3045077779c52874d/frontend/db.json)                                  | open localhost:3001/cars and localhost:3001/reminders      |
| S6-R2 | data no longer in React code           | [`App.jsx#L20-L21`](https://github.com/zaharie-radu-ioan/CarLog/blob/61decc2542c6082eddecd2d3045077779c52874d/frontend/src/App.jsx#L20-L21) (`useState([])`)                                                | read                                                       |
| S6-R3 | loading message while waiting          | [`App.jsx#L223-L225`](https://github.com/zaharie-radu-ioan/CarLog/blob/61decc2542c6082eddecd2d3045077779c52874d/frontend/src/App.jsx#L223-L225)                                                              | `npx json-server --watch db.json --port 3001 --delay 4000` |
| S6-R4 | error message when API is down         | [`App.jsx#L227-L236`](https://github.com/zaharie-radu-ioan/CarLog/blob/61decc2542c6082eddecd2d3045077779c52874d/frontend/src/App.jsx#L227-L236), [`App.jsx#L36-L58`](https://github.com/zaharie-radu-ioan/CarLog/blob/61decc2542c6082eddecd2d3045077779c52874d/frontend/src/App.jsx#L36-L58) (`useEffect` with `ignore`) | stop `npm run api`, refresh, then **Try again**            |
| S6-R5 | fetch only in api.js, URL from env     | [`api.js#L1-L18`](https://github.com/zaharie-radu-ioan/CarLog/blob/61decc2542c6082eddecd2d3045077779c52874d/frontend/src/api.js#L1-L18), [`.env.example`](https://github.com/zaharie-radu-ioan/CarLog/blob/61decc2542c6082eddecd2d3045077779c52874d/frontend/.env.example)                          | search for `fetch`                                         |
| S6-R6 | README Stage 6 section + AI log        | [`README.md#stage-6-data-from-a-mock-api`](./README.md#stage-6-data-from-a-mock-api), [`etapa-06.md`](https://github.com/zaharie-radu-ioan/CarLog/blob/61decc2542c6082eddecd2d3045077779c52874d/ai-log/etapa-06.md) | read                                                       |
| S6-R7 | commit "Stage 6" pushed                | [`61decc2`](https://github.com/zaharie-radu-ioan/CarLog/commit/61decc2542c6082eddecd2d3045077779c52874d)                                                    | commit history                                             |

## Stage 7: form and validation

Deadlines can be added from the page. The form is controlled and validated,
and every change (add, toggle, delete) goes to the API before it shows up
in the list, so everything survives a page refresh.

The form lives in its own component, `ReminderForm`. Besides the required title it checks:

- the title has at most 100 characters;
- a car is selected;
- the due date is filled in and its year is between 2000 and ten years from now.

The error is shown under the fields, not in an `alert`. While the request is on its way the
button says **Saving...** and cannot be pressed again, and the fields are cleared only if the
server confirmed the save. `tw.json` (in the repository root) and the `data-testid` attributes
are the landmarks for the automatic check.

| ID    | Requirement | Where (permalink) | How to check |
| ----- | ----------- | ----------------- | ------------ |
| S7-R1 | controlled form: value + onChange on every field | [`ReminderForm.jsx#L17-L22`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/components/ReminderForm.jsx#L17-L22), [`ReminderForm.jsx#L73-L123`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/components/ReminderForm.jsx#L73-L123) | read |
| S7-R2 | empty title shows an error, nothing is sent | [`ReminderForm.jsx#L27-L38`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/components/ReminderForm.jsx#L27-L38) (`validate`), [`ReminderForm.jsx#L40-L46`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/components/ReminderForm.jsx#L40-L46) | submit empty, watch Network |
| S7-R3 | added item shows in the list and survives refresh | [`App.jsx#L76-L79`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/App.jsx#L76-L79) (`handleAdd`), [`api.js#L25-L27`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/api.js#L25-L27) | add, refresh |
| S7-R4 | toggle and delete survive refresh | [`App.jsx#L81-L98`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/App.jsx#L81-L98) | toggle/delete, refresh |
| S7-R5 | button disabled while sending, form cleared only on success | [`ReminderForm.jsx#L48-L65`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/components/ReminderForm.jsx#L48-L65), [`ReminderForm.jsx#L131`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/components/ReminderForm.jsx#L131) | `--delay 3000`; stop API and submit |
| S7-R6 | tw.json and the data-testid attributes from table 7.3 | [`tw.json`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/tw.json), [`ReminderCard.jsx#L20-L66`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/components/ReminderCard.jsx#L20-L66), [`ReminderList.jsx#L6`](https://github.com/zaharie-radu-ioan/CarLog/blob/d00dbf474090afc6f2fdb194b021500f36be7a16/frontend/src/components/ReminderList.jsx#L6) | `querySelectorAll` in the console |
| S7-R7 | README Stage 7 section + AI log | [`README.md#stage-7-form-and-validation`](./README.md#stage-7-form-and-validation), [`etapa-07.md`](./ai-log/etapa-07.md) | read |
| S7-R8 | commit "Stage 7" pushed | [`d00dbf4`](https://github.com/zaharie-radu-ioan/CarLog/commit/d00dbf474090afc6f2fdb194b021500f36be7a16) | commit history |

## Stage 8: routing and detail page

The app now has four pages behind React Router, and the address changes without reloading the page:

- `/`: the form and the list of deadlines (the stage 7 code, moved from `App` to `RemindersPage`);
- `/reminders/:id`: one deadline, loaded from the server with its id from the address. Besides what the card shows, it has the full car details (year, fuel, mileage), the status in words, the notes and the id. For an id that does not exist (`/reminders/999`) it shows an error and a link back;
- `/about`: a short description of the app;
- any other address (`/ceva`): the app's own 404 page.

The header and the bottom bar are written once, in `Layout`, and every page is drawn in its `<Outlet />`.
The navigation stays in the bottom bar, like in a mobile app, with `NavLink` marking the current page.
The title of each card is now a link to its detail page; the checkbox and the **Delete** button work as before.
The counter moved from the header into the list section, because the header is now shared by every page.

The styles moved next to their components, with CSS Modules (`*.module.css`). `App.css` became `index.css`
and keeps only the color variables, the light/dark themes and the shared classes (`panel`, `surface`,
`section-title`, `badge`, `btn-danger`, `info`, `error`, `empty`). The fixed values (deadline types and
their labels) moved to `src/constants.js`.

| ID    | Requirement | Where | How to check |
| ----- | ----------- | ----- | ------------ |
| S8-R1 | header navigation changes page without reload | [`App.jsx#L12-L19`](./frontend/src/App.jsx#L12-L19), [`Layout.jsx#L71-L82`](./frontend/src/components/Layout.jsx#L71-L82) | click the links, watch Network |
| S8-R2 | click on an item opens its detail page | [`ReminderCard.jsx#L26`](./frontend/src/components/ReminderCard.jsx#L26), [`ReminderDetailPage.jsx`](./frontend/src/pages/ReminderDetailPage.jsx) | click a title |
| S8-R3 | refresh on the detail URL works; missing id shows an error | [`ReminderDetailPage.jsx#L10-L65`](./frontend/src/pages/ReminderDetailPage.jsx#L10-L65), [`api.js#L25-L28`](./frontend/src/api.js#L25-L28) | refresh `/reminders/1`, open `/reminders/999` |
| S8-R4 | unknown URL shows the app 404 page | [`App.jsx#L17`](./frontend/src/App.jsx#L17) (`path="*"`), [`NotFoundPage.jsx`](./frontend/src/pages/NotFoundPage.jsx) | open `/ceva` |
| S8-R5 | each component has its `.module.css`; `index.css` only shared styles | [`src/components`](./frontend/src/components), [`src/pages`](./frontend/src/pages), [`index.css`](./frontend/src/index.css) | read |
| S8-R6 | `data-testid` from tables 7.3 and 8.2; detail route `/reminders/:id` | [`Layout.jsx#L76`](./frontend/src/components/Layout.jsx#L76), [`ReminderCard.jsx#L13-L61`](./frontend/src/components/ReminderCard.jsx#L13-L61), [`ReminderDetailPage.jsx#L45-L76`](./frontend/src/pages/ReminderDetailPage.jsx#L45-L76), [`NotFoundPage.jsx#L7`](./frontend/src/pages/NotFoundPage.jsx#L7), [`tw.json`](./tw.json) | `querySelector` in the console |
| S8-R7 | README Stage 8 section + AI log | [`README.md#stage-8-routing-and-detail-page`](./README.md#stage-8-routing-and-detail-page), [`etapa-08.md`](./ai-log/etapa-08.md) | read |
| S8-R8 | commit "Stage 8" pushed | commit `Stage 8: routing and detail page` | commit history |