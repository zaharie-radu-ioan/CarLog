# CarLog

CarLog keeps track of the deadlines and services of your cars: ITP, RCA insurance, road tax and service work.
It is made for car owners who want one list that shows what expires next and what is already done.

## Data model

| Field    | Type         | Notes                                    |
| -------- | ------------ | ---------------------------------------- |
| title    | text         | required, max 100 chars                  |
| done     | boolean      | toggled from the list, default false     |
| due_date | date         | required, the day the deadline expires   |
| type     | fixed values | ITP, RCA, Road tax, Service              |
| car      | relation     | Dacia Duster, Volkswagen Golf            |
| user     | relation     | the owner of the item (from week 11)     |

Sample data used across all stages:

1. Renew ITP, active, ITP
2. Oil change, done, Service
3. Renew RCA, active, RCA

## How to run

Open `index.html` in a browser. No build step, no server.

## AI usage

| Tool   | Used for                                                                                   |
| ------ | ------------------------------------------------------------------------------------------ |
| Claude | First version of `index.html` and `style.css` (semantic layout, CSS Grid, Flexbox), README, stage 1 |

Details per stage: see the ai-log/ folder.

## Status

- [x] Stage 1: static mockup
- [ ] Stage 2: data logic in JavaScript