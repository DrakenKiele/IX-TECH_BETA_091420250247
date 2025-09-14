

"""
Centralized registry for mapping unique knowledge item IDs to metadata, including CSTA codes, titles, and other attributes.
"""
import uuid
import json
from typing import Dict, Any

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("knowledge_registry.py", "system_initialization", "import", "Knowledge registry for metadata mapping")

class KnowledgeRegistry:
    def __init__(self, registry_path: str):
        self.registry_path = registry_path
        self.items: Dict[str, Dict[str, Any]] = {}
        self._load()

    def _load(self):
        try:
            with open(self.registry_path, 'r', encoding='utf-8') as f:
                self.items = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            self.items = {}

    def save(self):
        with open(self.registry_path, 'w', encoding='utf-8') as f:
            json.dump(self.items, f, indent=2)

    def add_item(self, title: str, item_type: str, csta_code: str = None, description: str = "", source: str = "") -> str:
        item_id = str(uuid.uuid4())
        self.items[item_id] = {
            "title": title,
            "item_type": item_type,
            "csta_code": csta_code,
            "description": description,
            "source": source
        }
        self.save()
        return item_id

    def get_item(self, item_id: str) -> Dict[str, Any]:
        return self.items.get(item_id, {})

    def find_by_csta(self, csta_code: str) -> Dict[str, Any]:
        return {k: v for k, v in self.items.items() if v.get("csta_code") == csta_code}

    def find_by_title(self, query: str) -> Dict[str, Any]:
        return {k: v for k, v in self.items.items() if query.lower() in v.get("title", "").lower()}
