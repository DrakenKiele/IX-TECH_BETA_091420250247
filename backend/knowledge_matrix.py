

"""
Tesselated Knowledge Matrix: foundational class for hierarchical, connected subject matter indexing.
Supports dot-notated indices (e.g., CSTA codes), learning trajectories, and metadata.
"""

from typing import List, Dict, Optional

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("knowledge_matrix.py", "system_initialization", "import", "Tesselated knowledge matrix for learning trajectories")

class KnowledgeItem:
    def __init__(self, index: str, title: str, item_type: str, description: str = "", source: str = ""):
        self.index = index  # e.g., "1A-CS-01" or "CSD.1.1.0."
        self.title = title
        self.item_type = item_type  # 'vocabulary', 'concept', 'principle'
        self.description = description
        self.source = source  # filename or reference
        self.expansion: List[str] = []  # Lower-level, same subject
        self.extension: List[str] = []  # Higher-level, same subject
        self.exploration: List[str] = []  # Higher-level, other subject
        self.review: List[str] = []  # Lower-level, same subject
        self.metadata: Dict[str, str] = {}

class TesselatedKnowledgeMatrix:
    def __init__(self):
        self.items: Dict[str, KnowledgeItem] = {}

    def add_item(self, item: KnowledgeItem):
        self.items[item.index] = item

    def link_items(self, from_index: str, to_index: str, trajectory: str):
        if from_index in self.items and to_index in self.items:
            getattr(self.items[from_index], trajectory).append(to_index)

    def get_item(self, index: str) -> Optional[KnowledgeItem]:
        return self.items.get(index)

    def ingest_source(self, index: str, title: str, item_type: str, description: str, source: str):
        # Reinterpretation: AI can expand or rewrite description here
        item = KnowledgeItem(index, title, item_type, description, source)
        self.add_item(item)

    def get_connected(self, index: str, trajectory: str) -> List[KnowledgeItem]:
        item = self.get_item(index)
        if item:
            return [self.get_item(idx) for idx in getattr(item, trajectory) if self.get_item(idx)]
        return []

    def search_by_title(self, query: str) -> List[KnowledgeItem]:
        return [item for item in self.items.values() if query.lower() in item.title.lower()]
