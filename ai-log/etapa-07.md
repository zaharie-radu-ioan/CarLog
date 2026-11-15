# Stage 7: AI log

## Tools

- Claude (claude.ai)

## Conversations

- Claude

## Key requests


### 1. Saving the changes on the server

- Asked: how to send add, toggle and delete to json-server, following the guide.
- Got: `api.js` with a shared `request` function that sets the JSON header and checks `res.ok`, plus `createReminder`, `updateReminder` and `deleteReminder`. In `App`, `handleAdd`, `handleToggle` and `handleDelete` wait for the server and put in the list the object it returns.
- Changed or rejected: I kept my one-column layout instead of the two columns from the guide, because the form and the cards are already wide and readable that way.

### 2. A separate form component with validation

- Asked: how to move the form out of `App` and what extra validation makes sense for a car deadline.
- Got: `ReminderForm`, a controlled form with title, car, type and due date. It checks that the title is filled in and has at most 100 characters, that a car is selected, and that the due date is filled in with a year between 2000 and ten years from now. While saving, the button says **Saving...** and is disabled, and the fields are cleared only after the server answers.
- Changed or rejected: past dates stay allowed, because an overdue ITP is a real case the app has to show.

### 3. Preparing the automatic check

- Asked: which `data-testid` names my project needs and what goes in `tw.json`.
- Got: the names from table 7.3, plus `form-carId`, `form-type` and `form-expires`, named after the fields in `db.json`, and `tw.json` with `reminders`, `title`, `done` and a sample for the other fields.
- Changed or rejected: nothing.

## What I learned / what did not work

The list changes only after the server answers, and the new item comes with the id from the server; the frontend never makes up an id. `handleAdd` does not catch the error, so it reaches the form and is shown next to the fields. `finally` turns the button back on whether the save worked or not.
What did not work at first: `eslint` complained that `ReminderForm.jsx` exported a constant next to the component (fast refresh), so the list of types stayed private to the file. The first test with the API stopped showed "Pick a car." instead of "Failed to fetch", because the API was stopped before the cars loaded; stopping it after the page loaded showed the right error.