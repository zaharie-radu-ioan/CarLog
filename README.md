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
| car      | relation     | Dacia Duster, Volkswagen Golf            |
| user     | relation     | the owner of the item (from week 11)     |

Sample data used across all stages:

1. ITP Dacia Logan, active, itp
2. RCA Dacia Logan, done, rca
3. Rovinietă Dacia Logan, active, rovinieta

## How to run

```
cd frontend
npm install
npm run dev
```

Then open the address printed in the terminal (http://localhost:5173).
The Stage 1 and Stage 2 versions are in `mockup/`: open `mockup/index.html` in a browser, and the console (F12) for the data logic.

## AI usage

| Tool                       | Used for                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| Claude                     | First version of `index.html` and `style.css` (semantic layout, CSS Grid, Flexbox), README, stage 1 |
| Claude                     | `carlog.js` (data array, functions, console tests)                                        |
| GitHub Copilot (VS Code)   | Stage 4: `ReminderList` and `ReminderCard` components                                     |
| GitHub Copilot (VS Code)   | Stage 5: local state, toggle/delete events, light/dark theme                               |

Details per stage: see the ai-log/ folder.

## Status

- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [x] Stage 3: Vite and React project
- [x] Stage 4: components rendered from data
- [x] Stage 5: local state and events
- [ ] Stage 6: loading data from a mock API

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