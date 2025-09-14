# BREADCRUMB: [Project/Module] > __init__.py
# This file is part of the Aniota system.
# Next files in program flow (launch order):
#   1. [next_file_1] ([how_it_is_invoked_or_launched])
#   2. [next_file_2] ([how_it_is_invoked_or_launched])
#   3. [next_file_3] ([how_it_is_invoked_or_launched])
#   ...
# (Replace with actual files and launch details for each file.)
# -----------------------------------------------------------------------------
# File: __init__.py
# Purpose: Integration module for recursive_question_system
#   - log_file_dependency
#
# Key Classes:
#   - [None]
#
# Relationships:
#   - Imports: dev_log, recursive_question_system
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


"""
Integration module for recursive_question_system
Allows main application to import and use question mesh logic.
"""

# Import development logging system
try:
    from ..dev_log import log_file_traversal, log_file_dependency
except ImportError:
    try:
        from ...dev_log import log_file_traversal, log_file_dependency
    except ImportError:
        # Fallback if dev_log not available
        def log_file_traversal(*args, **kwargs): pass
        def log_file_dependency(*args, **kwargs): pass

# Log this file being traversed
log_file_traversal("__init__.py", "import_chain", "module_load", "Backend system component")

from .recursive_question_system import MeshNode, QuestionNode, populate_mesh, save_mesh_to_json, load_mesh_from_json

__all__ = [
    "MeshNode",
    "QuestionNode",
    "populate_mesh",
    "save_mesh_to_json",
    "load_mesh_from_json"
]