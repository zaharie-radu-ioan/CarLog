# Stage 1: AI log

## Tools

- Claude

## Conversations

- https://claude.ai/share/dace640b-1e0a-4368-8c5a-869863bb1243 (restyling the CSS of my CarLog mockup)

## Key requests

### 1. Modern dark restyle with bigger cards

- Asked: to make `style.css` look more modern, with a darker theme, everything in one column and bigger cards.
- Got: a darker midnight palette defined as CSS variables, larger cards with a glow in the status color and a stronger focus ring on fields. Claude also found a missing closing brace in my reduced-motion block that made the mobile rules apply only for reduced motion, and fixed it.
- Changed or rejected: I kept the dark theme and my card design.

### 2. Two columns and a finished card

- Asked: to use two columns (one column under 700px) and to make sure a card can be marked as finished.
- Got: a 2-column grid that becomes one column under 700px, and a "Finished" label with a check mark on cards with the class `card-done`.
- Changed or rejected: I rejected the single-column layout from the first request because the stage requires two columns on desktop (S1-R6).

### 3. Form on the left, deadlines on the right

- Asked: for "Add a deadline" on the left and "My deadlines" right next to it.
- Got: the form in the left column and the list of deadline cards in the right column, side by side on desktop and stacked on small screens.
- Changed or rejected: I went back to two columns with the form on the left and the list on the right.

## What I learned / what did not work

Grid sets the two-column layout of the page (form on the left, list on the right), while Flexbox arranges the content inside each card. The media query at 700px switches the page to one column on small screens. Colors are defined once as CSS variables in `:root`, so changing the theme means editing a few lines.
What did not work at first: a missing `}` in the reduced-motion block silently broke the mobile rules.