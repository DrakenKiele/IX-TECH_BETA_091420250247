Grid Interface Planning Summary
1. Grid Zones and Layout

Your UI uses 34 numbered zones.
Zones 1–21 are dynamically assigned for displaying questions, choices, or information.
Zones 22–34 are intended for static labels (not yet implemented in code).
The cellRatios array in grid.js defines the positions and numbers for zones 1–21.
The order in cellRatios is for layout; the code sorts by num to assign text in numeric order.
2. Display Logic

When displaying a list (questions, choices, etc.), each item is shown in the next available zone (1, 2, 3, ...).
The pattern is visually balanced: center, above, below, etc., not just linear.
When a user makes a selection:
The grid is cleared.
The selected item is placed in zone 1.
New choices are displayed in zones 2, 3, etc.
3. UI Metaphor

The interface acts like a “fan” or “radial” menu, not a dropdown.
This makes the UI more interactive and visually engaging.
4. Implementation Status

The current code supports dynamic assignment for zones 1–21.
Static zones 22–34 are not yet implemented.
You can add static zones by extending cellRatios and handling them separately in your code.
5. Next Steps (Planning)

Decide on the mapping and labels for static zones 22–34.
Add or refine code to support static and dynamic zones.
Plan for click handling, chat input, and backend integration as needed.