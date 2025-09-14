

"""
aniota_behaviors.py
Modular management of Aniota's state-behavior connections for IX-TECH backend.
Implements set_behaviors and manage_behaviors for dynamic action mapping.
"""


from typing import Callable, Dict, Any

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from dev_log import log_file_traversal, log_file_dependency

log_file_traversal("aniota_behaviors.py", "aniota_presence.py", "import", "Behavior management for Aniota state")

class AniotaBehaviorManager:
    def __init__(self):
        self.behaviors: Dict[str, Callable[[Any], None]] = {}

    def set_behaviors(self, behavior_map: Dict[str, Callable[[Any], None]]):
        """Set or replace the entire behavior mapping."""
        self.behaviors = behavior_map.copy()

    def add_behavior(self, name: str, func: Callable[[Any], None]):
        """Add or update a single behavior by name."""
        self.behaviors[name] = func

    def remove_behavior(self, name: str):
        """Remove a behavior by name."""
        if name in self.behaviors:
            del self.behaviors[name]

    def manage_behaviors(self, action: str, *args, **kwargs):
        """Invoke a behavior by action name, passing any arguments."""
        if action in self.behaviors:
            return self.behaviors[action](*args, **kwargs)
        raise ValueError(f"Behavior '{action}' not found.")

aniota_behavior_manager = AniotaBehaviorManager()
