# Code Tree and UML Overview

This document provides a high-level code tree, UML-style diagrams, and a migration/review log for the cognitive architecture in `IX-TECH`.

---

## Directory Structure (Current)

```
IX-TECH/
├── backend/
│   ├── main.py
│   └── aniota_presence.py
├── config/
│   ├── default.py
│   ├── development.py
│   ├── production.py
│   └── secrets.py
├── utils/
│   └── find_missing_sections.py
├── start_stack.py
```

---

## Cognitive Architecture UML/Module Map (Initial Draft)

```
CAF (Cognitive Framework)
│
├── SPE (Sensory Perception Encoder)
│    └── IEB (Input Event Buffer)
├── SIE (Socratic Inquiry Engine)
│    ├── HTM (Hypothesis Testing Module)
│    └── RFM (Reflective Feedback Module)
├── LRS (Learning Readiness & Scaffolding)
│    └── PDM (Zone of Proximal Development Map)
├── TPAI (Third-Party AI Integration)
├── Memory
│    ├── WMS (Working Memory System)
│    └── LDM (Long-Term Declarative Memory)
├── Data (JSON knowledge/rules)
└── API/App (FastAPI endpoints, integration)
```

---



## Migration/Review Log

- [ ] CAF: Review initialization, submodule registration, knowledge loading
- [ ] SPE: Review input encoding, parent/child wiring
- [ ] SIE: Review questioning logic, memory integration
- [ ] HTM/RFM: Review feedback/intervention logic
- [ ] LRS/PDM: Review scaffolding, ZPD mapping
- [ ] TPAI: Review external AI integration
- [ ] Memory: Review WMS/LDM logic
- [ ] Data: Ensure all required JSON files are present and loaded
- [ ] API/App: Ensure endpoints expose cognitive functions
- [ ] Plan and implement a Google Workspace for Education Chrome Extension for Aniota onboarding (to enable Google Classroom and Workspace integration)
- [ ] Implement parent-Aniota communication: allow parents to request student progress reports via chat/email, with LLM-generated summaries and legal language, and notify students when reports are sent.

---

## Findings & TODOs

- Add findings and UML updates as each module is reviewed.
- Document any interface or integration issues.
- Note any incomplete or stubbed logic for follow-up.

---

*This file is updated as part of the cognitive code set review and migration process.*
    - etc.

### backend/aniota_presence.py
- `class AniotaPresence`
    - State management attributes (dict)
    - Methods:
        - `update_mood`
        - `update_behavior_state`
        - `suggest_guidance_target`
        - `should_intercept_mouse`
        - `calculate_mouse_intercept_path`
        - `tinkerbelle_mouse_intercept_decision`
        - `calculate_reward_points`
        - `get_tinkerbelle_behavior`
        - `check_for_guidance_moment`
        - `update_position`
        - `log_interaction`
        - `get_state`
        - `add_message`
        - `process_context_change`
- `aniota_presence = AniotaPresence()` (global instance)

### config/default.py, development.py, production.py, secrets.py
- Simple variable assignments for configuration
    - (no classes/functions)

### utils/find_missing_sections.py
- Functions:
    - `scan_file`
    - `scan_directory`
    - `main`
- Command-line script for placeholder/code block analysis

### start_stack.py
- Functions:
    - `parse_arguments`
    - `is_docker_running`
    - `start_docker_compose`
    - `start_python_backend`
    - `wait_for_service`
    - `start_frontend_server`
    - `dashboard`
    - `main`
- Orchestrates stack startup and dashboard

---

*This document is auto-generated and should be updated as the codebase evolves.*
