


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("recursive_question_system.py", "system_initialization", "import", "Auto-generated dev log entry")

Recursive Adaptive Question System
- Supports multiple subjects, styles, and difficulty levels
- Each question is a node; answers lead to follow-up questions
- Tracks learner path for grading and adaptation
"""
from typing import List, Dict, Optional
import json

class QuestionNode:
    def __init__(self, subject: str, style: str, difficulty: int, content: str,
                 options: Optional[List[str]] = None,
                 follow_ups: Optional[Dict[str, 'QuestionNode']] = None,
                 open_ended: bool = False):
        self.subject = subject
        self.style = style  # e.g., 'mcq', 'open', 'binary', 'tf'
        self.difficulty = difficulty
        self.content = content
        self.options = options if options else []
        self.follow_ups = follow_ups if follow_ups else {}
        self.open_ended = open_ended

    def ask(self):
        print(f"Subject: {self.subject}")
        print(f"Difficulty: {self.difficulty}")
        print(self.content)
        if self.options:
            for idx, opt in enumerate(self.options):
                print(f"  {chr(97 + idx)}) {opt}")
        if self.open_ended:
            print("(Open-ended response required)")

    def next_question(self, answer: str) -> Optional['QuestionNode']:
        return self.follow_ups.get(answer)

class MeshNode:
    def __init__(self, content, node_type, difficulty=1):
        self.content = content  # question, concept, principle, or keyword
        self.node_type = node_type  # e.g., 'principle', 'concept', 'keyword', 'question'
        self.difficulty = difficulty
        self.links = set()  # connected MeshNodes

    def add_link(self, other_node):
        self.links.add(other_node)
        other_node.links.add(self)  # bidirectional link

    def traverse(self, visited=None):
        if visited is None:
            visited = set()
        visited.add(self)
        print(f"{self.node_type.title()}: {self.content}")
        for node in self.links:
            if node not in visited:
                node.traverse(visited)

def populate_mesh(concept, structure, created=None):
    """
    Recursively populate mesh for a concept.
    concept: str, starting concept name
    structure: dict, mapping node names to dicts of type, difficulty, and links
    created: dict, stores created MeshNodes
    """
    if created is None:
        created = {}
    if concept in created:
        return created[concept]
    node_info = structure.get(concept, {})
    node = MeshNode(
        content=concept,
        node_type=node_info.get('type', 'concept'),
        difficulty=node_info.get('difficulty', 1)
    )
    created[concept] = node
    for link_name in node_info.get('links', []):
        linked_node = populate_mesh(link_name, structure, created)
        node.add_link(linked_node)
    return node

def mesh_to_dict(node, visited=None):
    if visited is None:
        visited = set()
    if node in visited:
        return None
    visited.add(node)
    data = {
        'content': node.content,
        'node_type': node.node_type,
        'difficulty': node.difficulty,
        'links': [n.content for n in node.links]
    }
    children = []
    for n in node.links:
        child = mesh_to_dict(n, visited)
        if child:
            children.append(child)
    data['children'] = children
    return data

def save_mesh_to_json(node, filename):
    mesh_dict = mesh_to_dict(node)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(mesh_dict, f, indent=2)

def load_mesh_from_json(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        mesh_dict = json.load(f)
    nodes = {}

    def build_node(data):
        content = data['content']
        if content in nodes:
            return nodes[content]
        node = MeshNode(content, data['node_type'], data['difficulty'])
        nodes[content] = node
        for child_data in data.get('children', []):
            child_node = build_node(child_data)
            node.add_link(child_node)
        return node
    return build_node(mesh_dict)

if __name__ == "__main__":
    # Create a simple recursive question tree
    q3 = QuestionNode(
        subject="CS Concepts",
        style="open",
        difficulty=3,
        content="Explain why modularity is important in programming.",
        open_ended=True
    )
    q2 = QuestionNode(
        subject="CS Concepts",
        style="mcq",
        difficulty=2,
        content="Which is a benefit of modular code?",
        options=["Easier to debug", "Harder to maintain"],
        follow_ups={"a": q3, "b": q3}
    )
    q1 = QuestionNode(
        subject="CS Vocabulary",
        style="tf",
        difficulty=1,
        content="True or False: A function is a type of module.",
        options=["True", "False"],
        follow_ups={"a": q2, "b": q2}
    )
    # Simulate asking questions recursively
    current = q1
    path = []
    while current:
        current.ask()
        answer = input("Your answer: ").strip().lower()
        path.append((current.content, answer))
        current = current.next_question(answer)
    print("\nPath taken:")
    for q, a in path:
        print(f"Q: {q}\nA: {a}\n")

    # Example mesh construction
    modularity = MeshNode("Modularity", "principle", difficulty=3)
    abstraction = MeshNode("Abstraction", "concept", difficulty=2)
    function = MeshNode("Function", "keyword", difficulty=1)
    q_mod = MeshNode("Why is modularity important in software design?", "question", difficulty=3)
    q_func = MeshNode("What is a function?", "question", difficulty=1)
    # Link nodes
    modularity.add_link(abstraction)
    modularity.add_link(q_mod)
    abstraction.add_link(function)
    function.add_link(q_func)
    # Traverse mesh
    print("\nTraversing mesh from Modularity:")
    modularity.traverse()

    # Example mesh population
    structure = {
        "Modularity": {"type": "principle", "difficulty": 3, "links": ["Abstraction", "Why is modularity important?"]},
        "Abstraction": {"type": "concept", "difficulty": 2, "links": ["Function"]},
        "Function": {"type": "keyword", "difficulty": 1, "links": ["What is a function?"]},
        "Why is modularity important?": {"type": "question", "difficulty": 3, "links": []},
        "What is a function?": {"type": "question", "difficulty": 1, "links": []}
    }
    print("\nRecursively populating mesh for Modularity:")
    mesh_root = populate_mesh("Modularity", structure)
    mesh_root.traverse()

    # Save mesh to file
    save_mesh_to_json(mesh_root, 'modularity_mesh.json')
    print("\nMesh saved to modularity_mesh.json")
    # Load mesh from file
    loaded_mesh = load_mesh_from_json('modularity_mesh.json')
    print("\nTraversing loaded mesh:")
    loaded_mesh.traverse()# 2025-09-11 | [XX]    | [Description]                        | [Reason]
