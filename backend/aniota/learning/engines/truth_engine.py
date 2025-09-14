


"""

import sys
import os

try:
    from dev_log import log_file_traversal, log_file_dependency
except ImportError:
    def log_file_traversal(*args, **kwargs): pass
    def log_file_dependency(*args, **kwargs): pass

log_file_traversal("truth_engine.py", "system_initialization", "import", "Auto-generated dev log entry")

🔍 TRUTH ENGINE - Simple Fact Correlation System 🔍

Simple and elegant truth verification system:
1. Extract keywords from statement (remove connective words)
2. Search for corresponding results in knowledge base
3. Calculate correlation score based on matches
4. Report degree of truth from 0 to 100

DESIGN PRINCIPLE: Elegantly simple - more matches = higher truth probability
"""

from typing import Dict, List, Any, Set, Tuple
import re
from datetime import datetime
from hard_coded_knowledge import HardCodedKnowledgeBase

class TruthEngine:
    """
    🔍 Simple fact correlation system for truth verification
    
    Extracts keywords and correlates against known facts to determine
    degree of truth from 0 to 100.
    """
    
    def __init__(self, knowledge_base: HardCodedKnowledgeBase):
        self.knowledge_base = knowledge_base
        
        # Connective words to remove (these don't carry factual content)
        self.connective_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'so', 'yet', 'for', 'nor',
            'if', 'then', 'because', 'since', 'although', 'though', 'while',
            'when', 'where', 'how', 'what', 'who', 'which', 'that', 'this',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
            'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
            'may', 'might', 'can', 'must', 'shall', 'to', 'in', 'on', 'at',
            'by', 'with', 'from', 'up', 'about', 'into', 'through', 'during',
            'before', 'after', 'above', 'below', 'between', 'among', 'under',
            'over', 'very', 'really', 'quite', 'rather', 'too', 'much', 'many',
            'some', 'any', 'all', 'each', 'every', 'no', 'not', 'only', 'just'
        }
        
        print("🔍 Truth Engine initialized")
        print(f"   📚 Knowledge base: {len(self.knowledge_base.knowledge_base)} facts")
        print(f"   🚫 Connective words filtered: {len(self.connective_words)}")
    
    def verify_statement(self, statement: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        🎯 Main truth verification function
        
        Returns degree of truth from 0 to 100 based on keyword correlation
        """
        print(f"\n🔍 TRUTH ENGINE VERIFICATION")
        print(f"   📝 Statement: \"{statement}\"")
        
        # Step 1: Extract factual keywords
        keywords = self.extract_factual_keywords(statement)
        print(f"   🔑 Extracted keywords: {list(keywords)}")
        
        # Step 2: Find correlating facts
        correlations = self.find_correlating_facts(keywords)
        print(f"   📊 Found correlations: {len(correlations)}")
        
        # Step 3: Calculate truth score
        truth_score = self.calculate_truth_score(keywords, correlations, statement)
        print(f"   🎯 Truth score: {truth_score}/100")
        
        # Step 4: Generate verification report
        verification_report = self.generate_verification_report(
            statement, keywords, correlations, truth_score, context
        )
        
        return verification_report
    
    def extract_factual_keywords(self, statement: str) -> Set[str]:
        """
        🔑 Extract keywords that carry factual content
        
        Removes connective words and focuses on content-bearing terms
        """
        # Convert to lowercase and extract words
        words = re.findall(r'\b\w+\b', statement.lower())
        
        # Remove connective words and short words
        factual_keywords = set()
        for word in words:
            if (word not in self.connective_words and 
                len(word) > 2 and 
                not word.isdigit()):  # Skip pure numbers for now
                factual_keywords.add(word)
        
        return factual_keywords
    
    def find_correlating_facts(self, keywords: Set[str]) -> List[Dict[str, Any]]:
        """
        📊 Find facts in knowledge base that correlate with keywords
        
        Returns list of matching facts with correlation scores
        """
        correlations = []
        
        for concept_id, concept_data in self.knowledge_base.knowledge_base.items():
            correlation_score = self.calculate_keyword_correlation(keywords, concept_data)
            
            if correlation_score > 0:
                correlations.append({
                    'concept_id': concept_id,
                    'concept_data': concept_data,
                    'correlation_score': correlation_score,
                    'matching_keywords': self.find_matching_keywords(keywords, concept_data)
                })
        
        # Sort by correlation score
        correlations.sort(key=lambda x: x['correlation_score'], reverse=True)
        
        return correlations
    
    def calculate_keyword_correlation(self, query_keywords: Set[str], concept_data: Dict[str, Any]) -> float:
        """Calculate correlation between query keywords and concept data"""
        # Collect all keywords from concept
        concept_keywords = set()
        
        # Add explicit keywords
        for keyword in concept_data.get('keywords', []):
            concept_keywords.add(keyword.lower())
        
        # Add words from definition
        definition = concept_data.get('definition', '')
        definition_words = re.findall(r'\b\w+\b', definition.lower())
        for word in definition_words:
            if word not in self.connective_words and len(word) > 2:
                concept_keywords.add(word)
        
        # Add concept name
        concept_name = concept_data.get('concept_id', '').replace('_', ' ')
        concept_keywords.add(concept_name.lower())
        
        # Calculate overlap
        if not concept_keywords or not query_keywords:
            return 0.0
        
        overlap = len(query_keywords.intersection(concept_keywords))
        
        # Score based on both overlap and coverage
        overlap_score = overlap / len(query_keywords)  # How much of query is covered
        coverage_score = overlap / len(concept_keywords)  # How well concept matches
        
        # Weighted average favoring overlap (more important that query is covered)
        correlation = (overlap_score * 0.7) + (coverage_score * 0.3)
        
        return correlation
    
    def find_matching_keywords(self, query_keywords: Set[str], concept_data: Dict[str, Any]) -> List[str]:
        """Find which specific keywords match between query and concept"""
        concept_keywords = set()
        
        # Collect concept keywords
        for keyword in concept_data.get('keywords', []):
            concept_keywords.add(keyword.lower())
        
        definition_words = re.findall(r'\b\w+\b', concept_data.get('definition', '').lower())
        for word in definition_words:
            if word not in self.connective_words and len(word) > 2:
                concept_keywords.add(word)
        
        # Find intersection
        matches = query_keywords.intersection(concept_keywords)
        return list(matches)
    
    def calculate_truth_score(self, keywords: Set[str], correlations: List[Dict[str, Any]], original_statement: str) -> int:
        """
        🎯 Calculate truth score from 0-100 based on correlations
        
        Enhanced with proximity analysis and subject context:
        - Word proximity within statement
        - Subject consistency across correlations
        - Contradiction detection for false statements
        """
        if not correlations:
            return 0  # No correlating facts found

        # Step 1: Analyze word proximity in statement
        proximity_score = self.analyze_word_proximity(original_statement, keywords)
        
        # Step 2: Check subject consistency
        subject_consistency = self.analyze_subject_consistency(correlations)
        
        # Step 3: Check for contradictions
        contradiction_penalty = self.detect_contradictions(original_statement, correlations)

        # Step 4: Base score from best correlations
        top_correlations = correlations[:3]  # Use top 3 matches
        correlation_scores = [c['correlation_score'] for c in top_correlations]

        if not correlation_scores:
            return 0

        # Calculate weighted average of top correlations
        base_score = sum(correlation_scores) / len(correlation_scores)

        # Step 5: Apply proximity and subject bonuses
        proximity_boost = proximity_score * 0.15  # Max 15% boost for good proximity
        subject_boost = subject_consistency * 0.1  # Max 10% boost for subject consistency

        # Boost score based on number of correlating facts (increased for math)
        correlation_boost = min(len(correlations) * 0.08, 0.20)  # Increased to help math

        # Boost score based on keyword coverage
        total_keywords = len(keywords)
        covered_keywords = len(set().union(*[c['matching_keywords'] for c in correlations]))
        coverage_ratio = covered_keywords / total_keywords if total_keywords > 0 else 0
        coverage_boost = coverage_ratio * 0.1
        
        # Detect unnatural keyword lists and heavily penalize
        unnatural_penalty = 0.0
        if self.is_unnatural_keyword_list(statement, keywords):
            unnatural_penalty = 0.45  # Heavy penalty for keyword lists
            print(f"      ⚠️ Unnatural keyword list detected!")

        # Calculate final score with all factors
        final_score = (base_score + proximity_boost + subject_boost + 
                      correlation_boost + coverage_boost - contradiction_penalty - unnatural_penalty)
        
        # Convert to 0-100 scale and cap
        truth_score = max(0, min(int(final_score * 100), 100))
        
        print(f"   📊 Score breakdown:")
        print(f"      Base correlation: {base_score:.2f}")
        print(f"      Proximity bonus: +{proximity_boost:.2f}")
        print(f"      Subject bonus: +{subject_boost:.2f}")
        print(f"      Contradiction penalty: -{contradiction_penalty:.2f}")
        print(f"      Final score: {truth_score}/100")
        
        return truth_score
    
    def analyze_word_proximity(self, statement: str, keywords: Set[str]) -> float:
        """
        🔍 Analyze how close important keywords are to each other in the statement
        
        Words that appear close together often have stronger relationships,
        which can indicate more coherent and truthful statements.
        Enhanced to detect unnatural word arrangements vs natural sentences.
        """
        words = statement.lower().split()
        keyword_positions = {}
        
        # Find positions of all keywords in the statement
        for i, word in enumerate(words):
            clean_word = re.sub(r'[^\w]', '', word)  # Remove punctuation
            if clean_word in keywords:
                if clean_word not in keyword_positions:
                    keyword_positions[clean_word] = []
                keyword_positions[clean_word].append(i)
        
        if len(keyword_positions) < 2:
            return 0.5  # Neutral score if not enough keywords for proximity analysis
        
        # Special case: Check for unnatural arrangements (keywords without proper connectors)
        total_words = len(words)
        keyword_word_count = sum(len(positions) for positions in keyword_positions.values())
        keyword_density = keyword_word_count / total_words if total_words > 0 else 0
        
        # Count connective words to determine if this is a natural sentence
        connective_count = sum(1 for word in words if word in self.connective_words)
        has_connectives = connective_count > 0
        
        # If statement is mostly keywords without connectors AND lacks structure, penalize
        if keyword_density > 0.8 and not has_connectives and total_words > 3:
            print(f"      🔍 Unnatural keyword list detected: {keyword_density:.1%} keywords, no connectives")
            return 0.2  # Poor proximity for unstructured keyword lists
        elif keyword_density > 0.6 and total_words <= 6:  # Short natural sentences are OK
            print(f"      🔍 Natural sentence with high keyword density: {keyword_density:.1%}")
        
        # Calculate average distance between keywords
        total_distance = 0
        pair_count = 0
        
        keyword_list = list(keyword_positions.keys())
        for i in range(len(keyword_list)):
            for j in range(i + 1, len(keyword_list)):
                keyword1 = keyword_list[i]
                keyword2 = keyword_list[j]
                
                # Find minimum distance between any occurrence of these keywords
                min_distance = float('inf')
                for pos1 in keyword_positions[keyword1]:
                    for pos2 in keyword_positions[keyword2]:
                        distance = abs(pos1 - pos2)
                        min_distance = min(min_distance, distance)
                
                total_distance += min_distance
                pair_count += 1
        
        if pair_count == 0:
            return 0.5
        
        avg_distance = total_distance / pair_count
        
        # Convert distance to proximity score (closer = higher score)
        # Enhanced scoring with consideration for sentence length
        if avg_distance <= 2:
            proximity_score = 1.0  # Excellent proximity
        elif avg_distance <= 4:
            proximity_score = 0.8  # Good proximity
        elif avg_distance <= 7:
            proximity_score = 0.6  # Moderate proximity
        elif avg_distance <= 12:
            proximity_score = 0.4  # Poor proximity
        else:
            proximity_score = 0.2  # Very poor proximity
        
        print(f"      🔍 Proximity analysis: {avg_distance:.1f} avg distance → {proximity_score:.2f} score")
        return proximity_score
    
    def analyze_subject_consistency(self, correlations: List[Dict[str, Any]]) -> float:
        """
        📚 Analyze consistency of subjects across correlating facts
        
        Statements that correlate with facts from the same subject area
        are more likely to be coherent and truthful.
        """
        if not correlations:
            return 0.0
        
        # Extract subjects from correlations
        subjects = []
        for correlation in correlations:
            subject = correlation['concept_data'].get('subject', 'unknown')
            subjects.append(subject)
        
        # Calculate subject consistency
        if not subjects:
            return 0.5  # Neutral if no subject information
        
        # Count subject frequency
        subject_counts = {}
        for subject in subjects:
            subject_counts[subject] = subject_counts.get(subject, 0) + 1
        
        # Find dominant subject
        total_correlations = len(subjects)
        max_count = max(subject_counts.values())
        dominant_ratio = max_count / total_correlations
        
        # Score based on how concentrated the subjects are
        if dominant_ratio >= 0.8:
            consistency_score = 1.0  # Very consistent
        elif dominant_ratio >= 0.6:
            consistency_score = 0.8  # Good consistency
        elif dominant_ratio >= 0.4:
            consistency_score = 0.6  # Moderate consistency
        else:
            consistency_score = 0.3  # Poor consistency
        
        dominant_subject = max(subject_counts, key=subject_counts.get)
        print(f"      📚 Subject consistency: {dominant_subject} ({dominant_ratio:.1%}) → {consistency_score:.2f} score")
        return consistency_score
    
    def detect_contradictions(self, statement: str, correlations: List[Dict[str, Any]]) -> float:
        """
        ⚠️ Detect contradictions between statement and known facts
        
        Returns penalty value (0.0 = no contradiction, higher = more contradiction)
        Enhanced with domain-specific contradiction patterns.
        """
        if not correlations:
            return 0.0
        
        statement_lower = statement.lower()
        statement_words = set(re.findall(r'\b\w+\b', statement_lower))
        contradiction_penalty = 0.0
        
        # Common contradictory word pairs with enhanced detection
        contradiction_pairs = [
            ('up', 'down'), ('upward', 'downward'), ('above', 'below'),
            ('hot', 'cold'), ('big', 'small'), ('fast', 'slow'),
            ('true', 'false'), ('correct', 'incorrect'), ('right', 'wrong'),
            ('add', 'subtract'), ('multiply', 'divide'), ('increase', 'decrease'),
            ('always', 'never'), ('all', 'none'), ('yes', 'no'),
            ('action', 'person'), ('action', 'place'), ('action', 'thing'),
            ('verb', 'noun'), ('movement', 'naming')
        ]
        
        # Domain-specific contradiction detection
        
        # 1. Gravity Physics Contradiction
        if any(word in statement_words for word in ['gravity', 'fall', 'falling']):
            if any(word in statement_words for word in ['upward', 'up']):
                # This is a major physics contradiction
                contradiction_penalty += 0.7  # Severe penalty
                print(f"      ⚠️ MAJOR PHYSICS CONTRADICTION: Gravity + upward motion")
        
        # 2. Grammar Contradiction (Nouns vs Actions)
        if 'noun' in statement_words or 'nouns' in statement_words:
            if any(word in statement_words for word in ['action', 'movement', 'verb', 'verbs']):
                contradiction_penalty += 0.3  # Moderate grammar contradiction (was 0.5)
                print(f"      ⚠️ GRAMMAR CONTRADICTION: Nouns described as action words")
        
        # 3. Mathematical Operation Contradictions
        if 'addition' in statement_words:
            if any(word in statement_words for word in ['subtract', 'subtraction', 'divide', 'division']):
                contradiction_penalty += 0.4
                print(f"      ⚠️ MATH CONTRADICTION: Addition vs other operations")
        
        # 4. Check correlations for semantic contradictions
        for correlation in correlations:
            fact_text = correlation['concept_data'].get('definition', '').lower()
            fact_words = set(re.findall(r'\b\w+\b', fact_text))
            
            # Look for contradictory word pairs between statement and facts
            for word1, word2 in contradiction_pairs:
                if ((word1 in statement_words and word2 in fact_words) or 
                    (word2 in statement_words and word1 in fact_words)):
                    contradiction_penalty += 0.3  # Moderate penalty per contradiction
                    print(f"      ⚠️ Semantic contradiction: '{word1}' vs '{word2}'")
        
        # 5. Subject-specific validation
        for correlation in correlations:
            subject = correlation['concept_data'].get('subject', '')
            concept_id = correlation['concept_id']
            
            # Science domain validations
            if subject == 'science':
                if concept_id == 'photosynthesis' and 'dark' in statement_words:
                    contradiction_penalty += 0.4
                    print(f"      ⚠️ SCIENCE CONTRADICTION: Photosynthesis requires light")
                
                if concept_id == 'gravity' and any(word in statement_words for word in ['float', 'rise', 'upward']):
                    contradiction_penalty += 0.6
                    print(f"      ⚠️ SCIENCE CONTRADICTION: Gravity direction")
        
        # Cap the penalty to prevent negative scores
        contradiction_penalty = min(contradiction_penalty, 0.9)
        
        if contradiction_penalty > 0:
            print(f"      ⚠️ Total contradiction penalty: -{contradiction_penalty:.2f}")
        
        return contradiction_penalty
    
    def generate_verification_report(self, statement: str, keywords: Set[str], 
                                   correlations: List[Dict[str, Any]], truth_score: int,
                                   context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        📊 Generate comprehensive truth verification report
        """
        # Determine truth level
        if truth_score >= 80:
            truth_level = "Very High"
            confidence = "Strong evidence supports this statement"
        elif truth_score >= 60:
            truth_level = "High"
            confidence = "Good evidence supports this statement"
        elif truth_score >= 40:
            truth_level = "Moderate"
            confidence = "Some evidence supports this statement"
        elif truth_score >= 20:
            truth_level = "Low"
            confidence = "Limited evidence supports this statement"
        else:
            truth_level = "Very Low"
            confidence = "Little to no evidence supports this statement"
        
        # Identify supporting facts
        supporting_facts = []
        for correlation in correlations[:3]:  # Top 3 supporting facts
            supporting_facts.append({
                'concept': correlation['concept_id'],
                'subject': correlation['concept_data'].get('subject', 'unknown'),
                'correlation': f"{correlation['correlation_score']:.1%}",
                'matching_keywords': correlation['matching_keywords']
            })
        
        # Generate user-friendly explanation
        if truth_score >= 60:
            explanation = f"This statement aligns well with known facts about {', '.join(list(keywords)[:3])}."
        elif truth_score >= 20:
            explanation = f"This statement partially aligns with known facts, but some details may be uncertain."
        else:
            explanation = f"This statement does not align well with known facts in my knowledge base."
        
        return {
            'truth_score': truth_score,
            'truth_level': truth_level,
            'confidence_description': confidence,
            'explanation': explanation,
            'extracted_keywords': list(keywords),
            'correlating_facts_found': len(correlations),
            'supporting_facts': supporting_facts,
            'verification_timestamp': datetime.now().isoformat(),
            'knowledge_base_coverage': self._assess_coverage(keywords),
            'user_display': f"Truth Level: {truth_score}/100 ({truth_level})"
        }
    
    def _assess_coverage(self, keywords: Set[str]) -> str:
        """Assess how well the knowledge base covers the query keywords"""
        total_keywords = len(keywords)
        covered_keywords = 0
        
        for keyword in keywords:
            if keyword in self.knowledge_base.keyword_index:
                covered_keywords += 1
        
        coverage_ratio = covered_keywords / total_keywords if total_keywords > 0 else 0
        
        if coverage_ratio >= 0.8:
            return "Excellent"
        elif coverage_ratio >= 0.6:
            return "Good"
        elif coverage_ratio >= 0.4:
            return "Moderate"
        elif coverage_ratio >= 0.2:
            return "Limited"
        else:
            return "Poor"
    
    def batch_verify_statements(self, statements: List[str]) -> List[Dict[str, Any]]:
        """Verify multiple statements and return truth scores"""
        results = []
        
        for statement in statements:
            verification = self.verify_statement(statement)
            results.append({
                'statement': statement,
                'truth_score': verification['truth_score'],
                'truth_level': verification['truth_level']
            })
        
        return results
    
    def get_truth_engine_status(self) -> Dict[str, Any]:
        """Get status and capabilities of Truth Engine"""
        return {
            'engine_name': 'Simple Fact Correlation Truth Engine',
            'version': '1.0',
            'knowledge_base_size': len(self.knowledge_base.knowledge_base),
            'connective_words_filtered': len(self.connective_words),
            'truth_scale': '0-100 (percentage)',
            'correlation_method': 'keyword_overlap_scoring',
            'verification_speed': 'fast',
            'offline_capable': True,
            'last_updated': datetime.now().isoformat()
        }
    
    def is_unnatural_keyword_list(self, statement: str, keywords: Set[str]) -> bool:
        """
        🔍 Detect if a statement is just an unnatural list of keywords
        
        This helps identify statements like "Plants photosynthesis sunlight water democracy"
        which are incoherent and should score very low.
        """
        words = statement.lower().split()
        non_keyword_words = [w for w in words if w not in keywords and w not in self.connective_words]
        
        # If most words are keywords and there are very few connective words
        keyword_ratio = len(keywords) / len(words) if words else 0
        
        # Check for lack of natural sentence structure
        has_articles = any(word in ['the', 'a', 'an'] for word in words)
        has_verbs = any(word in ['is', 'are', 'was', 'were', 'use', 'make', 'do', 'have'] for word in words)
        
        # Unnatural if: high keyword ratio + no articles + no common verbs
        if keyword_ratio > 0.7 and not has_articles and not has_verbs:
            return True
            
        return False# 2025-09-11 | [XX]    | [Description]                        | [Reason]
