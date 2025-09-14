


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("base_module.py", "system_initialization", "import", "Auto-generated dev log entry")

Base Module Template for Aniota Digital Consciousness System
Use this as a starting point for new modules in the cognitive architecture.

Architecture Pattern: Hierarchical with CAF as root orchestrator
Design Philosophy: Modular, extensible, ethically-guided recursive learning
"""

from abc import ABC, abstractmethod
from typing import Optional, List

class BaseModule(ABC):
    """
    BaseModule: Abstract base for all Aniota modules.
    Extend this class for new modules.
    """
    def __init__(self, module_id: str, parent: Optional['BaseModule'] = None):
        self.module_id = module_id
        self.parent = parent
        self.children: List['BaseModule'] = []

    def add_child(self, child: 'BaseModule') -> None:
        self.children.append(child)
        child.parent = self

    @abstractmethod
    def process(self, *args, **kwargs):
        """Override in subclass: main processing logic for the module."""
        pass

class CoreSystemModule(BaseModule):
    """
    CoreSystemModule: For core system modules (e.g., orchestrators).
    Extend for CAF, orchestrators, etc.
    """
    def process(self, *args, **kwargs):
        pass

class UserExperienceModule(BaseModule):
    """
    UserExperienceModule: For UX/UI modules.
    Extend for user-facing components.
    """
    def process(self, *args, **kwargs):
        pass

BMT = BaseModule
CSM = CoreSystemModule
UXM = UserExperienceModule
