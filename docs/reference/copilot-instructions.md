Copilot Coding Agent Instructions for IX-TECH

## Project Overview

This codebase is a modular, privacy-first educational suite for DK Softworks LLC, built as a Progressive Web App (PWA) with a Python (FastAPI) backend. All user-facing apps are responsive, installable web apps; backend modules provide educational logic, data, and compliance services.

## Major Folders & Structure

- All folders ending in \*IX (e.g., IX-TECH/, CHRYSALIX, MAQNETIX, PHONEMIX, RADIX, SECURIX) contain modular app or UI code.
- `backend/`: Python modules (api, app, core, data, memory, etc.), requirements.txt for dependencies.
- `assets/`: Images, icons, backgrounds (referenced with relative paths from HTML).
- `stylesheets/`: Modular CSS (avoid monolithic or inline styles).
- `DOCS/+ALL REQUIREMENTS.md`: The canonical requirements and architecture reference for all modules, privacy, and compliance.

## Architecture & Patterns

- **Frontend:** Modular, responsive PWA (HTML/JS/CSS in each \*IX folder). Use a web app manifest and service worker for installability and offline support. Each page loads only the JS it needs (e.g., aniota_launcher.js for drag logic).
- **Backend:** FastAPI Python server, organized by domain. No direct integration with browser extension APIs. All data flows via documented REST endpoints.
- **Data:** All user data is session-bound, stored in local/session storage or ephemeral cookies. No PII is ever collected, stored, or transmitted. Only "Learning Moments" are recorded, and only for the active session.
- **Modularity:** All UI modules (drawers, panels, chat, color picker, MAQNETIX, etc.) are independent, reusable JS/CSS components. Backend modules (PHONEMIX, etc.) are Python packages with clear interfaces.

## Developer Workflows

- **Run/Build:** No build step required for frontend; serve static files via FastAPI or any static server. For backend, use Python 3.8+ and install dependencies with `pip install -r requirements.txt`.
- **Testing:** Python tests in backend (e.g., test_stack.py). Manual browser testing for UI. No formal JS test suite.
- **Debugging:** Use browser DevTools for UI; console logs for tracing user actions and debugging.

## Project-Specific Conventions

- All JavaScript must be in external files; no inline scripts or event handlers in HTML.
- Only include scripts needed for each page; avoid global scripts.
- Use null checks for event handlers; keep logic modular and CSP-compliant.
- Document code between functions, not inside them.
- Modularize all styles; use flexbox, aspect-ratio, and CSS variables for responsive, accessible layouts.
- Use Noto Sans Rounded and DK Softworks brand colors (see requirements doc).

## Integration Points

- **Frontend <-> Backend:** All communication via REST API endpoints (AJAX/fetch). No Chrome Extension APIs. No direct extension/backend integration.
- **Cross-component:** Use modular JS/CSS; keep logic self-contained unless backend interaction is required.

## Requirements & Compliance

- See `DOCS/+ALL REQUIREMENTS.md` for detailed system, privacy, and UI requirements, module structure, and compliance mandates.
- All user data is session-bound and anonymized. No PII is ever stored or processed.
- Only "Learning Moments" are recorded, and only within the active session.

## Examples

- See `aniota_launcher.js` for modular, page-specific JS logic.
- See `backend/` for Python module structure and requirements management.
- See `popup.html` + `popup.css` for modular, mobile-first UI patterns.

## DO NOTs

- **DO NOT make assumptions or change code without first making a backup.**
  Always create a backup copy of any file before making major edits, especially for major or structural changes.
  If unsure, ask for clarification or confirmation before proceeding with non-trivial modifications.

- **DO NOT use Chrome Extension APIs, permissions, or manifest.json.**
  All new features must follow the PWA, modular, and privacy-first patterns described above.

- **DO NOT edit, modify, or reformat the patent document (`DOCS/+prov_patent.md`) under any circumstances.**
  This file is legally sensitive and must remain unchanged by all AI agents and contributors.

If you add new features, follow the modular, page-specific pattern for JS/CSS, and reference the requirements doc for compliance. For questions, check the requirements doc and existing modular files for examples.

Do not produce lines of code that are longer than 80 character, and to not use tabs for indentation. Use spaces only.

Please review and let me know if any section is unclear or if you want more detail on any coding policy or workflow!
