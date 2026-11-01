# Stage 4: AI log

## Tools

- GitHub Copilot (Copilot Chat in VS Code)

## Conversations

- Copilot Chat in VS Code, no share link (splitting the CarLog list into React components)

## Key requests

### 1. Components for the list and the card

- Asked: to move the list of deadlines out of `App.jsx` into reusable components in `src/components/`, rendered from the data array.
- Got: `ReminderList`, which receives the whole array and renders one `ReminderCard` per deadline with `map` and `key={reminder.id}`, and `ReminderCard`, which receives a single deadline and its car through props and shows the title, type badge, car, expiry date and days left.
- Changed or rejected: I kept the two components and the props `reminder` and `car`, and left the form in `App.jsx`.

### 2. Card appearance based on the data

- Asked: for the card to look different depending on whether the deadline is done, expired or close to expiring.
- Got: a `statusClass` function that returns `card-done`, `card-overdue`, `card-soon` (30 days or less) or `card-ok`, using `daysLeft`, plus maps from the type values (`itp`, `rovinieta`...) to the text and badge class shown on screen.
- Changed or rejected: I kept the values in the data unchanged (`itp`, `rca`, `rovinieta`, `revizie`) and only translated them for display.

### 3. Empty list

- Asked: what the list should show when there are no deadlines.
- Got: an early return in `ReminderList` with the message "No deadlines yet." instead of an empty `<ul>`.
- Changed or rejected: nothing to change.

## What I learned / what did not work

Props go one way, from parent to child: `App` holds the data, `ReminderList` receives the array and `ReminderCard` receives a single item. The `key` must be a stable id, not the index, so React knows which card is which when the list changes. The card's look is computed from the data on every render, so there is nothing extra to keep in sync.
What did not work at first: the cars are stored by name, so the card needs `cars.find(...)` to get the plate, and the sample deadlines have no `car` field, so they show without a car line.