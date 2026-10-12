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

Open `index.html` in a browser. No build step, no server.
From Stage 2 on, open the console (F12) to see the results of the data logic.

## Stage 2: data logic

Plain JavaScript, no DOM. `carlog.js` holds the array of reminders and the functions
that read and change it: list titles, count active items, search, add with validation,
toggle and delete. All functions are immutable: they return a new list instead of
changing the one they receive. Results are printed in the browser console (F12).

Extras beyond the required functions: `daysLeft`, `withDaysLeft`, `sortByExpiry`,
`filterByType`, `expiringSoon`, plus automatic checks (including a test with frozen
objects that proves nothing is mutated).

## AI usage

| Tool   | Used for                                                                                   |
| ------ | ------------------------------------------------------------------------------------------ |
| Claude | First version of `index.html` and `style.css` (semantic layout, CSS Grid, Flexbox), README, stage 1 |
| Claude | `carlog.js` (data array, functions, console tests) |

Details per stage: see the ai-log/ folder.

## Status

- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [ ] Stage 3: Vite and React project

## Stage 2: verification table

| ID     | Requirement                                          | Where (permalink)                                                                                                         | How to check                                |
| ------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| S2-R1  | JS file linked, logs on page load                    | [src/index.html#L9](https://github.com/zaharie-radu-ioan/CarLog/blob/c70b94edfac9f019be6bac57cc51448048c38cbc/src/index.html#L9) (script)                                    | open page, F12                              |
| S2-R2  | 3+ items with id, name, state, tag                   | [src/carlog.js#L5-L9](https://github.com/zaharie-radu-ioan/CarLog/blob/c70b94edfac9f019be6bac57cc51448048c38cbc/src/carlog.js#L5-L9)                                           | read                                        |
| S2-R3  | list, count, search, add, toggle, delete             | [src/carlog.js#L117-L147](https://github.com/zaharie-radu-ioan/CarLog/blob/c70b94edfac9f019be6bac57cc51448048c38cbc/src/carlog.js#L117-L147)                                   | console output                              |
| S2-R4  | add rejects empty name and invalid tag               | [src/carlog.js#L48-L56](https://github.com/zaharie-radu-ioan/CarLog/blob/c70b94edfac9f019be6bac57cc51448048c38cbc/src/carlog.js#L48-L56)                                       | console, Validare section (3 rejected inputs) |
| S2-R5  | original array unchanged after add                   | [src/carlog.js#L125](https://github.com/zaharie-radu-ioan/CarLog/blob/c70b94edfac9f019be6bac57cc51448048c38cbc/src/carlog.js#L125)                                             | console line "Originalul a rămas cu: 3"     |
| S2-R6  | README Stage 2 section + AI log                      | README.md, ai-log/etapa-02.md                                                                                              | read                                        |
| S2-R7  | commit "Stage 2" pushed                              | [commit](https://github.com/zaharie-radu-ioan/CarLog/commit/c70b94edfac9f019be6bac57cc51448048c38cbc)                                                                          | commit history                              |