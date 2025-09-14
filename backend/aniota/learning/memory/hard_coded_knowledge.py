


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("hard_coded_knowledge.py", "system_initialization", "import", "Auto-generated dev log entry")

🧠 ANIOTA'S HARD-CODED KNOWLEDGE BASE 🧠

Essential knowledge for offline operation in core academic subjects.
This provides Aniota with enough foundational knowledge to operate
for several hours without LLM access.

DESIGN PRINCIPLE: Store essential facts and relationships, not comprehensive details.
Focus on core concepts that enable pattern recognition and basic reasoning.
"""

from typing import Dict, List, Any, Set
import re
from datetime import datetime

class HardCodedKnowledgeBase:
    """
    🧠 Aniota's offline knowledge foundation for core academic subjects
    
    Contains essential facts and relationships to enable autonomous operation
    when LLM access is unavailable.
    """
    
    def __init__(self):
        self.knowledge_base = self._initialize_core_knowledge()
        self.keyword_index = self._build_keyword_index()
        self.relationship_map = self._build_relationship_map()
        
        print("🧠 Hard-coded knowledge base initialized")
        print(f"   📚 Knowledge entries: {len(self.knowledge_base)}")
        print(f"   🔍 Keyword index: {len(self.keyword_index)} terms")
        print(f"   🔗 Relationships: {len(self.relationship_map)} connections")
    
    def _initialize_core_knowledge(self) -> Dict[str, Dict[str, Any]]:
        """Initialize core knowledge across academic subjects"""
        return {
            # MATHEMATICS KNOWLEDGE
            'addition': {
                'subject': 'mathematics',
                'definition': 'combining numbers to get a sum',
                'keywords': ['add', 'plus', 'sum', 'total', 'combine'],
                'grade_level': 'elementary',
                'examples': ['2 + 3 = 5', '10 + 15 = 25'],
                'related_concepts': ['subtraction', 'multiplication', 'arithmetic']
            },
            'multiplication': {
                'subject': 'mathematics',
                'definition': 'repeated addition of the same number',
                'keywords': ['multiply', 'times', 'product', 'repeated addition'],
                'grade_level': 'elementary',
                'examples': ['3 × 4 = 12', '7 × 8 = 56'],
                'related_concepts': ['addition', 'division', 'factors']
            },
            'fraction': {
                'subject': 'mathematics',
                'definition': 'a part of a whole expressed as numerator over denominator',
                'keywords': ['fraction', 'numerator', 'denominator', 'part', 'whole'],
                'grade_level': 'elementary',
                'examples': ['1/2', '3/4', '2/3'],
                'related_concepts': ['decimals', 'percentages', 'division']
            },
            'algebra': {
                'subject': 'mathematics',
                'definition': 'mathematics using letters and symbols to represent numbers',
                'keywords': ['variable', 'equation', 'solve', 'unknown', 'x', 'y'],
                'grade_level': 'middle_school',
                'examples': ['x + 5 = 10', '2y = 16'],
                'related_concepts': ['arithmetic', 'geometry', 'equations']
            },
            
            # SCIENCE KNOWLEDGE
            'photosynthesis': {
                'subject': 'science',
                'definition': 'process plants use to make food from sunlight, water, and carbon dioxide',
                'keywords': ['plants', 'sunlight', 'chlorophyll', 'oxygen', 'glucose', 'leaves'],
                'grade_level': 'elementary',
                'examples': ['plants making oxygen', 'leaves turning green'],
                'related_concepts': ['respiration', 'plants', 'energy', 'biology']
            },
            'gravity': {
                'subject': 'science',
                'definition': 'force that pulls objects toward Earth',
                'keywords': ['fall', 'weight', 'pull', 'down', 'Earth', 'attraction'],
                'grade_level': 'elementary',
                'examples': ['objects falling down', 'weight of objects'],
                'related_concepts': ['physics', 'force', 'motion', 'mass']
            },
            'atom': {
                'subject': 'science',
                'definition': 'smallest unit of matter that retains properties of an element',
                'keywords': ['proton', 'neutron', 'electron', 'nucleus', 'element', 'matter'],
                'grade_level': 'middle_school',
                'examples': ['hydrogen atom', 'carbon atom'],
                'related_concepts': ['molecule', 'element', 'chemistry', 'periodic table']
            },
            'evolution': {
                'subject': 'science',
                'definition': 'change in living things over long periods of time',
                'keywords': ['species', 'adaptation', 'natural selection', 'Darwin', 'change'],
                'grade_level': 'high_school',
                'examples': ['Darwin finches', 'species adaptation'],
                'related_concepts': ['biology', 'adaptation', 'species', 'genetics']
            },
            
            # ENGLISH LANGUAGE ARTS KNOWLEDGE
            'noun': {
                'subject': 'english_language_arts',
                'definition': 'word that names a person, place, thing, or idea',
                'keywords': ['person', 'place', 'thing', 'idea', 'name', 'subject'],
                'grade_level': 'elementary',
                'examples': ['cat', 'school', 'happiness', 'John'],
                'related_concepts': ['verb', 'adjective', 'grammar', 'parts of speech']
            },
            'verb': {
                'subject': 'english_language_arts',
                'definition': 'word that shows action or state of being',
                'keywords': ['action', 'doing', 'being', 'run', 'is', 'was'],
                'grade_level': 'elementary',
                'examples': ['run', 'jump', 'is', 'think'],
                'related_concepts': ['noun', 'adjective', 'grammar', 'sentence']
            },
            'metaphor': {
                'subject': 'english_language_arts',
                'definition': 'comparison between two things without using like or as',
                'keywords': ['comparison', 'figurative', 'poetry', 'literature', 'meaning'],
                'grade_level': 'middle_school',
                'examples': ['life is a journey', 'time is money'],
                'related_concepts': ['simile', 'poetry', 'literature', 'figurative language']
            },
            'essay': {
                'subject': 'english_language_arts',
                'definition': 'written composition expressing ideas on a particular topic',
                'keywords': ['writing', 'composition', 'paragraph', 'thesis', 'argument'],
                'grade_level': 'middle_school',
                'examples': ['persuasive essay', 'narrative essay'],
                'related_concepts': ['writing', 'paragraph', 'thesis', 'argument']
            },
            
            # SOCIAL STUDIES KNOWLEDGE
            'democracy': {
                'subject': 'social_studies',
                'definition': 'government where people vote to choose their leaders',
                'keywords': ['vote', 'election', 'citizens', 'government', 'leaders', 'people'],
                'grade_level': 'elementary',
                'examples': ['voting for president', 'town elections'],
                'related_concepts': ['government', 'citizenship', 'voting', 'constitution']
            },
            'constitution': {
                'subject': 'social_studies',
                'definition': 'written plan for how a government should work',
                'keywords': ['government', 'laws', 'rights', 'rules', 'founding fathers'],
                'grade_level': 'middle_school',
                'examples': ['US Constitution', 'Bill of Rights'],
                'related_concepts': ['democracy', 'government', 'rights', 'laws']
            },
            'civil_war': {
                'subject': 'social_studies',
                'definition': 'war between North and South United States from 1861-1865',
                'keywords': ['slavery', 'Lincoln', 'North', 'South', 'Union', 'Confederate'],
                'grade_level': 'middle_school',
                'examples': ['Battle of Gettysburg', 'Emancipation Proclamation'],
                'related_concepts': ['slavery', 'Abraham Lincoln', 'history', 'United States']
            },
            'geography': {
                'subject': 'social_studies',
                'definition': 'study of places on Earth and how people live there',
                'keywords': ['maps', 'continents', 'countries', 'climate', 'location'],
                'grade_level': 'elementary',
                'examples': ['world map', 'seven continents'],
                'related_concepts': ['maps', 'continents', 'countries', 'culture']
            }
        }
    
    def _build_keyword_index(self) -> Dict[str, List[str]]:
        """Build index mapping keywords to knowledge entries"""
        keyword_index = {}
        
        for concept_id, concept_data in self.knowledge_base.items():
            keywords = concept_data.get('keywords', [])
            
            # Add the concept name itself as a keyword
            keywords.append(concept_id.replace('_', ' '))
            
            for keyword in keywords:
                keyword_lower = keyword.lower()
                if keyword_lower not in keyword_index:
                    keyword_index[keyword_lower] = []
                keyword_index[keyword_lower].append(concept_id)
        
        return keyword_index
    
    def _build_relationship_map(self) -> Dict[str, List[str]]:
        """Build map of concept relationships"""
        relationship_map = {}
        
        for concept_id, concept_data in self.knowledge_base.items():
            related = concept_data.get('related_concepts', [])
            relationship_map[concept_id] = related
        
        return relationship_map
    
    def find_knowledge(self, query: str, subject_filter: str = None) -> List[Dict[str, Any]]:
        """
        🔍 Find relevant knowledge entries for a query
        
        This enables offline operation by matching queries to stored knowledge
        """
        query_lower = query.lower()
        matches = []
        
        # Extract keywords from query
        query_keywords = self._extract_keywords(query_lower)
        
        for concept_id, concept_data in self.knowledge_base.items():
            # Skip if subject filter doesn't match
            if subject_filter and concept_data.get('subject') != subject_filter:
                continue
            
            # Calculate relevance score
            relevance_score = self._calculate_relevance(query_keywords, concept_data)
            
            if relevance_score > 0:
                match_data = concept_data.copy()
                match_data['concept_id'] = concept_id
                match_data['relevance_score'] = relevance_score
                matches.append(match_data)
        
        # Sort by relevance score
        matches.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        return matches
    
    def _extract_keywords(self, text: str) -> Set[str]:
        """Extract meaningful keywords from text"""
        # Remove common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'what', 'how', 'when', 'where', 'why', 'who'}
        
        # Extract words
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Filter out stop words and short words
        keywords = {word for word in words if word not in stop_words and len(word) > 2}
        
        return keywords
    
    def _calculate_relevance(self, query_keywords: Set[str], concept_data: Dict[str, Any]) -> float:
        """Calculate relevance score between query and concept"""
        concept_keywords = set()
        
        # Add concept keywords
        for keyword in concept_data.get('keywords', []):
            concept_keywords.add(keyword.lower())
        
        # Add concept definition words
        definition_keywords = self._extract_keywords(concept_data.get('definition', ''))
        concept_keywords.update(definition_keywords)
        
        # Calculate overlap
        if not concept_keywords:
            return 0.0
        
        overlap = len(query_keywords.intersection(concept_keywords))
        total_query_keywords = len(query_keywords)
        
        if total_query_keywords == 0:
            return 0.0
        
        return overlap / total_query_keywords
    
    def get_offline_response(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        🤖 Generate offline response using hard-coded knowledge
        
        This enables Aniota to operate autonomously when LLM is unavailable
        """
        # Find relevant knowledge
        matches = self.find_knowledge(query)
        
        if not matches:
            return {
                'response': "I don't have enough information in my offline knowledge to answer that question.",
                'confidence': 0.0,
                'source': 'offline_knowledge',
                'knowledge_available': False
            }
        
        # Use best match to generate response
        best_match = matches[0]
        
        # Generate age-appropriate response
        age_level = context.get('age_level', 'middle_school') if context else 'middle_school'
        response = self._generate_age_appropriate_response(best_match, age_level)
        
        return {
            'response': response,
            'confidence': best_match['relevance_score'],
            'source': 'offline_knowledge',
            'knowledge_available': True,
            'concept_id': best_match['concept_id'],
            'subject': best_match['subject'],
            'related_concepts': best_match.get('related_concepts', [])
        }
    
    def _generate_age_appropriate_response(self, concept_data: Dict[str, Any], age_level: str) -> str:
        """Generate age-appropriate explanation from concept data"""
        definition = concept_data['definition']
        examples = concept_data.get('examples', [])
        
        if age_level == 'elementary':
            # Simple, concrete language
            response = f"{definition.capitalize()}."
            if examples:
                response += f" For example: {examples[0]}."
        
        elif age_level == 'middle_school':
            # More detailed but still accessible
            response = f"{definition.capitalize()}. "
            if examples:
                response += f"Examples include: {', '.join(examples[:2])}. "
            
            related = concept_data.get('related_concepts', [])
            if related:
                response += f"This connects to other concepts like {', '.join(related[:2])}."
        
        else:  # high_school or adult
            # Comprehensive explanation
            response = f"{definition.capitalize()}. "
            if examples:
                response += f"Key examples: {', '.join(examples)}. "
            
            related = concept_data.get('related_concepts', [])
            if related:
                response += f"Related concepts include: {', '.join(related)}."
        
        return response
    
    def check_knowledge_coverage(self, subject: str = None) -> Dict[str, Any]:
        """Check what knowledge is available for offline operation"""
        if subject:
            entries = [k for k, v in self.knowledge_base.items() if v.get('subject') == subject]
        else:
            entries = list(self.knowledge_base.keys())
        
        subjects = {}
        grade_levels = {}
        
        for entry_id in entries:
            entry = self.knowledge_base[entry_id]
            subj = entry.get('subject', 'unknown')
            grade = entry.get('grade_level', 'unknown')
            
            subjects[subj] = subjects.get(subj, 0) + 1
            grade_levels[grade] = grade_levels.get(grade, 0) + 1
        
        return {
            'total_concepts': len(entries),
            'subjects_covered': subjects,
            'grade_levels_covered': grade_levels,
            'offline_capability': 'several_hours' if len(entries) > 20 else 'limited',
            'last_updated': datetime.now().isoformat()
        }# 2025-09-11 | [XX]    | [Description]                        | [Reason]
