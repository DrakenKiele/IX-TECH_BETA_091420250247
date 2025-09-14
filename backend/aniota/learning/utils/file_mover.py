# BREADCRUMB: [Project/Module] > file_mover.py
# This file is part of the Aniota system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: file_mover.py
# Purpose: [No module docstring found]
# Key Classes:
#   - [None]
#
# Relationships:
#   - Imports: os, shutil
#
# Usefulness & Execution Path:
#   - [Execution notes]
#
# Suggestions:
#   - **Performance:** [Performance notes]
#   - **Code Cleanliness:** [Code cleanliness notes]
#   - **Location:** [Location notes]
#   - **Function:** [Function notes]
#   - **Legacy:** [Legacy notes]
#   - **Config:** [Config notes]
#   - **Error Handling:** [Error handling notes]
#   - **Cross-Platform:** [Cross-platform notes]
#
# Summary:
#   - [Summary notes]
#
# CHANGE MANAGEMENT LOG
# Date        | Initials | Description of Change                | Reason for Change
# -----------------------------------------------------------------------------
# 2025-09-11 | [XX]    | Header auto-generated                   | Initial automation
# -----------------------------------------------------------------------------


import os
import shutil

# Base directory for your learning folder
BASE_DIR = r"h:\DK_Softworks_LLC_Application_Projects\DK_SOFTWORKS_LLC\IX-TECH\backend\aniota\learning"

# Mapping of files to their destination subfolders
file_moves = {
    "analyzers": [
        "syllabic_pattern_analyzer.py",
        "homophone_pattern_analyzer.py",
        "pattern_proximity_analyzer.py",
        "phonemix_convergence_analysis.py",
        "sentence_length_analyzer.py",
        "ai_detection_analyzer.py",
        "facts_fiction_spectrum_test.py",
        "spectrum_analysis_summary.py",
        "breadcrumb_system.py",
        "discovery_playground.py",
        "iterative_keyword_elimination.py",
        "development_synergy.py",
        "pathway_marketing.py",
        "farm_layer_architecture.py",
        "game_server_infrastructure.py"
    ],
    "engines": [
        "truth_engine.py",
        "choice_engine.py",
        "curiosity_engine.py",
        "operant_conditioning.py",
        "recursive_question_system.py",
        "sie.py",
        "rfm.py",
        "pdm.py",
        "htm.py",
        "unified_learning.py"
    ],
    "simulators": [
        "conversational_data_simulator.py",
        "interactive_sie_test.py",
        "escape_hatch_demo.py",
        "offline_operation_demo.py",
        "sie_system_tester.py",
        "simple_truth_demo.py",
        "test_microvibration.py"
    ],
    "memory": [
        "memory_core.py",
        "hard_coded_knowledge.py",
        "import_historical_data.py"
    ],
    "network": [
        "hive_learning.py",
        "farm_layer_architecture.py",
        "development_synergy.py",
        "viral_token_network.py",
        "universal_win_system.py",
        "game_server_infrastructure.py",
        "pathway_marketing.py",
        "social_conditioning_system.py"
    ],
    "llm": [
        "llm_manager.py",
        "llm_management_demo.py"
    ],
    "utils": [
        "dev_log.py",
        "base_module.py",
        "metaix.py"
    ]
}

for folder, files in file_moves.items():
    dest_dir = os.path.join(BASE_DIR, folder)
    os.makedirs(dest_dir, exist_ok=True)
    for filename in files:
        src = os.path.join(BASE_DIR, filename)
        dst = os.path.join(dest_dir, filename)
        if os.path.exists(src):
            if not os.path.exists(dst):
                shutil.copy2(src, dst)
                print(f"Copied {filename} to {folder}/")
            else:
                print(f"Skipped {filename}: already exists in {folder}/")
        else:
            print(f"Source file not found: {filename}")

print("File copy complete. Please verify contents before removing originals.")