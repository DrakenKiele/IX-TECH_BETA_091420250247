# SVG Grid Key

The files are located in the IX-TECH/aniota_ui/aniota_radix_grid/

This grid maps the row/column (L/M/R) coordinates to SVG file numbers for dynamic button rendering.

|   | P  | C  |S/T |
|---|----|----|----|
| 1 | 21 | 14 | 7  |
| 2 | 19 | 12 | 5  |
| 3 | 17 | 10 | 3  |
| 4 | 15 | 8  | 1  |
| 5 | 16 | 9  | 2  |
| 6 | 18 | 11 | 4  |
| 7 | 20 | 13 | 6  |

- **P** = Principle column
- **C** = Concetpt column
- **S/T** = Subject/Topic column
- Each cell value is the SVG file number for that row/column (e.g., `1.svg`, `2.svg`, ...)

Use this key to select the correct SVG for each button based on its grid position.

- In quiz or test mode, the question will be displayed using SVG 8.

---

## SVG Usage Rules

1. **SVGs in row 4 are the trunk.**
   - Any user selection will always be visually moved to the trunk (row 4) before presenting further output.
2. **SVGs 16, 9, 18, and 11** are used for Multiple Choice options **A, B, C, and D** respectively.
3. **SVGs 2 and 4** are used for **True** and **False** choices, respectively.
4. **SVGs 21, 14, 19, and 12** are used for **Extend, Expand, Review, and Explore**, respectively.
5. **SVG 0** is used for the **Activation Button**.
6. **When choices are presented,** the overlay text (A, B, C, D, True, False, etc.) will be displayed on top of the SVGs in their specified numerical order.
7. **In quiz or test mode,** the question will be displayed using **SVG 8**.

---
