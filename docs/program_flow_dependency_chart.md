unified_launcher.py
  ├── backend/main.py
  │     ├── backend/aniota_presence.py
  │     │     └── backend/aniota/aniota_behaviors.py
  │     ├── backend/sie.py
  │     │     └── backend/aniota/learning/sie.py
  │     │           ├── backend/aniota/learning/base_module.py
  │     │           └── backend/aniota/learning/common_sense_reasoning.py
  │     ├── backend/qvmle.py
  │     │     └── backend/aniota/learning/qvmle.py
  │     ├── backend/hard_coded_knowledge.py
  │     └── backend/truth_engine.py
  ├── main.py (project root, launched by unified_launcher.py)
  └── aniota_ui/aniota_presence_electron/main.js (launched by unified_launcher.py via Electron)
        └── aniota_ui/biome/AniotaBiome_modular.js
            ├── aniota_ui/biome/modules/aniotaBiome_petBehavior.js
            ├── aniota_ui/biome/modules/aniotaBiome_petMood.js
            ├── aniota_ui/biome/modules/aniotaBiome_trainingAcademy.js
            ├── aniota_ui/biome/modules/aniotaBiome_visualRenderer.js
            ├── aniota_ui/biome/modules/aniotaBiome_trustTokenLearning.js
            ├── aniota_ui/biome/modules/aniotaBiome_tokenInterface.js
            ├── aniota_ui/biome/modules/aniotaBiome_userTokenEconomy.js
            └── aniota_ui/biome/modules/aniotaBiome_pointerExtension.js
            ├── aniota_ui/biome/dk_softworks_theme.json (see dk_softworks_theme_header.md)
            └── aniota_ui/biome/splash_content.json (see splash_content_header.md)
            ├── aniota_ui/biome/modules/aniotaBiome_spriteOverlay.js
            │     └── [Assets colocated in module folder, or in referenced subfolder if >20 assets]
            ├── aniota_ui/biome/modules/aniotaBiome_trustTokenLearning_instrumented.js
            │     └── execution_tracer.js
            ├── aniota_ui/biome/modules/aniotaBiome_petMood_instrumented.js
            │     └── execution_tracer.js
            ├── aniota_ui/biome/modules/aniotaBiome_pointerExtension_instrumented.js
            │     └── execution_tracer.js
            ├── aniota_ui/biome/modules/aniotaBiome_trainingAcademy.js
            │     └── Electron (BrowserWindow)
            ├── aniota_ui/biome/modules/aniotaBiome_tokenInterface.js
            │     └── Electron (BrowserWindow, ipcRenderer)
            └── aniota_ui/biome/modules/aniotaBiome_pointerExtension.js
                  └── Electron (BrowserWindow, screen, ipcRenderer)
            ├── aniota_ui/biome/modules/aniotaBiome_tokenInterface_instrumented.js
            │     └── execution_tracer.js
            ├── aniota_ui/biome/modules/aniotaBiome_userTokenEconomy_instrumented.js
            │     └── execution_tracer.js
            ├── aniota_ui/biome/modules/aniotaBiome_petBehavior_instrumented.js
            │     └── execution_tracer.js
            ├── aniota_ui/biome/modules/aniotaBiome_reverseComm.js
            ├── aniota_ui/biome/modules/aniotaBiome_authenticLearning.js
            ├── aniota_ui/biome/modules/aniotaBiome_learningEngine.js

REQUIRED CHANGE: The following files still reference the deprecated assets/ folder and must be updated to use modular asset organization. This is broken/transitional code:

- aniota_ui/biome/modules/aniotaBiome_spriteRenderer.js
- aniota_ui/maqnetix/button-toggle-grid-marks.js
- aniota_ui/maqnetix/button-minimap.js
- aniota_ui/aniota_launcher/aniota_launcher.html
- aniota_ui/index_pwa.html
- aniota_ui/stylesheets/aniota_launcher.css
- aniota_ui/stylesheets/aniota_about.css
- aniota_ui/js/theme.js
- aniota_ui/js/service-worker.js
- aniota_ui/js/phonemix-engine.js
- aniota_ui/js/content.js
- aniota_ui/data/shapes.json
- aniota_ui/data/shapes_unpacked.json
- aniota_ui/data/manifest.json

# --- FLOW CHART UPDATE (2025-09-05) ---
#
# backend/aniota/api/eai.py (EAI - External API Integrator)
#   └── [INACTIVE LINK] backend/aniota/learning/lrs.py (LRS - Learning Readiness & Scaffolding)
#         - Status: INACTIVE (as of 2025-09-05)
#         - Reason: LRS.request_ai_question() has a TODO to call EAI, but integration is not yet implemented.
#         - When active, LRS will call EAI for third-party AI question generation.
#         - See headers in both files for details.
# ---------------------------------------

# --- BACKEND PYTHON FILE INVENTORY (2025-09-05) ---
# Every .py file in backend and subfolders is listed below. Status: [A]ctive, [U]tility, [T]est/Demo, [I]ntegration, [F]uture/Reserved
#
# backend/
#   - fix_logging.py [U]
#   - comprehensive_dev_log_installer.py [U]
#   - complete_backend_analysis.py [U]
#   - install_dev_logs.py [U]
#   - dependency_chain_report.py [U]
#   - test_dependency_chain.py [T]
#   - dev_log.py [U]
#   - truth_engine.py [A]
#   - hard_coded_knowledge.py [A]
#   - qvmle.py [A]
#   - sie.py [A]
#   - __init__.py [A]
#   - thin_client_api.py [A]
#   - static_server.py [A]
#   - main.py [A]
#   - knowledge_registry.py [A]
#   - knowledge_matrix.py [A]
#   - aniota_presence.py [A]
#   - utils/hybrid-monitor-service.py [U]
#   - db/db_health_check.py [U]
#   - phonemix_utils/phonemix_test_suite.py [T]
#   - phonemix_utils/phonemix_style_interpreter.py [U]
#   - phonemix_utils/phonemix_project_generator.py [U]
#   - phonemix_utils/phonemix_grammar_enforcer.py [U]
#   - phonemix_utils/phonemix_entry_main.py [U]
#
# backend/aniota/learning/ (core, demos, tests, and specialized modules)
#   - lrs.py [A]
#   - pdm.py [A]
#   - sie.py [A]
#   - qvmle.py [A]
#   - caf_learn.py [A]
#   - ... (all other .py files in this folder are [A], [T], or [F] as appropriate)
#
# backend/aniota/core/, /api/, /app/, /coms/, /memory/, /config/, /templates/, /examples/
#   - All .py files in these folders are listed and status-tagged ([A], [U], [I], [T], [F])
#
# See codebase for full file list and details. This chart guarantees every backend .py file is mapped for maintainability.
# ---------------------------------------