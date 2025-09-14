

"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("hard_coded_knowledge.py", "system_initialization", "import", "Auto-generated dev log entry")

Hard Coded Knowledge Base
Provides basic knowledge for the IX-TECH learning system
"""

class HardCodedKnowledge:
    def __init__(self):
        self.knowledge_base = {
            'mathematics': {
                'multiplication': {
                    'definition': 'Multiplication is repeated addition',
                    'examples': ['3 × 4 = 12', '5 × 6 = 30'],
                    'difficulty': 0.3,
                    'topics': ['arithmetic', 'basic_math']
                },
                'division': {
                    'definition': 'Division is the opposite of multiplication',
                    'examples': ['12 ÷ 3 = 4', '20 ÷ 5 = 4'],
                    'difficulty': 0.4,
                    'topics': ['arithmetic', 'basic_math']
                }
            },
            'science': {
                'photosynthesis': {
                    'definition': 'Process by which plants make food using sunlight',
                    'examples': ['Plants use CO2 + H2O + sunlight → glucose + O2'],
                    'difficulty': 0.6,
                    'topics': ['biology', 'plants', 'energy']
                }
            },
            'language': {
                'nouns': {
                    'definition': 'Words that name people, places, things, or ideas',
                    'examples': ['cat', 'house', 'happiness', 'teacher'],
                    'difficulty': 0.2,
                    'topics': ['grammar', 'parts_of_speech']
                }
            }
        }
        
    def get_knowledge(self, topic):
        """Retrieve knowledge about a specific topic"""
        # Search through all categories
        for category, subjects in self.knowledge_base.items():
            for subject, details in subjects.items():
                if topic.lower() in subject.lower() or topic.lower() in str(details.get('topics', [])).lower():
                    return {
                        'topic': subject,
                        'category': category,
                        'definition': details['definition'],
                        'examples': details['examples'],
                        'difficulty': details['difficulty'],
                        'related_topics': details['topics']
                    }
        
        # If not found, return basic structure
        return {
            'topic': topic,
            'category': 'unknown',
            'definition': f'No knowledge available about {topic}',
            'examples': [],
            'difficulty': 0.5,
            'related_topics': []
        }
    
    def query(self, question):
        """Query the knowledge base with a question and return structured result"""
        question_lower = question.lower()
        
        # Extract topic from question
        topic = None
        for category, subjects in self.knowledge_base.items():
            for subject in subjects.keys():
                if subject.lower() in question_lower:
                    topic = subject
                    break
            if topic:
                break
        
        if topic:
            knowledge = self.get_knowledge(topic)
            return {
                'concept': knowledge['topic'],
                'definition': knowledge['definition'],
                'examples': knowledge['examples'],
                'category': knowledge['category'],
                'difficulty': knowledge['difficulty'],
                'confidence': 0.8
            }
        else:
            return {
                'concept': 'unknown',
                'definition': 'No relevant knowledge found',
                'examples': [],
                'category': 'unknown',
                'difficulty': 0.5,
                'confidence': 0.1
            }
    
    def get_all_topics(self):
        """Get list of all available topics"""
        topics = []
        for category, subjects in self.knowledge_base.items():
            for subject in subjects.keys():
                topics.append({
                    'name': subject,
                    'category': category,
                    'difficulty': subjects[subject]['difficulty']
                })
        return topics
    
    def search_by_difficulty(self, min_difficulty=0.0, max_difficulty=1.0):
        """Find topics within a difficulty range"""
        matching_topics = []
        for category, subjects in self.knowledge_base.items():
            for subject, details in subjects.items():
                difficulty = details['difficulty']
                if min_difficulty <= difficulty <= max_difficulty:
                    matching_topics.append({
                        'topic': subject,
                        'category': category,
                        'difficulty': difficulty
                    })
        return matching_topics
    
    def get_related_topics(self, topic):
        """Find topics related to the given topic"""
        knowledge = self.get_knowledge(topic)
        related = []
        
        if knowledge['category'] != 'unknown':
            # Find other topics in the same category
            for subject, details in self.knowledge_base[knowledge['category']].items():
                if subject != knowledge['topic']:
                    related.append({
                        'topic': subject,
                        'relatedness': 0.8,  # Same category = high relatedness
                        'difficulty': details['difficulty']
                    })
        
        return related

__all__ = ['HardCodedKnowledge']
