
<!--
NOTE: Files in the aniota, assets, backend, data, and docs folders are NOT deprecated. Only files outside these folders may be deprecated.
-->
manifest.json
background.js
content.js
aniota_splash.html
aniota_launcher.js
aniota_splash.js
aniota_epicenter.html
about_aniota.html
about_aniota.js
about_dk_softworks.html
about_dk_softworks.js
about_ix-tech.html
about_ix-tech.js
instructions.html
subscriptions.html
license.html
instructions.js
subscriptions.js
license.js
aniota_epicenter.js
aniota_field.html
aniota_field.js
aniota_field_animation.js
popup.html
aniota_launcher.html
popup.js
prime_colors.json
generate_prime_colors.js
styles.css
ANIOTA.code-workspace
navbar_hierarchy.json
maqnetix_ui_core_snapgrid.html
gridConfig.js
shapeData.js
gridRenderer.js
shapesLoader.js
minimap.js
dragResizeHandlers.js
shapes.json
main.js
multiSelect.js
gridMarkers.js
mouseOverlay.js
featureToggles.js
unpacker.js
unpackerUI.js
uicaPlacer.js
themeRef.js
minimap-requirements.md
renderedGrid.js
exploder.js
exploderUI.js
shapeLoader.js


# Coding Style & Practices

# Rules for Common Sense Programming

1. **Start with Clear, Modular Design**
   - Break problems into small, manageable modules with single responsibilities.
   - Use encapsulation to hide internal details and expose clear interfaces.

2. **Promote Reuse and Patterns**
   - Design code to be reusable in different contexts (use inheritance, composition, or pure functions).
   - Apply established design patterns where appropriate, but only when they fit the problem.

3. **Prefer Simplicity and Readability**
   - Write code that is easy to read, understand, and maintain.
   - Avoid unnecessary complexity; use clear, descriptive names and straightforward logic.

4. **Handle Uncertainty and Incomplete Information**
   - Anticipate missing or ambiguous data; use defaults and sensible fallbacks.
   - Validate inputs and handle errors gracefully.

5. **Context Matters**
   - Always consider the context in which code runs; adapt logic to fit the situation.
   - Avoid hardcoding assumptions that may not hold in all scenarios.

6. **Test and Validate**
   - Write tests to confirm code works as expected, especially for edge cases.
   - Use assertions and checks to catch mistakes early.

7. **Document Reasoning and Decisions**
   - Explain non-obvious choices and logic between functions, not inside them.
   - Keep a running log of design decisions and lessons learned.

8. **Learn and Adapt**
   - Refactor code as new requirements or insights emerge.
   - Be open to changing approaches if a simpler or more robust solution is found.

9. **Leverage Multiple Paradigms**
   - Use OOP, functional, procedural, or declarative styles as appropriate for the problem.
   - Combine paradigms to maximize modularity, reuse, and clarity.

10. **Think Like a User and a Developer**
    - Anticipate how others will use and modify your code.
    - Strive for solutions that are robust, flexible, and easy to extend.
 ## Object Oriented Programming Principles 

## General Principles
- Modular architecture: separate frontend/backend, clear API boundaries
- Privacy-first: implement privacy filtering (no PII transmission)
- Use unit tests and validation for compliance
- Sprint-based planning and documentation
- Real-time, low-latency communication (WebSocket, <10ms latency)
- Clear repository structure: docs, frontend, backend, requirements, package.json, README
- End-to-end and performance testing as part of integration

## JavaScript/HTML/CSS
- All JavaScript must be in external files (no inline scripts or event handlers in HTML)
- Event handlers must use null checks and be modular for extensibility
- Placeholder logic for unimplemented features, with clear alerts
- Menu logic and UI event handlers must be robust, modular, and CSP-compliant
- Maintain clean, descriptive commit messages and synchronized documentation
- Document code within files in the spaces between functions, but not within functions themselves

## Documentation & AI Collaboration
- Keep running notes and context in programmersLog_temp.md; this file is read and updated by any AI working on the code to maintain a record of all discussions and decisions

## UX & Philosophy
- Core UX: Intuitive, emotionally safe, curiosity-driven, not punitive or rigid
- All feedback in the app must be symbolic, non-punitive, and emotionally safe

## Process
- Track technical descriptions and processes for later implementation
- Cross-reference requirements documentation for compliance
- No coding without explicit authorization during planning

---

## Special Keywords

- **SIDENOTE:** Stop programming; enter strategic planning mode. No code changes should be made.
- **BACKTO WORK:** Resume programming; strategic planning is complete and coding may continue.
- **CLEANUP:**
  - Append the contents of programmersLog_temp.md to programmersLog.md.
  - Append the contents of devLog_temp.md to devLog.md.
  - Create GitHub commands to backup progress.

For all new functions:

- Developers shall add or expand documentation between functions, including parameter and return value descriptions.
- Developers shall ensure all new modular functions include clear, descriptive comments as required by the coding contract.
- Developers shall review all new code for possible "common sense" rule violations and add clarifying comments as needed.

For existing code:

- If a possible "common sense" code violation (e.g., magic numbers, unclear logic) is identified, developers shall add a comment with the keyword POSSIBLE_COMMON_SENSE_CODE_VIOLATION at that location.
- Developers shall not make corrections to existing code unless the code is being changed for other reasons, at which point the violation shall be addressed and the comment removed.

- The file list at the beginning of this file shall be updated with new filenames as they are created.

- The architectural note regarding the file list shall be preserved to ensure AI agents can locate and parse this file when directives reference any of the listed filenames.

---

Each time you see this line of text, say "I am following your coding rules."